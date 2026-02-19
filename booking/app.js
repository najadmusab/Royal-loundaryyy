/* ============================================================
   AQUA LUXE LAUNDRY — MAIN APPLICATION SCRIPT
   ============================================================ */
'use strict';

// ============================================================
// GLOBAL STATE
// ============================================================
const state = {
  currentStep: 1,
  selectedService: null,
  selectedCategory: 'daily',
  clothes: {},          // { itemId: { name, qty, price } }
  addons: [],           // [{ name, price }]
  pickupDate: '',
  pickupTime: '',
  deliverySpeed: 'Standard (24-48 hrs)',
  deliveryExtra: 0,
  address: {},
  couponDiscount: 0,
  couponCode: '',
};

const WHATSAPP_NUMBER = '919526226011';

// ============================================================
// CLOTH DATA WITH DRAWING DESCRIPTORS
// ============================================================
const CLOTH_DATA = {
  daily: [
    { id: 'shirt',    name: 'Shirt',      price: 25, draw: drawShirt,   tag: 'Formal / Casual' },
    { id: 'tshirt',   name: 'T-Shirt',    price: 20, draw: drawTshirt,  tag: 'Casual' },
    { id: 'pants',    name: 'Pants',      price: 30, draw: drawPants,   tag: 'Formal' },
    { id: 'jeans',    name: 'Jeans',      price: 35, draw: drawJeans,   tag: 'Denim' },
    { id: 'shorts',   name: 'Shorts',     price: 18, draw: drawShorts,  tag: 'Casual' },
    { id: 'uniform',  name: 'Uniform',    price: 28, draw: drawUniform, tag: 'Work / School' },
    { id: 'suit',     name: 'Suit',       price: 80, draw: drawSuit,    tag: 'Premium' },
    { id: 'innerwear',name: 'Inner Wear', price: 12, draw: drawInner,   tag: 'Daily' },
  ],
  traditional: [
    { id: 'saree',       name: 'Saree',          price: 60, draw: drawSaree,      tag: 'Daily Wear' },
    { id: 'dsr_saree',   name: 'Designer Saree', price: 120,draw: drawDSaree,     tag: 'Premium' },
    { id: 'kurta',       name: 'Kurta / Kurti',  price: 35, draw: drawKurta,      tag: 'Cotton / Silk' },
    { id: 'blouse',      name: 'Blouse',         price: 25, draw: drawBlouse,     tag: 'Silk / Cotton' },
    { id: 'lehenga',     name: 'Lehenga',        price: 150,draw: drawLehenga,    tag: 'Festival' },
    { id: 'dhoti',       name: 'Dhoti / Mundu',  price: 30, draw: drawDhoti,      tag: 'Cotton' },
    { id: 'salwar',      name: 'Salwar Suit',    price: 55, draw: drawSalwar,     tag: 'Full Set' },
    { id: 'dupatta',     name: 'Dupatta / Stole',price: 20, draw: drawDupatta,    tag: 'Accessories' },
  ],
  winter: [
    { id: 'jacket',   name: 'Jacket',     price: 70, draw: drawJacket,  tag: 'Casual / Sport' },
    { id: 'sweater',  name: 'Sweater',    price: 55, draw: drawSweater, tag: 'Wool / Cotton' },
    { id: 'hoodie',   name: 'Hoodie',     price: 50, draw: drawHoodie,  tag: 'Fleece' },
    { id: 'coat',     name: 'Coat',       price: 100,draw: drawCoat,    tag: 'Formal' },
    { id: 'blanket',  name: 'Blanket',    price: 90, draw: drawBlanket, tag: 'Double / Single' },
    { id: 'shawl',    name: 'Shawl / Stole',price: 40, draw: drawShawl, tag: 'Wool / Silk' },
  ],
  home: [
    { id: 'bedsheet', name: 'Bedsheet',    price: 50, draw: drawBedsheet,  tag: 'Single / Double' },
    { id: 'pillow',   name: 'Pillow Cover',price: 15, draw: drawPillow,    tag: 'Per piece' },
    { id: 'curtain',  name: 'Curtain',     price: 80, draw: drawCurtain,   tag: 'Per panel' },
    { id: 'sofa',     name: 'Sofa Cover',  price: 120,draw: drawSofaCover, tag: '3-seater' },
    { id: 'tablecloth',name: 'Table Cloth',price: 30, draw: drawTableCloth,tag: 'Dining' },
    { id: 'towel',    name: 'Towel',       price: 20, draw: drawTowel,     tag: 'Bath / Hand' },
    { id: 'bag',      name: 'Bag / Backpack',price: 45, draw: drawBag,    tag: 'Fabric / Canvas' },
    { id: 'mat',      name: 'Door Mat / Rug',price: 60, draw: drawMat,    tag: 'Large' },
  ],
};

// ============================================================
// CLOTH DRAWING FUNCTIONS (Canvas 2D)
// Each receives (ctx, w, h) and draws a stylized icon
// ============================================================

function clothBg(ctx, w, h, color='#061428') {
  ctx.clearRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#061428');
  grad.addColorStop(1, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function clothShadow(ctx, w, h) {
  const sg = ctx.createRadialGradient(w/2, h-8, 2, w/2, h-8, w*0.4);
  sg.addColorStop(0, 'rgba(0,0,0,0.5)');
  sg.addColorStop(1, 'transparent');
  ctx.fillStyle = sg;
  ctx.fillRect(0, h-30, w, 30);
}

function glowAt(ctx, x, y, r, color='rgba(0,245,212,0.15)') {
  const g = ctx.createRadialGradient(x, y, 1, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
}

function drawShirt(ctx, w, h) {
  clothBg(ctx, w, h, '#0a1a35');
  glowAt(ctx, w/2, h/2, 55, 'rgba(0,245,212,0.08)');
  const s = Math.min(w,h)*0.7;
  const x = (w-s)/2, y = (h-s)/2+6;
  ctx.fillStyle = '#1a4060';
  ctx.strokeStyle = '#00f5d4';
  ctx.lineWidth = 1.5;
  // Body
  ctx.beginPath();
  ctx.moveTo(x+s*0.15, y+s*0.25);
  ctx.lineTo(x+s*0.08, y+s*0.55);
  ctx.lineTo(x, y+s*0.55);
  ctx.lineTo(x, y+s);
  ctx.lineTo(x+s, y+s);
  ctx.lineTo(x+s, y+s*0.55);
  ctx.lineTo(x+s*0.92, y+s*0.55);
  ctx.lineTo(x+s*0.85, y+s*0.25);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Collar left
  ctx.beginPath();
  ctx.moveTo(x+s*0.15, y+s*0.25);
  ctx.quadraticCurveTo(x+s*0.32, y, x+s*0.42, y+s*0.2);
  ctx.lineTo(x+s*0.42, y+s*0.35);
  ctx.quadraticCurveTo(x+s*0.28, y+s*0.2, x+s*0.15, y+s*0.25);
  ctx.fillStyle = '#0e2a44'; ctx.fill(); ctx.stroke();
  // Collar right
  ctx.beginPath();
  ctx.moveTo(x+s*0.85, y+s*0.25);
  ctx.quadraticCurveTo(x+s*0.68, y, x+s*0.58, y+s*0.2);
  ctx.lineTo(x+s*0.58, y+s*0.35);
  ctx.quadraticCurveTo(x+s*0.72, y+s*0.2, x+s*0.85, y+s*0.25);
  ctx.fillStyle = '#0e2a44'; ctx.fill(); ctx.stroke();
  // Sleeves
  ctx.fillStyle = '#1a4060';
  // Left
  ctx.beginPath();
  ctx.moveTo(x+s*0.15, y+s*0.25);
  ctx.lineTo(x, y+s*0.6);
  ctx.lineTo(x+s*0.06, y+s*0.6);
  ctx.lineTo(x+s*0.08, y+s*0.55);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Right
  ctx.beginPath();
  ctx.moveTo(x+s*0.85, y+s*0.25);
  ctx.lineTo(x+s, y+s*0.6);
  ctx.lineTo(x+s*0.94, y+s*0.6);
  ctx.lineTo(x+s*0.92, y+s*0.55);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Buttons
  ctx.fillStyle = '#00f5d4';
  for(let i=0;i<4;i++){
    ctx.beginPath(); ctx.arc(x+s/2, y+s*0.45+i*0.1*s, 2, 0, Math.PI*2); ctx.fill();
  }
  clothShadow(ctx,w,h);
}

function drawTshirt(ctx, w, h) {
  clothBg(ctx, w, h, '#0a1a35');
  glowAt(ctx, w/2, h/2, 55, 'rgba(0,245,212,0.07)');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2+4;
  ctx.fillStyle = '#1e3a5a';
  ctx.strokeStyle = '#00f5d4';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x+s*0.22, y+s*0.18);
  ctx.lineTo(x, y+s*0.5);
  ctx.lineTo(x+s*0.22, y+s*0.5);
  ctx.lineTo(x+s*0.22, y+s);
  ctx.lineTo(x+s*0.78, y+s);
  ctx.lineTo(x+s*0.78, y+s*0.5);
  ctx.lineTo(x+s, y+s*0.5);
  ctx.lineTo(x+s*0.78, y+s*0.18);
  ctx.quadraticCurveTo(x+s*0.62, y, x+s*0.5, y+s*0.12);
  ctx.quadraticCurveTo(x+s*0.38, y, x+s*0.22, y+s*0.18);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Graphic
  ctx.fillStyle = 'rgba(0,245,212,0.2)';
  ctx.beginPath(); ctx.arc(x+s/2, y+s*0.65, s*0.12, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#00f5d4';
  ctx.font = `bold ${s*0.09}px Sora,sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('AL', x+s/2, y+s*0.65);
  clothShadow(ctx,w,h);
}

function drawPants(ctx, w, h) {
  clothBg(ctx, w, h, '#0d1a2a');
  glowAt(ctx, w/2, h/2, 50, 'rgba(0,245,212,0.07)');
  const s = Math.min(w,h)*0.68;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.fillStyle = '#14334a'; ctx.strokeStyle = '#00f5d4'; ctx.lineWidth = 1.5;
  // Waistband
  ctx.fillRect(x, y, s, s*0.1);
  ctx.strokeRect(x, y, s, s*0.1);
  // Left leg
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.1);
  ctx.lineTo(x+s*0.04, y+s);
  ctx.lineTo(x+s*0.5, y+s);
  ctx.lineTo(x+s*0.46, y+s*0.5);
  ctx.lineTo(x, y+s*0.1);
  ctx.fill(); ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(x+s, y+s*0.1);
  ctx.lineTo(x+s*0.96, y+s);
  ctx.lineTo(x+s*0.5, y+s);
  ctx.lineTo(x+s*0.54, y+s*0.5);
  ctx.lineTo(x+s, y+s*0.1);
  ctx.fill(); ctx.stroke();
  // Crease line
  ctx.strokeStyle = 'rgba(0,245,212,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x+s*0.26, y+s*0.3); ctx.lineTo(x+s*0.2, y+s*0.9); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+s*0.74, y+s*0.3); ctx.lineTo(x+s*0.8, y+s*0.9); ctx.stroke();
  clothShadow(ctx,w,h);
}

function drawJeans(ctx, w, h) {
  clothBg(ctx, w, h, '#0a1228');
  glowAt(ctx, w/2, h/2, 50, 'rgba(0,100,200,0.1)');
  const s = Math.min(w,h)*0.68;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.fillStyle = '#1a3a7a'; ctx.strokeStyle = '#4499cc'; ctx.lineWidth = 1.5;
  // Waistband
  ctx.fillStyle = '#0f2455'; ctx.fillRect(x, y, s, s*0.1); ctx.strokeRect(x, y, s, s*0.1);
  ctx.fillStyle = '#1a3a7a';
  // Left leg
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.1);
  ctx.lineTo(x+s*0.02, y+s);
  ctx.lineTo(x+s*0.5, y+s);
  ctx.lineTo(x+s*0.48, y+s*0.48);
  ctx.lineTo(x, y+s*0.1);
  ctx.fill(); ctx.stroke();
  // Right
  ctx.beginPath();
  ctx.moveTo(x+s, y+s*0.1);
  ctx.lineTo(x+s*0.98, y+s);
  ctx.lineTo(x+s*0.5, y+s);
  ctx.lineTo(x+s*0.52, y+s*0.48);
  ctx.lineTo(x+s, y+s*0.1);
  ctx.fill(); ctx.stroke();
  // Pocket
  ctx.strokeStyle = 'rgba(68,153,204,0.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(x+s*0.25, y+s*0.15, s*0.07, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(x+s*0.75, y+s*0.15, s*0.07, Math.PI, 0); ctx.stroke();
  // Seam stitch lines
  ctx.setLineDash([2,3]);
  ctx.beginPath(); ctx.moveTo(x+s*0.24, y+s*0.2); ctx.lineTo(x+s*0.14, y+s*0.85); ctx.stroke();
  ctx.setLineDash([]);
  clothShadow(ctx,w,h);
}

function drawShorts(ctx, w, h) {
  clothBg(ctx, w, h, '#081420');
  const s = Math.min(w,h)*0.7;
  const x = (w-s)/2, y = (h-s)/2+5;
  ctx.fillStyle = '#1a3050'; ctx.strokeStyle = '#00f5d4'; ctx.lineWidth = 1.5;
  // Waistband
  ctx.fillStyle = '#0e2040'; ctx.fillRect(x, y, s, s*0.14); ctx.strokeRect(x, y, s, s*0.14);
  ctx.fillStyle = '#1a3050';
  // Left
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.14);
  ctx.lineTo(x+s*0.06, y+s*0.65);
  ctx.lineTo(x+s*0.5, y+s*0.65);
  ctx.lineTo(x+s*0.46, y+s*0.42);
  ctx.lineTo(x, y+s*0.14); ctx.fill(); ctx.stroke();
  // Right
  ctx.beginPath();
  ctx.moveTo(x+s, y+s*0.14);
  ctx.lineTo(x+s*0.94, y+s*0.65);
  ctx.lineTo(x+s*0.5, y+s*0.65);
  ctx.lineTo(x+s*0.54, y+s*0.42);
  ctx.lineTo(x+s, y+s*0.14); ctx.fill(); ctx.stroke();
  // Stripe
  ctx.strokeStyle = 'rgba(0,245,212,0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x+s*0.15, y+s*0.14); ctx.lineTo(x+s*0.18, y+s*0.6); ctx.stroke();
  clothShadow(ctx,w,h);
}

function drawUniform(ctx, w, h) {
  clothBg(ctx, w, h, '#080f20');
  glowAt(ctx, w/2, h/2, 50, 'rgba(0,80,180,0.1)');
  const s = Math.min(w,h)*0.7;
  const x = (w-s)/2, y = (h-s)/2+4;
  ctx.fillStyle = '#0a1a3a'; ctx.strokeStyle = '#3366cc'; ctx.lineWidth = 1.5;
  // Body
  ctx.beginPath();
  ctx.moveTo(x+s*0.2, y+s*0.22);
  ctx.lineTo(x+s*0.08, y+s*0.55);
  ctx.lineTo(x, y+s*0.55);
  ctx.lineTo(x, y+s);
  ctx.lineTo(x+s, y+s);
  ctx.lineTo(x+s, y+s*0.55);
  ctx.lineTo(x+s*0.92, y+s*0.55);
  ctx.lineTo(x+s*0.8, y+s*0.22);
  ctx.lineTo(x+s*0.62, y+s*0.28);
  ctx.lineTo(x+s*0.5, y+s*0.06);
  ctx.lineTo(x+s*0.38, y+s*0.28);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Epaulettes
  ctx.fillStyle = '#3366cc';
  ctx.fillRect(x+s*0.78, y+s*0.2, s*0.14, s*0.06);
  ctx.fillRect(x+s*0.08, y+s*0.2, s*0.14, s*0.06);
  // Badge
  ctx.fillStyle = 'rgba(255,215,0,0.6)';
  ctx.beginPath(); ctx.arc(x+s*0.3, y+s*0.45, s*0.05, 0, Math.PI*2); ctx.fill();
  clothShadow(ctx,w,h);
}

function drawSuit(ctx, w, h) {
  clothBg(ctx, w, h, '#06100a');
  glowAt(ctx, w/2, h/2, 55, 'rgba(212,168,75,0.08)');
  const s = Math.min(w,h)*0.7;
  const x = (w-s)/2, y = (h-s)/2+2;
  ctx.fillStyle = '#0d1a12'; ctx.strokeStyle = '#d4a84b'; ctx.lineWidth = 1.5;
  // Jacket
  ctx.beginPath();
  ctx.moveTo(x+s*0.15, y+s*0.2);
  ctx.lineTo(x, y+s*0.5);
  ctx.lineTo(x, y+s);
  ctx.lineTo(x+s, y+s);
  ctx.lineTo(x+s, y+s*0.5);
  ctx.lineTo(x+s*0.85, y+s*0.2);
  ctx.lineTo(x+s*0.6, y+s*0.3);
  ctx.lineTo(x+s*0.5, y);
  ctx.lineTo(x+s*0.4, y+s*0.3);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Lapels
  ctx.fillStyle = '#18301c';
  ctx.beginPath();
  ctx.moveTo(x+s*0.4, y+s*0.3);
  ctx.lineTo(x+s*0.5, y+s*0.5);
  ctx.lineTo(x+s*0.38, y+s*0.7);
  ctx.lineTo(x+s*0.15, y+s*0.2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x+s*0.6, y+s*0.3);
  ctx.lineTo(x+s*0.5, y+s*0.5);
  ctx.lineTo(x+s*0.62, y+s*0.7);
  ctx.lineTo(x+s*0.85, y+s*0.2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Pocket
  ctx.strokeStyle = '#d4a84b'; ctx.lineWidth = 1;
  ctx.strokeRect(x+s*0.28, y+s*0.62, s*0.15, s*0.08);
  // Buttons
  ctx.fillStyle = '#d4a84b';
  for(let i=0;i<3;i++){ ctx.beginPath(); ctx.arc(x+s/2, y+s*(0.55+i*0.12), 2.5, 0, Math.PI*2); ctx.fill(); }
  clothShadow(ctx,w,h);
}

function drawInner(ctx, w, h) {
  clothBg(ctx, w, h, '#06101a');
  const s = Math.min(w,h)*0.65;
  const x = (w-s)/2, y = (h-s)/2+8;
  ctx.fillStyle = '#1a3344'; ctx.strokeStyle = '#00f5d4'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x+s*0.1, y);
  ctx.quadraticCurveTo(x, y, x, y+s*0.15);
  ctx.lineTo(x, y+s);
  ctx.lineTo(x+s, y+s);
  ctx.lineTo(x+s, y+s*0.15);
  ctx.quadraticCurveTo(x+s, y, x+s*0.9, y);
  ctx.quadraticCurveTo(x+s*0.7, y-s*0.08, x+s/2, y);
  ctx.quadraticCurveTo(x+s*0.3, y-s*0.08, x+s*0.1, y);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  clothShadow(ctx,w,h);
}

function drawSaree(ctx, w, h) {
  clothBg(ctx, w, h, '#1a0a1a');
  glowAt(ctx, w/2, h/2, 60, 'rgba(200,100,200,0.1)');
  const s = Math.min(w,h)*0.75;
  const x = (w-s)/2, y = (h-s)/2;
  // Draped fabric
  ctx.fillStyle = '#3d0a3d';
  ctx.strokeStyle = '#cc44cc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.1);
  ctx.bezierCurveTo(x+s*0.3, y, x+s*0.6, y+s*0.2, x+s, y+s*0.15);
  ctx.lineTo(x+s, y+s);
  ctx.bezierCurveTo(x+s*0.7, y+s*0.9, x+s*0.4, y+s, x, y+s);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Border
  ctx.strokeStyle = '#ffaaff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y+s*0.82); ctx.bezierCurveTo(x+s*0.3, y+s*0.78, x+s*0.7, y+s*0.85, x+s, y+s*0.8); ctx.stroke();
  // Pallav
  ctx.fillStyle = 'rgba(255,100,255,0.15)';
  ctx.beginPath();
  ctx.moveTo(x+s*0.6, y+s*0.05);
  ctx.lineTo(x+s, y+s*0.15);
  ctx.lineTo(x+s, y+s*0.5);
  ctx.lineTo(x+s*0.55, y+s*0.4);
  ctx.closePath(); ctx.fill();
  // Pattern dots
  ctx.fillStyle = 'rgba(255,200,255,0.5)';
  for(let i=0;i<6;i++) for(let j=0;j<4;j++){
    ctx.beginPath(); ctx.arc(x+s*0.15+i*s*0.12, y+s*0.2+j*s*0.18, 2, 0, Math.PI*2); ctx.fill();
  }
  clothShadow(ctx,w,h);
}

function drawDSaree(ctx, w, h) {
  clothBg(ctx, w, h, '#1a0800');
  glowAt(ctx, w/2, h/2, 60, 'rgba(212,168,75,0.15)');
  const s = Math.min(w,h)*0.75;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.fillStyle = '#3a1000'; ctx.strokeStyle = '#d4a84b'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.1);
  ctx.bezierCurveTo(x+s*0.3, y, x+s*0.6, y+s*0.2, x+s, y+s*0.15);
  ctx.lineTo(x+s, y+s);
  ctx.bezierCurveTo(x+s*0.7, y+s*0.9, x+s*0.4, y+s, x, y+s);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Gold border
  ctx.strokeStyle = '#d4a84b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y+s*0.82); ctx.bezierCurveTo(x+s*0.3, y+s*0.78, x+s*0.7, y+s*0.85, x+s, y+s*0.8); ctx.stroke();
  // Zari pattern
  ctx.strokeStyle = 'rgba(212,168,75,0.4)'; ctx.lineWidth = 1;
  for(let i=0;i<5;i++){
    ctx.beginPath();
    ctx.moveTo(x+s*0.15, y+s*(0.2+i*0.12));
    ctx.lineTo(x+s*0.85, y+s*(0.2+i*0.12));
    ctx.stroke();
  }
  ctx.fillStyle = '#d4a84b';
  for(let i=0;i<5;i++) for(let j=0;j<3;j++){
    ctx.beginPath(); ctx.arc(x+s*0.2+j*s*0.28, y+s*(0.2+i*0.12), 2.5, 0, Math.PI*2); ctx.fill();
  }
  clothShadow(ctx,w,h);
}

function drawKurta(ctx, w, h) {
  clothBg(ctx, w, h, '#060e1a');
  glowAt(ctx, w/2, h/2, 55, 'rgba(0,180,160,0.08)');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.fillStyle = '#0a2030'; ctx.strokeStyle = '#00cca3'; ctx.lineWidth = 1.5;
  // Long body
  ctx.beginPath();
  ctx.moveTo(x+s*0.18, y+s*0.2);
  ctx.lineTo(x, y+s*0.5);
  ctx.lineTo(x+s*0.15, y+s*0.5);
  ctx.lineTo(x+s*0.15, y+s);
  ctx.lineTo(x+s*0.85, y+s);
  ctx.lineTo(x+s*0.85, y+s*0.5);
  ctx.lineTo(x+s, y+s*0.5);
  ctx.lineTo(x+s*0.82, y+s*0.2);
  ctx.quadraticCurveTo(x+s*0.66, y, x+s*0.5, y+s*0.08);
  ctx.quadraticCurveTo(x+s*0.34, y, x+s*0.18, y+s*0.2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Collar band
  ctx.fillStyle = '#082028';
  ctx.beginPath();
  ctx.moveTo(x+s*0.38, y+s*0.08);
  ctx.lineTo(x+s*0.62, y+s*0.08);
  ctx.lineTo(x+s*0.58, y+s*0.25);
  ctx.lineTo(x+s*0.42, y+s*0.25);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Embroidery pattern
  ctx.strokeStyle = 'rgba(0,245,212,0.3)'; ctx.lineWidth = 1;
  for(let i=0;i<5;i++){
    ctx.beginPath();
    ctx.arc(x+s*0.5, y+s*0.35+i*s*0.1, 4, 0, Math.PI*2);
    ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

function drawBlouse(ctx, w, h) {
  clothBg(ctx, w, h, '#1a0510');
  const s = Math.min(w,h)*0.68;
  const x = (w-s)/2, y = (h-s)/2+5;
  ctx.fillStyle = '#3a0a20'; ctx.strokeStyle = '#ff88aa'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x+s*0.15, y+s*0.3);
  ctx.lineTo(x, y+s*0.55);
  ctx.lineTo(x+s*0.18, y+s*0.55);
  ctx.lineTo(x+s*0.22, y+s*0.75);
  ctx.lineTo(x+s*0.78, y+s*0.75);
  ctx.lineTo(x+s*0.82, y+s*0.55);
  ctx.lineTo(x+s, y+s*0.55);
  ctx.lineTo(x+s*0.85, y+s*0.3);
  ctx.quadraticCurveTo(x+s*0.7, y, x+s*0.55, y+s*0.1);
  ctx.lineTo(x+s*0.5, y+s*0.28);
  ctx.lineTo(x+s*0.45, y+s*0.1);
  ctx.quadraticCurveTo(x+s*0.3, y, x+s*0.15, y+s*0.3);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Hook closures
  ctx.strokeStyle = 'rgba(255,136,170,0.5)'; ctx.lineWidth = 1;
  for(let i=0;i<3;i++){
    ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*(0.32+i*0.12)); ctx.lineTo(x+s*0.58, y+s*(0.32+i*0.12)); ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

function drawLehenga(ctx, w, h) {
  clothBg(ctx, w, h, '#150a1a');
  glowAt(ctx, w/2, h*0.7, 60, 'rgba(180,0,200,0.1)');
  const s = Math.min(w,h)*0.8;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.strokeStyle = '#cc44ff'; ctx.lineWidth = 1.5;
  // Skirt
  ctx.fillStyle = '#2a0540';
  ctx.beginPath();
  ctx.moveTo(x+s*0.3, y+s*0.2);
  ctx.lineTo(x, y+s);
  ctx.lineTo(x+s, y+s);
  ctx.lineTo(x+s*0.7, y+s*0.2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Tier lines
  ctx.strokeStyle = 'rgba(204,68,255,0.4)'; ctx.lineWidth = 1;
  for(let i=1;i<=4;i++){
    const p = i/5;
    const lx = x+s*0.3-s*0.3*p, rx = x+s*0.7+s*0.3*p;
    ctx.beginPath(); ctx.moveTo(lx, y+s*0.2+i*s*0.16); ctx.lineTo(rx, y+s*0.2+i*s*0.16); ctx.stroke();
  }
  // Embellishments
  ctx.fillStyle = '#d4a84b';
  for(let i=0;i<8;i++){
    const px = x+s*0.1+Math.random()*s*0.8, py = y+s*0.3+Math.random()*s*0.6;
    ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
  }
  clothShadow(ctx,w,h);
}

function drawDhoti(ctx, w, h) {
  clothBg(ctx, w, h, '#0a0e08');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2+4;
  ctx.fillStyle = '#f5f0e0'; ctx.strokeStyle = '#888'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.1);
  ctx.bezierCurveTo(x+s*0.2, y, x+s*0.8, y, x+s, y+s*0.1);
  ctx.lineTo(x+s, y+s);
  ctx.lineTo(x, y+s);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Border
  ctx.strokeStyle = '#cc4400'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y+s*0.85); ctx.lineTo(x+s, y+s*0.85); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y+s*0.9); ctx.lineTo(x+s, y+s*0.9); ctx.stroke();
  // Pleats
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1;
  for(let i=1;i<8;i++){ ctx.beginPath(); ctx.moveTo(x+i*s/8, y+s*0.1); ctx.lineTo(x+i*s/8, y+s*0.8); ctx.stroke(); }
  clothShadow(ctx,w,h);
}

function drawSalwar(ctx, w, h) {
  clothBg(ctx, w, h, '#061420');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.fillStyle = '#0e2840'; ctx.strokeStyle = '#6699ff'; ctx.lineWidth = 1.5;
  // Kameez top
  ctx.beginPath();
  ctx.moveTo(x+s*0.2, y+s*0.2);
  ctx.lineTo(x, y+s*0.5);
  ctx.lineTo(x+s*0.15, y+s*0.5);
  ctx.lineTo(x+s*0.18, y+s*0.62);
  ctx.lineTo(x+s*0.82, y+s*0.62);
  ctx.lineTo(x+s*0.85, y+s*0.5);
  ctx.lineTo(x+s, y+s*0.5);
  ctx.lineTo(x+s*0.8, y+s*0.2);
  ctx.quadraticCurveTo(x+s*0.65, y, x+s*0.5, y+s*0.08);
  ctx.quadraticCurveTo(x+s*0.35, y, x+s*0.2, y+s*0.2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Bottom trouser part
  ctx.fillStyle = '#0a1e34';
  ctx.beginPath();
  ctx.moveTo(x+s*0.18, y+s*0.62);
  ctx.lineTo(x+s*0.06, y+s);
  ctx.lineTo(x+s*0.46, y+s);
  ctx.lineTo(x+s*0.48, y+s*0.78);
  ctx.lineTo(x+s*0.52, y+s*0.78);
  ctx.lineTo(x+s*0.54, y+s);
  ctx.lineTo(x+s*0.94, y+s);
  ctx.lineTo(x+s*0.82, y+s*0.62);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  clothShadow(ctx,w,h);
}

function drawDupatta(ctx, w, h) {
  clothBg(ctx, w, h, '#060808');
  const s = Math.min(w,h)*0.75;
  const x = (w-s)/2, y = (h-s)/2+5;
  // Flowing fabric
  ctx.fillStyle = 'rgba(0,200,200,0.2)';
  ctx.strokeStyle = '#00cccc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.1);
  ctx.bezierCurveTo(x+s*0.25, y, x+s*0.3, y+s*0.4, x+s*0.5, y+s*0.3);
  ctx.bezierCurveTo(x+s*0.7, y+s*0.2, x+s*0.75, y+s*0.5, x+s, y+s*0.35);
  ctx.lineTo(x+s, y+s*0.55);
  ctx.bezierCurveTo(x+s*0.75, y+s*0.7, x+s*0.7, y+s*0.4, x+s*0.5, y+s*0.5);
  ctx.bezierCurveTo(x+s*0.3, y+s*0.6, x+s*0.25, y+s*0.2, x, y+s*0.3);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Border fringe
  for(let i=0;i<12;i++){
    const fx = x+i*(s/11);
    ctx.strokeStyle = 'rgba(0,200,200,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(fx, y+s*0.52); ctx.lineTo(fx, y+s*0.62); ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

function drawJacket(ctx, w, h) {
  clothBg(ctx, w, h, '#060c18');
  glowAt(ctx, w/2, h/2, 55, 'rgba(0,50,150,0.1)');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2+2;
  ctx.fillStyle = '#0e1e38'; ctx.strokeStyle = '#4488cc'; ctx.lineWidth = 1.5;
  // Body
  ctx.beginPath();
  ctx.moveTo(x+s*0.15, y+s*0.22);
  ctx.lineTo(x, y+s*0.5);
  ctx.lineTo(x, y+s);
  ctx.lineTo(x+s, y+s);
  ctx.lineTo(x+s, y+s*0.5);
  ctx.lineTo(x+s*0.85, y+s*0.22);
  ctx.lineTo(x+s*0.58, y+s*0.32);
  ctx.lineTo(x+s*0.5, y);
  ctx.lineTo(x+s*0.42, y+s*0.32);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Lapels
  ctx.fillStyle = '#0a1828';
  ctx.beginPath();
  ctx.moveTo(x+s*0.42, y+s*0.32); ctx.lineTo(x+s*0.5, y+s*0.6); ctx.lineTo(x+s*0.38, y+s*0.8); ctx.lineTo(x+s*0.15, y+s*0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x+s*0.58, y+s*0.32); ctx.lineTo(x+s*0.5, y+s*0.6); ctx.lineTo(x+s*0.62, y+s*0.8); ctx.lineTo(x+s*0.85, y+s*0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Zipper
  ctx.strokeStyle = '#99ccff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x+s/2, y+s*0.6); ctx.lineTo(x+s/2, y+s); ctx.stroke();
  // Pockets
  ctx.strokeStyle = '#4488cc'; ctx.lineWidth = 1;
  ctx.strokeRect(x+s*0.1, y+s*0.62, s*0.18, s*0.08);
  ctx.strokeRect(x+s*0.72, y+s*0.62, s*0.18, s*0.08);
  clothShadow(ctx,w,h);
}

function drawSweater(ctx, w, h) {
  clothBg(ctx, w, h, '#0a0608');
  glowAt(ctx, w/2, h/2, 55, 'rgba(180,60,60,0.08)');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2+2;
  ctx.fillStyle = '#2a0e0e'; ctx.strokeStyle = '#cc4444'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x+s*0.2, y+s*0.2);
  ctx.lineTo(x, y+s*0.5);
  ctx.lineTo(x+s*0.18, y+s*0.5);
  ctx.lineTo(x+s*0.18, y+s);
  ctx.lineTo(x+s*0.82, y+s);
  ctx.lineTo(x+s*0.82, y+s*0.5);
  ctx.lineTo(x+s, y+s*0.5);
  ctx.lineTo(x+s*0.8, y+s*0.2);
  ctx.quadraticCurveTo(x+s*0.65, y, x+s*0.5, y+s*0.1);
  ctx.quadraticCurveTo(x+s*0.35, y, x+s*0.2, y+s*0.2);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Knit texture
  ctx.strokeStyle = 'rgba(204,68,68,0.3)'; ctx.lineWidth = 1;
  for(let row=0;row<7;row++){
    for(let col=0;col<8;col++){
      ctx.beginPath();
      ctx.arc(x+s*0.16+col*s*0.1, y+s*0.22+row*s*0.1, 3, 0, Math.PI*2);
      ctx.stroke();
    }
  }
  // Ribbed neck
  ctx.fillStyle = '#3a1010';
  ctx.beginPath();
  ctx.ellipse(x+s/2, y+s*0.12, s*0.16, s*0.06, 0, 0, Math.PI*2);
  ctx.fill(); ctx.strokeStyle = '#cc4444'; ctx.stroke();
  clothShadow(ctx,w,h);
}

function drawHoodie(ctx, w, h) {
  clothBg(ctx, w, h, '#060a0e');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2+2;
  ctx.fillStyle = '#0e1c2c'; ctx.strokeStyle = '#336699'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x+s*0.2, y+s*0.3);
  ctx.lineTo(x, y+s*0.55);
  ctx.lineTo(x+s*0.18, y+s*0.55);
  ctx.lineTo(x+s*0.18, y+s);
  ctx.lineTo(x+s*0.82, y+s);
  ctx.lineTo(x+s*0.82, y+s*0.55);
  ctx.lineTo(x+s, y+s*0.55);
  ctx.lineTo(x+s*0.8, y+s*0.3);
  ctx.lineTo(x+s*0.62, y+s*0.1);
  ctx.quadraticCurveTo(x+s*0.5, y, x+s*0.38, y+s*0.1);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Hood
  ctx.fillStyle = '#0a1622';
  ctx.beginPath();
  ctx.moveTo(x+s*0.38, y+s*0.1);
  ctx.quadraticCurveTo(x+s*0.3, y-s*0.05, x+s*0.28, y+s*0.2);
  ctx.lineTo(x+s*0.2, y+s*0.3);
  ctx.lineTo(x+s*0.8, y+s*0.3);
  ctx.lineTo(x+s*0.72, y+s*0.2);
  ctx.quadraticCurveTo(x+s*0.7, y-s*0.05, x+s*0.62, y+s*0.1);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Kangaroo pocket
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.roundRect(x+s*0.3, y+s*0.62, s*0.4, s*0.2, 4);
  ctx.fill(); ctx.strokeStyle = '#336699'; ctx.stroke();
  // Drawstrings
  ctx.strokeStyle = '#99aabb'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x+s*0.42, y+s*0.22); ctx.lineTo(x+s*0.42, y+s*0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+s*0.58, y+s*0.22); ctx.lineTo(x+s*0.58, y+s*0.5); ctx.stroke();
  clothShadow(ctx,w,h);
}

function drawCoat(ctx, w, h) {
  clothBg(ctx, w, h, '#040608');
  glowAt(ctx, w/2, h/2, 60, 'rgba(60,60,80,0.1)');
  const s = Math.min(w,h)*0.75;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.fillStyle = '#0e0e14'; ctx.strokeStyle = '#6666aa'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x+s*0.15, y+s*0.18);
  ctx.lineTo(x, y+s*0.4);
  ctx.lineTo(x, y+s);
  ctx.lineTo(x+s, y+s);
  ctx.lineTo(x+s, y+s*0.4);
  ctx.lineTo(x+s*0.85, y+s*0.18);
  ctx.lineTo(x+s*0.6, y+s*0.24);
  ctx.lineTo(x+s*0.5, y);
  ctx.lineTo(x+s*0.4, y+s*0.24);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Lapels
  ctx.fillStyle = '#0a0a10';
  ctx.beginPath(); ctx.moveTo(x+s*0.4, y+s*0.24); ctx.lineTo(x+s*0.5, y+s*0.5); ctx.lineTo(x+s*0.36, y+s*0.85); ctx.lineTo(x+s*0.15, y+s*0.18); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+s*0.6, y+s*0.24); ctx.lineTo(x+s*0.5, y+s*0.5); ctx.lineTo(x+s*0.64, y+s*0.85); ctx.lineTo(x+s*0.85, y+s*0.18); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Buttons
  ctx.fillStyle = '#6666aa';
  for(let i=0;i<4;i++){ ctx.beginPath(); ctx.arc(x+s*0.5, y+s*(0.54+i*0.1), 3, 0, Math.PI*2); ctx.fill(); }
  // Belt
  ctx.fillStyle = '#1a1a28';
  ctx.fillRect(x+s*0.08, y+s*0.58, s*0.84, s*0.06);
  ctx.strokeRect(x+s*0.08, y+s*0.58, s*0.84, s*0.06);
  clothShadow(ctx,w,h);
}

function drawBlanket(ctx, w, h) {
  clothBg(ctx, w, h, '#080612');
  const s = Math.min(w,h)*0.78;
  const x = (w-s)/2, y = (h-s)/2+2;
  // Folded blanket
  ctx.fillStyle = '#1a0e2e';
  ctx.strokeStyle = '#8855cc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.1);
  ctx.lineTo(x+s, y);
  ctx.lineTo(x+s, y+s*0.7);
  ctx.lineTo(x, y+s*0.8);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Pattern stripes
  ctx.strokeStyle = 'rgba(136,85,204,0.4)'; ctx.lineWidth = 4;
  for(let i=1;i<=4;i++){
    const p = i/5;
    ctx.beginPath();
    ctx.moveTo(x, y+s*0.1+p*(s*0.7));
    ctx.lineTo(x+s, y+p*s*0.7);
    ctx.stroke();
  }
  // Fold at bottom
  ctx.fillStyle = '#0e0820';
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.75);
  ctx.lineTo(x+s, y+s*0.65);
  ctx.lineTo(x+s, y+s*0.8);
  ctx.lineTo(x, y+s*0.9);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  clothShadow(ctx,w,h);
}

function drawShawl(ctx, w, h) {
  clothBg(ctx, w, h, '#060a08');
  const s = Math.min(w,h)*0.78;
  const x = (w-s)/2, y = (h-s)/2+2;
  ctx.fillStyle = 'rgba(0,150,120,0.25)';
  ctx.strokeStyle = '#00aa88';
  ctx.lineWidth = 1.5;
  // Draped shape
  ctx.beginPath();
  ctx.moveTo(x, y+s*0.15);
  ctx.bezierCurveTo(x+s*0.2, y, x+s*0.4, y+s*0.25, x+s*0.5, y+s*0.18);
  ctx.bezierCurveTo(x+s*0.6, y+s*0.1, x+s*0.8, y, x+s, y+s*0.15);
  ctx.lineTo(x+s*0.95, y+s*0.4);
  ctx.bezierCurveTo(x+s*0.75, y+s*0.55, x+s*0.55, y+s*0.35, x+s*0.5, y+s*0.42);
  ctx.bezierCurveTo(x+s*0.45, y+s*0.48, x+s*0.25, y+s*0.6, x+s*0.05, y+s*0.4);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Fringe
  for(let i=0;i<14;i++){
    const fx = x+i*(s/13);
    ctx.strokeStyle = 'rgba(0,170,136,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(fx, y+s*0.38); ctx.lineTo(fx-4+Math.random()*8, y+s*0.55); ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

function drawBedsheet(ctx, w, h) {
  clothBg(ctx, w, h, '#060812');
  glowAt(ctx, w/2, h/2, 65, 'rgba(0,100,200,0.06)');
  const s = Math.min(w,h)*0.8;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.fillStyle = '#0e1a2e'; ctx.strokeStyle = '#336699'; ctx.lineWidth = 1.5;
  // Sheet rectangle with fold
  ctx.fillRect(x, y+s*0.05, s, s*0.7);
  ctx.strokeRect(x, y+s*0.05, s, s*0.7);
  // Top folded part
  ctx.fillStyle = '#162840';
  ctx.fillRect(x, y+s*0.05, s, s*0.12);
  ctx.strokeRect(x, y+s*0.05, s, s*0.12);
  // Pillow outline
  ctx.fillStyle = '#1a3050';
  ctx.beginPath();
  ctx.roundRect(x+s*0.08, y+s*0.18, s*0.35, s*0.22, 6);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x+s*0.57, y+s*0.18, s*0.35, s*0.22, 6);
  ctx.fill(); ctx.stroke();
  // Stripe pattern
  ctx.strokeStyle = 'rgba(51,102,153,0.3)'; ctx.lineWidth = 2;
  for(let i=1;i<=5;i++){
    ctx.beginPath(); ctx.moveTo(x, y+s*0.05+i*s*0.1); ctx.lineTo(x+s, y+s*0.05+i*s*0.1); ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

function drawPillow(ctx, w, h) {
  clothBg(ctx, w, h, '#060810');
  const s = Math.min(w,h)*0.7;
  const x = (w-s)/2, y = (h-s)/2+5;
  ctx.fillStyle = '#1a2a44'; ctx.strokeStyle = '#4488aa'; ctx.lineWidth = 1.5;
  // Pillow 3D
  ctx.beginPath();
  ctx.roundRect(x, y, s, s*0.65, 10);
  ctx.fill(); ctx.stroke();
  // Piping
  ctx.strokeStyle = '#224466'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x+8, y+8, s-16, s*0.65-16, 6);
  ctx.stroke();
  // Pattern
  ctx.strokeStyle = 'rgba(68,136,170,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x+s*0.25, y); ctx.lineTo(x+s*0.25, y+s*0.65); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+s*0.5, y); ctx.lineTo(x+s*0.5, y+s*0.65); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+s*0.75, y); ctx.lineTo(x+s*0.75, y+s*0.65); ctx.stroke();
  clothShadow(ctx,w,h);
}

function drawCurtain(ctx, w, h) {
  clothBg(ctx, w, h, '#06060a');
  const s = Math.min(w,h)*0.8;
  const x = (w-s)/2, y = h*0.06;
  // Curtain rod
  ctx.fillStyle = '#888';
  ctx.fillRect(x-4, y, s+8, 6);
  // Rings
  ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1.5;
  for(let i=0;i<=6;i++){
    ctx.beginPath(); ctx.arc(x+i*(s/6), y+3, 5, 0, Math.PI*2); ctx.stroke();
  }
  // Curtain panels (draped)
  const panelColors = ['rgba(80,30,30,0.8)', 'rgba(60,20,20,0.6)'];
  [0,1].forEach(p=>{
    const px = x + p*(s*0.48);
    ctx.fillStyle = panelColors[p];
    ctx.strokeStyle = '#aa4444'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, y+6);
    for(let i=0;i<=8;i++){
      const wavex = px + s*0.48 * (i/8);
      const wavey = y+6 + (i%2===0 ? 0 : 12);
      ctx.lineTo(wavex, wavey);
    }
    ctx.lineTo(px+s*0.48, y+6);
    ctx.lineTo(px+s*0.48, h-8);
    // Curved hem
    ctx.bezierCurveTo(px+s*0.35, h-2, px+s*0.15, h, px, h-8);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Vertical pleats
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
    for(let v=1;v<=4;v++){
      ctx.beginPath();
      ctx.moveTo(px+v*(s*0.48/5), y+10);
      ctx.lineTo(px+v*(s*0.48/5)+4, h-10);
      ctx.stroke();
    }
  });
  clothShadow(ctx,w,h);
}

function drawSofaCover(ctx, w, h) {
  clothBg(ctx, w, h, '#060a06');
  glowAt(ctx, w/2, h*0.6, 55, 'rgba(0,150,60,0.06)');
  const s = Math.min(w,h)*0.78;
  const x = (w-s)/2, y = (h-s)/2+2;
  ctx.fillStyle = '#0a1e0e'; ctx.strokeStyle = '#226633'; ctx.lineWidth = 1.5;
  // Back rest
  ctx.beginPath();
  ctx.roundRect(x+s*0.04, y, s*0.92, s*0.45, 8);
  ctx.fill(); ctx.stroke();
  // Seat
  ctx.fillStyle = '#0e2a14';
  ctx.beginPath();
  ctx.roundRect(x, y+s*0.42, s, s*0.35, 5);
  ctx.fill(); ctx.stroke();
  // Arm rests
  ctx.fillStyle = '#0a1e0e';
  ctx.beginPath(); ctx.roundRect(x, y+s*0.15, s*0.12, s*0.65, 5); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(x+s*0.88, y+s*0.15, s*0.12, s*0.65, 5); ctx.fill(); ctx.stroke();
  // Cushion lines
  ctx.strokeStyle = 'rgba(34,102,51,0.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x+s*0.5, y+s*0.42); ctx.lineTo(x+s*0.5, y+s*0.77); ctx.stroke();
  // Pattern
  ctx.strokeStyle = 'rgba(34,102,51,0.2)'; ctx.lineWidth = 1;
  for(let i=1;i<=4;i++){
    ctx.beginPath(); ctx.moveTo(x+s*0.12, y+i*s*0.08); ctx.lineTo(x+s*0.88, y+i*s*0.08); ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

function drawTableCloth(ctx, w, h) {
  clothBg(ctx, w, h, '#0a0806');
  const s = Math.min(w,h)*0.78;
  const x = (w-s)/2, y = (h-s)/2;
  ctx.fillStyle = '#2a1a08'; ctx.strokeStyle = '#aa8833'; ctx.lineWidth = 1.5;
  // Main surface
  ctx.fillRect(x+s*0.06, y+s*0.1, s*0.88, s*0.6);
  ctx.strokeRect(x+s*0.06, y+s*0.1, s*0.88, s*0.6);
  // Draping sides
  ctx.fillStyle = '#1e1206';
  // Left drape
  ctx.beginPath();
  ctx.moveTo(x+s*0.06, y+s*0.1);
  ctx.lineTo(x, y+s*0.2);
  ctx.lineTo(x, y+s*0.85);
  ctx.lineTo(x+s*0.06, y+s*0.7); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Right drape
  ctx.beginPath();
  ctx.moveTo(x+s*0.94, y+s*0.1);
  ctx.lineTo(x+s, y+s*0.2);
  ctx.lineTo(x+s, y+s*0.85);
  ctx.lineTo(x+s*0.94, y+s*0.7); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Check pattern
  ctx.strokeStyle = 'rgba(170,136,51,0.3)'; ctx.lineWidth = 1;
  for(let i=1;i<=5;i++){
    ctx.beginPath(); ctx.moveTo(x+s*0.06, y+s*0.1+i*s*0.1); ctx.lineTo(x+s*0.94, y+s*0.1+i*s*0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*0.06+i*s*0.15, y+s*0.1); ctx.lineTo(x+s*0.06+i*s*0.15, y+s*0.7); ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

function drawTowel(ctx, w, h) {
  clothBg(ctx, w, h, '#060a0c');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2+3;
  // Rolled towel
  ctx.fillStyle = '#1e3040'; ctx.strokeStyle = '#44aacc'; ctx.lineWidth = 1.5;
  // Main roll body
  ctx.beginPath();
  ctx.roundRect(x, y+s*0.2, s, s*0.55, s*0.1);
  ctx.fill(); ctx.stroke();
  // End cap ellipses
  ctx.beginPath(); ctx.ellipse(x+14, y+s*0.47, 14, s*0.275, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x+s-14, y+s*0.47, 14, s*0.275, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // Stripe
  ctx.strokeStyle = '#224466'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x, y+s*0.38); ctx.lineTo(x+s, y+s*0.38); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y+s*0.54); ctx.lineTo(x+s, y+s*0.54); ctx.stroke();
  // Texture lines
  ctx.strokeStyle = 'rgba(68,170,204,0.2)'; ctx.lineWidth = 1;
  for(let i=1;i<=10;i++){
    ctx.beginPath(); ctx.moveTo(x+i*s/11, y+s*0.2); ctx.lineTo(x+i*s/11, y+s*0.75); ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

function drawBag(ctx, w, h) {
  clothBg(ctx, w, h, '#080608');
  glowAt(ctx, w/2, h*0.6, 55, 'rgba(100,0,200,0.06)');
  const s = Math.min(w,h)*0.72;
  const x = (w-s)/2, y = (h-s)/2+2;
  ctx.fillStyle = '#1a0a28'; ctx.strokeStyle = '#8855cc'; ctx.lineWidth = 1.5;
  // Main bag body
  ctx.beginPath();
  ctx.roundRect(x+s*0.08, y+s*0.25, s*0.84, s*0.72, 8);
  ctx.fill(); ctx.stroke();
  // Shoulder strap
  ctx.strokeStyle = '#6633aa'; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x+s*0.25, y+s*0.25);
  ctx.bezierCurveTo(x+s*0.2, y, x+s*0.5, y-s*0.08, x+s*0.75, y+s*0.25);
  ctx.stroke();
  // Zipper
  ctx.strokeStyle = '#aaaaff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x+s*0.2, y+s*0.32); ctx.lineTo(x+s*0.8, y+s*0.32); ctx.stroke();
  // Pocket
  ctx.fillStyle = 'rgba(100,50,180,0.3)';
  ctx.strokeStyle = '#6633aa'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x+s*0.18, y+s*0.5, s*0.64, s*0.3, 5);
  ctx.fill(); ctx.stroke();
  // Logo
  ctx.fillStyle = 'rgba(136,85,204,0.5)';
  ctx.beginPath(); ctx.arc(x+s*0.5, y+s*0.65, s*0.06, 0, Math.PI*2); ctx.fill();
  clothShadow(ctx,w,h);
}

function drawMat(ctx, w, h) {
  clothBg(ctx, w, h, '#060806');
  const s = Math.min(w,h)*0.78;
  const x = (w-s)/2, y = (h-s)/2+5;
  ctx.fillStyle = '#0e1e0a'; ctx.strokeStyle = '#448833'; ctx.lineWidth = 1.5;
  // Main mat
  ctx.beginPath();
  ctx.roundRect(x, y+s*0.25, s, s*0.5, 10);
  ctx.fill(); ctx.stroke();
  // Weave pattern
  ctx.strokeStyle = 'rgba(68,136,51,0.4)'; ctx.lineWidth = 1;
  for(let i=1;i<=7;i++){
    ctx.beginPath(); ctx.moveTo(x+i*s/8, y+s*0.25); ctx.lineTo(x+i*s/8, y+s*0.75); ctx.stroke();
  }
  for(let j=1;j<=4;j++){
    ctx.beginPath(); ctx.moveTo(x, y+s*0.25+j*s*0.08); ctx.lineTo(x+s, y+s*0.25+j*s*0.08); ctx.stroke();
  }
  // Border fringe
  ctx.strokeStyle = 'rgba(100,180,70,0.5)'; ctx.lineWidth = 1;
  for(let i=0;i<=12;i++){
    const fx = x+i*(s/12);
    ctx.beginPath(); ctx.moveTo(fx, y+s*0.25); ctx.lineTo(fx, y+s*0.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx, y+s*0.75); ctx.lineTo(fx, y+s*0.88); ctx.stroke();
  }
  clothShadow(ctx,w,h);
}

// ============================================================
// RENDER CLOTH GRID
// ============================================================
function renderClothGrid(category) {
  const grid = document.getElementById('clothGrid');
  grid.innerHTML = '';
  const items = CLOTH_DATA[category] || [];

  items.forEach(item => {
    const qty = state.clothes[item.id]?.qty || 0;
    const card = document.createElement('div');
    card.className = 'cloth-card' + (qty > 0 ? ' has-items' : '');
    card.dataset.id = item.id;

    const canvasId = 'c_' + item.id;
    card.innerHTML = `
      <div class="cloth-img-wrap" style="height:130px;">
        <canvas id="${canvasId}" width="200" height="160" style="width:100%;height:130px;display:block;"></canvas>
        <div class="cloth-img-shadow"></div>
      </div>
      <div class="cloth-info">
        <div class="cloth-name">${item.name}</div>
        <div class="cloth-price">₹${item.price} / piece</div>
        <div class="qty-selector">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)" aria-label="Decrease">−</button>
          <span class="qty-val" id="qty_${item.id}">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)" aria-label="Increase">+</button>
        </div>
      </div>`;
    grid.appendChild(card);

    // Draw cloth icon
    requestAnimationFrame(() => {
      const canvas = document.getElementById(canvasId);
      if (canvas && item.draw) {
        try { item.draw(canvas.getContext('2d'), canvas.width, canvas.height); }
        catch(e) { console.warn('Draw error', e); }
      }
    });
  });
}

// ============================================================
// QUANTITY LOGIC
// ============================================================
function changeQty(itemId, delta) {
  let found = null;
  for (const cat in CLOTH_DATA) {
    const item = CLOTH_DATA[cat].find(i => i.id === itemId);
    if (item) { found = item; break; }
  }
  if (!found) return;

  const current = state.clothes[itemId]?.qty || 0;
  const newQty = Math.max(0, current + delta);

  if (newQty === 0) {
    delete state.clothes[itemId];
  } else {
    state.clothes[itemId] = { name: found.name, qty: newQty, price: found.price };
  }

  // Update display
  const qtyEl = document.getElementById('qty_' + itemId);
  if (qtyEl) {
    qtyEl.textContent = newQty;
    qtyEl.classList.remove('pulse');
    requestAnimationFrame(() => qtyEl.classList.add('pulse'));
  }
  const card = document.querySelector(`.cloth-card[data-id="${itemId}"]`);
  if (card) card.classList.toggle('has-items', newQty > 0);

  updateSummary();
  rippleEffect();
}

// ============================================================
// STEP NAVIGATION
// ============================================================
function goStep(n) {
  const current = document.getElementById('step' + state.currentStep);
  const next = document.getElementById('step' + n);
  if (!next) return;

  if (current) current.classList.remove('active');
  next.classList.add('active');
  state.currentStep = n;

  // Update progress indicators
  document.querySelectorAll('.step-item').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === n) el.classList.add('active');
    if (s < n) el.classList.add('done');
  });

  // Update fill bar
  const fillPct = ((n - 1) / 5) * 100;
  document.getElementById('stepFill').style.width = fillPct + '%';

  // Scroll to booking section
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Build confirm summary if step 6
  if (n === 6) buildConfirmSummary();

  // Show mobile summary on step > 1
  document.getElementById('mobileSummary').style.display = n > 1 ? 'flex' : 'none';
}

// ============================================================
// VALIDATION
// ============================================================
function validatePickup() {
  const date = document.getElementById('pickupDate').value;
  if (!date) { alert('Please select a pickup date.'); return; }
  if (!state.pickupTime) { alert('Please select a time slot.'); return; }
  state.pickupDate = date;
  goStep(5);
}

function validateAddress() {
  const name = document.getElementById('addrName').value.trim();
  const phone = document.getElementById('addrPhone').value.trim();
  const addr = document.getElementById('addrFull').value.trim();
  const city = document.getElementById('addrCity').value.trim();
  const pin = document.getElementById('addrPin').value.trim();
  if (!name || !phone || !addr || !city || !pin) {
    alert('Please fill all required address fields.'); return;
  }
  if (!/^\d{10}$/.test(phone)) { alert('Please enter a valid 10-digit phone number.'); return; }
  if (!/^\d{6}$/.test(pin)) { alert('Please enter a valid 6-digit pincode.'); return; }
  state.address = {
    name, phone, address: addr, city, pin,
    landmark: document.getElementById('addrLandmark').value.trim()
  };
  goStep(6);
}

// ============================================================
// SUMMARY UPDATE
// ============================================================
function updateSummary() {
  const itemCount = Object.values(state.clothes).reduce((a, b) => a + b.qty, 0);
  const subtotal = Object.values(state.clothes).reduce((a, b) => a + b.qty * b.price, 0);
  const addonTotal = state.addons.reduce((a, b) => a + b.price, 0);
  const delivery = state.deliveryExtra;
  const total = Math.max(0, subtotal + addonTotal + delivery - state.couponDiscount);

  // Badge
  document.getElementById('summaryItemCount').textContent = itemCount + ' item' + (itemCount !== 1 ? 's' : '');
  document.getElementById('sumService').textContent = state.selectedService || 'Not selected';

  // Clothes list
  const clothList = document.getElementById('sumClothesList');
  if (itemCount === 0) {
    clothList.innerHTML = '<div class="sum-empty">No items yet</div>';
  } else {
    clothList.innerHTML = Object.values(state.clothes).map(c => `
      <div class="sum-cloth-row">
        <span class="sum-cloth-name">${c.name} × ${c.qty}</span>
        <span class="sum-cloth-price">₹${c.qty * c.price}</span>
      </div>`).join('');
  }

  // Addons
  const addonSection = document.getElementById('summaryAddons');
  const addonList = document.getElementById('sumAddonsList');
  if (state.addons.length > 0) {
    addonSection.style.display = 'block';
    addonList.innerHTML = state.addons.map(a => `
      <div class="sum-addon-row"><span>${a.name}</span><span>+₹${a.price}</span></div>`).join('');
    document.getElementById('sumAddonRow').style.display = 'flex';
    document.getElementById('sumAddonTotal').textContent = '₹' + addonTotal;
  } else {
    addonSection.style.display = 'none';
    document.getElementById('sumAddonRow').style.display = 'none';
  }

  // Delivery
  if (delivery > 0) {
    document.getElementById('sumDeliveryRow').style.display = 'flex';
    document.getElementById('sumDeliveryCharge').textContent = '₹' + delivery;
  } else {
    document.getElementById('sumDeliveryRow').style.display = 'none';
  }

  // Discount
  if (state.couponDiscount > 0) {
    document.getElementById('sumDiscountRow').style.display = 'flex';
    document.getElementById('sumDiscount').textContent = '-₹' + state.couponDiscount;
  } else {
    document.getElementById('sumDiscountRow').style.display = 'none';
  }

  // Totals
  document.getElementById('sumSubtotal').textContent = '₹' + subtotal;
  const totalEl = document.getElementById('sumTotal');
  totalEl.textContent = '₹' + total;
  totalEl.style.transform = 'scale(1.08)';
  setTimeout(() => { totalEl.style.transform = 'scale(1)'; }, 300);

  // Mobile
  document.getElementById('mobItems').textContent = itemCount + ' item' + (itemCount !== 1 ? 's' : '') + ' selected';
  document.getElementById('mobTotal').textContent = '₹' + total;

  // Pickup
  if (state.pickupDate || state.pickupTime) {
    document.getElementById('summaryPickup').style.display = 'block';
    document.getElementById('sumPickupDetails').innerHTML = `
      <div style="font-size:12.5px;color:var(--white-dim)">
        ${state.pickupDate ? '📅 ' + state.pickupDate + '<br>' : ''}
        ${state.pickupTime ? '⏰ ' + state.pickupTime + '<br>' : ''}
        ${state.deliverySpeed ? '🚚 ' + state.deliverySpeed : ''}
      </div>`;
  }
}

// ============================================================
// CONFIRM SUMMARY (Step 6)
// ============================================================
function buildConfirmSummary() {
  const clothLines = Object.values(state.clothes).map(c => `${c.name} – ${c.qty}`).join('\n');
  const addonNames = state.addons.map(a => a.name).join(', ');
  const total = calcTotal();

  const html = `
    <div class="confirm-row">
      <span class="confirm-key">Service</span>
      <span class="confirm-val">${state.selectedService || '—'}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-key">Clothes</span>
      <span class="confirm-val">${Object.values(state.clothes).map(c => `${c.name} × ${c.qty}`).join(', ') || '—'}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-key">Add-ons</span>
      <span class="confirm-val">${addonNames || 'None'}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-key">Pickup Date</span>
      <span class="confirm-val">${state.pickupDate || '—'}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-key">Time Slot</span>
      <span class="confirm-val">${state.pickupTime || '—'}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-key">Delivery</span>
      <span class="confirm-val">${state.deliverySpeed}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-key">Name</span>
      <span class="confirm-val">${state.address.name || '—'}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-key">Phone</span>
      <span class="confirm-val">${state.address.phone || '—'}</span>
    </div>
    <div class="confirm-row">
      <span class="confirm-key">Address</span>
      <span class="confirm-val">${[state.address.address, state.address.city, state.address.pin, state.address.landmark].filter(Boolean).join(', ') || '—'}</span>
    </div>
    <div class="confirm-total-row">
      <span>Total Amount</span>
      <span class="confirm-total-price">₹${total}</span>
    </div>`;
  document.getElementById('confirmSummary').innerHTML = html;
}

function calcTotal() {
  const sub = Object.values(state.clothes).reduce((a, b) => a + b.qty * b.price, 0);
  const add = state.addons.reduce((a, b) => a + b.price, 0);
  return Math.max(0, sub + add + state.deliveryExtra - state.couponDiscount);
}

// ============================================================
// WHATSAPP
// ============================================================
function sendWhatsApp() {
  const clothList = Object.values(state.clothes)
    .map(c => `  ${c.name} – ${c.qty}`)
    .join('\n') || '  None selected';
  const addonList = state.addons.map(a => a.name).join(', ') || 'None';
  const addrFull = [
    state.address.address,
    state.address.city,
    state.address.pin,
    state.address.landmark,
  ].filter(Boolean).join(', ');
  const total = calcTotal();

  const msg = `Hello Aqua Luxe Laundry! 👋

I would like to book a laundry pickup.

🧺 *Service:* ${state.selectedService || 'Not selected'}

👕 *Clothes:*
${clothList}

✨ *Add-ons:*
${addonList}

📅 *Pickup Date:* ${state.pickupDate || 'Not set'}
⏰ *Time:* ${state.pickupTime || 'Not set'}
🚚 *Delivery:* ${state.deliverySpeed}

👤 *Name:* ${state.address.name || ''}
📞 *Phone:* ${state.address.phone || ''}

📍 *Address:*
${addrFull || 'Not provided'}

💰 *Total Price:* ₹${total}

Please confirm my order. Thank you!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ============================================================
// COUPON
// ============================================================
const COUPONS = { 'AQUA10': 10, 'LUXE20': 20, 'FIRST15': 15 };

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const msg = document.getElementById('couponMsg');
  if (COUPONS[code]) {
    const pct = COUPONS[code];
    const sub = Object.values(state.clothes).reduce((a, b) => a + b.qty * b.price, 0);
    state.couponDiscount = Math.round(sub * pct / 100);
    state.couponCode = code;
    msg.className = 'coupon-msg success';
    msg.textContent = `✓ Coupon applied! You save ₹${state.couponDiscount} (${pct}% off)`;
    updateSummary();
  } else if (code) {
    msg.className = 'coupon-msg error';
    msg.textContent = '✗ Invalid coupon code. Try AQUA10, LUXE20 or FIRST15.';
  }
}

// ============================================================
// RIPPLE EFFECT
// ============================================================
function rippleEffect(e) {
  const r = document.getElementById('rippleClick');
  const x = e ? e.clientX : window.innerWidth / 2;
  const y = e ? e.clientY : window.innerHeight / 2;
  r.style.cssText = `width:30px;height:30px;left:${x-15}px;top:${y-15}px;position:fixed;border-radius:50%;background:rgba(0,245,212,0.3);transform:scale(0);animation:rippleOut 0.6s ease forwards;z-index:9997;pointer-events:none;`;
  r.style.animation = 'none';
  requestAnimationFrame(() => { r.style.animation = 'rippleOut 0.6s ease forwards'; });
}

// ============================================================
// THREE.JS HERO — 3D Washing Machine
// ============================================================
function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const w = canvas.parentElement.offsetWidth;
  const h = canvas.parentElement.offsetHeight;
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
  camera.position.set(0, 0.3, 5.5);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;

  function onResize() {
    const nw = canvas.parentElement.offsetWidth;
    const nh = canvas.parentElement.offsetHeight;
    renderer.setSize(nw, nh);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Lights
  scene.add(new THREE.AmbientLight(0x0a1530, 2));
  const key = new THREE.PointLight(0x00f5d4, 10, 14);
  key.position.set(3, 3, 3);
  scene.add(key);
  const rim = new THREE.SpotLight(0x00f5d4, 18, 18, Math.PI/7, 0.5);
  rim.position.set(-4, 1, 2);
  scene.add(rim);
  const back = new THREE.PointLight(0x001840, 5, 10);
  back.position.set(0, -3, -3);
  scene.add(back);

  // Machine group
  const g = new THREE.Group();
  scene.add(g);

  const MAT = (col, met=0.9, rou=0.1) => new THREE.MeshPhysicalMaterial({ color:col, metalness:met, roughness:rou });

  // Body
  g.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.2,2.8,1.5,4,4,2), MAT(0x090f1e)), {}));

  // Door ring
  const ringM = new THREE.MeshPhysicalMaterial({ color:0x00f5d4, emissive:0x00f5d4, emissiveIntensity:1, metalness:1, roughness:0 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.055, 16, 64), ringM);
  ring.position.z = 0.82;
  g.add(ring);

  // Door glass
  const doorM = new THREE.MeshPhysicalMaterial({ color:0x001a2a, metalness:0.4, roughness:0, transparent:true, opacity:0.8 });
  const door = new THREE.Mesh(Object.assign(new THREE.CylinderGeometry(0.72,0.72,0.14,64), {}).rotateX(Math.PI/2), doorM);
  door.rotation.x = Math.PI/2;
  door.position.z = 0.82;
  g.add(door);

  // Drum
  const drumM = new THREE.MeshPhysicalMaterial({ color:0x003333, metalness:0.7, roughness:0.2, emissive:0x004444, emissiveIntensity:0.3 });
  const drum = Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(0.58,0.58,0.18,24), drumM), {});
  drum.rotation.x = Math.PI/2;
  drum.position.z = 0.85;
  g.add(drum);

  // Drum holes
  for(let i=0;i<10;i++){
    const a = (i/10)*Math.PI*2;
    const hm = new THREE.Mesh(new THREE.CircleGeometry(0.04,8), new THREE.MeshBasicMaterial({color:0x00f5d4,transparent:true,opacity:0.5}));
    hm.position.set(Math.cos(a)*0.38, Math.sin(a)*0.38, 0.87);
    g.add(hm);
  }

  // Top panel
  const panel = new THREE.Mesh(new THREE.BoxGeometry(2.2,0.38,1.5), MAT(0x050c16, 0.95, 0.05));
  panel.position.y = 1.59;
  g.add(panel);

  // Indicator dots
  [0x00f5d4, 0x0066ff, 0x00f5d4].forEach((col, i) => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045,16,16), new THREE.MeshBasicMaterial({color:col}));
    dot.position.set(-0.35+i*0.35, 1.6, 0.82);
    g.add(dot);
  });

  // Dial
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.07,32), MAT(0x00f5d4, 1, 0));
  dial.rotation.x = Math.PI/2;
  dial.position.set(0.7, 1.6, 0.82);
  g.add(dial);

  g.position.set(0.4, -0.3, 0);
  g.rotation.y = -0.25;

  // Floating bubbles
  const bubbles = [];
  for(let i=0;i<18;i++){
    const r = 0.04 + Math.random()*0.1;
    const bm = new THREE.MeshPhysicalMaterial({ color:0x00f5d4, transparent:true, opacity:0.12+Math.random()*0.18, metalness:0.5, roughness:0 });
    const b = new THREE.Mesh(new THREE.SphereGeometry(r,12,12), bm);
    b.position.set((Math.random()-0.5)*7, (Math.random()-0.5)*7, (Math.random()-0.5)*3);
    b.userData = { vy:0.003+Math.random()*0.005, vx:(Math.random()-0.5)*0.003, pulse:Math.random()*0.04+0.02 };
    scene.add(b);
    bubbles.push(b);
  }

  // Mouse tilt
  let tx=0, ty=0;
  document.addEventListener('mousemove', e => {
    tx = (e.clientX/window.innerWidth - 0.5) * 0.4;
    ty = -(e.clientY/window.innerHeight - 0.5) * 0.2;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    g.rotation.y += (tx - 0.25 - g.rotation.y) * 0.06;
    g.rotation.x += (ty - g.rotation.x) * 0.06;
    drum.rotation.z += 0.025;
    key.intensity = 8 + Math.sin(t*2)*2;
    rim.intensity = 15 + Math.sin(t*1.5+1)*4;
    bubbles.forEach(b => {
      b.position.x += b.userData.vx;
      b.position.y += b.userData.vy;
      b.material.opacity = 0.1 + Math.abs(Math.sin(t * b.userData.pulse)) * 0.2;
      if(b.position.y > 5) { b.position.y = -5; b.position.x = (Math.random()-0.5)*7; }
    });
    renderer.render(scene, camera);
  }
  animate();
}

// ============================================================
// SERVICE ICON CANVASES
// ============================================================
function drawServiceIcons() {
  const icons = [
    { id:'svc1', draw:(ctx,w,h) => {
      ctx.clearRect(0,0,w,h);
      ctx.strokeStyle='#00f5d4'; ctx.lineWidth=2;
      ctx.fillStyle='rgba(0,245,212,0.1)';
      ctx.beginPath(); ctx.roundRect(10,10,w-20,h-20,8); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#00f5d4'; ctx.font=`${w*0.4}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('🏠', w/2, h/2);
    }},
    { id:'svc2', draw:(ctx,w,h) => {
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle='rgba(0,245,212,0.1)'; ctx.strokeStyle='#00f5d4'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(10,10,w-20,h-20,8); ctx.fill(); ctx.stroke();
      ctx.font=`${w*0.4}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('🍽️', w/2, h/2);
    }},
    { id:'svc3', draw:(ctx,w,h) => {
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle='rgba(212,168,75,0.1)'; ctx.strokeStyle='#d4a84b'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(10,10,w-20,h-20,8); ctx.fill(); ctx.stroke();
      ctx.font=`${w*0.4}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('💎', w/2, h/2);
    }},
    { id:'svc4', draw:(ctx,w,h) => {
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle='rgba(0,245,212,0.1)'; ctx.strokeStyle='#00f5d4'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(10,10,w-20,h-20,8); ctx.fill(); ctx.stroke();
      ctx.font=`${w*0.4}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('🪟', w/2, h/2);
    }},
  ];
  icons.forEach(({ id, draw }) => {
    const c = document.getElementById(id);
    if(c) draw(c.getContext('2d'), c.width, c.height);
  });
}

// ============================================================
// BACKGROUND PARTICLES
// ============================================================
function initBgParticles() {
  const canvas = document.getElementById('bgParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = Array.from({ length: 100 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 0.5 + Math.random() * 1.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    a: Math.random() * 0.4 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,212,${p.a})`;
      ctx.fill();
    });
    // Lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i+1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,245,212,${0.04*(1-d/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ============================================================
// SCROLL REVEALS
// ============================================================
function initScrollReveal() {
  const els = document.querySelectorAll('.service-card, .review-card, .step-header, .addon-card');
  els.forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-next, .btn-whatsapp, .btn-sum-book').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*0.12}px, ${y*0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ============================================================
// INIT ALL EVENTS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Cursor
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
  });
  function animRing() {
    rx += (parseFloat(cur.style.left||0) - rx) * 0.14;
    ry += (parseFloat(cur.style.top||0) - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a,button,.cloth-card,.service-card,.time-slot,.delivery-opt').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cur.classList.remove('expanded'));
  });

  // NAV scroll
  window.addEventListener('scroll', () => {
    document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 40);
  });

  // Parallax hero layers
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    document.querySelectorAll('.hero-layer').forEach((l, i) => {
      l.style.transform = `translateY(${sy * (0.1 + i*0.08)}px)`;
    });
  });

  // Service selection
  document.getElementById('serviceGrid').addEventListener('click', e => {
    const card = e.target.closest('.service-card');
    if (!card) return;
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.selectedService = card.dataset.service;
    document.getElementById('s1Next').disabled = false;
    document.getElementById('sumService').textContent = state.selectedService;
    rippleEffect(e);
  });

  // Step 1 next
  document.getElementById('s1Next').addEventListener('click', () => {
    if (state.selectedService) goStep(2);
  });

  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.selectedCategory = tab.dataset.cat;
      renderClothGrid(state.selectedCategory);
    });
  });

  // Addons
  document.querySelectorAll('.addon-toggle').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const card = this.closest('.addon-card');
      const name = card.dataset.addon;
      const price = parseInt(card.dataset.price);
      card.classList.toggle('active', this.checked);
      if (this.checked) {
        if (!state.addons.find(a => a.name === name)) state.addons.push({ name, price });
      } else {
        state.addons = state.addons.filter(a => a.name !== name);
      }
      updateSummary();
    });
  });

  // Pickup date min
  const today = new Date();
  const dd = String(today.getDate()).padStart(2,'0');
  const mm = String(today.getMonth()+1).padStart(2,'0');
  document.getElementById('pickupDate').min = `${today.getFullYear()}-${mm}-${dd}`;
  document.getElementById('pickupDate').addEventListener('change', function() {
    state.pickupDate = this.value;
    updateSummary();
  });

  // Time slots
  document.getElementById('timeSlots').addEventListener('click', e => {
    const slot = e.target.closest('.time-slot');
    if (!slot) return;
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
    state.pickupTime = slot.dataset.time;
    updateSummary();
    rippleEffect(e);
  });

  // Delivery options
  document.querySelectorAll('.delivery-opt').forEach(opt => {
    opt.addEventListener('click', function(e) {
      document.querySelectorAll('.delivery-opt').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      state.deliverySpeed = this.dataset.speed;
      state.deliveryExtra = parseInt(this.dataset.extra);
      updateSummary();
      rippleEffect(e);
    });
  });
  document.querySelector('.delivery-opt').classList.add('selected');

  // Click ripple
  document.addEventListener('click', e => rippleEffect(e));

  // Hamburger
  document.getElementById('navHamburger').addEventListener('click', function() {
    const links = document.querySelector('.nav-links');
    if (links.style.display === 'flex') {
      links.style.display = '';
    } else {
      links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;background:rgba(3,8,18,0.97);padding:24px;gap:20px;backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,245,212,0.2);z-index:499;';
    }
  });

  // Step items click
  document.querySelectorAll('.step-item').forEach(item => {
    item.addEventListener('click', () => {
      const s = parseInt(item.dataset.step);
      if (item.classList.contains('done')) goStep(s);
    });
  });

  // Init all
  initBgParticles();
  drawServiceIcons();
  renderClothGrid('daily');
  initScrollReveal();

  // Defer heavy 3D
  setTimeout(initHero3D, 300);
  setTimeout(initMagneticButtons, 500);

  // Initial summary
  updateSummary();
});
