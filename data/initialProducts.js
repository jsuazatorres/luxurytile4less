// Initial store and product configuration for Luxury Tile 4 Less
const DEFAULT_SITE_CONFIG = {
  businessName: "Luxury Tile 4 Less",
  tagline: "Luxury Quality at Wholesale Prices",
  heroTitle: "Luxury Porcelain Tiles & Natural Stone at Direct Wholesale Prices",
  heroSubtitle: "Visit our premier tile showroom in Port St. Lucie, FL. Discover high-end Italian & Spanish porcelain, large format slabs, exotic quartzite countertops, and complete kitchen & bathroom remodeling.",
  bannerAnnouncement: "🎉 Direct Importer Specials: Up to 40% OFF on Selected 24x48 Porcelain Slabs! Visit Our Showroom Today.",
  phone: "(772) 924-9276",
  altPhone: "(772) 722-9078",
  whatsappPhone: "17729249276",
  email: "luxurytile4less@gmail.com",
  address: "778 SW Bayshore Blvd, Port St. Lucie, FL 34986",
  hoursWeekday: "Monday - Friday: 8:00 AM - 6:00 PM",
  hoursSaturday: "Saturday: 9:00 AM - 4:00 PM",
  hoursSunday: "Sunday: Closed / Appointments Available",
  facebookUrl: "https://www.facebook.com/americanluxurytile4less",
  instagramUrl: "https://www.instagram.com/luxurytile4less/",
  googleMapsUrl: "https://maps.google.com/?q=778+SW+Bayshore+Blvd,+Port+St.+Lucie,+FL+34986",
  adminPin: "admin123"
};

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Calacatta Gold Polished Porcelain",
    category: "marble-look",
    finish: "polished",
    size: "24\" x 48\"",
    thickness: "9mm",
    price: "$3.95 / sq.ft",
    image: "assets/product-calacatta.jpg",
    description: "Iconic Italian Calacatta marble design with warm golden and soft grey veins on an ultra-white polished porcelain body. Rectified edges for minimal grout lines.",
    applications: ["Floors", "Walls", "Bathrooms", "Showers", "Living Areas"],
    badge: "Best Seller",
    inStock: true,
    featured: true
  },
  {
    id: "prod-2",
    name: "Noir Saint Laurent / Black Marquina",
    category: "marble-look",
    finish: "polished",
    size: "24\" x 48\"",
    thickness: "9.5mm",
    price: "$4.25 / sq.ft",
    image: "assets/product-noir.jpg",
    description: "Deep obsidian black marble look accented with dramatic golden-bronze and crisp white linear veining. Ultra high-gloss mirror finish for luxurious modern accents.",
    applications: ["Accent Walls", "Fireplaces", "Master Baths", "Entryways"],
    badge: "Luxury Choice",
    inStock: true,
    featured: true
  },
  {
    id: "prod-3",
    name: "Patagonia Exotic Quartzite Slab",
    category: "quartzite",
    finish: "polished",
    size: "Large Format Slab (126\" x 64\")",
    thickness: "20mm / 30mm",
    price: "Custom Fabrication",
    image: "assets/product-quartzite.jpg",
    description: "Rare and exotic natural quartzite with translucent quartz crystals, dramatic black minerals, and warm creamy tones. Ideal for backlit kitchen islands and vanity tops.",
    applications: ["Kitchen Countertops", "Waterfall Islands", "Feature Walls"],
    badge: "Exotic Stone",
    inStock: true,
    featured: true
  },
  {
    id: "prod-4",
    name: "Scandinavian Natural Oak Plank",
    category: "wood-look",
    finish: "matte",
    size: "8\" x 48\"",
    thickness: "9mm",
    price: "$3.49 / sq.ft",
    image: "assets/product-wood.jpg",
    description: "Hyper-realistic natural white oak grain with authentic tactile wood texture and zero water absorption. 100% waterproof porcelain that never warps, stains, or scratches.",
    applications: ["Entire Home Flooring", "Bedrooms", "Bathrooms", "Patios"],
    badge: "100% Waterproof",
    inStock: true,
    featured: true
  },
  {
    id: "prod-5",
    name: "Carrara White Herringbone Mosaic",
    category: "mosaics",
    finish: "honed",
    size: "12\" x 12\" Mesh Sheet",
    thickness: "8mm",
    price: "$11.90 / sheet",
    image: "assets/product-herringbone.jpg",
    description: "Classic Italian Carrara marble herringbone mosaic on flexible mesh backing for easy installation. Timeless geometric aesthetic for kitchen backsplashes and shower pans.",
    applications: ["Kitchen Backsplashes", "Shower Floors", "Niches", "Accents"],
    badge: "Trending",
    inStock: true,
    featured: true
  },
  {
    id: "prod-6",
    name: "Roman Travertine Warm Beige",
    category: "travertine",
    finish: "matte",
    size: "24\" x 48\"",
    thickness: "10mm",
    price: "$3.79 / sq.ft",
    image: "assets/product-travertine.jpg",
    description: "Warm Mediterranean porous travertine look rendered in durable rectified porcelain. Brings organic warmth, texture, and serene elegance without requiring sealing or sealing maintenance.",
    applications: ["Floors", "Patios", "Sunrooms", "Bathroom Suites"],
    badge: "Timeless",
    inStock: true,
    featured: false
  },
  {
    id: "prod-7",
    name: "Urban Minimalist Grey Concrete",
    category: "concrete",
    finish: "matte",
    size: "30\" x 30\"",
    thickness: "9.5mm",
    price: "$3.65 / sq.ft",
    image: "assets/product-concrete.jpg",
    description: "Contemporary industrial aesthetic with subtle clouding and fine aggregate texture. Scratch-resistant, slip-resistant matte finish for contemporary and commercial spaces.",
    applications: ["Modern Living Rooms", "Kitchens", "Commercial", "Showrooms"],
    badge: "Modern Minimal",
    inStock: true,
    featured: false
  }
];

const DEFAULT_SERVICES = [
  {
    id: "serv-1",
    title: "Complete Bathroom Remodeling",
    subtitle: "From Demolition to Turnkey Luxury",
    image: "assets/service-bathroom.jpg",
    description: "Turn your bathroom into a 5-star spa sanctuary. We specialize in curbless walk-in showers, linear drains, freestanding tubs, waterproof Schluter systems, and precision floor-to-ceiling tile work."
  },
  {
    id: "serv-2",
    title: "Kitchen Remodel & Custom Countertops",
    subtitle: "Gourmet Elegance Built to Last",
    image: "assets/service-kitchen.jpg",
    description: "Upgrade your culinary space with custom quartzite or porcelain waterfall islands, seamless matching backsplashes, cabinet coordination, and durable non-porous surfaces."
  },
  {
    id: "serv-3",
    title: "Direct Tile Showroom & Wholesale Supply",
    subtitle: "Huge Inventory at 778 SW Bayshore Blvd",
    image: "assets/hero-showroom.jpg",
    description: "Browse hundreds of in-stock porcelain tiles, mosaics, and slabs in our local Port St. Lucie showroom. We cut out middleman markups to deliver unbeatable wholesale pricing to contractors and homeowners alike."
  }
];

const DEFAULT_GALLERY = [
  { id: "gal-1", title: "Master Bathroom Oasis in Tradition, FL", image: "assets/service-bathroom.jpg", tag: "Bathroom" },
  { id: "gal-2", title: "Quartzite Waterfall Island in St. Lucie West", image: "assets/service-kitchen.jpg", tag: "Kitchen" },
  { id: "gal-3", title: "Port St. Lucie Showroom Display", image: "assets/hero-showroom.jpg", tag: "Showroom" },
  { id: "gal-4", title: "Calacatta Gold Great Room Floors", image: "assets/product-calacatta.jpg", tag: "Flooring" },
  { id: "gal-5", title: "Black Marquina Powder Room Accent Wall", image: "assets/product-noir.jpg", tag: "Walls" },
  { id: "gal-6", title: "Natural Oak Look Porcelain Open Concept", image: "assets/product-wood.jpg", tag: "Flooring" }
];
