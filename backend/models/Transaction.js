import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  referenceId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => 'TX-' + Math.floor(100000 + Math.random() * 900000)
  },
  date: { type: Date, default: Date.now, index: true },
  type: { 
    type: String, 
    enum: ['SALE', 'PURCHASE_STOCK', 'EXPENSE', 'SALES_RETURN', 'DEBT_PAYMENT'], 
    required: true 
  },
  flow: { 
    type: String, 
    enum: ['CREDIT', 'DEBIT'], 
    required: true 
  },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    enum: [
      'Paint Sales', 
      'Auto Paint Sales', 
      'Tools & Thinners', 
      'Stock Restock', 
      'Generator / Fuel', 
      'Shop Maintenance', 
      'Logistics / Waybill', 
      'Staff / Wages', 
      'Customer Refund', 
      'Other'
    ],
    default: 'Paint Sales'
  },
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'POS', 'Bank Transfer', 'Credit (Unpaid)'], 
    default: 'Cash' 
  },
  customerOrSupplierName: { type: String, default: 'Counter Customer' },
  itemsSummary: { type: String }, // e.g. "2x 20L Value Plus Satin, 1x 5L Thinner"
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);
