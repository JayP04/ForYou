// data.js

// All jewelry product data lives here. Putting every product in this one file.
// scripts.js reads from this file — it does not store any data.
// Here, each of these product is an object. and the fields are as follows:



// Object strucutre:
//   id          → unique number for each item (never changes)
//   name        → display name shown on the card
//   category    → "bracelet", "necklace", or "accessories"
//   occasion    → "daily"  (everyday wear)
//                 "event"  (weddings, functions, parties)
//   description → 1–2 sentences shown on the card
//   price       → in rupees, stored as a plain number (no ₹ symbol here)
//   imageURL    → link to the photo — swap with "./images/xxx.jpg" for real photos
//   isNew       → true if this piece was recently added to the collection
//   inStock     → true means available to order, false means sold out
//   clicks      → starting popularity count — scripts.js adds real likes on top of this
//
// ===========

// Note: This was populated first by me with data by myself, and then was updated by AI (Claude Code)
// Every product is reviewed.


const products = [

  // ── BRACELETS ──────────────────────────────────────────────

  {
    id: 1,
    name: "Gold Bangle Set",
    category: "bracelet",
    occasion: "daily",
    description: "Set of 6 smooth gold-plated bangles. Stackable and light enough for all day wear.",
    price: 299,
    isNew: false,
    inStock: true,
    imageURL: "./assets/1.png",
    clicks: 52
  },
  {
    id: 2,
    name: "Silver Charm Bracelet",
    category: "bracelet",
    occasion: "daily",
    description: "Delicate silver chain with small dangling charms. Adjustable and lightweight.",
    price: 249,
    isNew: false,
    inStock: true,
    imageURL: "./assets/2.png",
    clicks: 11
  },
  {
    id: 3,
    name: "Kundan Bracelet",
    category: "bracelet",
    occasion: "event",
    description: "Handset kundan stones in a traditional gold base. Made for weddings and big functions.",
    price: 599,
    isNew: false,
    inStock: false,
    imageURL: "./assets/3.png",
    clicks: 8
  },
  {
    id: 4,
    name: "Pearl Bracelet",
    category: "bracelet",
    occasion: "event",
    description: "Single strand of lustrous pearls with a gold clasp. Elevates any formal outfit.",
    price: 449,
    isNew: false,
    inStock: true,
    imageURL: "./assets/4.png",
    clicks: 6
  },
  {
    id: 5,
    name: "Rose Gold Open Cuff",
    category: "bracelet",
    occasion: "daily",
    description: "Minimalist open-ended cuff in rose gold. Modern, adjustable, goes with everything.",
    price: 349,
    isNew: true,
    inStock: true,
    imageURL: "./assets/5.png",
    clicks: 17
  },
  {
    id: 6,
    name: "Bridal Meenakari Kada",
    category: "bracelet",
    occasion: "event",
    description: "Heavy pair of bridal kadas with hand-painted meenakari work. Available in red and green.",
    price: 899,
    isNew: false,
    inStock: false,
    imageURL: "./assets/6.png",
    clicks: 14
  },
  {
    id: 7,
    name: "Oxidized Silver Bracelet",
    category: "bracelet",
    occasion: "daily",
    description: "Boho oxidized silver bracelet with a tribal engraved pattern. Pairs well with casual kurtas.",
    price: 279,
    isNew: false,
    inStock: true,
    imageURL: "./assets/7.png",
    clicks: 5
  },
  {
    id: 8,
    name: "Beaded Bracelet Set",
    category: "bracelet",
    occasion: "daily",
    description: "Pack of 3 hand-beaded bracelets in warm tones. Perfect layered together.",
    price: 199,
    isNew: true,
    inStock: true,
    imageURL: "./assets/8.png",
    clicks: 28
  },

  // ── NECKLACES ──────────────────────────────────────────────

  {
    id: 9,
    name: "Slim Gold Chain",
    category: "necklace",
    occasion: "daily",
    description: "18-inch slim gold-plated chain. The kind of necklace you never take off.",
    price: 399,
    isNew: false,
    inStock: true,
    imageURL: "./assets/9.png",
    clicks: 44
  },
  {
    id: 10,
    name: "Kundan Choker",
    category: "necklace",
    occasion: "event",
    description: "Close-fitting kundan choker with a deep red velvet back. Stunning for any function.",
    price: 749,
    isNew: false,
    inStock: false,
    imageURL: "./assets/10.png",
    clicks: 39
  },
  {
    id: 11,
    name: "Double Strand Necklace",
    category: "necklace",
    occasion: "event",
    description: "Two rows of freshwater pearls on a gold clasp. A timeless piece for weddings.",
    price: 649,
    isNew: false,
    inStock: true,
    imageURL: "./assets/11.png",
    clicks: 9
  },
  {
    id: 12,
    name: "Triple Layer Chain Set",
    category: "necklace",
    occasion: "daily",
    description: "Three chains at different lengths that wear as one. Looks layered, zero effort.",
    price: 329,
    isNew: true,
    inStock: true,
    imageURL: "./assets/12.png",
    clicks: 33
  },
  {
    id: 13,
    name: "Gold Coin Pendant",
    category: "necklace",
    occasion: "daily",
    description: "Dainty hammered gold coin on a fine chain. Minimalist and always in style.",
    price: 289,
    isNew: false,
    inStock: true,
    imageURL: "./assets/13.png",
    clicks: 7
  },
  {
    id: 14,
    name: "Meenakari Pendant Set",
    category: "necklace",
    occasion: "event",
    description: "Handpainted meenakari pendant with matching jhumka earrings. A full festive set.",
    price: 549,
    isNew: false,
    inStock: false,
    imageURL: "./assets/14.png",
    clicks: 12
  },
  {
    id: 15,
    name: "Mangalsutra",
    category: "necklace",
    occasion: "daily",
    description: "Slim black bead mangalsutra with a small gold pendant. Light enough to wear every day.",
    price: 499,
    isNew: false,
    inStock: true,
    imageURL: "./assets/15.png",
    clicks: 4
  },
  {
    id: 16,
    name: "Crystal Necklace",
    category: "necklace",
    occasion: "daily",
    description: "Clear crystal teardrop on a silver chain. Catches the light beautifully indoors and out.",
    price: 269,
    isNew: true,
    inStock: true,
    imageURL: "./assets/16.png",
    clicks: 24
  },
  {
    id: 17,
    name: "Bridal Haar",
    category: "necklace",
    occasion: "event",
    description: "Full statement bridal necklace in gold-tone with matching maangtikka. The complete bridal look.",
    price: 1299,
    isNew: false,
    inStock: false,
    imageURL: "./assets/17.png",
    clicks: 21
  },

  // ── ACCESSORIES ────────────────────────────────────────────

  {
    id: 18,
    name: "Gold Jhumka Earrings",
    category: "accessories",
    occasion: "event",
    description: "Classic dome jhumkas with filigree work and tiny pearl drops. Never goes out of style.",
    price: 349,
    isNew: false,
    inStock: true,
    imageURL: "./assets/18.png",
    clicks: 19
  },
  {
    id: 19,
    name: "Daily Stud Set",
    category: "accessories",
    occasion: "daily",
    description: "5 pairs of small studs — stars, dots, hearts, hoops, and flat rounds. One for each day.",
    price: 199,
    isNew: false,
    inStock: true,
    imageURL: "./assets/19.png",
    clicks: 3
  },
  {
    id: 20,
    name: "Maang Tikka",
    category: "accessories",
    occasion: "event",
    description: "Adjustable maang tikka with a teardrop kundan centrepiece. Bridal or festive wear.",
    price: 449,
    isNew: false,
    inStock: true,
    imageURL: "./assets/20.png",
    clicks: 6
  },
  {
    id: 21,
    name: "Gold Necklace Set",
    category: "accessories",
    occasion: "daily",
    description: "Set of 3 small gold nose pins — plain, twisted, and stone-set. Subtle everyday wear.",
    price: 149,
    isNew: false,
    inStock: true,
    imageURL: "./assets/21.png",
    clicks: 2
  },
  {
    id: 22,
    name: "Silver Anklet Pair",
    category: "accessories",
    occasion: "daily",
    description: "Pair of sterling silver anklets with small bell charms. A soft jingle with every step.",
    price: 229,
    isNew: true,
    inStock: true,
    imageURL: "./assets/22.png",
    clicks: 15
  },
  {
    id: 23,
    name: "Floral Hair Pins",
    category: "accessories",
    occasion: "event",
    description: "Set of 4 gold floral hair pins for buns, braids, or a half-updo. Bridal or mehndi look.",
    price: 179,
    isNew: false,
    inStock: true,
    imageURL: "./assets/23.png",
    clicks: 4
  },
  {
    id: 24,
    name: "Heavy Set",
    category: "accessories",
    occasion: "event",
    description: "Layered head piece with a central stone and cascading chains. A show-stopper for any bride.",
    price: 599,
    isNew: false,
    inStock: false,
    imageURL: "./assets/24.png",
    clicks: 11
  },
  {
    id: 25,
    name: "Stackable Ring Set",
    category: "accessories",
    occasion: "daily",
    description: "4 stackable rings — two thin bands and two stone-set — in gold and rose gold.",
    price: 249,
    isNew: true,
    inStock: true,
    imageURL: "./assets/25.png",
    clicks: 18
  }

];
