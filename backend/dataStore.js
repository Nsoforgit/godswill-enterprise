import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data_store.json');

// Initialize database file if not present
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    products: [
      {
        id: "prod-1",
        title: "Value Plus Satin",
        slug: "value-plus-satin",
        brand: "Value Paint",
        category: "Home Paints",
        finishType: "Satin",
        description: "Value Plus Satin paint offers a unique blend of elegance and durability. It provides a tough washable finish, excellent moisture resistance, and subtle sheen ideal for living rooms, hallways, and modern interiors.",
        shortDescription: "Luxurious satin sheen, tough washable finish, and high moisture resistance.",
        features: ["Subtle Sheen & Washable", "Fungal & Mildew Resistant", "Easy Maintenance", "High Opacity & Coverage"],
        availableSizes: [
          { label: "20L Drum", code: "20L" },
          { label: "4L Gallon", code: "4L" }
        ],
        spreadingRate: 14,
        numberOfCoatsRequired: 2,
        image: "https://valuepaints.org/wp-content/uploads/2019/10/value-crop-10.png",
        isFeatured: true,
        inStock: true
      },
      {
        id: "prod-2",
        title: "Buffalo Satin Emulsion",
        slug: "buffalo-satin-emulsion",
        brand: "Value Paint",
        category: "Home Paints",
        finishType: "Satin",
        description: "Top-notch quality paint mixture leaving a rich sheen on its substrate. Features high spreading power and backed with superior resistance against fungal and algae attacks.",
        shortDescription: "Premium satin with 14.5–17 m²/L spreading rate and fungal resistance.",
        features: ["14.5 - 17 m²/L Spreading Rate", "Single-Coat Richness", "Anti-Algae & Anti-Fungal", "Backed with 5-year durability"],
        availableSizes: [
          { label: "20L Drum", code: "20L" },
          { label: "4L Gallon", code: "4L" }
        ],
        spreadingRate: 16,
        numberOfCoatsRequired: 2,
        image: "https://valuepaints.org/wp-content/uploads/2019/10/value-crop-8-e1698150795503.png",
        isFeatured: true,
        inStock: true
      },
      {
        id: "prod-3",
        title: "Value Plus Matt Emulsion",
        slug: "value-plus-matt-emulsion",
        brand: "Value Paint",
        category: "Home Paints",
        finishType: "Matt Emulsion",
        description: "Smooth matte formulation designed to hide minor plaster imperfections while offering soft light dispersion across interior rooms.",
        shortDescription: "Non-reflective matte finish that conceals wall flaws effortlessly.",
        features: ["Zero Glare Finish", "Hides Surface Imperfections", "Low Odor & Eco-friendly", "Quick Drying"],
        availableSizes: [
          { label: "20L Drum", code: "20L" },
          { label: "4L Gallon", code: "4L" }
        ],
        spreadingRate: 12,
        numberOfCoatsRequired: 2,
        image: "https://valuepaints.org/wp-content/uploads/2019/10/value-crop-3.png",
        isFeatured: true,
        inStock: true
      },
      {
        id: "prod-4",
        title: "Value Premium Gloss Finish",
        slug: "value-premium-gloss-finish",
        brand: "Value Paint",
        category: "Home Paints",
        finishType: "Gloss",
        description: "High-solids gloss enamel engineered for maximum reflection and weather resistance. Ideal for exterior metal gates, wood trims, doors, and architectural ironwork.",
        shortDescription: "High-reflection protective gloss for metals, gates, and woodwork.",
        features: ["Ultra High Reflectivity", "Anti-Corrosion on Metals", "Weather & Rain Barrier", "Tough Scratch Resistance"],
        availableSizes: [
          { label: "4L Gallon", code: "4L" },
          { label: "1L Tin", code: "1L" }
        ],
        spreadingRate: 13,
        numberOfCoatsRequired: 2,
        image: "https://valuepaints.org/wp-content/uploads/2022/05/Value-crop-images.png",
        isFeatured: true,
        inStock: true
      },
      {
        id: "prod-5",
        title: "Textured Finish (Stucco / Tex)",
        slug: "textured-finish-stucco",
        brand: "Value Paint",
        category: "Home Paints",
        finishType: "Stucco",
        description: "Heavy-duty coarse masonry paint that creates an impenetrable barrier against harsh tropical rain, sunlight, and humidity, while providing a distinctive architectural texture.",
        shortDescription: "Architectural coarse exterior barrier for masonry and perimeter walls.",
        features: ["Extreme Weather Proofing", "Hides Plaster Unevenness", "UV & Heat Resilient", "Tough Acrylic Texture"],
        availableSizes: [
          { label: "20L Drum", code: "20L" }
        ],
        spreadingRate: 8,
        numberOfCoatsRequired: 2,
        image: "https://valuepaints.org/wp-content/uploads/2019/10/value-crop2.png",
        isFeatured: true,
        inStock: true
      },
      {
        id: "prod-6",
        title: "Negro Capa Premium Velvet",
        slug: "negro-capa-premium-velvet",
        brand: "Value Paint",
        category: "Home Paints",
        finishType: "Velvet",
        description: "Luxury decorative velvet coating with rich depth of color and silky touch. Designed for luxury homes, master bedrooms, and executive offices.",
        shortDescription: "Ultra-smooth velvet touch with deep color pigmentation.",
        features: ["Silky Velvet Sheen", "Superior Deep-Tone Retention", "Stain Repellent", "Washable Luxury Film"],
        availableSizes: [
          { label: "20L Drum", code: "20L" },
          { label: "4L Gallon", code: "4L" }
        ],
        spreadingRate: 14,
        numberOfCoatsRequired: 2,
        image: "https://valuepaints.org/wp-content/uploads/2019/10/value-crop-9.png",
        isFeatured: true,
        inStock: true
      },
      {
        id: "prod-7",
        title: "Godswill 2K Auto Basecoat Metallic",
        slug: "godswill-2k-auto-basecoat",
        brand: "Godswill Auto",
        category: "Auto Paints",
        finishType: "Metallic Basecoat",
        description: "Precision-matched 2K automotive acrylic basecoat with brilliant metallic flake suspension. Fast drying and formulated for direct computerized spray application on motor vehicles.",
        shortDescription: "Premium automotive metallic basecoat with high pigment clarity.",
        features: ["Micro-metallic Flake Formula", "Rapid Flash-off Time", "Seamless Clearcoat Adhesion", "Custom Color Matching Available"],
        availableSizes: [
          { label: "4L Gallon", code: "4L" },
          { label: "1L Tin", code: "1L" }
        ],
        spreadingRate: 10,
        numberOfCoatsRequired: 3,
        image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80",
        isFeatured: true,
        inStock: true
      },
      {
        id: "prod-8",
        title: "Godswill High Solid 2K Clearcoat & Hardener",
        slug: "godswill-2k-clearcoat-hardener",
        brand: "Godswill Auto",
        category: "Auto Paints",
        finishType: "Clearcoat",
        description: "Two-component polyurethane high-gloss automotive clearcoat with matching fast hardener. Delivers deep optical gloss and UV protection against tropical sun fading.",
        shortDescription: "Ultra-deep optical shine and scratch-resistant automotive clearcoat.",
        features: ["2:1 Mixing Ratio with Hardener", "Mirror-Gloss Finish", "Yellowing & UV Resistant", "High Chemical Resistance"],
        availableSizes: [
          { label: "5L Kit (4L Clear + 1L Hardener)", code: "5L Kit" },
          { label: "1L Kit", code: "1L Kit" }
        ],
        spreadingRate: 11,
        numberOfCoatsRequired: 2,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        inStock: true
      },
      {
        id: "prod-9",
        title: "Godswill Fast-Dry Acrylic Thinner (Grade A)",
        slug: "godswill-fast-dry-acrylic-thinner",
        brand: "Godswill Solvents",
        category: "Thinners & Hardeners",
        finishType: "N/A",
        description: "Premium virgin solvent thinner engineered specifically for automotive basecoats, acrylic lacquers, and heavy-duty enamel paints. Ensures smooth atomization and prevents orange-peel defect.",
        shortDescription: "Virgin grade thinner for auto spray guns and enamel thinning.",
        features: ["Zero Clouding / Moisture Resistance", "Optimized Flash Time", "High Solvent Power", "Suitable for Spray Equipment Cleaning"],
        availableSizes: [
          { label: "25L Drum", code: "25L" },
          { label: "5L Gallon", code: "5L" }
        ],
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        inStock: true
      },
      {
        id: "prod-10",
        title: "Professional Painter Tool Kit & Roller Set",
        slug: "professional-roller-brush-set",
        brand: "Godswill Tools",
        category: "Painting Tools",
        finishType: "N/A",
        description: "Contractor-grade paint application kit including heavy-duty roller handles, high-density microfiber sleeves, precision cutting-in sash brushes, masking tape, and stainless scrapers.",
        shortDescription: "Durable microfiber rollers, sash brushes, and masking tools.",
        features: ["Shed-resistant Microfiber", "Ergonomic Non-slip Handle", "Stainless Steel Frame", "Precision Sash Brush Included"],
        availableSizes: [
          { label: "Full Kit", code: "Kit" },
          { label: "9-inch Roller Handle + Sleeve", code: "9in" }
        ],
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
        isFeatured: false,
        inStock: true
      }
    ],
    shades: [
      { id: "sh-1", name: "Brilliant White", code: "#FFFFFF", family: "Whites & Off-Whites", isPopular: true },
      { id: "sh-2", name: "Pearl White", code: "#F8F9FA", family: "Whites & Off-Whites", isPopular: true },
      { id: "sh-3", name: "Magnolia Cream", code: "#F4EBD9", family: "Warm Neutrals", isPopular: true },
      { id: "sh-4", name: "Sahara Sand", code: "#E8D8C3", family: "Warm Neutrals", isPopular: false },
      { id: "sh-5", name: "Dove Grey", code: "#CBD5E1", family: "Cool Greys", isPopular: true },
      { id: "sh-6", name: "Charcoal Slate", code: "#334155", family: "Cool Greys", isPopular: true },
      { id: "sh-7", name: "Royal Edo Coral", code: "#E05A47", family: "Vibrant & Earthy", isPopular: true },
      { id: "sh-8", name: "Earthy Terracotta", code: "#B85D38", family: "Vibrant & Earthy", isPopular: false },
      { id: "sh-9", name: "Breeze Azure", code: "#93C5FD", family: "Blues & Greens", isPopular: true },
      { id: "sh-10", name: "Emerald Pine", code: "#065F46", family: "Blues & Greens", isPopular: false },
      { id: "sh-11", name: "Textured Rustic Cream", code: "#DDD3C1", family: "Special Textures", isPopular: true },
      { id: "sh-12", name: "Textured Ash Stone", code: "#949B96", family: "Special Textures", isPopular: false }
    ],
    quotes: [
      {
        id: "quote-1",
        reference: "GWQ-91024",
        customerName: "Engr. Osasere",
        customerPhone: "+2348031234567",
        customerEmail: "osasere.building@gmail.com",
        deliveryArea: "GRA, Benin City",
        projectType: "Residential House",
        items: [
          { productTitle: "Value Plus Satin", size: "20L Drum", quantity: 4, shadeName: "Brilliant White", shadeCode: "#FFFFFF" },
          { productTitle: "Textured Finish (Stucco / Tex)", size: "20L Drum", quantity: 6, shadeName: "Textured Ash Stone", shadeCode: "#949B96" }
        ],
        status: "Contacted via WhatsApp",
        createdAt: new Date().toISOString()
      }
    ],
    transactions: [
      {
        id: "tx-1",
        referenceId: "TX-90124",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        type: "SALE",
        flow: "CREDIT",
        amount: 320000,
        category: "Paint Sales",
        paymentMethod: "Bank Transfer",
        customerOrSupplierName: "Pastor Jude (Airport Rd Project)",
        itemsSummary: "3x 20L Value Plus Satin (Brilliant White), 2x 4L Gloss",
        notes: "Full payment confirmed via transfer"
      },
      {
        id: "tx-2",
        referenceId: "TX-90125",
        date: new Date(Date.now() - 86400000).toISOString(),
        type: "EXPENSE",
        flow: "DEBIT",
        amount: 15000,
        category: "Generator / Fuel",
        paymentMethod: "Cash",
        customerOrSupplierName: "NNPC Mega Station",
        itemsSummary: "Petrol for shop generator (15 Litres)",
        notes: "Power outage in First East Circular"
      },
      {
        id: "tx-3",
        referenceId: "TX-90126",
        date: new Date(Date.now() - 86400000).toISOString(),
        type: "PURCHASE_STOCK",
        flow: "DEBIT",
        amount: 850000,
        category: "Stock Restock",
        paymentMethod: "Bank Transfer",
        customerOrSupplierName: "Gold Edge Industries (Value Paint Depot)",
        itemsSummary: "Restock: 20x 20L Satin, 15x 20L Emulsion, 10x 4L Gloss",
        notes: "Waybill received intact at Benin depot"
      },
      {
        id: "tx-4",
        referenceId: "TX-90127",
        date: new Date().toISOString(),
        type: "SALE",
        flow: "CREDIT",
        amount: 95000,
        category: "Auto Paint Sales",
        paymentMethod: "POS",
        customerOrSupplierName: "Edo Auto Panel Beaters",
        itemsSummary: "2x 1L 2K Metallic, 1x 5L Fast Thinner, 2x Hardener",
        notes: "POS terminal receipt #8812"
      }
    ]
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

export function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

export function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
