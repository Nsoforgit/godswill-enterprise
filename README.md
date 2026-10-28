# Godswill Enterprise Web Platform

Official distributor of **Value Paints** and premium automotive finishes, painting tools, adhesives, and coatings in **Benin City, Edo State, Nigeria**.

---

## 🎨 Overview
Godswill Enterprise is a full-featured web platform and digital store designed for customers, painters, and contractors in Benin City and nationwide.

### Core Features
- **Product Catalog**: Paints (Value Paints, Value Plus, Buffalo, Rovano, Sharon), Automotive refinish basecoats (MAC APEX, RegisCar), primers, thinners, rollers, brushes, adhesives, and sandpapers.
- **Smart Paint Calculator**: Computes required gallons/drums based on room dimensions, coat count, and wall condition (bare/fresh plaster vs. repainted).
- **Interactive Color Swatches & Mixing Advisor**: Color formulation guides, RGB/Hex values, and shade selector.
- **AI Room Painter & WhatsApp Consultation**: Virtual room preview and direct 1-click WhatsApp photo consultation with Godswill color consultants.
- **Project Bag & Quotation Dispatch**: Multi-item project quote requests via WhatsApp and Email.
- **Admin Management Portal**: Financial ledger (Today / Month / Year net profit metrics, Restocks, Sales, Expenses) and Quote Leads management.

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
# In the root folder:
npm install

# In the client folder:
cd client && npm install

# In the backend folder:
cd ../backend && npm install
```

### 2. Run Locally
- **Backend API Server**:
  ```bash
  cd backend
  node server.js
  ```
  Runs on `http://localhost:5000`

- **Frontend Client**:
  ```bash
  cd client
  npm run dev
  ```
  Runs on `http://localhost:3000`

---

## 🌐 Deployment on Vercel
The repository is pre-configured for fullstack deployment on Vercel:
1. Import this repository on [vercel.com](https://vercel.com).
2. Framework Preset: **Vite** (Root Directory: `./`).
3. Build Command: `cd client && npm install && npm run build` (or Output Directory: `client/dist`).
4. Click **Deploy**.

---

## 📍 Store Information
- **Store Address**: 4 First East Circular Rd, Benin City, Edo State, Nigeria
- **Phone / WhatsApp**: +234 911 531 7958
- **Email**: ifeomansofor48@gmail.com
- **Operating Hours**: Monday – Saturday: 7:30 AM – 6:00 PM (Sunday: Closed)
