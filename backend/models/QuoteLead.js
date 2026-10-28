import mongoose from 'mongoose';

const QuoteLeadSchema = new mongoose.Schema({
  reference: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => 'GWQ-' + Math.floor(10000 + Math.random() * 90000) 
  },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  deliveryArea: { type: String, default: 'Benin City' },
  projectType: { type: String, enum: ['Residential House', 'Commercial Building', 'Automotive Painting', 'Repaint / Touchup', 'Other'], default: 'Residential House' },
  items: [{
    productTitle: String,
    category: String,
    shadeName: String,
    shadeCode: String,
    size: String,
    quantity: Number
  }],
  status: { 
    type: String, 
    enum: ['New Inquiry', 'Contacted via WhatsApp', 'Quoted', 'Completed / Paid', 'Cancelled'], 
    default: 'New Inquiry' 
  },
  channel: { type: String, default: 'WhatsApp' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('QuoteLead', QuoteLeadSchema);
