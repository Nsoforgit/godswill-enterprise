import mongoose from 'mongoose';

const ColorShadeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }, // HEX code e.g. #F8F9FA
  family: { 
    type: String, 
    enum: ['Whites & Off-Whites', 'Warm Neutrals', 'Cool Greys', 'Vibrant & Earthy', 'Blues & Greens', 'Special Textures'],
    required: true 
  },
  rgb: {
    r: Number,
    g: Number,
    b: Number
  },
  popularFor: [{ type: String }], // ['Living Room', 'Exterior', 'Ceiling', 'Automotive']
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('ColorShade', ColorShadeSchema);
