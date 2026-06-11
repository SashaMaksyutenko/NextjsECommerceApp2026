import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category";
import Product from "./models/Product";

dotenv.config();

const CATEGORIES = [
  { name: "T-shirts",    slug: "t-shirts",    description: "Casual and stylish t-shirts for every occasion" },
  { name: "Shoes",       slug: "shoes",        description: "Sneakers, boots and casual footwear" },
  { name: "Accessories", slug: "accessories",  description: "Bags, belts, hats and more" },
  { name: "Bags",        slug: "bags",         description: "Handbags, backpacks and crossbody bags" },
  { name: "Dresses",     slug: "dresses",      description: "Elegant and casual dresses" },
  { name: "Jackets",     slug: "jackets",      description: "Lightweight jackets and heavy coats" },
  { name: "Gloves",      slug: "gloves",       description: "Warm and stylish gloves" },
];

const PRODUCTS = [
  // ── SHOES ──────────────────────────────────────────────────────────────────
  {
    categorySlug: "shoes", name: "Nike Air Max 270",
    description: "Experience unrivaled comfort with the Nike Air Max 270. Featuring a large Air unit in the heel for maximum cushioning, this sneaker blends bold style with all-day wearability. The breathable mesh upper keeps your feet cool during long walks or light workouts.",
    price: 149.99, stock: 42, sizes: ["40","41","42","43","44","45"], colors: ["black","white","red"],
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
  },
  {
    categorySlug: "shoes", name: "Adidas Stan Smith",
    description: "A true icon since 1971. The Adidas Stan Smith is the clean, minimalist sneaker that never goes out of style. Crafted with a smooth leather upper and the signature perforated three stripes, it pairs effortlessly with any outfit.",
    price: 99.99, stock: 35, sizes: ["38","39","40","41","42","43","44"], colors: ["white","green"],
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"],
  },
  {
    categorySlug: "shoes", name: "Timberland 6-Inch Boot",
    description: "Built to withstand the elements. Waterproof nubuck leather upper, rustproof hardware, and padded collar for ankle support. These boots transition seamlessly from outdoor trails to city streets.",
    price: 189.99, stock: 22, sizes: ["40","41","42","43","44","45","46"], colors: ["wheat","black","brown"],
    images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80"],
  },
  {
    categorySlug: "shoes", name: "Vans Old Skool",
    description: "The Vans Old Skool is a classic skate shoe and the first to feature the iconic side stripe. A low-top lace-up with durable suede and canvas upper, padded collar, and waffle outsole. A staple of street culture since 1977.",
    price: 79.99, stock: 60, sizes: ["36","37","38","39","40","41","42","43","44"], colors: ["black","white","red"],
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80"],
  },
  {
    categorySlug: "shoes", name: "New Balance 574",
    description: "A legendary silhouette that has stood the test of time. The New Balance 574 features a suede and mesh upper with the iconic 'N' logo, ENCAP midsole technology for durable support, and a versatile look that works dressed up or down.",
    price: 109.99, stock: 45, sizes: ["39","40","41","42","43","44","45"], colors: ["gray","navy","green"],
    images: ["https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80"],
  },
  {
    categorySlug: "shoes", name: "Converse Chuck Taylor All Star",
    description: "The Chuck Taylor All Star has been the go-to sneaker for rebels, rockers and free-thinkers since 1917. Canvas upper, vulcanised rubber sole, and the iconic ankle patch make this one of the most recognisable shoes ever made.",
    price: 69.99, stock: 80, sizes: ["36","37","38","39","40","41","42","43","44","45"], colors: ["black","white","red","navy"],
    images: ["https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=800&q=80"],
  },
  {
    categorySlug: "shoes", name: "Leather Oxford Shoes",
    description: "Polished full-grain leather uppers, a closed lacing system, and a Blake-stitched leather sole — these Oxfords are the benchmark of classic formal footwear. A well-maintained pair will last years and only look better with age.",
    price: 159.99, stock: 18, sizes: ["40","41","42","43","44","45"], colors: ["black","brown"],
    images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80"],
  },
  {
    categorySlug: "shoes", name: "Slip-On Canvas Sneakers",
    description: "Effortless to wear and endlessly versatile, these laceless canvas slip-ons are the ideal everyday shoe. Elasticated gussets for a secure fit, a padded insole for comfort, and a clean minimalist profile that pairs well with shorts, chinos or jeans.",
    price: 44.99, stock: 95, sizes: ["37","38","39","40","41","42","43"], colors: ["white","black","gray"],
    images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80"],
  },

  // ── T-SHIRTS ──────────────────────────────────────────────────────────────
  {
    categorySlug: "t-shirts", name: "Premium Cotton Oversized Tee",
    description: "Made from 100% ring-spun cotton, this oversized tee offers a relaxed, dropped-shoulder silhouette. Pre-washed for a soft feel from day one. Available in muted, versatile tones that coordinate with everything in your wardrobe.",
    price: 34.99, stock: 120, sizes: ["xs","s","m","l","xl","xxl"], colors: ["white","black","gray"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
  },
  {
    categorySlug: "t-shirts", name: "Striped Sailor Tee",
    description: "Channel effortless Parisian style with this classic Breton-stripe tee. Cut from lightweight cotton jersey with a slightly relaxed fit, it features a rounded neckline and fine navy stripes on a white base.",
    price: 29.99, stock: 85, sizes: ["xs","s","m","l","xl"], colors: ["white","blue"],
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"],
  },
  {
    categorySlug: "t-shirts", name: "Vintage Washed Graphic Tee",
    description: "Inspired by 1990s band merch, this heavyweight cotton tee features a faded vintage print on a pre-washed base. The slightly boxy fit and raw-edge hem give it an authentic worn-in feel.",
    price: 39.99, stock: 70, sizes: ["s","m","l","xl","xxl"], colors: ["gray","black","brown"],
    images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80"],
  },
  {
    categorySlug: "t-shirts", name: "Merino Wool Polo",
    description: "Elevate your casual wardrobe with this slim-fit merino wool polo. Naturally temperature-regulating and odour-resistant. The fine-knit construction and two-button placket keep it looking sharp without trying too hard.",
    price: 89.99, stock: 40, sizes: ["s","m","l","xl"], colors: ["navy","white","green","red"],
    images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80"],
  },
  {
    categorySlug: "t-shirts", name: "Long-Sleeve Henley",
    description: "The Henley is the relaxed middle ground between a t-shirt and a button-down. A three-button placket, ribbed cuffs, and a slightly tapered fit make this a versatile layering piece. Wear it alone or under a flannel shirt or jacket.",
    price: 44.99, stock: 65, sizes: ["xs","s","m","l","xl","xxl"], colors: ["white","gray","navy","black"],
    images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"],
  },
  {
    categorySlug: "t-shirts", name: "Cropped Ribbed Tank Top",
    description: "A wardrobe essential for warmer months. This cropped ribbed tank top in a fitted silhouette pairs effortlessly with high-waisted jeans, shorts or skirts. The thick ribbed fabric holds its shape wash after wash.",
    price: 24.99, stock: 100, sizes: ["xs","s","m","l"], colors: ["white","black","pink","beige"],
    images: ["https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80"],
  },
  {
    categorySlug: "t-shirts", name: "Tie-Dye Relaxed Tee",
    description: "No two are exactly alike. Each tie-dye tee is individually dyed using a spiral technique that creates a unique swirl pattern. Made from 100% cotton in a loose, comfortable fit. A fun pop of colour for casual days.",
    price: 32.99, stock: 55, sizes: ["xs","s","m","l","xl","xxl"], colors: ["blue","pink","purple"],
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"],
  },

  // ── JACKETS ───────────────────────────────────────────────────────────────
  {
    categorySlug: "jackets", name: "Leather Biker Jacket",
    description: "A wardrobe essential crafted from genuine full-grain leather. Features an asymmetric zip closure, quilted shoulder panels, and snap-down lapels. The slim-fit silhouette gives it a sharp, modern edge.",
    price: 299.99, stock: 18, sizes: ["xs","s","m","l","xl"], colors: ["black","brown"],
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"],
  },
  {
    categorySlug: "jackets", name: "Lightweight Puffer Jacket",
    description: "Stay warm without the bulk. Filled with recycled down alternative and compresses into its own pocket for easy packing. Water-resistant shell fabric handles light rain and wind. Perfect transitional layer.",
    price: 129.99, stock: 55, sizes: ["xs","s","m","l","xl","xxl"], colors: ["black","navy","olive"],
    images: ["https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80"],
  },
  {
    categorySlug: "jackets", name: "Denim Trucker Jacket",
    description: "A wardrobe cornerstone since the 1960s. Cut from midweight 100% cotton denim with a slightly faded wash. Chest pockets, button-through front, and adjustable waist tabs for a tailored fit.",
    price: 119.99, stock: 35, sizes: ["xs","s","m","l","xl","xxl"], colors: ["blue","black"],
    images: ["https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800&q=80"],
  },
  {
    categorySlug: "jackets", name: "Windbreaker Anorak",
    description: "A lightweight pullover windbreaker built for unpredictable weather. Packable nylon shell blocks wind and light rain. The relaxed oversized cut is right on trend. The kangaroo pocket and adjustable drawcord hem give it a sporty edge.",
    price: 94.99, stock: 48, sizes: ["xs","s","m","l","xl"], colors: ["orange","navy","olive","black"],
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"],
  },
  {
    categorySlug: "jackets", name: "Oversized Blazer",
    description: "The oversized blazer has become a modern power dressing staple. Cut with exaggerated shoulders and a long, relaxed fit, it works just as well thrown over a mini dress as it does with matching trousers. Unlined for a lightweight drape.",
    price: 149.99, stock: 28, sizes: ["xs","s","m","l","xl"], colors: ["black","beige","gray"],
    images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"],
  },
  {
    categorySlug: "jackets", name: "Fleece Zip-Up Hoodie",
    description: "A cosy everyday essential. Made from anti-pill fleece with a full-length zip and two hand pockets. The relaxed fit layers easily over a tee or under a heavier coat. A timeless casual layer for year-round comfort.",
    price: 74.99, stock: 72, sizes: ["xs","s","m","l","xl","xxl"], colors: ["gray","black","navy","green"],
    images: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80"],
  },
  {
    categorySlug: "jackets", name: "Trench Coat",
    description: "The quintessential British outerwear icon. Double-breasted with epaulettes, storm flaps, and a belted waist, this cotton-gabardine trench coat is as functional as it is elegant. A long-term investment piece that never goes out of style.",
    price: 249.99, stock: 15, sizes: ["xs","s","m","l","xl"], colors: ["beige","black","navy"],
    images: ["https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&q=80"],
  },

  // ── BAGS ──────────────────────────────────────────────────────────────────
  {
    categorySlug: "bags", name: "Mini Leather Crossbody Bag",
    description: "Compact yet spacious, this crossbody bag is crafted from soft pebbled leather with gold-tone hardware. The adjustable chain strap allows you to wear it on the shoulder or across the body. Fits phone, cards and keys.",
    price: 89.99, stock: 30, sizes: [], colors: ["black","tan","white"],
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"],
  },
  {
    categorySlug: "bags", name: "Canvas Tote Bag",
    description: "Heavy-duty 12oz canvas tote designed for everyday use. Roomy enough for a laptop, gym clothes, or groceries. Reinforced stitching at the straps ensures durability. Available in natural, black, and army green.",
    price: 39.99, stock: 200, sizes: [], colors: ["white","black","green"],
    images: ["https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80"],
  },
  {
    categorySlug: "bags", name: "Leather Backpack",
    description: "Designed for the modern professional. Full-grain leather, fits a 15-inch laptop, dedicated tablet sleeve, and multiple pockets. Antique brass hardware and vegetable-tanned leather develop a beautiful patina over time.",
    price: 179.99, stock: 20, sizes: [], colors: ["brown","black"],
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
  },
  {
    categorySlug: "bags", name: "Nylon Waist Bag",
    description: "Keep your hands free with this lightweight nylon waist bag. Features a main zip compartment, front pocket with organiser slots, and an adjustable strap. Water-resistant and incredibly practical for travel, festivals, or everyday use.",
    price: 34.99, stock: 90, sizes: [], colors: ["black","gray","red"],
    images: ["https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=80"],
  },
  {
    categorySlug: "bags", name: "Structured Top Handle Bag",
    description: "A polished structured bag with a short top handle and optional crossbody strap. The clean boxy silhouette and turnlock closure give it a sophisticated, boardroom-ready aesthetic. Suede lining and interior pockets.",
    price: 139.99, stock: 22, sizes: [], colors: ["black","burgundy","camel"],
    images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80"],
  },
  {
    categorySlug: "bags", name: "Weekender Duffle Bag",
    description: "The perfect travel companion for short trips. Spacious main compartment, end pockets for shoes or wet items, and a trolley sleeve that slips over your suitcase handle. Water-resistant canvas with full-grain leather trim.",
    price: 119.99, stock: 25, sizes: [], colors: ["navy","gray","black"],
    images: ["https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80"],
  },

  // ── DRESSES ───────────────────────────────────────────────────────────────
  {
    categorySlug: "dresses", name: "Floral Wrap Midi Dress",
    description: "A flattering wrap silhouette in a vibrant floral print, perfect for warm-weather occasions. The V-neckline and adjustable tie waist accentuate your figure, while the flowy viscose fabric keeps you cool and comfortable.",
    price: 74.99, stock: 40, sizes: ["xs","s","m","l","xl"], colors: ["blue","pink"],
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"],
  },
  {
    categorySlug: "dresses", name: "Classic Slip Dress",
    description: "Effortlessly elegant slip dress cut from smooth satin-finish fabric. The minimalist design with thin adjustable straps and a subtle side slit gives it a luxurious feel. Wear to dinner, a wedding, or dress down with a denim jacket.",
    price: 59.99, stock: 50, sizes: ["xs","s","m","l"], colors: ["black","champagne"],
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80"],
  },
  {
    categorySlug: "dresses", name: "Linen Shirt Dress",
    description: "Breathable and effortlessly chic linen shirt dress for warm-weather days. Features a shirt collar, button-down front, and self-tie waist belt. Can be worn open as a cover-up or belted for a more defined silhouette.",
    price: 84.99, stock: 38, sizes: ["xs","s","m","l","xl"], colors: ["white","beige","blue"],
    images: ["https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80"],
  },
  {
    categorySlug: "dresses", name: "Knit Mini Dress",
    description: "A form-fitting ribbed knit mini dress that's both cosy and stylish. The mock-neck collar and long sleeves give it a sleek look while the stretchy fabric moves with you. Perfect with ankle boots and a blazer.",
    price: 64.99, stock: 45, sizes: ["xs","s","m","l"], colors: ["black","camel"],
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"],
  },
  {
    categorySlug: "dresses", name: "Boho Maxi Dress",
    description: "Free-spirited and romantic, this flowing maxi dress features delicate smocked bodice detailing and wide-set adjustable straps. The tiered skirt falls gracefully to the floor — perfect for festivals, beach holidays or garden parties.",
    price: 89.99, stock: 32, sizes: ["xs","s","m","l","xl"], colors: ["white","yellow","red"],
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80"],
  },
  {
    categorySlug: "dresses", name: "Little Black Dress",
    description: "Every wardrobe needs one. This LBD features a clean scoop neckline, fitted bodice, and a knee-length A-line skirt in a stretch crepe fabric. Simple enough to be versatile, elegant enough to be unforgettable.",
    price: 79.99, stock: 55, sizes: ["xs","s","m","l","xl"], colors: ["black"],
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"],
  },

  // ── ACCESSORIES ───────────────────────────────────────────────────────────
  {
    categorySlug: "accessories", name: "Wool Bucket Hat",
    description: "A modern take on the 90s bucket hat, crafted from boiled wool for structure and warmth. The wide brim provides sun protection and a cool street-style look. Fits most head sizes thanks to its slightly stretchy construction.",
    price: 44.99, stock: 60, sizes: [], colors: ["black","beige","gray"],
    images: ["https://images.unsplash.com/photo-1533055640609-24b498dfd74c?w=800&q=80"],
  },
  {
    categorySlug: "accessories", name: "Aviator Sunglasses",
    description: "A timeless frame shape that flatters every face. Metal-frame aviators with UV400-protected lenses in a classic gradient tint. Lightweight construction and adjustable nose pads ensure all-day comfort.",
    price: 49.99, stock: 80, sizes: [], colors: ["gold","silver","black"],
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"],
  },
  {
    categorySlug: "accessories", name: "Silk Scarf",
    description: "Hand-rolled edges and a vibrant printed design make this 100% silk scarf a true luxury accessory. Versatile enough to wear tied around the neck, knotted in the hair, or looped through a bag handle.",
    price: 79.99, stock: 30, sizes: [], colors: ["blue","red","green"],
    images: ["https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=800&q=80"],
  },
  {
    categorySlug: "accessories", name: "Minimalist Watch",
    description: "A clean, uncluttered watch face with a slim stainless steel case and a genuine leather strap. The Japanese quartz movement ensures reliable accuracy without the bulk of a smartwatch. An everyday wear piece that gets better with age.",
    price: 129.99, stock: 35, sizes: [], colors: ["silver","gold","black"],
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
  },
  {
    categorySlug: "accessories", name: "Leather Belt",
    description: "A full-grain leather dress belt with a brushed silver buckle. The single-piece leather construction means no peeling or cracking over time. Available in black and tan, fits waist sizes 28 to 40 inches.",
    price: 54.99, stock: 50, sizes: ["s","m","l","xl"], colors: ["black","tan"],
    images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80"],
  },
  {
    categorySlug: "accessories", name: "Snapback Cap",
    description: "A structured 6-panel snapback with a flat brim, embroidered logo patch, and an adjustable snap closure at the back. The cotton twill fabric is durable and breathable. One size fits most.",
    price: 34.99, stock: 100, sizes: [], colors: ["black","white","navy","red"],
    images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80"],
  },
  {
    categorySlug: "accessories", name: "Ribbed Beanie",
    description: "A cosy ribbed knit beanie in a classic turned-cuff style. Made from a merino wool blend for warmth without itchiness. Slouchy enough to wear pushed back but fitted enough to stay put in the wind.",
    price: 27.99, stock: 75, sizes: [], colors: ["gray","black","red","green"],
    images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80"],
  },

  // ── GLOVES ────────────────────────────────────────────────────────────────
  {
    categorySlug: "gloves", name: "Touchscreen Leather Gloves",
    description: "Sleek lined leather gloves with touchscreen-compatible fingertips. The cashmere lining provides warmth without adding bulk. A practical luxury essential for the colder months.",
    price: 64.99, stock: 25, sizes: ["s","m","l"], colors: ["black","brown"],
    images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80"],
  },
  {
    categorySlug: "gloves", name: "Knit Fingerless Gloves",
    description: "The perfect compromise between warmth and dexterity. Merino wool fingerless gloves keep your hands cosy while leaving your fingers free for your phone, keyboard, or coffee cup. Ribbed cuff prevents slipping.",
    price: 29.99, stock: 55, sizes: ["s/m","l/xl"], colors: ["gray","black","burgundy"],
    images: ["https://images.unsplash.com/photo-1609803384069-19f3f9375c3f?w=800&q=80"],
  },
  {
    categorySlug: "gloves", name: "Ski & Snow Gloves",
    description: "Waterproof and windproof ski gloves with a 3-in-1 design: a removable liner glove inside a hardshell outer. Pre-curved fingers reduce fatigue on the slopes, and a wrist strap prevents loss when loading the chairlift.",
    price: 84.99, stock: 30, sizes: ["s","m","l","xl"], colors: ["black","red","blue"],
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"],
  },
  {
    categorySlug: "gloves", name: "Cotton Garden Gloves",
    description: "Soft, breathable cotton gloves with a textured latex grip on the palm and fingers. Perfect for gardening, light DIY, or any task requiring dexterity. Machine washable and available in a range of bright colours.",
    price: 14.99, stock: 120, sizes: ["s","m","l"], colors: ["green","yellow","pink"],
    images: ["https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&q=80"],
  },
  {
    categorySlug: "gloves", name: "Motorcycle Riding Gloves",
    description: "Designed for protection and control on the road. Full-grain leather palm and knuckle armour absorb impact, while perforated leather panels provide ventilation. Gauntlet cuffs extend over jacket sleeves.",
    price: 74.99, stock: 20, sizes: ["s","m","l","xl"], colors: ["black","brown"],
    images: ["https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80"],
  },
  // ── 4 extra to reach 50 ───────────────────────────────────────────────────
  {
    categorySlug: "shoes", name: "Platform Chunky Sneakers",
    description: "Make a statement with these bold platform sneakers. The exaggerated chunky sole adds height and attitude, while the padded collar and cushioned insole keep your feet comfortable all day. Lace-up front with contrast stitching.",
    price: 124.99, stock: 28, sizes: ["36","37","38","39","40","41"], colors: ["white","black"],
    images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80"],
  },
  {
    categorySlug: "t-shirts", name: "Pocket Oxford Shirt",
    description: "A heritage staple reimagined for everyday wear. The Oxford shirt is woven from a breathable cotton-polyester blend with a classic chest pocket, button-down collar, and a slightly relaxed fit. Smart enough for the office, casual enough for weekends.",
    price: 54.99, stock: 60, sizes: ["xs","s","m","l","xl","xxl"], colors: ["white","blue","pink"],
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"],
  },
  {
    categorySlug: "dresses", name: "Corset Mini Dress",
    description: "A modern corset-inspired mini dress with boning detail, a square neckline, and adjustable lace-up back. The structured bodice creates an hourglass silhouette while the short hem keeps it playful. Perfect for a night out.",
    price: 69.99, stock: 35, sizes: ["xs","s","m","l"], colors: ["black","red","white"],
    images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80"],
  },
  {
    categorySlug: "accessories", name: "Leather Card Holder",
    description: "Slim, minimal, and effortlessly sleek. This leather card holder fits up to 6 cards and a few folded notes in a clean bifold design. Full-grain leather with tight stitching that improves with age. The ideal alternative to a bulky wallet.",
    price: 39.99, stock: 90, sizes: [], colors: ["black","tan","navy"],
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to MongoDB");

  // Delete ALL existing categories and products for a clean slate
  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log("Cleared existing data");

  // Create categories fresh
  const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const cat of CATEGORIES) {
    const doc = await Category.create(cat);
    categoryMap[cat.slug] = doc._id as mongoose.Types.ObjectId;
    console.log(`Category: ${cat.name}`);
  }

  // Create products
  for (const p of PRODUCTS) {
    const categoryId = categoryMap[p.categorySlug];
    if (!categoryId) { console.warn(`No category for slug: ${p.categorySlug}`); continue; }
    const { categorySlug, ...productData } = p;
    void categorySlug;
    await Product.create({ ...productData, category: categoryId });
    console.log(`  + ${p.name}`);
  }

  console.log(`\nDone: ${PRODUCTS.length} products across ${CATEGORIES.length} categories.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
