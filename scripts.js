// scripts.js
// handling all the user interactions for the jewelry catalog
// data comes from data.js — this file only reads from that array, never stores data

// real way to contact my MOM without API ;) .
const WHATSAPP_NUMBER = "918469232383";

// names for the keys used to save stuff in localStorage
const CLICKS_KEY   = "jewelry_clicks";
const WISHLIST_KEY = "jewelry_wishlist";
// ─────────────────────────────────────────────────────────────────────────────


// ── current state ─────────────────────────────────────────────────────────────
// these variables track whatever the user has selected right now
// whenever one changes, filterAndRender() runs again and redraws the cards
//
// data structures used here:
//   activeCategory, activeOccasion, currentSort → plain strings, compared against
//     product.category and product.occasion fields inside the products array
//   showingWishlist ---> boolean, gates whether wishlistMatch check runs in filter
//   wishlist --->  array of plain numbers (product ids), like [1, 5, 12]
//   resortTimer ---> holds a setTimeout id so we can cancel it with clearTimeout

let activeCategory  = "all";
let activeOccasion  = "all";
let currentSort     = "default";   // "default", "popular", "price-low", "price-high"
let showingWishlist = false;        // true when user is viewing saved items only

let wishlist    = [];   // array of product id numbers the user has saved
let resortTimer = null; // used to delay re-sorting when popular sort is on


// label helpers 
// data structure: product.category and product.occasion are raw strings from data.js
// mapping them to human-readable labels for display

function getCategoryLabel(category) {
    if (category === "bracelet")    return "Bracelet";
    if (category === "necklace")    return "Necklace";
    if (category === "accessories") return "Accessories";
    return category;
}

function getOccasionLabel(occasion) {
    if (occasion === "daily") return "Daily Wear";
    if (occasion === "event") return "Special Events";
    return occasion;
}


// ── event listeners ───────────────────────────────────────────────────────────
// wiring up every interactive element on the page — called once on page load

function setupListeners() {

    // search input — re-running filter on every keystroke
    document.getElementById("search-input").addEventListener("input", function() {
        filterAndRender();
    });

    // ── category filter buttons
    // reading data-category attribute (string) into activeCategory
    let categoryBtns = document.querySelectorAll(".filter-btn[data-category]");
    for (let i = 0; i < categoryBtns.length; i++) {
        categoryBtns[i].addEventListener("click", function() {
            for (let j = 0; j < categoryBtns.length; j++) {
                categoryBtns[j].classList.remove("active");
            }
            this.classList.add("active");
            activeCategory = this.getAttribute("data-category");
            filterAndRender();
        });
    }

    // ── occasion filter buttons — reading data-occasion into activeOccasion
    let occasionBtns = document.querySelectorAll(".filter-btn[data-occasion]");
    for (let i = 0; i < occasionBtns.length; i++) {
        occasionBtns[i].addEventListener("click", function() {
            for (let j = 0; j < occasionBtns.length; j++) {
                occasionBtns[j].classList.remove("active");
            }
            this.classList.add("active");
            activeOccasion = this.getAttribute("data-occasion");
            filterAndRender();
        });
    }

    // ── sort buttons — reading data-sort into currentSort
    // clicking the already-active button resets it to "default"
    let sortBtns = document.querySelectorAll(".sort-btn[data-sort]");
    for (let i = 0; i < sortBtns.length; i++) {
        sortBtns[i].addEventListener("click", function() {
            let chosen = this.getAttribute("data-sort");
            if (currentSort === chosen) {
                currentSort = "default";
                for (let j = 0; j < sortBtns.length; j++) {
                    sortBtns[j].classList.remove("active");
                }
            } else {
                currentSort = chosen;
                for (let j = 0; j < sortBtns.length; j++) {
                    sortBtns[j].classList.remove("active");
                }
                this.classList.add("active");
            }
            filterAndRender();
        });
    }

    // ── saved / wishlist toggle — flips the showingWishlist boolean
    document.getElementById("saved-toggle").addEventListener("click", function() {
        showingWishlist = !showingWishlist;
        this.classList.toggle("active", showingWishlist);
        refreshSavedToggleLabel();
        filterAndRender();
    });

    // ── clear all filters button
    document.getElementById("clear-all-btn").addEventListener("click", function() {
        clearAllFilters();
    });

    // ── event delegation for like + save buttons on cards
    // using delegation because filterAndRender() rebuilds cards on every call —
    // directly attached listeners would get wiped each time
    let container = document.getElementById("card-container");
    container.addEventListener("click", function(e) {

        let likeBtn = e.target.closest(".like-btn");
        if (likeBtn !== null) {
            let id = parseInt(likeBtn.getAttribute("data-product-id"));
            handleLikeClick(id);
            return;
        }

        let saveBtn = e.target.closest(".save-btn");
        if (saveBtn !== null) {
            let id = parseInt(saveBtn.getAttribute("data-product-id"));
            handleSaveClick(id);
            return;
        }
    });

    // ── modal close button (X)
    document.getElementById("modal-close").addEventListener("click", function() {
        closeModal();
    });

    // ── clicking the dark overlay (outside the box) closes the modal
    document.getElementById("modal-overlay").addEventListener("click", function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // ── escape key closes the modal from anywhere
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    // ── save button inside the modal
    // reading the open product id from the overlay's data attribute
    document.getElementById("modal-save-btn").addEventListener("click", function() {
        let openId = parseInt(document.getElementById("modal-overlay").getAttribute("data-open-id"));
        handleSaveClick(openId);
    });
}



// ── localStorage — clicks ─────────────────────────────────────────────────────
// data structure: products (array of objects from data.js)
// also uses: clickData — a plain object where keys are product ids and values are counts
//            example: { "1": 52, "9": 44, "12": 33 }

// reading saved click counts back into the products array
// without this every heart resets to data.js defaults on each page refresh
function loadClicksFromStorage() {
    let saved = localStorage.getItem(CLICKS_KEY);

    // nothing saved yet — the clicks from data.js are used as-is
    if (saved === null) {
        return;
    }

    // JSON.parse turns the stored string back into a real object
    let clickData = JSON.parse(saved);

    // looping through the products array and restoring each saved count
    // products[i].id is the key, clickData[that key] is the saved number
    for (let i = 0; i < products.length; i++) {
        let savedCount = clickData[products[i].id];
        if (savedCount !== undefined) {
            products[i].clicks = savedCount;
        }
    }
}

// saving every product's current click count into localStorage
// calling this right after incrementing so nothing gets lost on refresh
// builds a plain object { productId: clickCount } then stringifies it
function saveClicksToStorage() {
    let clickData = {};
    for (let i = 0; i < products.length; i++) {
        // using the product's id as the key in the clickData object
        clickData[products[i].id] = products[i].clicks;
    }
    localStorage.setItem(CLICKS_KEY, JSON.stringify(clickData));
}

// ── localStorage — wishlist ───────────────────────────────────────────────────
// data structure: wishlist — an array of numbers (product ids)
// stored in localStorage as a JSON string like "[1, 5, 12]"

// loading the wishlist back on page open
function loadWishlistFromStorage() {
    let saved = localStorage.getItem(WISHLIST_KEY);
    if (saved === null) {
        return; // nothing saved, wishlist stays as an empty array
    }
    // JSON.parse turns "[1, 5, 12]" back into the actual array [1, 5, 12]
    wishlist = JSON.parse(saved);
}

// saving the current wishlist array to localStorage
// called every time something gets saved or unsaved
function saveWishlistToStorage() {
    // JSON.stringify turns the array [1, 5, 12] into the string "[1, 5, 12]"
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

// checking if a product id exists inside the wishlist array
// looping through because that's the clearest way — checking each slot one by one
function isInWishlist(productId) {
    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i] === productId) {
            return true;
        }
    }
    return false;
}

// adding or removing a product id from the wishlist array
// if it's already in there → remove it with splice()
// if it's not → push() it onto the end
// returns true if the item was just added, false if it was just removed
function toggleWishlist(productId) {
    if (isInWishlist(productId)) {

        // finding the position in the array with a loop, then removing it
        // splice(i, 1) means: at index i, remove 1 element
        for (let i = 0; i < wishlist.length; i++) {
            if (wishlist[i] === productId) {
                wishlist.splice(i, 1);
                break;
            }
        }
        saveWishlistToStorage();
        return false; // removed

    } else {

        // push() adds the id to the end of the wishlist array
        wishlist.push(productId);
        saveWishlistToStorage();
        return true; // added
    }
}





//filtering and sorting 
// data structure: products array (from data.js) — all 25 objects
// filter() returns a NEW array — the original products array is never changed
// sort() is called on the filtered copy so the original order stays intact

// the main workhorse — reads current state, filters + sorts the data, re-renders
function filterAndRender() {
    let searchTerm = document.getElementById("search-input").value.toLowerCase();

    // filter() goes through every product object and keeps the ones that pass
    // each check compares a string field on the product object to the active state
    let filtered = products.filter(function(product) {
        // comparing product.category (string) to activeCategory (string)
        let categoryMatch = (activeCategory === "all") || (product.category === activeCategory);
        // comparing product.occasion (string) to activeOccasion (string)
        let occasionMatch = (activeOccasion === "all") || (product.occasion === activeOccasion);

        // checking both product.name and product.description for the search text
        let nameHit     = product.name.toLowerCase().includes(searchTerm);
        let descHit     = product.description.toLowerCase().includes(searchTerm);
        let searchMatch = (searchTerm === "") || nameHit || descHit;

        // wishlistMatch calls isInWishlist() which scans the wishlist array for this product's id
        let wishlistMatch = !showingWishlist || isInWishlist(product.id);

        return categoryMatch && occasionMatch && searchMatch && wishlistMatch;
    });

    // sort() mutates the filtered array in place — comparing product.clicks or product.price (numbers)
    if (currentSort === "popular") {
        // b.clicks - a.clicks puts higher numbers first (descending)
        filtered.sort(function(a, b) {
            return b.clicks - a.clicks;
        });

    } else if (currentSort === "price-low") {
        // a.price - b.price puts lower prices first (ascending)
        // price is stored as a plain number in each product object, so this just works
        filtered.sort(function(a, b) {
            return a.price - b.price;
        });

    } else if (currentSort === "price-high") {
        filtered.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    showCards(filtered);
}




// rendering 
// data structure: productsToShow — a filtered/sorted array of product objects
// each product object has the fields from data.js for objects.

// takes the filtered + sorted array and builds the card grid from scratch
function showCards(productsToShow) {
    let container = document.getElementById("card-container");

    // wiping out the old cards first so they don't pile up on top of each other
    // without this every filterAndRender() call just appends MORE cards to what's already there
    container.innerHTML = "";

    // .length on the array tells us how many products passed the filter
    let countLabel = document.getElementById("result-count");
    countLabel.textContent = productsToShow.length + " of " + products.length + " pieces";

    if (productsToShow.length === 0) {
        let msg = document.createElement("p");
        msg.className = "no-results";
        if (showingWishlist) {
            msg.textContent = "no saved pieces yet — hit save on any card to bookmark it.";
        } else {
            msg.textContent = "no items match these filters. try broadening your search.";
        }
        container.appendChild(msg);
        return;
    }

    // looping through the filtered array and building one card per product object
    for (let i = 0; i < productsToShow.length; i++) {
        let card = buildCard(productsToShow[i]);
        container.appendChild(card);
    }
}



// MAIN ASPECT.
// creating the DOM element for a single product card
// data structure used: one product object — reading its fields to build the HTML
function buildCard(product) {
    let card = document.createElement("div");
    card.className = "card";

    // storing the product's id on the DOM element so event listeners can read it later
    card.setAttribute("data-product-id", product.id);

    // reading product.inStock (boolean) to decide whether to grey the card
    if (product.inStock === false) {
        card.classList.add("is-sold-out");
    }

    // price is a number in the object — adding ₹ only at display time
    let priceDisplay  = "₹" + product.price;
    let categoryLabel = getCategoryLabel(product.category);
    let occasionLabel = getOccasionLabel(product.occasion);

    // calling isInWishlist() which scans the wishlist array for this product's id
    let saveLabel = isInWishlist(product.id) ? "saved ✓" : "save";
    let saveCls   = isInWishlist(product.id) ? "save-btn is-saved" : "save-btn";

    // reading product.isNew (boolean) to decide if the NEW ribbon shows
    let newRibbon = "";
    if (product.isNew === true) {
        newRibbon = '<span class="new-ribbon">NEW</span>';
    }

    // reading product.inStock (boolean) for the sold-out overlay badge
    let soldBadge = "";
    if (product.inStock === false) {
        soldBadge = '<span class="sold-out-badge">Sold Out</span>';
    }

    card.innerHTML =
        '<div class="card-img-wrap">' +
            '<img src="' + product.imageURL + '" alt="' + product.name + '" />' +
            newRibbon +
            soldBadge +
            '<div class="card-badges">' +
                '<span class="badge badge-' + product.category + '">' + categoryLabel + '</span>' +
                '<span class="badge badge-' + product.occasion + '">' + occasionLabel + '</span>' +
            '</div>' +
        '</div>' +
        '<div class="card-body">' +
            '<div class="card-top-row">' +
                '<h2 class="card-name">' + product.name + '</h2>' +
                '<button class="' + saveCls + '" data-product-id="' + product.id + '">' + saveLabel + '</button>' +
            '</div>' +
            '<p class="card-desc">' + product.description + '</p>' +
            '<div class="card-footer">' +
                '<span class="card-price">' + priceDisplay + '</span>' +
                '<button class="like-btn" data-product-id="' + product.id + '">&#9825; <span class="like-count">' + product.clicks + '</span></button>' +
            '</div>' +
        '</div>';

    // clicking the card body (not the buttons inside it) opens the modal
    card.addEventListener("click", function(e) {
        let clickedLike = e.target.closest(".like-btn");
        let clickedSave = e.target.closest(".save-btn");
        if (clickedLike !== null || clickedSave !== null) {
            return; // button clicks are handled by event delegation below
        }
        openModal(product.id);
    });

    return card;
}


// //popular picks graph 
// // data structure: products array — reading .clicks (number) and .name (string)
// // using .slice() to COPY the array before sorting — never sorts the original
// // .sort() ranks by clicks descending, then .slice(0, 5) grabs just the top 5

// function renderGraph() {
//     let container = document.getElementById("graph-container");
//     if (container === null) {
//         return; // graph section not in DOM yet, skipping
//     }
//     container.innerHTML = "";

//     // .slice(0, 5) pulls just the first 5 items from the sorted copy
//     let topFive  = sorted.slice(0, 5);
//     let maxClicks = topFive[0].clicks;

//     if (maxClicks === 0) {
//         // nobody has liked anything yet — showing a nudge message
//         container.innerHTML = '<p class="graph-empty">like some pieces ♥ to see what\'s trending here</p>';
//         return;
//     }

//     // building one bar row per product in the top 5
//     for (let i = 0; i < topFive.length; i++) {
//         let product  = topFive[i];

//         // percentage width = this product's clicks ÷ the max clicks × 100
//         let widthPct = Math.round

//         //giving up :( 
//     }
// }




//modal 
// data structure: products array — searching by id to find the right object
// then reading individual fields off that product object to populate the DOM

function openModal(productId) {

    // linear search — going through every product until the id matches 
    let product = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }
    if (product === null) {
        return;
    }

    // swapping in the product's image and text fields from the object
    document.getElementById("modal-img").src = product.imageURL;
    document.getElementById("modal-img").alt = product.name;

    // product.isNew is a boolean — show or hide the ribbon based on it
    let ribbon = document.getElementById("modal-new-ribbon");
    ribbon.style.display = product.isNew === true ? "inline-block" : "none";

    // building badge HTML from product.category and product.occasion (both strings)
    document.getElementById("modal-badges").innerHTML =
        '<span class="badge badge-' + product.category + '">' + getCategoryLabel(product.category) + '</span>' +
        ' <span class="badge badge-' + product.occasion + '">' + getOccasionLabel(product.occasion) + '</span>';

    document.getElementById("modal-name").textContent  = product.name;
    document.getElementById("modal-desc").textContent  = product.description;

    // price is a number — adding the ₹ symbol only at display time
    document.getElementById("modal-price").textContent = "₹" + product.price;

    // product.inStock is a boolean — choosing between two text/class options
    let stockEl = document.getElementById("modal-stock");
    if (product.inStock === true) {
        stockEl.textContent = "● in stock";
        stockEl.className   = "modal-stock available";
    } else {
        stockEl.textContent = "● sold out";
        stockEl.className   = "modal-stock unavailable";
    }
//MAIN FEATURE HIGHLIGHT
    // whatsapp link uses product.name and product.price in the pre-written message
    let waBtn = document.getElementById("modal-wa-btn");
    if (product.inStock === true) {
        waBtn.href = buildWhatsAppLink(product);
        waBtn.classList.remove("btn-disabled");
        waBtn.removeAttribute("aria-disabled");
    } else {
        waBtn.removeAttribute("href");
        waBtn.classList.add("btn-disabled");
        waBtn.setAttribute("aria-disabled", "true");
    }

    // syncing the save button with the wishlist array
    syncModalSaveBtn(productId);

    // storing the open product's id on the overlay element
    // the modal's save button reads this attribute to know which product to act on
    document.getElementById("modal-overlay").setAttribute("data-open-id", productId);

    document.getElementById("modal-overlay").classList.add("is-open");
    document.body.classList.add("scroll-locked");
}

//close by just clicking outside the box
function closeModal() {
    document.getElementById("modal-overlay").classList.remove("is-open");
    document.body.classList.remove("scroll-locked");
}

// syncing the modal's save button with the wishlist array
// isInWishlist() does a linear scan through the wishlist array
function syncModalSaveBtn(productId) {
    let btn = document.getElementById("modal-save-btn");
    if (isInWishlist(productId)) {
        btn.textContent = "saved ✓";
        btn.classList.add("is-saved");
    } else {
        btn.textContent = "save";
        btn.classList.remove("is-saved");
    }
}

//MAIN FEATUREEEE :) 
// ── whatsapp link builder ─────────────────────────────────────────────────────
// data structure: one product object — reading .name (string) and .price (number)
// encodeURIComponent makes the message string safe to put inside a URL

function buildWhatsAppLink(product) {
    let msg     = "Hi! I'm interested in the " + product.name + " (\u20B9" + product.price + "). Is it still available?";
    let encoded = encodeURIComponent(msg);
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encoded;
}


// like / heart button 
// data structure: products array — finding the object by id, then incrementing
//   its .clicks field (a number stored on each product object)

function handleLikeClick(productId) {
    let target = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            target = products[i];
            break;
        }
    }
    if (target === null) {
        return;
    }

    // incrementing the .clicks number on the product object directly
    target.clicks++;
    saveClicksToStorage(); // persisting right away so a refresh won't lose it

    // updating just this card's displayed number — no full re-render yet
    let cardEl = document.querySelector(".card[data-product-id='" + productId + "']");
    if (cardEl !== null) {
        let countEl = cardEl.querySelector(".like-count");
        if (countEl !== null) {
            countEl.textContent = target.clicks;
        }
        // brief visual pulse so the user knows the click registered
        let btn = cardEl.querySelector(".like-btn");
        btn.classList.add("is-liked");
        setTimeout(function() {
            btn.classList.remove("is-liked");
        }, 600);
    }

    // re-rendering the graph because the clicks array just changed
    renderGraph();

    // if popular sort is on, waiting 2.5 seconds before re-sorting
    // so the card doesn't jump to the top the moment you click the heart
    if (currentSort === "popular") {
        clearTimeout(resortTimer);
        resortTimer = setTimeout(function() {
            filterAndRender();
        }, 2500);
    }
}


// save / wishlist button 
// data structure: wishlist array — toggleWishlist() pushes or splices the id
// also syncs: the save button on the card, the save button in the modal,
//   and the "saved (n)" label in the controls bar

function handleSaveClick(productId) {
    let wasAdded = toggleWishlist(productId); // modifies the wishlist array

    // syncing the save button on the card in the grid
    let cardEl = document.querySelector(".card[data-product-id='" + productId + "']");
    if (cardEl !== null) {
        let saveBtn = cardEl.querySelector(".save-btn");
        if (wasAdded) {
            saveBtn.textContent = "saved ✓";
            saveBtn.classList.add("is-saved");
        } else {
            saveBtn.textContent = "save";
            saveBtn.classList.remove("is-saved");
        }
    }

    // if the modal is open for this same product, syncing its button too
    let overlay = document.getElementById("modal-overlay");
    let openId  = parseInt(overlay.getAttribute("data-open-id"));
    if (overlay.classList.contains("is-open") && openId === productId) {
        syncModalSaveBtn(productId);
    }
    refreshSavedToggleLabel();

    // if the saved-only filter is on and user just unsaved something, removing it from grid
    if (showingWishlist && wasAdded === false) {
        filterAndRender();
    }
}

// keeping the saved toggle button label accurate
// wishlist.length is the current size of the wishlist array
function refreshSavedToggleLabel() {
    let btn = document.getElementById("saved-toggle");
    if (btn === null) {
        return;
    }
    let count = wishlist.length;
    if (showingWishlist) {
        btn.textContent = "\u2665 saved (" + count + ")";
    } else {
        btn.textContent = "\u2665 saved" + (count > 0 ? " (" + count + ")" : "");
    }
}


//clear all filters 
// data structures touched: activeCategory, activeOccasion, currentSort (strings),
//   showingWishlist (boolean) — resetting all of them to their original defaults
// also clears: search input text, .active classes on all filter/sort buttons

function clearAllFilters() {
    activeCategory  = "all";
    activeOccasion  = "all";
    currentSort     = "default";
    showingWishlist = false;

    // clearing whatever text is in the search input
    document.getElementById("search-input").value = "";

    // removing active from all category buttons, re-adding to the "all" one
    let categoryBtns = document.querySelectorAll(".filter-btn[data-category]");
    for (let i = 0; i < categoryBtns.length; i++) {
        categoryBtns[i].classList.remove("active");
        if (categoryBtns[i].getAttribute("data-category") === "all") {
            categoryBtns[i].classList.add("active");
        }
    }

    // same for occasion buttons
    let occasionBtns = document.querySelectorAll(".filter-btn[data-occasion]");
    for (let i = 0; i < occasionBtns.length; i++) {
        occasionBtns[i].classList.remove("active");
        if (occasionBtns[i].getAttribute("data-occasion") === "all") {
            occasionBtns[i].classList.add("active");
        }
    }

    // removing active from all sort buttons
    let sortBtns = document.querySelectorAll(".sort-btn[data-sort]");
    for (let i = 0; i < sortBtns.length; i++) {
        sortBtns[i].classList.remove("active");
    }

    let savedToggle = document.getElementById("saved-toggle");
    savedToggle.classList.remove("active");
    refreshSavedToggleLabel();

    filterAndRender();
}



// init in terms of js
// runs once the HTML is fully loaded and ready

document.addEventListener("DOMContentLoaded", function() {
    loadClicksFromStorage();   // restoring saved likes into the products array
    loadWishlistFromStorage(); // restoring saved wishlist ids into the wishlist array
    filterAndRender();         // drawing all cards for the first time
    renderGraph();             // drawing the popular picks chart
    setupListeners();          // wiring up every button, input, and key event
    refreshSavedToggleLabel(); // setting the initial label on the saved button
});
