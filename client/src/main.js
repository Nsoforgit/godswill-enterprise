import './style.css';

// Central State
const state = {
  view: 'home', // 'home', 'catalog', 'shades', 'calculator', 'visualizer', 'bag', 'admin'
  selectedCategory: 'ALL',
  selectedFinish: 'ALL',
  products: [],
  shades: [],
  projectBag: JSON.parse(localStorage.getItem('godswill_bag') || '[]'),
  info: null,
  activeProductModal: null,
  
  // AI Generative Room Painter State
  visualizerImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80', // Default reference room
  generatedRoomImage: null,
  visualizerRoomType: 'Living Room',
  visualizerStyle: 'Modern Nigerian Luxury',
  visualizerLighting: 'Bright Natural Daylight',
  visualizerColor: '#CBD5E1', // Default Dove Grey
  visualizerAccentColor: '#FFFFFF', // Default Brilliant White trim
  visualizerOpacity: 0.55,
  visualizerBlendMode: 'multiply',
  isGeneratingRoom: false,
  generationHistory: [],
  visViewMode: 'generated', // 'generated', 'reference'
  aiRecommendations: [],
  isAnalyzing: false,

  // Room Photo WhatsApp Consultation State
  consultationImage: null,
  consultationImageName: '',

  // Color Mixing Suggestion State
  mixTargetId: 'shade-3',
  mixBase1: '#FFFFFF',
  mixBase2: '#DC2626',

  // Paint Calculator State
  calcLastResult: null,

  // Admin State
  adminToken: localStorage.getItem('godswill_admin_token') || null,
  ledgerData: null,
  ledgerPeriod: 'month',
  adminTab: 'ledger', // 'ledger', 'quotes'
  showTxModal: false,
  txModalType: 'SALE',
  selectedTx: null // For Transaction Detail Modal
};

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? (window.location.port === '3000' ? 'http://localhost:5000/api' : '/api')
  : '/api';

// Fetch Initial Data
async function initData() {
  try {
    const [infoRes, prodRes, shadeRes] = await Promise.all([
      fetch(`${API_BASE}/info`),
      fetch(`${API_BASE}/products`),
      fetch(`${API_BASE}/shades`)
    ]);
    state.info = await infoRes.json();
    const prodJson = await prodRes.json();
    state.products = prodJson.products;
    const shadeJson = await shadeRes.json();
    state.shades = shadeJson.shades;
    render();
  } catch (err) {
    console.error('Failed to connect to backend:', err);
    render();
  }
}

// Storage helpers
function saveBag() {
  localStorage.setItem('godswill_bag', JSON.stringify(state.projectBag));
  render();
}

function addToBag(item) {
  state.projectBag.push({ id: Date.now(), ...item });
  saveBag();
  state.activeProductModal = null;
  showToast(`${item.title} added to Project Bag!`);
}

function removeFromBag(id) {
  state.projectBag = state.projectBag.filter(item => item.id !== id);
  saveBag();
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 text-sm font-medium animate-bounce';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Generate WhatsApp Link
function generateWhatsAppUrl(customerDetails) {
  const phone = state.info?.phone || '2349115317958';
  let text = `🎨 *GODSWILL ENTERPRISE - PROJECT QUOTE REQUEST*\n`;
  text += `📍 _Distributor of Value Paint in Benin City, Edo State_\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👤 *Client Name:* ${customerDetails.name || 'Valued Customer'}\n`;
  text += `📞 *Phone:* ${customerDetails.phone || 'Provided via WhatsApp'}\n`;
  if (customerDetails.area) text += `📍 *Delivery Area:* ${customerDetails.area}\n`;
  if (customerDetails.projectType) text += `🏢 *Project Category:* ${customerDetails.projectType}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  text += `📦 *REQUESTED ITEMS (${state.projectBag.length}):*\n`;

  state.projectBag.forEach((item, index) => {
    text += `*${index + 1}. ${item.title}*\n`;
    if (item.shade) text += `   • Shade: ${item.shade.name} (${item.shade.code})\n`;
    text += `   • Packaging: ${item.size}\n`;
    text += `   • Quantity: ${item.quantity} unit(s)\n\n`;
  });

  if (customerDetails.notes) {
    text += `📝 *Additional Instructions:*\n${customerDetails.notes}\n\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Hello Godswill Enterprise, I have chosen these items on your website. Please give me the total quotation, availability, and pickup/delivery options at 4 First East Circular Rd. Thank you!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// Core Render
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <!-- Top Announcement Bar -->
    <header class="bg-[#022A68] text-white text-xs font-medium py-2.5 px-4 shadow-md">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div class="flex items-center space-x-2">
          <span class="bg-amber-500 text-slate-900 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded tracking-wider">Benin City</span>
          <span class="truncate">📍 4 First East Circular Rd, Benin City, Edo State</span>
          <span class="hidden md:inline text-slate-400">|</span>
          <span class="hidden md:inline">🕒 Mon–Sat: 7:30 AM – 6:00 PM</span>
        </div>
        <div class="flex items-center space-x-4">
          <a href="tel:+2349115317958" class="hover:text-amber-300 transition-colors flex items-center space-x-1.5">
            <i class="fa-solid fa-phone"></i>
            <span>+234 911 531 7958</span>
          </a>
          <button onclick="window.navTo('admin')" class="bg-white/10 hover:bg-white/20 text-white text-[11px] px-2.5 py-1 rounded transition-colors flex items-center space-x-1">
            <i class="fa-solid fa-lock text-[10px]"></i>
            <span>Owner Admin</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation Header -->
    <nav class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-3 cursor-pointer" onclick="window.navTo('home')">
          <div class="w-11 h-11 bg-gradient-to-tr from-[#022A68] to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <i class="fa-solid fa-paint-roller text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight text-[#022A68] leading-tight">GODSWILL ENTERPRISE</h1>
            <p class="text-[11px] font-semibold text-amber-600 tracking-wide uppercase">Distributor of Value Paint</p>
          </div>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-700">
          <button onclick="window.navTo('home')" class="${state.view === 'home' ? 'text-[#022A68] border-b-2 border-[#022A68] pb-1 font-bold' : 'hover:text-[#022A68] transition-colors'}">Home</button>
          <button onclick="window.navTo('catalog')" class="${state.view === 'catalog' ? 'text-[#022A68] border-b-2 border-[#022A68] pb-1 font-bold' : 'hover:text-[#022A68] transition-colors'}">Products & Finishes</button>
          <button onclick="window.navTo('shades')" class="${state.view === 'shades' ? 'text-[#022A68] border-b-2 border-[#022A68] pb-1 font-bold' : 'hover:text-[#022A68] transition-colors'}">Color Swatches</button>
          
          <!-- AI Visualizer Tab -->
          <button onclick="window.navTo('visualizer')" class="relative flex items-center space-x-1.5 ${state.view === 'visualizer' ? 'text-blue-700 font-bold border-b-2 border-blue-700 pb-1' : 'text-blue-600 hover:text-blue-800'}">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
            <span>AI Room Painter</span>
            <span class="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">New</span>
          </button>

          <button onclick="window.navTo('calculator')" class="${state.view === 'calculator' ? 'text-[#022A68] border-b-2 border-[#022A68] pb-1 font-bold' : 'hover:text-[#022A68] transition-colors'}">Paint Calculator</button>
          <button onclick="window.filterCat('Painting Tools')" class="${state.view === 'catalog' && state.selectedCategory === 'Painting Tools' ? 'text-[#022A68] border-b-2 border-[#022A68] pb-1 font-bold' : 'hover:text-[#022A68] transition-colors'}">Tools & Supplies</button>
        </div>

        <!-- Action CTAs -->
        <div class="flex items-center space-x-3">
          <button onclick="window.navTo('bag')" class="relative bg-slate-100 hover:bg-slate-200 text-[#022A68] px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center space-x-2">
            <i class="fa-solid fa-briefcase"></i>
            <span class="hidden sm:inline">Project Bag</span>
            <span class="bg-[#022A68] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              ${state.projectBag.length}
            </span>
          </button>
          <a href="https://wa.me/2349115317958?text=Hello%20Godswill%20Enterprise,%20I%20am%20inquiring%20about%20Value%20Paints%20in%20Benin%20City." 
             target="_blank" 
             class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2">
            <i class="fa-brands fa-whatsapp text-lg"></i>
            <span class="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Dynamic View -->
    <main>
      ${renderView()}
    </main>

    <!-- Footer -->
    <footer class="bg-[#060B1A] text-slate-400 text-sm border-t border-slate-800 pt-16 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div class="space-y-4">
          <div class="flex items-center space-x-2 text-white">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-paint-roller text-sm"></i>
            </div>
            <span class="text-lg font-black tracking-tight">GODSWILL ENTERPRISE</span>
          </div>
          <p class="text-xs leading-relaxed text-slate-400">
            Official Distributor of Value Paint in Benin City, Edo State. We supply top-tier Satin, Matt, Gloss, Velvet, and Stucco finishes, automotive basecoats, thinners, and industrial painting tools.
          </p>
          <div class="pt-2">
            <span class="inline-block bg-blue-950 text-blue-300 border border-blue-800 text-[11px] font-semibold px-3 py-1 rounded-full">
              ★ Authorised Paint Distributor
            </span>
          </div>
        </div>

        <div>
          <h4 class="text-white font-bold text-base mb-4">Quick Links</h4>
          <ul class="space-y-2.5 text-xs">
            <li><a href="javascript:void(0)" onclick="window.navTo('visualizer')" class="text-amber-400 font-bold hover:underline">🎨 AI Room & House Visualizer</a></li>
            <li><a href="javascript:void(0)" onclick="window.filterCat('Home Paints')" class="hover:text-white transition-colors">Value Plus Satin & Matt</a></li>
            <li><a href="javascript:void(0)" onclick="window.filterCat('Home Paints', 'Stucco')" class="hover:text-white transition-colors">Textured Finish & Stucco</a></li>
            <li><a href="javascript:void(0)" onclick="window.filterCat('Auto Paints')" class="hover:text-white transition-colors">Automotive Basecoats & Clearcoats</a></li>
            <li><a href="javascript:void(0)" onclick="window.filterCat('Thinners & Hardeners')" class="hover:text-white transition-colors">Fast Thinners & 2K Hardeners</a></li>
            <li><a href="javascript:void(0)" onclick="window.navTo('calculator')" class="hover:text-white transition-colors">Paint Quantity Calculator</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-base mb-4">Depot Information</h4>
          <ul class="space-y-3 text-xs">
            <li class="flex items-start space-x-2.5">
              <i class="fa-solid fa-location-dot text-amber-500 mt-1"></i>
              <span>4 First East Circular Rd, Benin City, Edo State, Nigeria</span>
            </li>
            <li class="flex items-center space-x-2.5">
              <i class="fa-solid fa-clock text-blue-400"></i>
              <span>Mon–Sat: 7:30 AM – 6:00 PM (Sunday Closed)</span>
            </li>
            <li class="flex items-center space-x-2.5">
              <i class="fa-solid fa-phone text-emerald-400"></i>
              <a href="tel:+2349115317958" class="hover:text-white font-semibold">+234 911 531 7958</a>
            </li>
            <li class="flex items-center space-x-2.5">
              <i class="fa-solid fa-envelope text-red-400"></i>
              <span>ifeomansofor48@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold text-base mb-4">Request a Quote</h4>
          <p class="text-xs text-slate-400 mb-4 leading-relaxed">
            Need pricing for residential painting, commercial projects, or auto workshop supplies? We build custom quotations within minutes.
          </p>
          <a href="https://wa.me/2349115317958" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all">
            <i class="fa-brands fa-whatsapp text-base"></i>
            <span>Chat on WhatsApp Directly</span>
          </a>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800/80 text-xs flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
        <p>© ${new Date().getFullYear()} Godswill Enterprise. All rights reserved. Distributor of Value Paint in Benin City, Edo State.</p>
        <button onclick="window.navTo('admin')" class="hover:text-slate-300">Owner Ledger Portal</button>
      </div>
    </footer>

    <!-- Active Product Configuration Modal -->
    ${renderProductModal()}

    <!-- Admin Record Transaction Modal -->
    ${renderTxModal()}

    <!-- Admin Transaction Detail Modal -->
    ${renderTxDetailModal()}
  `;
}

// Router switcher
function renderView() {
  switch (state.view) {
    case 'catalog':
      return renderCatalogView();
    case 'shades':
      return renderShadesView();
    case 'visualizer':
      return renderVisualizerView();
    case 'calculator':
      return renderCalculatorView();
    case 'bag':
      return renderBagView();
    case 'admin':
      return renderAdminView();
    case 'home':
    default:
      return renderHomeView();
  }
}

// ==========================================
// 1. AI ROOM & HOUSE VISUALIZER TAB
// ==========================================
function renderVisualizerView() {
  const currentShade = state.shades.find(s => s.code.toLowerCase() === state.visualizerColor.toLowerCase()) || {
    name: 'Buffalo Satin Dove Grey',
    code: state.visualizerColor
  };

  const roomTypes = [
    { label: 'Modern Living Room', val: 'Living Room' },
    { label: 'Executive Master Bedroom', val: 'Master Bedroom' },
    { label: 'Exterior House Facade', val: 'Exterior House Facade' },
    { label: 'Dining Room', val: 'Dining Room' },
    { label: 'Modern Kitchen', val: 'Kitchen' },
    { label: 'Executive Office', val: 'Executive Office' }
  ];

  const styles = [
    'Modern Nigerian Luxury',
    'Contemporary Minimalist',
    'Warm Classical Villa',
    'Tropical High-Ceiling'
  ];

  const lightings = [
    'Bright Natural Daylight',
    'Warm Ambient Evening Glow',
    'Modern Recessed LEDs'
  ];

  const isGenerating = state.isGeneratingRoom;
  const displayImage = (state.visViewMode === 'generated' && state.generatedRoomImage) 
    ? state.generatedRoomImage 
    : state.visualizerImage;

  return `
    <div class="bg-slate-900 text-white py-10 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-amber-500/20 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-blue-300 mb-2">
              <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
              <span>Generative AI Architectural Engine</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black">AI Room & House Painter</h1>
            <p class="text-xs text-slate-400 mt-1 max-w-2xl">
              Real generative AI image creation: Select any Value Paint color and room type. Our AI generates a photorealistic architectural photograph with the walls cleanly coated in that exact shade.
            </p>
          </div>
          <button onclick="window.runAiColorAnalysis()" class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition-all">
            <i class="fa-solid fa-sparkles"></i>
            <span>${state.isAnalyzing ? 'Analyzing Room...' : 'AI Auto-Suggest 3-Tone Harmonies'}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Main Display Canvas & Controls (8 Cols) -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- Image Display Stage -->
          <div class="relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl aspect-[16/10] flex items-center justify-center">
            
            ${isGenerating ? `
              <div class="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center text-2xl shadow-xl animate-bounce">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div class="space-y-1">
                  <h4 class="text-lg font-black tracking-tight">AI Engine Rendering Room Transformation...</h4>
                  <p class="text-xs text-slate-400 max-w-md">
                    Coating walls in <strong>${currentShade.name}</strong> (${state.visualizerColor}) with ${state.visualizerLighting.toLowerCase()}...
                  </p>
                </div>
                <div class="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            ` : ''}

            <!-- Rendered Image -->
            <img src="${displayImage}" alt="Room Preview" class="w-full h-full object-cover transition-opacity duration-300" />

            <!-- Active Color & Model Tag -->
            <div class="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-2xl flex items-center space-x-3 text-white shadow-xl">
              <div class="w-10 h-10 rounded-xl border border-white/30 shadow-inner flex-shrink-0" style="background-color: ${state.visualizerColor};"></div>
              <div>
                <p class="text-xs font-black leading-tight">${currentShade.name}</p>
                <p class="text-[10px] font-mono text-slate-400 uppercase">${state.visualizerColor} • ${state.visViewMode === 'generated' && state.generatedRoomImage ? 'AI Generative Render' : 'Reference Space'}</p>
              </div>
            </div>

            <!-- Top Right: View Mode Toggle & Upload -->
            <div class="absolute top-4 right-4 z-20 flex items-center space-x-2">
              ${state.generatedRoomImage ? `
                <div class="bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700 flex space-x-1 text-[11px] font-bold text-white">
                  <button onclick="window.setVisViewMode('generated')" class="px-2.5 py-1 rounded-lg ${state.visViewMode === 'generated' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
                    AI Makeover
                  </button>
                  <button onclick="window.setVisViewMode('reference')" class="px-2.5 py-1 rounded-lg ${state.visViewMode === 'reference' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
                    Reference
                  </button>
                </div>
              ` : ''}

              <label class="bg-white/90 hover:bg-white text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg cursor-pointer flex items-center space-x-1.5 transition-colors">
                <i class="fa-solid fa-camera text-blue-600"></i>
                <span class="hidden sm:inline">Upload Room</span>
                <input type="file" id="room-upload-input" accept="image/*" class="hidden" onchange="window.handleRoomUpload(event)" />
              </label>
            </div>
          </div>

          <!-- Generative Tuning Controls -->
          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Space Type:</label>
                <select id="vis-room-type" onchange="window.updateVisRoomType(this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-blue-600">
                  ${roomTypes.map(r => `
                    <option value="${r.val}" ${state.visualizerRoomType === r.val ? 'selected' : ''}>${r.label}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Interior / Exterior Style:</label>
                <select id="vis-style" onchange="window.updateVisStyle(this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-blue-600">
                  ${styles.map(s => `
                    <option value="${s}" ${state.visualizerStyle === s ? 'selected' : ''}>${s}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Lighting Atmosphere:</label>
                <select id="vis-lighting" onchange="window.updateVisLighting(this.value)" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-blue-600">
                  ${lightings.map(l => `
                    <option value="${l}" ${state.visualizerLighting === l ? 'selected' : ''}>${l}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Action Buttons: Generate & Add to Bag -->
            <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button onclick="window.generateRealAiRoom()" ${isGenerating ? 'disabled' : ''} class="flex-1 bg-gradient-to-r from-[#022A68] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all">
                <i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
                <span>${isGenerating ? 'Generating AI Makeover...' : `Generate Real AI Makeover (${currentShade.name})`}</span>
              </button>

              <button onclick="window.addVisualizerColorToBag()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 px-5 rounded-2xl shadow transition-colors flex items-center justify-center space-x-2">
                <i class="fa-solid fa-cart-plus"></i>
                <span>Add This Paint to Bag</span>
              </button>
            </div>
          </div>

          <!-- Session Generation History Strip -->
          ${state.generationHistory.length ? `
            <div class="bg-white rounded-2xl border border-slate-200 p-4">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Recent AI Generated Spaces:</span>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${state.generationHistory.map((item, idx) => `
                  <div onclick="window.selectHistoryItem(${idx})" class="cursor-pointer group relative rounded-xl overflow-hidden border-2 aspect-video ${state.generatedRoomImage === item.imageUrl ? 'border-blue-600 ring-2 ring-blue-400' : 'border-slate-200'}">
                    <img src="${item.imageUrl}" alt="${item.color.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-1.5 text-white">
                      <p class="text-[10px] font-bold truncate">${item.color.name}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Color Swatches & AI Palettes Sidebar (4 Cols) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 class="font-black text-slate-900 text-base mb-1">Pick a Value Paint Shade</h3>
            <p class="text-xs text-slate-500 mb-4">Click any swatch to set as your primary wall color:</p>

            <div class="grid grid-cols-4 gap-3">
              ${state.shades.map(s => `
                <button onclick="window.setVisualizerColor('${s.code}')" 
                        title="${s.name}" 
                        class="aspect-square rounded-xl border-2 transition-transform hover:scale-105 shadow-sm relative ${state.visualizerColor.toLowerCase() === s.code.toLowerCase() ? 'border-blue-600 ring-2 ring-blue-500/50' : 'border-slate-200'}" 
                        style="background-color: ${s.code};">
                </button>
              `).join('')}
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Custom Hex Color:</label>
                <div class="flex items-center space-x-2">
                  <input type="color" value="${state.visualizerColor}" onchange="window.setVisualizerColor(this.value)" class="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0" />
                  <span class="text-xs font-mono font-bold text-slate-600 uppercase">${state.visualizerColor}</span>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Trim / Ceiling:</label>
                <div class="flex items-center space-x-2">
                  <input type="color" value="${state.visualizerAccentColor}" onchange="window.setVisualizerAccent(this.value)" class="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0" />
                  <span class="text-xs font-mono font-bold text-slate-600 uppercase">${state.visualizerAccentColor}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Suggested Palettes Result -->
          <div class="bg-gradient-to-tr from-blue-50 via-indigo-50 to-slate-50 rounded-3xl border border-blue-200 p-6 shadow-sm">
            <div class="flex items-center space-x-2 text-blue-900 font-black text-sm mb-2">
              <i class="fa-solid fa-sparkles text-amber-500"></i>
              <span>AI Coordinated Palettes</span>
            </div>
            <p class="text-xs text-slate-600 mb-4">Architectural 3-tone harmonies calculated for Nigerian lighting:</p>

            ${state.aiRecommendations.length ? `
              <div class="space-y-4">
                ${state.aiRecommendations.map(p => `
                  <div class="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm space-y-2">
                    <h5 class="font-black text-xs text-slate-900">${p.palette_name}</h5>
                    <div class="flex space-x-2">
                      <div onclick="window.setVisualizerColor('${p.primary.code}')" class="flex-1 p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer hover:opacity-90 transition-opacity border border-slate-200" style="background-color: ${p.primary.code}; color: ${p.primary.code === '#FFFFFF' ? '#000' : '#FFF'};">
                        Main Wall
                      </div>
                      <div onclick="window.setVisualizerAccent('${p.secondary.code}')" class="flex-1 p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer hover:opacity-90 transition-opacity border border-slate-200" style="background-color: ${p.secondary.code}; color: ${p.secondary.code === '#FFFFFF' ? '#000' : '#FFF'};">
                        Trim
                      </div>
                      <div onclick="window.setVisualizerColor('${p.accent.code}')" class="flex-1 p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer hover:opacity-90 transition-opacity border border-slate-200" style="background-color: ${p.accent.code}; color: ${p.accent.code === '#FFFFFF' ? '#000' : '#FFF'};">
                        Feature
                      </div>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug">${p.description}</p>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="text-center py-6 text-slate-500">
                <i class="fa-solid fa-wand-magic-sparkles text-2xl text-blue-400 mb-2"></i>
                <p class="text-xs">Click "AI Auto-Suggest" to generate matched 3-tone palettes for your space.</p>
              </div>
            `}
          </div>

        </div>
      </div>

      <!-- Direct WhatsApp Room Consultation Module (Human Expert Photo Review & Color Matching) -->
      <div class="mt-12 bg-gradient-to-r from-[#022A68] via-slate-900 to-emerald-950 rounded-3xl border-2 border-emerald-500/50 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-4">
            <div class="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <i class="fa-brands fa-whatsapp text-sm"></i>
              <span>Direct WhatsApp Colorist Consultation</span>
            </div>
            
            <h3 class="text-2xl sm:text-3xl font-black text-white leading-tight">
              Snap Your Real Room & Send via WhatsApp for Consultation
            </h3>

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Automatic AI renders can sometimes guess lighting incorrectly. To get 100% accurate results for your actual space, <strong>snap your room or house</strong> with your phone, preview it below, and send it directly to our color team at <span class="text-white font-semibold">4 First East Circular Rd, Benin City</span>. We will review your room's architecture, suggest the exact Value Paint finishes, calculate required drums, and prepare a custom quotation!
            </p>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <label class="bg-white hover:bg-slate-100 text-slate-900 font-black text-xs px-5 py-3.5 rounded-xl shadow-lg cursor-pointer flex items-center justify-center space-x-2 transition-all">
                <i class="fa-solid fa-camera text-emerald-600 text-sm"></i>
                <span>${state.consultationImage ? 'Change Uploaded Photo' : 'Snap / Upload Room Photo'}</span>
                <input type="file" id="consultation-photo-input" accept="image/*" class="hidden" onchange="window.handleConsultationPhotoUpload(event)" />
              </label>

              <button onclick="window.sendRoomConsultationToWhatsApp()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-xl flex items-center justify-center space-x-2 transition-all">
                <i class="fa-brands fa-whatsapp text-lg"></i>
                <span>Send Room Photo & Colors to WhatsApp (+234 911 531 7958)</span>
              </button>
            </div>

            <div class="bg-black/30 border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-emerald-200 flex items-center space-x-3">
              <div class="w-6 h-6 rounded-lg flex-shrink-0 border border-white/40 shadow-inner" style="background-color: ${state.visualizerColor};"></div>
              <p class="leading-snug">
                Pre-selected shade: <strong class="text-white">${currentShade.name}</strong> (${state.visualizerColor}) • Space: <strong class="text-white">${state.visualizerRoomType}</strong>. Tapping WhatsApp opens a direct chat with this exact specification!
              </p>
            </div>
          </div>

          <!-- Preview Stage for Uploaded Photo -->
          <div class="lg:col-span-4 flex justify-center">
            ${state.consultationImage ? `
              <div class="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl bg-slate-950 aspect-[4/3] flex items-center justify-center group">
                <img src="${state.consultationImage}" alt="Room Preview" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Photo Ready for WhatsApp</span>
                  <p class="text-xs font-semibold truncate">${state.consultationImageName || 'Uploaded Room'}</p>
                </div>
              </div>
            ` : `
              <div class="w-full max-w-sm border-2 border-dashed border-emerald-500/40 rounded-3xl p-8 text-center text-slate-400 bg-white/5 flex flex-col items-center justify-center aspect-[4/3]">
                <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-3">
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <p class="text-xs font-bold text-slate-200">Upload Room or House Photo</p>
                <p class="text-[11px] text-slate-400 mt-1 max-w-xs">Supports interior walls, exterior facades, gates, and commercial premises.</p>
              </div>
            `}
          </div>
        </div>
      </div>

    </div>
  `;
}

// ==========================================
// 2. ADMIN BOOKKEEPING LEDGER WITH MODAL
// ==========================================
function renderAdminView() {
  if (!state.adminToken) {
    return `
      <div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 max-w-md w-full text-center">
          <div class="w-14 h-14 bg-blue-100 text-[#022A68] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h2 class="text-2xl font-black text-slate-900">Owner Admin Portal</h2>
          <p class="text-xs text-slate-500 mt-1 mb-6">Restricted to Godswill Enterprise Management</p>

          <div class="text-left space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Admin Password / PIN</label>
              <input type="password" id="admin-pass" placeholder="Enter admin password" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-blue-600" />
            </div>
            <button onclick="window.adminLogin()" class="w-full bg-[#022A68] hover:bg-blue-700 text-white font-black py-3.5 rounded-xl text-sm transition-colors shadow-lg">
              Sign In to Business Ledger
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const s = state.ledgerData?.summary || { totalSales: 0, totalStockPurchases: 0, totalExpenses: 0, totalReturns: 0, totalDebts: 0, netProfit: 0, profitMargin: 0 };
  const glance = state.ledgerData?.growthAtAGlance || {};
  const todayG = glance.today || { totalSales: 0, totalStockPurchases: 0, totalExpenses: 0, totalReturns: 0, netProfit: 0, profitMargin: 0, transactionCount: 0 };
  const monthG = glance.month || { totalSales: 0, totalStockPurchases: 0, totalExpenses: 0, totalReturns: 0, netProfit: 0, profitMargin: 0, transactionCount: 0 };
  const yearG = glance.year || { totalSales: 0, totalStockPurchases: 0, totalExpenses: 0, totalReturns: 0, netProfit: 0, profitMargin: 0, transactionCount: 0 };
  const txs = state.ledgerData?.transactions || [];

  return `
    <div class="bg-[#022A68] text-white py-6 px-4 border-b border-blue-900">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span class="text-amber-400 text-xs uppercase font-extrabold tracking-wider">Business Operating System</span>
          <h1 class="text-2xl font-black">Daily Transactions & Profit/Loss Ledger</h1>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="window.openTxModal('SALE')" class="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-1.5">
            <i class="fa-solid fa-plus"></i>
            <span>+ Record Daily Sale</span>
          </button>
          <button onclick="window.openTxModal('PURCHASE_STOCK')" class="bg-blue-500 hover:bg-blue-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-1.5">
            <i class="fa-solid fa-boxes-stacked"></i>
            <span>+ Restock Purchase</span>
          </button>
          <button onclick="window.openTxModal('EXPENSE')" class="bg-red-500 hover:bg-red-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-1.5">
            <i class="fa-solid fa-receipt"></i>
            <span>+ Log Expense</span>
          </button>
          <button onclick="window.openTxModal('DEBTOR_CREDIT')" class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-1.5">
            <i class="fa-solid fa-user-clock"></i>
            <span>+ Credit / Debtor</span>
          </button>
          <button onclick="window.adminLogout()" class="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Executive Growth & Net Profit Overview (Today vs Month vs Year) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div class="bg-gradient-to-r from-slate-900 via-[#022A68] to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-900 shadow-xl mb-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-blue-800/80 pb-5 mb-6">
          <div>
            <div class="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-1">
              <i class="fa-solid fa-chart-line"></i>
              <span>Executive Profitability Dashboard</span>
            </div>
            <h2 class="text-2xl font-black">Net Profit & Growth at a Glance</h2>
            <p class="text-xs text-blue-200 mt-0.5">Real-time financial visibility: Track exactly how your business is profiting today, this month, and this year.</p>
          </div>
          <div class="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-right">
            <span class="text-[10px] text-blue-300 uppercase font-bold block">Profit Formula</span>
            <span class="text-xs font-mono font-bold text-amber-300">Sales - (Stock COGS + Expenses + Returns)</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Today's Net Profit Card -->
          <div class="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">Today (Daily Growth)</span>
                <p class="text-3xl font-black mt-1 ${todayG.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                  ₦ ${(todayG.netProfit || 0).toLocaleString()}
                </p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${todayG.profitMargin >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}">
                ${todayG.profitMargin || 0}% Margin
              </span>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-slate-400 block text-[10px]">Sales Inflow:</span>
                <span class="font-bold text-emerald-300">₦ ${(todayG.totalSales || 0).toLocaleString()}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Costs & Expenses:</span>
                <span class="font-bold text-rose-300">₦ ${((todayG.totalStockPurchases || 0) + (todayG.totalExpenses || 0)).toLocaleString()}</span>
              </div>
            </div>
            <span class="text-[10px] text-slate-400 mt-2 block">${todayG.transactionCount || 0} entries logged today</span>
          </div>

          <!-- This Month's Net Profit Card -->
          <div class="bg-white/10 border-2 border-blue-400/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden shadow-lg">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-[11px] font-extrabold uppercase text-blue-300 tracking-wider">This Month (Monthly Growth)</span>
                <p class="text-3xl font-black mt-1 ${monthG.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                  ₦ ${(monthG.netProfit || 0).toLocaleString()}
                </p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${monthG.profitMargin >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}">
                ${monthG.profitMargin || 0}% Margin
              </span>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-slate-400 block text-[10px]">Sales Inflow:</span>
                <span class="font-bold text-emerald-300">₦ ${(monthG.totalSales || 0).toLocaleString()}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Costs & Expenses:</span>
                <span class="font-bold text-rose-300">₦ ${((monthG.totalStockPurchases || 0) + (monthG.totalExpenses || 0)).toLocaleString()}</span>
              </div>
            </div>
            <span class="text-[10px] text-slate-400 mt-2 block">${monthG.transactionCount || 0} entries logged this month</span>
          </div>

          <!-- This Year's Net Profit Card -->
          <div class="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider">This Year (Annual Growth)</span>
                <p class="text-3xl font-black mt-1 ${yearG.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                  ₦ ${(yearG.netProfit || 0).toLocaleString()}
                </p>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${yearG.profitMargin >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}">
                ${yearG.profitMargin || 0}% Margin
              </span>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span class="text-slate-400 block text-[10px]">Sales Inflow:</span>
                <span class="font-bold text-emerald-300">₦ ${(yearG.totalSales || 0).toLocaleString()}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Costs & Expenses:</span>
                <span class="font-bold text-rose-300">₦ ${((yearG.totalStockPurchases || 0) + (yearG.totalExpenses || 0)).toLocaleString()}</span>
              </div>
            </div>
            <span class="text-[10px] text-slate-400 mt-2 block">${yearG.transactionCount || 0} entries logged this year</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Filtered Period Breakdown -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 class="text-lg font-black text-slate-800">Active Period Ledger Breakdown</h3>
          <p class="text-xs text-slate-500">Currently showing: <strong class="text-blue-900 uppercase">${state.ledgerPeriod}</strong> records</p>
        </div>
        <div class="flex space-x-1.5 bg-slate-200 p-1 rounded-xl text-xs font-bold">
          <button onclick="window.setLedgerPeriod('today')" class="px-3 py-1.5 rounded-lg ${state.ledgerPeriod === 'today' ? 'bg-white text-[#022A68] shadow' : 'text-slate-600 hover:text-slate-900'}">Today</button>
          <button onclick="window.setLedgerPeriod('month')" class="px-3 py-1.5 rounded-lg ${state.ledgerPeriod === 'month' ? 'bg-white text-[#022A68] shadow' : 'text-slate-600 hover:text-slate-900'}">This Month</button>
          <button onclick="window.setLedgerPeriod('year')" class="px-3 py-1.5 rounded-lg ${state.ledgerPeriod === 'year' ? 'bg-white text-[#022A68] shadow' : 'text-slate-600 hover:text-slate-900'}">This Year</button>
          <button onclick="window.setLedgerPeriod('all')" class="px-3 py-1.5 rounded-lg ${state.ledgerPeriod === 'all' ? 'bg-white text-[#022A68] shadow' : 'text-slate-600 hover:text-slate-900'}">All-Time</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales (Inflow)</span>
          <p class="text-2xl font-black text-emerald-600 mt-2">₦ ${(s.totalSales || 0).toLocaleString()}</p>
          <p class="text-[11px] text-slate-500 mt-1">Walk-in + WhatsApp orders</p>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Purchases (COGS)</span>
          <p class="text-2xl font-black text-slate-800 mt-2">₦ ${(s.totalStockPurchases || 0).toLocaleString()}</p>
          <p class="text-[11px] text-slate-500 mt-1">Value Paint factory restock</p>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Shop Running Expenses</span>
          <p class="text-2xl font-black text-red-600 mt-2">₦ ${(s.totalExpenses || 0).toLocaleString()}</p>
          <p class="text-[11px] text-slate-500 mt-1">Generator fuel, logistics, wages</p>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Returns & Debtors</span>
          <p class="text-2xl font-black text-amber-600 mt-2">₦ ${((s.totalReturns || 0) + (s.totalDebts || 0)).toLocaleString()}</p>
          <p class="text-[11px] text-slate-500 mt-1">Exchanges & unpaid credit</p>
        </div>

        <div class="bg-gradient-to-tr from-[#022A68] to-blue-800 text-white rounded-2xl p-5 shadow-lg">
          <span class="text-xs font-bold text-amber-300 uppercase tracking-wider">Net Profit (Growth)</span>
          <p class="text-2xl font-black mt-2">₦ ${(s.netProfit || 0).toLocaleString()}</p>
          <p class="text-[11px] text-blue-200 mt-1">Sales minus stock & expenses</p>
        </div>
      </div>

      <!-- Transactions Ledger Table -->
      <div class="mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 class="font-black text-slate-900 text-sm">Ledger Records (${txs.length})</h3>
          <span class="text-xs text-slate-500">Persistent Local Storage & Database</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-400 uppercase font-extrabold border-b border-slate-100">
              <tr>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Ref</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Customer / Supplier</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Details</th>
                <th class="py-3 px-4">Method</th>
                <th class="py-3 px-4 text-right">Amount (₦)</th>
                <th class="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              ${txs.length ? txs.map(t => `
                <tr onclick="window.viewTxDetail('${t.id}')" class="hover:bg-blue-50/70 cursor-pointer transition-colors group">
                  <td class="py-3.5 px-4 whitespace-nowrap text-slate-500">${new Date(t.date).toLocaleDateString()}</td>
                  <td class="py-3.5 px-4 font-mono font-bold text-slate-700 group-hover:text-blue-700">${t.referenceId}</td>
                  <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${t.flow === 'CREDIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                      ${t.type}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-bold text-slate-900">${t.customerOrSupplierName}</td>
                  <td class="py-3.5 px-4 text-slate-500">${t.category}</td>
                  <td class="py-3.5 px-4 max-w-xs truncate text-slate-600" title="${t.itemsSummary || t.notes || ''}">
                    ${t.itemsSummary ? `<span class="font-semibold text-slate-800">${t.itemsSummary}</span>` : (t.notes || '-')}
                  </td>
                  <td class="py-3.5 px-4">${t.paymentMethod}</td>
                  <td class="py-3.5 px-4 text-right font-black ${t.flow === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'}">
                    ${t.flow === 'CREDIT' ? '+' : '-'} ₦ ${(t.amount || 0).toLocaleString()}
                  </td>
                  <td class="py-3.5 px-4 text-center" onclick="event.stopPropagation()">
                    <div class="flex items-center justify-center space-x-1">
                      <button onclick="window.viewTxDetail('${t.id}')" title="View Full Details" class="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        <i class="fa-solid fa-eye text-xs"></i>
                      </button>
                      <button onclick="window.deleteTransaction('${t.id}')" title="Delete Record" class="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr><td colspan="9" class="py-8 text-center text-slate-400">No transactions recorded for this period.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Transaction Modal Component (Replaces browser prompt with a rich, mobile-friendly dialog)
function renderTxModal() {
  if (!state.showTxModal) return '';

  return `
    <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <div class="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <span class="text-xs font-bold text-blue-600 uppercase">Bookkeeping Entry</span>
            <h3 class="text-xl font-black text-slate-900">Record New Transaction</h3>
          </div>
          <button onclick="window.closeTxModal()" class="text-slate-400 hover:text-slate-600 p-2">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onsubmit="window.saveTransaction(event)" class="space-y-4 mt-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Transaction Type *</label>
              <select id="tx-type" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-blue-600">
                <option value="SALE" ${state.txModalType === 'SALE' ? 'selected' : ''}>Daily Sale (Credit Inflow)</option>
                <option value="PURCHASE_STOCK" ${state.txModalType === 'PURCHASE_STOCK' ? 'selected' : ''}>Stock Restock (Debit Outflow)</option>
                <option value="EXPENSE" ${state.txModalType === 'EXPENSE' ? 'selected' : ''}>Shop Expense (Debit Outflow)</option>
                <option value="SALES_RETURN" ${state.txModalType === 'SALES_RETURN' ? 'selected' : ''}>Sales Return / Refund</option>
                <option value="DEBTOR_CREDIT" ${state.txModalType === 'DEBTOR_CREDIT' ? 'selected' : ''}>Credit Given to Customer</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Amount (₦) *</label>
              <input type="number" id="tx-amount" required placeholder="e.g. 85000" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-blue-600" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select id="tx-category" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-blue-600">
                <option value="Paint Sales">Paint Sales (Satin, Matt, Gloss)</option>
                <option value="Auto Paint Sales">Auto Paints & Clearcoats</option>
                <option value="Tools & Thinners">Tools, Thinners & Hardeners</option>
                <option value="Stock Restock">Value Paint Depot Restock</option>
                <option value="Generator / Fuel">Generator / Petrol</option>
                <option value="Logistics / Waybill">Transport & Logistics</option>
                <option value="Shop Maintenance">Shop Repairs & Running</option>
                <option value="Staff / Wages">Staff Allowance / Wages</option>
                <option value="Other">Other Expenses</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select id="tx-method" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-blue-600">
                <option value="Cash">Cash</option>
                <option value="POS">POS Terminal</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit (Unpaid)">Unpaid Credit</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Customer / Supplier Name</label>
            <input type="text" id="tx-name" placeholder="e.g. Pastor Jude, Gold Edge Waybill" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-blue-600" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Items / Description Summary</label>
            <input type="text" id="tx-details" placeholder="e.g. 2x 20L Value Plus Satin, 1x 5L Fast Thinner" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-blue-600" />
          </div>

          <div class="pt-4 border-t border-slate-100 flex space-x-3">
            <button type="button" onclick="window.closeTxModal()" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors">
              Cancel
            </button>
            <button type="submit" class="flex-1 bg-[#022A68] hover:bg-blue-700 text-white font-black py-3 rounded-xl text-xs transition-colors shadow">
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Transaction Detail Modal Component (Displays full, unabbreviated details of any transaction)
function renderTxDetailModal() {
  if (!state.selectedTx) return '';
  const tx = state.selectedTx;
  const isCredit = tx.flow === 'CREDIT';
  const formattedDate = new Date(tx.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) + ' at ' + new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `
    <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        
        <!-- Header -->
        <div class="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">${tx.referenceId}</span>
              <span class="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                ${isCredit ? 'Inflow (+ Credit)' : 'Outflow (- Debit)'}
              </span>
            </div>
            <h3 class="text-xl font-black text-slate-900 mt-2">${tx.type.replace('_', ' ')}</h3>
            <p class="text-xs text-slate-500 mt-0.5"><i class="fa-regular fa-calendar text-slate-400 mr-1"></i>${formattedDate}</p>
          </div>
          <button onclick="window.closeTxDetailModal()" class="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Financial Value Display -->
        <div class="my-6 p-5 rounded-2xl ${isCredit ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'} flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider ${isCredit ? 'text-emerald-700' : 'text-rose-700'}">Total Transaction Value</span>
            <div class="text-3xl font-black ${isCredit ? 'text-emerald-600' : 'text-rose-600'} mt-0.5">
              ${isCredit ? '+' : '-'} ₦ ${(tx.amount || 0).toLocaleString()}
            </div>
          </div>
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isCredit ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}">
            <i class="fa-solid ${isCredit ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i>
          </div>
        </div>

        <!-- Key Transaction Information Grid -->
        <div class="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 font-bold block mb-1">Customer / Supplier</span>
            <span class="font-extrabold text-slate-900 text-sm break-words">${tx.customerOrSupplierName || 'Walk-in Counter'}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 font-bold block mb-1">Category</span>
            <span class="font-extrabold text-slate-900 text-sm">${tx.category || 'General'}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 font-bold block mb-1">Payment Method</span>
            <span class="font-extrabold text-slate-900">${tx.paymentMethod || 'Cash'}</span>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 font-bold block mb-1">Entry Flow</span>
            <span class="font-extrabold ${isCredit ? 'text-emerald-600' : 'text-rose-600'}">${tx.flow}</span>
          </div>
        </div>

        <!-- Full Lengthy Items Breakdown (No truncation) -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Itemized Breakdown & Order Specification</span>
            <span class="text-[10px] text-slate-400 font-normal">Full Unabbreviated Record</span>
          </label>
          <div class="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-slate-800 selection:bg-amber-400 selection:text-slate-950">
${tx.itemsSummary ? tx.itemsSummary : 'No itemized product breakdown entered.'}
          </div>
        </div>

        <!-- Internal Notes & Waybill References -->
        ${tx.notes ? `
          <div class="mb-6 bg-amber-50/70 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950">
            <div class="flex items-center space-x-1.5 font-bold mb-1">
              <i class="fa-solid fa-circle-info text-amber-600"></i>
              <span>Bookkeeping Notes & Remarks</span>
            </div>
            <p class="text-amber-900 leading-relaxed">${tx.notes}</p>
          </div>
        ` : ''}

        <!-- Bottom Action Bar -->
        <div class="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
          <button onclick="window.copyTxSummary('${tx.id}')" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5">
            <i class="fa-solid fa-copy"></i>
            <span>Copy Voucher</span>
          </button>
          <button onclick="window.deleteTransaction('${tx.id}')" class="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center space-x-1.5 border border-red-200">
            <i class="fa-solid fa-trash-can"></i>
            <span>Delete</span>
          </button>
          <button onclick="window.closeTxDetailModal()" class="bg-[#022A68] hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl text-xs transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  `;
}

// 3. PRODUCT MODAL
function renderProductModal() {
  if (!state.activeProductModal) return '';
  const p = state.activeProductModal;

  return `
    <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <div class="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">${p.category}</span>
            <h3 class="text-2xl font-black text-slate-900 mt-1">${p.title}</h3>
          </div>
          <button onclick="window.closeProductModal()" class="text-slate-400 hover:text-slate-600 p-2">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div class="bg-slate-50 p-6 rounded-2xl flex items-center justify-center aspect-square">
            <img src="${p.image}" alt="${p.title}" class="max-h-full max-w-full object-contain drop-shadow-lg" />
          </div>

          <div class="space-y-4">
            <p class="text-xs text-slate-600 leading-relaxed">${p.description}</p>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Choose Packaging Size:</label>
              <select id="modal-size" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-blue-600">
                ${p.availableSizes.map(s => `<option value="${s.label}">${s.label}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Quantity:</label>
              <div class="flex items-center space-x-3">
                <input type="number" id="modal-qty" value="1" min="1" class="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-blue-600" />
                <span class="text-xs text-slate-400">units</span>
              </div>
            </div>

            ${p.category === 'Home Paints' ? `
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Select Color Shade:</label>
                <select id="modal-shade" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-blue-600">
                  <option value="">Default White / Factory Base</option>
                  ${state.shades.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('')}
                </select>
              </div>
            ` : ''}

            <div class="pt-4 border-t border-slate-100">
              <button onclick="window.confirmAddProduct()" class="w-full bg-[#022A68] hover:bg-blue-700 text-white font-black py-3.5 rounded-xl text-xs transition-colors shadow-lg">
                Add to Project Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 4. HOME & CATALOG VIEWS
function renderHomeView() {
  const featured = state.products.filter(p => p.isFeatured) || [];

  return `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-b from-[#022A68] via-[#041D44] to-[#060B1A] text-white py-20 lg:py-28 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Official Distributor of Value Paint in Benin City, Edo State</span>
            </div>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Premium Paints & Coatings Built for Nigerian Homes & Vehicles.
            </h1>

            <p class="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Discover Value Plus Satin, Buffalo Satin, Velvet, Stucco, auto finishes, and thinners at <strong class="text-white">4 First East Circular Rd, Benin City</strong>.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button onclick="window.navTo('visualizer')" class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-7 py-4 rounded-xl text-sm shadow-xl flex items-center justify-center space-x-2 transition-all">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Try AI Room Painter</span>
              </button>
              <button onclick="window.navTo('catalog')" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-4 rounded-xl text-sm backdrop-blur-md transition-all flex items-center justify-center space-x-2">
                <span>Browse Products & Finishes</span>
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 relative flex justify-center">
            <div class="relative w-full max-w-md bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
              <div class="relative aspect-square rounded-2xl overflow-hidden bg-slate-900/50 flex items-center justify-center p-8">
                <img src="/products/value-plus-satin-4ltr-gallon.png" alt="Value Plus Satin" class="max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="mt-5 text-center">
                <span class="text-xs uppercase font-extrabold text-amber-400 tracking-wider">Top Recommended Finish</span>
                <h3 class="text-xl font-black text-white mt-1">Value Plus Satin</h3>
                <p class="text-xs text-slate-300 mt-1">Washable luxury eggshell finish with superior moisture resistance</p>
                <button onclick="window.openProduct('prod-1')" class="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-colors">
                  Configure & Add to Project Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Showcase -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span class="text-xs font-bold text-blue-600 uppercase tracking-widest">In Stock at Benin Depot</span>
            <h2 class="text-2xl sm:text-3xl font-black text-[#022A68] mt-1">Featured Paint Finishes</h2>
          </div>
          <button onclick="window.navTo('catalog')" class="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1">
            <span>View Full Catalog (${state.products.length} Products)</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          ${featured.map(product => renderProductCard(product)).join('')}
        </div>
      </div>
    </section>

    <!-- Professional Painting Tools & Allied Products Section -->
    <section class="py-16 bg-white border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div class="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <i class="fa-solid fa-screwdriver-wrench"></i>
              <span>Professional Contractor & Auto Supplies</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-[#022A68]">Painting Tools & Allied Workshop Supplies</h2>
            <p class="text-xs text-slate-500 mt-1 max-w-xl">
              Equip your painters, auto body technicians, and site managers with heavy-duty HVLP spray guns, roller poles, stainless scrapers, car body fillers, and precision masking tapes.
            </p>
          </div>
          <button onclick="window.filterCat('Painting Tools')" class="bg-[#022A68] hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow transition-colors flex items-center space-x-1.5">
            <span>Explore All Tools & Hardware</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          ${state.products.filter(p => p.category === 'Painting Tools').slice(0, 3).map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderCatalogView() {
  let filtered = state.products;
  if (state.selectedCategory !== 'ALL') {
    filtered = filtered.filter(p => p.category === state.selectedCategory);
  }
  if (state.selectedFinish !== 'ALL') {
    filtered = filtered.filter(p => p.finishType === state.selectedFinish);
  }

  const categories = ['ALL', 'Home Paints', 'Auto Paints', 'Thinners & Hardeners', 'Painting Tools', 'Other Products'];

  return `
    <div class="bg-slate-100 py-8 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-black text-[#022A68]">Product Catalog & Finishes</h1>
        <p class="text-xs text-slate-600 mt-1">Distributor of Value Paint in Benin City, Edo State.</p>
        
        <div class="mt-6 flex flex-wrap gap-2">
          ${categories.map(cat => `
            <button onclick="window.filterCat('${cat}')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${state.selectedCategory === cat ? 'bg-[#022A68] text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200'}">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        ${filtered.map(p => renderProductCard(p)).join('')}
      </div>
    </div>
  `;
}

function renderProductCard(p) {
  return `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      <div class="relative bg-slate-100 p-8 flex items-center justify-center aspect-[4/3] overflow-hidden">
        <span class="absolute top-3 left-3 bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-blue-200">
          ${p.category}
        </span>
        <img src="${p.image}" alt="${p.title}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md" />
      </div>

      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">${p.brand}</span>
          <h3 class="text-lg font-black text-slate-900 mt-1 leading-snug group-hover:text-blue-700 transition-colors">${p.title}</h3>
          <p class="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">${p.shortDescription || p.description}</p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-500">Sizes: ${p.availableSizes.map(s => s.code || s.label).join(', ')}</span>
          <button onclick="window.openProduct('${p.id}')" class="bg-[#022A68] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-1.5">
            <span>Configure</span>
            <i class="fa-solid fa-plus text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Built-in mixing recipes for Value Paint shades
const shadeMixingRecipes = {
  'shade-1': { base: 'Value White Satin Base (98%)', tint1: 'Lamp Black (1.5%)', tint2: 'Ultramarine Blue (0.5%)', tips: 'Yields crisp Brilliant White with high light reflectance.' },
  'shade-2': { base: 'Value White Emulsion (90%)', tint1: 'Golden Ochre Tint (8%)', tint2: 'Raw Umber (2%)', tips: 'Classic Nigerian warm parlor tone; soft and welcoming.' },
  'shade-3': { base: 'Value White Satin Base (85%)', tint1: 'Carbon Black Toner (12%)', tint2: 'Oxford Blue Tint (3%)', tips: 'Modern architectural neutral; hides dirt and coordinates with gypsum boards.' },
  'shade-4': { base: 'Value White Base (88%)', tint1: 'Raw Umber (8%)', tint2: 'Yellow Ochre (4%)', tips: 'Warm desert stone hue; ideal for bedrooms and hallways.' },
  'shade-5': { base: 'Value White Base (82%)', tint1: 'Chrome Green Toner (14%)', tint2: 'Lemon Yellow (4%)', tips: 'Cool organic green for relaxing lounges and doctor clinics.' },
  'shade-6': { base: 'Oxford Blue Base (78%)', tint1: 'Carbon Black (18%)', tint2: 'Signal Red Tint (4%)', tips: 'Deep executive feature wall finish; pairs luxuriously with gold lighting.' },
  'shade-7': { base: 'Oxide Red Base (70%)', tint1: 'Golden Ochre (20%)', tint2: 'White Satin (10%)', tips: 'Earthy Benin terracotta warmth; weather-resistant exterior and pillar coat.' },
  'shade-8': { base: 'Yellow Oxide Base (75%)', tint1: 'Brilliant White (20%)', tint2: 'Medium Bronze (5%)', tips: 'Rich radiant accent tone for luxury dining and ceilings.' },
  'shade-9': { base: 'Value White Satin (84%)', tint1: 'Signal Red Toner (12%)', tint2: 'Yellow Ochre (4%)', tips: 'Delicate soothing tone for baby nurseries and boutique salons.' },
  'shade-10': { base: 'Value White Base (86%)', tint1: 'Leaf Green (10%)', tint2: 'Raw Sienna (4%)', tips: 'Earthy herbal tone popular in modern Scandinavian and luxury duplex designs.' },
  'shade-11': { base: 'Value White Base (85%)', tint1: 'Ultramarine Blue (12%)', tint2: 'Carbon Black (3%)', tips: 'Airy spacious sky tone; elevates room height perception.' },
  'shade-12': { base: 'Carbon Black Base (80%)', tint1: 'White Satin (15%)', tint2: 'Navy Toner (5%)', tips: 'Industrial moody statement shade; dramatic backdrops.' }
};

function blendHexColors(c1, c2, weight = 0.5) {
  try {
    const r1 = parseInt(c1.slice(1, 3), 16);
    const g1 = parseInt(c1.slice(3, 5), 16);
    const b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16);
    const g2 = parseInt(c2.slice(3, 5), 16);
    const b2 = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(r1 * (1 - weight) + r2 * weight);
    const g = Math.round(g1 * (1 - weight) + g2 * weight);
    const b = Math.round(b1 * (1 - weight) + b2 * weight);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  } catch (e) {
    return '#CBD5E1';
  }
}

function findClosestShade(targetHex) {
  try {
    const tr = parseInt(targetHex.slice(1, 3), 16);
    const tg = parseInt(targetHex.slice(3, 5), 16);
    const tb = parseInt(targetHex.slice(5, 7), 16);
    let best = state.shades[0] || { name: 'Dove Grey', code: '#CBD5E1' };
    let minDiff = Infinity;
    state.shades.forEach(s => {
      const sr = parseInt(s.code.slice(1, 3), 16);
      const sg = parseInt(s.code.slice(3, 5), 16);
      const sb = parseInt(s.code.slice(5, 7), 16);
      const diff = Math.sqrt((tr - sr) ** 2 + (tg - sg) ** 2 + (tb - sb) ** 2);
      if (diff < minDiff) {
        minDiff = diff;
        best = s;
      }
    });
    return best;
  } catch (e) {
    return state.shades[0] || { name: 'Dove Grey', code: '#CBD5E1' };
  }
}

function renderShadesView() {
  const targetShade = state.shades.find(s => s.id === state.mixTargetId) || state.shades[2] || state.shades[0];
  const recipe = shadeMixingRecipes[targetShade?.id] || {
    base: 'Value White Emulsion (85%)',
    tint1: 'Primary Toner Concentrate (10%)',
    tint2: 'Secondary Undertone Modifier (5%)',
    tips: 'Blend tints gradually into the factory base with continuous stirring.'
  };

  const blendedColor = blendHexColors(state.mixBase1, state.mixBase2, 0.5);
  const closestChartShade = findClosestShade(blendedColor);

  return `
    <div class="bg-slate-100 py-8 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <i class="fa-solid fa-swatchbook"></i>
          <span>Value Paint Official Palette & Formulation</span>
        </div>
        <h1 class="text-3xl font-black text-[#022A68]">Color Swatches & Mixing Formulations</h1>
        <p class="text-xs text-slate-600 mt-1 max-w-2xl">
          Browse our standard Value Paint shade swatches, test any tone in the AI Room Painter, or use our interactive Color Matching & Mixing Formulation Advisor to discover exact pigment ratios.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <!-- Color Swatches Grid -->
      <div>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 class="text-xl font-black text-slate-900">Standard Value Paint Swatches</h2>
            <p class="text-xs text-slate-500">Available in Satin, Matt, Gloss, and Luxury Velvet finishes</p>
          </div>
          <span class="text-xs font-bold bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl">
            ${state.shades.length} Colors In Stock
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          ${state.shades.map(shade => `
            <div class="bg-white rounded-2xl border ${state.mixTargetId === shade.id ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md' : 'border-slate-200'} p-4 shadow-sm hover:shadow-lg transition-all group">
              <div class="aspect-square rounded-xl shadow-inner mb-3 border border-slate-200/80 transition-transform group-hover:scale-105 cursor-pointer relative" 
                   style="background-color: ${shade.code};" 
                   onclick="window.setMixTarget('${shade.id}')">
                ${state.mixTargetId === shade.id ? `
                  <span class="absolute top-2 right-2 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    Selected
                  </span>
                ` : ''}
              </div>
              <h4 class="font-black text-slate-900 text-sm truncate">${shade.name}</h4>
              <p class="text-[11px] font-mono text-slate-400 uppercase">${shade.code}</p>
              <div class="mt-3 flex space-x-1.5">
                <button onclick="window.testInVisualizer('${shade.code}')" title="Test in AI Room Painter" class="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black py-1.5 rounded-lg transition-colors">
                  AI Painter
                </button>
                <button onclick="window.setMixTarget('${shade.id}')" title="View formulation ratio" class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-900 text-[10px] font-bold py-1.5 rounded-lg transition-colors border border-blue-200">
                  Formula
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Color Formulation & Mixing Advisor Section -->
      <div class="bg-gradient-to-tr from-slate-900 via-[#022A68] to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-blue-800">
        <div class="max-w-3xl mb-8">
          <div class="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <i class="fa-solid fa-flask-vial text-amber-400"></i>
            <span>Benin City Depot Formulation Lab</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black">Color Matching & Mixing Formulation Advisor</h2>
          <p class="text-xs sm:text-sm text-blue-200 mt-1 leading-relaxed">
            Need a custom shade mixed at our depot? Choose a target color on the Value Paint chart to view suggested base and tinting ratios, or simulate blending any two colors to find the closest match.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Column A: Target Shade Recipe Breakdown (7 cols) -->
          <div class="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 space-y-6">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-xl border-2 border-white/40 shadow-inner flex-shrink-0" style="background-color: ${targetShade.code};"></div>
                <div>
                  <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Target Shade Recipe</span>
                  <h3 class="text-lg font-black">${targetShade.name}</h3>
                  <span class="text-xs font-mono text-slate-300">${targetShade.code}</span>
                </div>
              </div>
              <button onclick="window.sendMixingConsultationToWhatsApp('${targetShade.name}', '${targetShade.code}')" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 shadow">
                <i class="fa-brands fa-whatsapp text-sm"></i>
                <span class="hidden sm:inline">Request Tint Mix</span>
              </button>
            </div>

            <!-- Formula Ratios Breakdown -->
            <div class="space-y-3.5">
              <span class="text-xs font-bold text-slate-300 uppercase tracking-wider block">Recommended Mixing Ratios:</span>
              
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold">
                  <span class="text-white"><i class="fa-solid fa-bucket text-blue-400 mr-1.5"></i>Base: ${recipe.base}</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div class="bg-blue-400 h-full rounded-full" style="width: 85%;"></div>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold">
                  <span class="text-amber-200"><i class="fa-solid fa-droplet text-amber-400 mr-1.5"></i>Primary Toner: ${recipe.tint1}</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div class="bg-amber-400 h-full rounded-full" style="width: 12%;"></div>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold">
                  <span class="text-emerald-200"><i class="fa-solid fa-eye-dropper text-emerald-400 mr-1.5"></i>Tone Adjuster: ${recipe.tint2}</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div class="bg-emerald-400 h-full rounded-full" style="width: 5%;"></div>
                </div>
              </div>
            </div>

            <!-- Practical Workshop Tip -->
            <div class="bg-slate-950/40 border border-white/10 rounded-xl p-3.5 text-xs text-slate-300 flex items-start space-x-2.5">
              <i class="fa-solid fa-lightbulb text-amber-400 text-sm mt-0.5"></i>
              <div>
                <strong class="text-white block font-bold">Depot Mixing Tip:</strong>
                <p class="leading-relaxed text-[11px] text-slate-300">${recipe.tips}</p>
              </div>
            </div>
          </div>

          <!-- Column B: Two-Color Blend Simulator (5 cols) -->
          <div class="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 space-y-5">
            <div>
              <span class="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">Blend Simulator</span>
              <h3 class="text-base font-black">Mix Two Shades to Preview Match</h3>
              <p class="text-[11px] text-slate-300 mt-1">Combine two pigments to see the resulting blended shade and its nearest chart equivalent:</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <span class="text-[10px] text-slate-300 block mb-1">Color 1 (50%)</span>
                <input type="color" value="${state.mixBase1}" onchange="window.setMixBase1(this.value)" class="w-10 h-10 rounded-lg cursor-pointer mx-auto border border-white/30 p-0" />
                <span class="text-[10px] font-mono text-slate-300 uppercase block mt-1">${state.mixBase1}</span>
              </div>

              <div class="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <span class="text-[10px] text-slate-300 block mb-1">Color 2 (50%)</span>
                <input type="color" value="${state.mixBase2}" onchange="window.setMixBase2(this.value)" class="w-10 h-10 rounded-lg cursor-pointer mx-auto border border-white/30 p-0" />
                <span class="text-[10px] font-mono text-slate-300 uppercase block mt-1">${state.mixBase2}</span>
              </div>
            </div>

            <!-- Resulting Blend Output -->
            <div class="bg-slate-950/60 rounded-xl p-4 border border-white/10 flex items-center space-x-4">
              <div class="w-12 h-12 rounded-xl border-2 border-white/50 shadow-inner flex-shrink-0" style="background-color: ${blendedColor};"></div>
              <div>
                <span class="text-[10px] text-amber-300 uppercase font-bold block">Blended Hex: ${blendedColor}</span>
                <p class="text-xs font-black text-white">Nearest Chart Color:</p>
                <div class="flex items-center space-x-1.5 mt-0.5">
                  <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${closestChartShade.code};"></span>
                  <span class="text-xs font-semibold text-emerald-300">${closestChartShade.name}</span>
                </div>
              </div>
            </div>

            <button onclick="window.testInVisualizer('${blendedColor}')" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-3 rounded-xl shadow transition-colors flex items-center justify-center space-x-2">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>Test This Mixture in AI Room Painter</span>
            </button>
          </div>

        </div>

        <div class="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-blue-200">
          <div class="flex items-center space-x-2">
            <i class="fa-solid fa-palette text-amber-400 text-sm"></i>
            <span>Physical Value Paint Shade Charts & Custom Tinting available at 4 First East Circular Rd, Benin City.</span>
          </div>
          <a href="https://wa.me/2349115317958?text=Hello%20Godswill%20Enterprise,%20I%20want%20to%20inquire%20about%20a%20custom%20color%20mixing%20formulation%20from%20your%20Value%20Paint%20chart." target="_blank" class="text-amber-300 hover:text-white font-bold underline flex items-center space-x-1">
            <span>Inquire About In-Store Tinting</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      </div>

    </div>
  `;
}

function renderCalculatorView() {
  const products = [
    { slug: 'value-plus-satin', title: 'Value Plus Satin (Washable Sheen)', rate: 14 },
    { slug: 'buffalo-satin-emulsion', title: 'Buffalo Satin Emulsion (Anti-Fungal & Superior Spread)', rate: 16 },
    { slug: 'value-matt-emulsion', title: 'Value Matt Emulsion (Velvety Matt)', rate: 13 },
    { slug: 'negro-capa-velvet', title: 'Negro Capa Velvet (Luxury Sheen)', rate: 15 },
    { slug: 'value-gloss', title: 'Value Gloss Enamel (High Gloss Trim)', rate: 15 }
  ];

  return `
    <div class="bg-slate-100 py-8 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <i class="fa-solid fa-calculator"></i>
          <span>Value Paint Precision Estimator</span>
        </div>
        <h1 class="text-3xl font-black text-[#022A68]">Paint Coverage & Volume Calculator</h1>
        <p class="text-xs text-slate-600 mt-1 max-w-2xl">
          Calculate the exact 20L Drums and 4L Gallons required for your painting project in Benin City, factoring in whether your wall is fresh plaster or repainting over existing dark colors.
        </p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
        
        <!-- Wall Condition / Substrate Status -->
        <div>
          <label class="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>1. Wall Substrate Condition & Existing Color *</span>
          </label>
          <select id="calc-condition" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-blue-600 focus:ring-2 focus:ring-blue-100 transition-all">
            <option value="same_color" selected>Repainting — Same or Similar Color (2 Standard Coats)</option>
            <option value="dark_to_light">Repainting — Dark Wall Changing to Light Shade (3 Coats for Full Obliteration)</option>
            <option value="light_to_dark">Repainting — Light Wall Changing to Dark Shade (2 High-Pigment Coats)</option>
            <option value="fresh">Fresh Plaster / Bare Wall (2 Coats)</option>
            <option value="touchup">Maintenance Refresh / Single Topcoat (1 Coat)</option>
          </select>
          <p class="text-[11px] text-slate-500 mt-1.5">
            <i class="fa-solid fa-circle-info text-blue-500 mr-1"></i>
            Fresh raw cement absorbs paint rapidly, while dark prior paints require multiple coats to prevent undertone show-through.
          </p>
        </div>

        <!-- Product Selection -->
        <div>
          <label class="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>2. Select Value Paint Product & Finish *</span>
          </label>
          <select id="calc-product" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-blue-600 focus:ring-2 focus:ring-blue-100 transition-all">
            ${products.map(p => `
              <option value="${p.slug}">${p.title} — Spreading: ~${p.rate} m²/L</option>
            `).join('')}
          </select>
        </div>

        <!-- Room Dimensions Grid -->
        <div>
          <label class="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>3. Room Dimensions (Meters) *</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span class="block text-xs font-bold text-slate-600 mb-1">Room Length</span>
              <div class="relative">
                <input type="number" id="calc-length" value="6" min="1" step="0.5" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-blue-600" />
                <span class="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">m</span>
              </div>
            </div>
            <div>
              <span class="block text-xs font-bold text-slate-600 mb-1">Room Width</span>
              <div class="relative">
                <input type="number" id="calc-width" value="4" min="1" step="0.5" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-blue-600" />
                <span class="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">m</span>
              </div>
            </div>
            <div>
              <span class="block text-xs font-bold text-slate-600 mb-1">Ceiling Height</span>
              <div class="relative">
                <input type="number" id="calc-height" value="3" min="1" step="0.5" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-blue-600" />
                <span class="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">m</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Openings Deductions Grid -->
        <div>
          <label class="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>4. Deductions (Doors & Windows)</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span class="block text-xs font-bold text-slate-600 mb-1">Number of Doors (~2.1 m² each)</span>
              <input type="number" id="calc-doors" value="1" min="0" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-blue-600" />
            </div>
            <div>
              <span class="block text-xs font-bold text-slate-600 mb-1">Number of Windows (~1.5 m² each)</span>
              <input type="number" id="calc-windows" value="2" min="0" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-blue-600" />
            </div>
          </div>
        </div>

        <!-- Calculate Trigger Button -->
        <div class="pt-4 border-t border-slate-100">
          <button onclick="window.runCalculator()" class="w-full bg-[#022A68] hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2">
            <i class="fa-solid fa-calculator"></i>
            <span>Calculate Required Volume & Packaging</span>
          </button>
        </div>

        <!-- Dynamic Results Card Container -->
        <div id="calc-result" class="hidden"></div>

      </div>
    </div>
  `;
}

function renderBagView() {
  return `
    <div class="bg-slate-100 py-8 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-black text-[#022A68]">Your Project Bag</h1>
        <p class="text-xs text-slate-600 mt-1">Submit your quotation request via WhatsApp or through our direct email portal.</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      ${state.projectBag.length === 0 ? `
        <div class="bg-white rounded-3xl border border-slate-200 p-16 text-center max-w-xl mx-auto">
          <h3 class="text-xl font-black text-slate-900">Your Project Bag is empty</h3>
          <button onclick="window.navTo('catalog')" class="mt-6 bg-[#022A68] text-white font-bold text-xs px-6 py-3 rounded-xl shadow">Browse Product Catalog</button>
        </div>
      ` : `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div class="lg:col-span-7 space-y-4">
            ${state.projectBag.map(item => `
              <div class="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 rounded-xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center">
                    <img src="${item.image}" alt="${item.title}" class="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 class="font-black text-slate-900 text-sm">${item.title}</h4>
                    <p class="text-xs text-slate-500">Size: <strong class="text-slate-700">${item.size}</strong> | Qty: <strong class="text-slate-700">${item.quantity}</strong></p>
                    ${item.shade ? `
                      <div class="flex items-center space-x-1.5 mt-1">
                        <span class="w-3.5 h-3.5 rounded-full border border-slate-300" style="background-color: ${item.shade.code};"></span>
                        <span class="text-[11px] font-semibold text-slate-600">${item.shade.name}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
                <button onclick="window.removeBagItem(${item.id})" class="text-slate-400 hover:text-red-500 p-2">
                  <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
            `).join('')}
          </div>

          <div class="lg:col-span-5">
            <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-4">
              <h3 class="text-lg font-black text-[#022A68] border-b border-slate-100 pb-3">Submit for Price Quotation</h3>
              <p class="text-xs text-slate-500">Our customer desk will prepare the pricing breakdown for pickup or waybill.</p>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input type="text" id="cust-name" placeholder="e.g. Engr. Osasere" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-blue-600" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Phone Number (WhatsApp Active) *</label>
                <input type="text" id="cust-phone" placeholder="e.g. 08012345678" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-blue-600" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" id="cust-email" placeholder="e.g. osasere@gmail.com" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-blue-600" />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Delivery / Site Area</label>
                <input type="text" id="cust-area" placeholder="e.g. GRA, Benin City or Store Pickup" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-blue-600" />
              </div>

              <div class="pt-2 space-y-2.5">
                <button onclick="window.submitWhatsAppQuote()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg transition-all">
                  <i class="fa-brands fa-whatsapp text-lg"></i>
                  <span>Send Order & Request Quote via WhatsApp</span>
                </button>

                <button onclick="window.submitEmailQuote()" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all">
                  <i class="fa-solid fa-envelope"></i>
                  <span>Submit via Email (ifeomansofor48@gmail.com)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

// Global Handlers
window.navTo = function(view) {
  state.view = view;
  if (view === 'admin' && state.adminToken) {
    loadLedger();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
};

window.filterCat = function(cat, finish = 'ALL') {
  state.selectedCategory = cat;
  state.selectedFinish = finish;
  state.view = 'catalog';
  render();
};

window.openProduct = function(id) {
  state.activeProductModal = state.products.find(p => p.id === id);
  render();
};

window.closeProductModal = function() {
  state.activeProductModal = null;
  render();
};

window.confirmAddProduct = function() {
  const p = state.activeProductModal;
  const size = document.getElementById('modal-size')?.value || p.availableSizes[0]?.label;
  const qty = parseInt(document.getElementById('modal-qty')?.value || '1', 10);
  const shadeId = document.getElementById('modal-shade')?.value;
  const shade = shadeId ? state.shades.find(s => s.id === shadeId) : null;

  addToBag({
    productId: p.id,
    title: p.title,
    image: p.image,
    size,
    quantity: qty,
    shade
  });
};

window.addShadeToQuickBag = function(shadeId) {
  const shade = state.shades.find(s => s.id === shadeId);
  addToBag({
    productId: 'custom-shade',
    title: `Value Plus Custom Shade: ${shade.name}`,
    image: '/products/value-plus-satin-4ltr-gallon.png',
    size: '20L Drum',
    quantity: 1,
    shade
  });
};

window.removeBagItem = function(id) {
  removeFromBag(id);
};

// Visualizer Actions
window.setVisualizerColor = function(color) {
  state.visualizerColor = color;
  render();
};

window.setVisualizerAccent = function(color) {
  state.visualizerAccentColor = color;
  render();
};

window.testInVisualizer = function(color) {
  state.visualizerColor = color;
  state.view = 'visualizer';
  render();
};

window.updateVisRoomType = function(val) {
  state.visualizerRoomType = val;
};

window.updateVisStyle = function(val) {
  state.visualizerStyle = val;
};

window.updateVisLighting = function(val) {
  state.visualizerLighting = val;
};

window.setVisViewMode = function(mode) {
  state.visViewMode = mode;
  render();
};

window.selectHistoryItem = function(idx) {
  const item = state.generationHistory[idx];
  if (item) {
    state.generatedRoomImage = item.imageUrl;
    state.visualizerColor = item.color.hex;
    state.visViewMode = 'generated';
    render();
  }
};

window.handleRoomUpload = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    state.visualizerImage = evt.target.result;
    state.visViewMode = 'reference';
    render();
    showToast('Your room image has been loaded into AI Painter as reference!');
  };
  reader.readAsDataURL(file);
};

window.generateRealAiRoom = async function() {
  const currentShade = state.shades.find(s => s.code.toLowerCase() === state.visualizerColor.toLowerCase()) || {
    name: 'Value Paint Custom Formulation',
    code: state.visualizerColor
  };

  const accentShade = state.shades.find(s => s.code.toLowerCase() === state.visualizerAccentColor.toLowerCase()) || {
    name: 'Brilliant White Architectural Trim',
    code: state.visualizerAccentColor
  };

  state.isGeneratingRoom = true;
  render();

  try {
    const res = await fetch(`${API_BASE}/ai/generate-room-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomType: state.visualizerRoomType,
        colorName: currentShade.name,
        colorHex: state.visualizerColor,
        accentColorName: accentShade.name,
        accentColorHex: state.visualizerAccentColor,
        style: state.visualizerStyle,
        lighting: state.visualizerLighting
      })
    });

    const data = await res.json();
    if (data.success && data.imageUrl) {
      state.generatedRoomImage = data.imageUrl;
      state.visViewMode = 'generated';
      state.generationHistory.unshift({
        imageUrl: data.imageUrl,
        roomType: state.visualizerRoomType,
        color: { name: currentShade.name, hex: state.visualizerColor },
        date: new Date().toLocaleTimeString()
      });
      if (state.generationHistory.length > 8) state.generationHistory.pop();
      showToast(`AI Room Makeover rendered with ${currentShade.name}!`);
    } else {
      alert(data.message || 'AI generation failed. Please try again.');
    }
  } catch (err) {
    console.error('Generation error:', err);
    alert('Failed to connect to AI generation engine.');
  } finally {
    state.isGeneratingRoom = false;
    render();
  }
};

window.runAiColorAnalysis = async function() {
  state.isAnalyzing = true;
  render();

  try {
    const res = await fetch(`${API_BASE}/ai/analyze-room`, { method: 'POST' });
    const data = await res.json();
    state.aiRecommendations = data.recommendations || [];
    showToast('AI Room Palettes Generated Successfully!');
  } catch (err) {
    console.error('AI Error:', err);
  } finally {
    state.isAnalyzing = false;
    render();
  }
};

window.addVisualizerColorToBag = function() {
  const currentShade = state.shades.find(s => s.code.toLowerCase() === state.visualizerColor.toLowerCase()) || {
    name: 'Custom AI Wall Color',
    code: state.visualizerColor
  };

  addToBag({
    productId: 'ai-color',
    title: `AI Visualizer Formulation (${currentShade.name})`,
    image: '/products/value-plus-satin-4ltr-gallon.png',
    size: '20L Drum',
    quantity: 1,
    shade: currentShade
  });
};

// Room Photo WhatsApp Consultation Handlers
window.handleConsultationPhotoUpload = function(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    state.consultationImage = evt.target.result;
    state.consultationImageName = file.name;
    showToast(`Room photo "${file.name}" ready for consultation!`);
    render();
  };
  reader.readAsDataURL(file);
};

window.sendRoomConsultationToWhatsApp = function() {
  const phone = state.info?.phone || '2349115317958';
  const currentShade = state.shades.find(s => s.code.toLowerCase() === state.visualizerColor.toLowerCase()) || {
    name: 'Custom Choice',
    code: state.visualizerColor
  };

  let text = `🎨 *GODSWILL ENTERPRISE - ROOM PHOTO COLOR CONSULTATION*\n`;
  text += `📍 _Distributor of Value Paint in Benin City, Edo State_\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🏠 *Space Type:* ${state.visualizerRoomType}\n`;
  text += `🎨 *Target Wall Shade:* ${currentShade.name} (${state.visualizerColor})\n`;
  text += `🖌️ *Trim / Ceiling Choice:* ${state.visualizerAccentColor}\n`;
  text += `✨ *Atmosphere Style:* ${state.visualizerStyle} (${state.visualizerLighting})\n`;
  if (state.consultationImageName) {
    text += `📷 *Attached Room Photo:* ${state.consultationImageName}\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Hello Godswill Enterprise, I have attached a photo of my room/house. Please review the lighting and space, confirm if this Value Paint shade will fit properly, and advise me on the number of coats & drums needed. Thank you!`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// Color Formulation & Mixing Advisor Handlers
window.setMixTarget = function(shadeId) {
  state.mixTargetId = shadeId;
  render();
};

window.setMixBase1 = function(hex) {
  state.mixBase1 = hex;
  render();
};

window.setMixBase2 = function(hex) {
  state.mixBase2 = hex;
  render();
};

window.sendMixingConsultationToWhatsApp = function(shadeName, hex) {
  const phone = state.info?.phone || '2349115317958';
  let text = `🎨 *GODSWILL ENTERPRISE - CUSTOM COLOR MIXING REQUEST*\n`;
  text += `📍 _4 First East Circular Rd, Benin City, Edo State_\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🎯 *Target Value Paint Shade:* ${shadeName} (${hex})\n`;
  text += `🧪 *Inquiry:* In-store custom tinting formulation and drum pricing\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Hello Godswill Enterprise, I would like to request an in-store custom tint mix for ${shadeName}. Please let me know the availability of the base paint and toners at your Benin City depot. Thank you!`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

// WhatsApp & Email Quote Submissions
window.submitWhatsAppQuote = function() {
  const name = document.getElementById('cust-name')?.value;
  const phone = document.getElementById('cust-phone')?.value;
  const area = document.getElementById('cust-area')?.value;

  if (!name || !phone) {
    alert('Please enter your Name and WhatsApp Phone Number.');
    return;
  }

  fetch(`${API_BASE}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerName: name, customerPhone: phone, deliveryArea: area, items: state.projectBag })
  });

  const url = generateWhatsAppUrl({ name, phone, area });
  window.open(url, '_blank');
};

window.submitEmailQuote = async function() {
  const name = document.getElementById('cust-name')?.value;
  const phone = document.getElementById('cust-phone')?.value;
  const email = document.getElementById('cust-email')?.value;
  const area = document.getElementById('cust-area')?.value;

  if (!name || !phone) {
    alert('Please provide your Name and Phone Number.');
    return;
  }

  let quoteRef = 'GWQ-' + Math.floor(10000 + Math.random() * 90000);

  try {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        deliveryArea: area,
        items: state.projectBag
      })
    });
    const data = await res.json();
    if (data.success && data.quote) {
      quoteRef = data.quote.reference;
    }
  } catch (e) {
    console.warn('Saved quote lead to fallback queue.');
  }

  // Guaranteed direct dispatch via client mailto link to ifeomansofor48@gmail.com
  const subject = encodeURIComponent(`[Quote Request ${quoteRef}] Value Paint Order - ${name}`);
  let body = `Hello Godswill Enterprise,\n\nI would like to request an official quotation for the following Value Paint items:\n\n`;
  state.projectBag.forEach((item, idx) => {
    body += `${idx + 1}. ${item.title} (${item.size}) - Quantity: ${item.quantity} unit(s)\n`;
    if (item.shade) body += `   Color: ${item.shade.name} (${item.shade.code})\n`;
  });
  body += `\nCustomer Details:\n- Name: ${name}\n- Phone: ${phone}\n- Email: ${email || 'Not specified'}\n- Delivery / Site Area: ${area || 'Benin City'}\n\nPlease reply with the total cost breakdown and pickup/delivery options.\n\nThank you!`;

  window.open(`mailto:ifeomansofor48@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`, '_blank');
  
  showToast(`Quote [${quoteRef}] logged! Opening your email composer.`);
  state.projectBag = [];
  saveBag();
};

window.runCalculator = function() {
  const len = parseFloat(document.getElementById('calc-length')?.value || '0');
  const wid = parseFloat(document.getElementById('calc-width')?.value || '0');
  const hgt = parseFloat(document.getElementById('calc-height')?.value || '0');
  const doors = parseInt(document.getElementById('calc-doors')?.value || '0', 10);
  const windows = parseInt(document.getElementById('calc-windows')?.value || '0', 10);
  const condition = document.getElementById('calc-condition')?.value || 'same_color';
  const productSlug = document.getElementById('calc-product')?.value || 'value-plus-satin';

  const grossArea = 2 * (len + wid) * hgt;
  const deductions = (doors * 2.1) + (windows * 1.5);
  const netArea = Math.max(0, grossArea - deductions);

  let coats = 2;
  let rateMultiplier = 1.0;
  let conditionLabel = 'Standard Repaint';
  let explanation = '';

  if (condition === 'fresh') {
    coats = 2;
    rateMultiplier = 0.88; // Allowance for bare plaster porosity
    conditionLabel = 'Fresh Plaster / Bare Wall (2 Coats)';
    explanation = 'Fresh plaster wall calculated for 2 full coating layers with optimal binder absorption and spreading power.';
  } else if (condition === 'dark_to_light') {
    coats = 3;
    rateMultiplier = 1.0;
    conditionLabel = 'Dark Wall to Light Shade (3 Coats)';
    explanation = 'Covering a dark wall with a lighter hue requires 3 full coats to achieve 100% color obliteration and eliminate dark undertones bleeding through.';
  } else if (condition === 'same_color') {
    coats = 2;
    rateMultiplier = 1.0;
    conditionLabel = 'Same or Similar Shade (2 Coats)';
    explanation = 'Repainting over a clean similar color requires 2 standard coats for an even, durable, washable finish.';
  } else if (condition === 'light_to_dark') {
    coats = 2;
    rateMultiplier = 1.0;
    conditionLabel = 'Light Wall to Dark Shade (2 Coats)';
    explanation = 'Darker pigments offer rich hiding power over lighter substrates; 2 coats deliver uniform deep color saturation.';
  } else if (condition === 'touchup') {
    coats = 1;
    rateMultiplier = 1.0;
    conditionLabel = 'Single Coat Maintenance Refresh (1 Coat)';
    explanation = 'Single coat refresh for previously clean, well-maintained wall surfaces.';
  }

  const selectedProduct = state.products.find(p => p.slug === productSlug) || {
    id: 'value-plus-satin',
    title: 'Value Plus Satin',
    spreadingRate: 14,
    image: '/products/value-plus-satin-4ltr-gallon.png'
  };

  const effectiveRate = selectedProduct.spreadingRate * rateMultiplier;
  const litres = (netArea * coats) / effectiveRate;
  const drums20L = Math.floor(litres / 20);
  const remainingLitres = litres % 20;
  const gallons4L = Math.ceil(remainingLitres / 4);

  state.calcLastResult = {
    product: selectedProduct,
    netArea,
    coats,
    litres,
    drums20L,
    gallons4L,
    conditionLabel,
    explanation
  };

  const resCard = document.getElementById('calc-result');
  if (resCard) {
    resCard.classList.remove('hidden');
    resCard.innerHTML = `
      <div class="bg-gradient-to-tr from-blue-50 via-slate-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-blue-200 pb-5">
          <div>
            <span class="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">Coverage Calculation Complete</span>
            <h3 class="text-2xl font-black text-slate-900 mt-2">Estimated Volume: ~${litres.toFixed(1)} Litres</h3>
            <p class="text-xs text-slate-600 mt-0.5">Based on <strong>${netArea.toFixed(1)} m²</strong> net paintable wall area (${coats} coats)</p>
          </div>
          <div class="bg-white px-4 py-2.5 rounded-2xl border border-blue-200 shadow-sm text-right">
            <span class="text-[10px] font-bold text-slate-400 uppercase block">Wall Condition Mode</span>
            <span class="text-xs font-black text-blue-900">${conditionLabel}</span>
          </div>
        </div>

        <!-- Packaging Recommendation Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div class="w-14 h-14 bg-blue-100 text-[#022A68] rounded-2xl flex items-center justify-center text-2xl font-black">
              <i class="fa-solid fa-bucket"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase">20L Drums Required</span>
              <p class="text-3xl font-black text-slate-900">${drums20L} <span class="text-sm font-semibold text-slate-500">Drum${drums20L !== 1 ? 's' : ''}</span></p>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div class="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center text-2xl font-black">
              <i class="fa-solid fa-can-food"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase">4L Gallons Required</span>
              <p class="text-3xl font-black text-slate-900">${gallons4L} <span class="text-sm font-semibold text-slate-500">Gallon${gallons4L !== 1 ? 's' : ''}</span></p>
            </div>
          </div>
        </div>

        <!-- Technical Advisory Rationale -->
        <div class="bg-white/80 border border-blue-200 rounded-2xl p-4 text-xs text-slate-700 flex items-start space-x-3 mb-6">
          <i class="fa-solid fa-lightbulb text-amber-500 text-base mt-0.5"></i>
          <div>
            <strong class="font-bold text-slate-900 block mb-0.5">Professional Painting Recommendation:</strong>
            <p class="leading-relaxed">${explanation}</p>
          </div>
        </div>

        <!-- 1-Click Action to Add to Project Bag -->
        <button onclick="window.addCalculatedToBag()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all">
          <i class="fa-solid fa-cart-plus"></i>
          <span>Add ${drums20L ? `${drums20L}x 20L Drums ` : ''}${gallons4L ? `${gallons4L}x 4L Gallons ` : ''}of ${selectedProduct.title} to Project Bag</span>
        </button>
      </div>
    `;
  }
};

window.addCalculatedToBag = function() {
  if (!state.calcLastResult) return;
  const { product, drums20L, gallons4L } = state.calcLastResult;

  if (drums20L > 0) {
    addToBag({
      productId: product.id || 'calc-drum',
      title: `${product.title} (20L Drum)`,
      image: product.image,
      size: '20L Drum',
      quantity: drums20L,
      shade: null
    });
  }

  if (gallons4L > 0) {
    addToBag({
      productId: product.id || 'calc-gallon',
      title: `${product.title} (4L Gallon)`,
      image: product.image,
      size: '4L Gallon',
      quantity: gallons4L,
      shade: null
    });
  }

  showToast(`Added calculated paint order to your Project Bag!`);
};

// Admin Bookkeeping Modal Logic (Replaces window.prompt)
window.adminLogin = async function() {
  const pass = document.getElementById('admin-pass')?.value;
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass })
    });
    const data = await res.json();
    if (data.success) {
      state.adminToken = data.token;
      localStorage.setItem('godswill_admin_token', data.token);
      loadLedger();
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Failed to connect to backend.');
  }
};

window.adminLogout = function() {
  state.adminToken = null;
  localStorage.removeItem('godswill_admin_token');
  render();
};

async function loadLedger() {
  try {
    const res = await fetch(`${API_BASE}/admin/ledger?period=${state.ledgerPeriod}`, {
      headers: { 'Authorization': `Bearer ${state.adminToken}` }
    });
    const data = await res.json();
    if (data.success) {
      state.ledgerData = data;
      render();
    }
  } catch (err) {
    console.error('Failed to load ledger:', err);
  }
}

window.setLedgerPeriod = function(p) {
  state.ledgerPeriod = p;
  loadLedger();
};

window.openTxModal = function(type = 'SALE') {
  state.txModalType = type;
  state.showTxModal = true;
  render();
};

window.closeTxModal = function() {
  state.showTxModal = false;
  render();
};

window.saveTransaction = async function(e) {
  e.preventDefault();
  const type = document.getElementById('tx-type')?.value;
  const amount = document.getElementById('tx-amount')?.value;
  const category = document.getElementById('tx-category')?.value;
  const method = document.getElementById('tx-method')?.value;
  const name = document.getElementById('tx-name')?.value;
  const details = document.getElementById('tx-details')?.value;

  try {
    const res = await fetch(`${API_BASE}/admin/ledger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.adminToken}`
      },
      body: JSON.stringify({
        type,
        amount: parseFloat(amount),
        category,
        paymentMethod: method,
        customerOrSupplierName: name || 'Walk-in Customer',
        itemsSummary: details || ''
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Transaction saved to ledger!');
      state.showTxModal = false;
      loadLedger();
    }
  } catch (err) {
    alert('Failed to save transaction.');
  }
};

window.viewTxDetail = function(id) {
  const tx = state.ledgerData?.transactions?.find(t => t.id === id || t.referenceId === id);
  if (tx) {
    state.selectedTx = tx;
    render();
  }
};

window.closeTxDetailModal = function() {
  state.selectedTx = null;
  render();
};

window.copyTxSummary = function(id) {
  const tx = state.selectedTx || state.ledgerData?.transactions?.find(t => t.id === id || t.referenceId === id);
  if (!tx) return;

  const dateStr = new Date(tx.date).toLocaleDateString('en-GB');
  const voucher = `🎨 GODSWILL ENTERPRISE - LEDGER RECORD
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reference: ${tx.referenceId}
Date: ${dateStr}
Type: ${tx.type} (${tx.flow})
Party: ${tx.customerOrSupplierName}
Category: ${tx.category} | Method: ${tx.paymentMethod}
Amount: ₦${(tx.amount || 0).toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
ITEMIZED BREAKDOWN:
${tx.itemsSummary || 'None specified'}
${tx.notes ? `\nNOTES & REMARKS:\n${tx.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 4 First East Circular Rd, Benin City, Edo State`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(voucher).then(() => {
      showToast('Transaction voucher copied to clipboard!');
    }).catch(() => {
      alert(voucher);
    });
  } else {
    alert(voucher);
  }
};

window.deleteTransaction = async function(id) {
  if (!confirm('Are you sure you want to delete this ledger record?')) return;
  try {
    await fetch(`${API_BASE}/admin/ledger/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${state.adminToken}` }
    });
    showToast('Record deleted.');
    if (state.selectedTx && (state.selectedTx.id === id || state.selectedTx.referenceId === id)) {
      state.selectedTx = null;
    }
    loadLedger();
  } catch (err) {
    alert('Failed to delete transaction.');
  }
};

// Initialize
initData();
