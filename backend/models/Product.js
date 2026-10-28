import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, default: 'Value Paint' },
  category: { 
    type: String, 
    enum: ['Home Paints', 'Auto Paints', 'Thinners & Hardeners', 'Painting Tools'],
    required: true 
  },
  finishType: { 
    type: String, 
    enum: ['Satin', 'Matt Emulsion', 'Gloss', 'Velvet', 'Stucco', 'Metallic Basecoat', 'Clearcoat', 'Enamel', 'N/A'],
    default: 'N/A'
  },
  description: { type: String, required: true },
  shortDescription: { type: String },
  features: [{ type: String }],
  availableSizes: [{
    label: { type: String, required: true }, // e.g., '20L Drum', '4L Gallon', '1L Tin', '5L Can'
    code: { type: String }
  }],
  spreadingRate: { type: Number }, // in m² per Litre
  numberOfCoatsRequired: { type: Number, default: 2 },
  image: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
