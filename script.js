// ===== Dynamic Greeting =====
(function initGreeting() {
  const h = new Date().getHours();
  const greets = [
    { s:5,  e:12, icon:"🌅", text:"สวัสดีตอนเช้า!",    sub:"วันนี้อากาศดี เหมาะปลูกแตงร้านมาก" },
    { s:12, e:14, icon:"☀️", text:"สวัสดีตอนเที่ยง!", sub:"อย่าลืมรดน้ำแตงร้านช่วงเย็นด้วยนะครับ" },
    { s:14, e:18, icon:"🌤️", text:"สวัสดีตอนบ่าย!",  sub:"ช่วงบ่ายเย็นเหมาะสำหรับเก็บเกี่ยว" },
    { s:18, e:21, icon:"🌆", text:"สวัสดีตอนเย็น!",  sub:"เย็นนี้ลองทำเมนูแตงร้านสักจาน?" },
    { s:21, e:24, icon:"🌙", text:"สวัสดีตอนค่ำ!",   sub:"ขอบคุณที่แวะมาเยี่ยมชมครับ" },
    { s:0,  e:5,  icon:"🌙", text:"สวัสดียามดึก!",   sub:"ขอบคุณที่แวะมาครับ" },
  ];
  const g = greets.find(x => h >= x.s && h < x.e) || greets[0];
  const el = document.getElementById('heroGreeting');
  if (el) el.innerHTML = `${g.icon} <span>${g.text}</span> <small style="font-weight:400;opacity:.7;font-size:.9em">${g.sub}</small>`;
})();

// ===== Price Board =====
(function initPrices() {
  const grid = document.getElementById('priceGrid');
  const dateEl = document.getElementById('priceDate');
  if (!grid) return;

  // show today's date in Thai
  const today = new Date();
  if (dateEl) {
    dateEl.textContent = today.toLocaleDateString('th-TH', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });
  }

  // deterministic daily seed — prices change once a day, stable across refreshes
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  function lcg(base, offset) {
    return (((base * 1664525 + offset * 22695477) >>> 0) % 1000) / 1000;
  }

  const MARKETS = [
    { name:"ตลาดไท",         loc:"ปทุมธานี",     icon:"🏪", bw:9.0, br:16.5, vw:4, vr:5 },
    { name:"ตลาดสี่มุมเมือง", loc:"นนทบุรี",      icon:"🛒", bw:9.5, br:17.0, vw:3, vr:5 },
    { name:"ตลาดศรีเมือง",   loc:"นครราชสีมา",   icon:"🌾", bw:7.5, br:14.0, vw:4, vr:5 },
    { name:"ตลาดบางเขน",     loc:"กรุงเทพฯ",     icon:"🏙️", bw:10.0,br:18.0, vw:3, vr:4 },
    { name:"ตลาดเชียงใหม่",  loc:"เชียงใหม่",    icon:"🏔️", bw:7.0, br:13.0, vw:4, vr:5 },
    { name:"ตลาดหาดใหญ่",   loc:"สงขลา",        icon:"🌴", bw:8.0, br:15.0, vw:4, vr:5 },
  ];

  MARKETS.forEach((m, i) => {
    const todayW = m.bw + lcg(seed,     i * 13) * m.vw;
    const prevW  = m.bw + lcg(seed - 1, i * 13) * m.vw;
    const todayR = m.br + lcg(seed,     i * 17) * m.vr;
    const diff   = todayW - prevW;

    const trendClass = diff > 0.3 ? 'up' : diff < -0.3 ? 'down' : 'stable';
    const trendLabel = { up:'▲ ขึ้น', down:'▼ ลง', stable:'● คงที่' }[trendClass];
    const diffStr  = trendClass === 'stable' ? '' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`;
    const diffCls  = diff > 0 ? 'diff-up' : diff < 0 ? 'diff-down' : 'diff-flat';

    const card = document.createElement('div');
    card.className = 'price-card';
    card.innerHTML = `
      <div class="pc-market">
        <span class="pc-icon">${m.icon}</span>
        <div><strong>${m.name}</strong><small>${m.loc}</small></div>
      </div>
      <hr class="pc-divider">
      <div class="pc-prices">
        <div class="pc-row">
          <span class="pc-label">ราคาส่ง</span>
          <span class="pc-trend trend-${trendClass}">${trendLabel}</span>
        </div>
        <div class="pc-row" style="align-items:baseline;gap:6px">
          <span class="pc-val">${todayW.toFixed(1)}</span>
          <span style="font-size:.72rem;color:rgba(255,255,255,.5)">฿/กก.</span>
          ${diffStr ? `<span class="pc-diff ${diffCls}">(${diffStr})</span>` : ''}
        </div>
        <div class="pc-row" style="margin-top:4px">
          <span class="pc-label">ราคาปลีก</span>
          <span class="pc-val retail">${todayR.toFixed(1)} ฿</span>
        </div>
      </div>`;
    grid.appendChild(card);
  });
})();

// ===== Navbar shadow on scroll =====
const navbar = document.getElementById('navbar');
const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 10);
  toTop.classList.toggle('show', y > 500);
});

// ===== Mobile menu =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// close mobile menu when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== Back to top =====
toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');
    // close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-a').style.maxHeight = null;
    });
    // open clicked one if it was closed
    if (!isOpen) {
      item.classList.add('active');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll(
  '.fact-card, .vcard, .step, .rcard, .benefit, .nutri-table-wrap, .callout, .section-head, .dcard'
);
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // slight stagger for groups
      setTimeout(() => entry.target.classList.add('in'), (i % 4) * 70);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ===== Lazada Affiliate Link Enhancer =====
// เรียก /api/lazada เพื่อแปลง direct links เป็น affiliate links หลัง DOM render
async function enhanceLazadaLinks() {
  const btns = document.querySelectorAll('a.lazada-btn[href*="lazada.co.th"]');
  if (!btns.length) return;

  await Promise.all([...btns].map(async btn => {
    const originalUrl = btn.href;
    try {
      const res = await fetch(`/api/lazada?url=${encodeURIComponent(originalUrl)}`);
      if (!res.ok) return;
      const { affiliate_url, fallback } = await res.json();
      if (!fallback && affiliate_url) {
        btn.href = affiliate_url;
        btn.dataset.affiliate = 'true';
      }
    } catch {
      // ถ้า API ไม่พร้อม ใช้ URL เดิม
    }
  }));
}

// รอให้ seasonal section render เสร็จก่อนถึงค่อย enhance
setTimeout(enhanceLazadaLinks, 300);

// ===== Seasonal Disease Alert =====
(function initSeasonal() {
  const monthEl  = document.getElementById('seasonMonth');
  const cardsEl  = document.getElementById('seasonCards');
  const bannerEl = document.getElementById('seasonBanner');
  if (!cardsEl) return;

  const m = new Date().getMonth(); // 0-11
  const MONTH_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                    'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  if (monthEl) monthEl.textContent = MONTH_TH[m];

  /* --- สินค้า Lazada (ลิงก์ตรง — แปลงเป็น affiliate ผ่าน dashboard ก่อนใช้งาน) --- */
  const P = {
    mancozeb:      { name:'แมนโคเซบ 80% WP',            brand:'Mancozeb',         use:'ราน้ำค้าง · แอนแทรคโนส',              dose:'30–40 ก./น้ำ 20 ล. ทุก 7–10 วัน',      url:'https://www.lazada.co.th/products/80-mancozeb-80-wp-1-i2766570062.html' },
    metalaxyl:     { name:'เมทาแลกซิล 35% DS',           brand:'Metalaxyl',        use:'ราน้ำค้าง · รากเน่า Pythium',           dose:'ราดโคนต้น หรือผสมดินก่อนปลูก',         url:'https://www.lazada.co.th/products/metalaxyl-35-ds-1-i865108802.html' },
    carbendazim:   { name:'คาร์เบนดาซิม 50% SC',         brand:'Carbendazim',      use:'ราแป้ง · แอนแทรคโนส · โรคกิ่งแห้ง',    dose:'20–30 มล./น้ำ 20 ล. ทุก 7–14 วัน',     url:'https://www.lazada.co.th/products/carbendazim-50-sc-1-i317868844.html' },
    imidacloprid:  { name:'อิมิดาโคลพริด 70% WG',         brand:'Imidacloprid',     use:'เพลี้ยอ่อน · แมลงหวี่ขาว (พาหะไวรัส)', dose:'5–10 ก./น้ำ 20 ล. ทุก 7 วัน',          url:'https://www.lazada.co.th/products/imidacloprid-70wg-100-i2568060900.html' },
    copper:        { name:'ฟังกูราน คอปเปอร์ไฮดรอกไซด์', brand:'Copper Hydroxide', use:'โรคแบคทีเรีย · ใบจุดเหลี่ยม',           dose:'30–40 ก./น้ำ 20 ล. ทุก 7 วัน',          url:'https://www.lazada.co.th/products/1-copper-hydroxide-i727486994.html' },
    chlorothalonil:{ name:'คลอโรทาโลนิล 75%',            brand:'Chlorothalonil',   use:'ราน้ำค้าง · ใบจุด · แอนแทรคโนส',       dose:'30–40 ก./น้ำ 20 ล. ทุก 7 วัน',          url:'https://www.lazada.co.th/products/75-1-i392172203.html' },
  };

  /* --- ตารางโรคประจำเดือน --- */
  const SCHEDULE = [
    /* ม.ค. */ [{ name:'ราแป้ง',          risk:'high',   icon:'🍞', reason:'อากาศเย็นแห้ง อุณหภูมิ 20–25°C เอื้อต่อราแป้งสูงสุด',          prods:['carbendazim'] },
                { name:'ไวรัส CMV/ZYMV',  risk:'medium', icon:'🧬', reason:'เพลี้ยอ่อนเริ่มระบาดในช่วงอากาศแห้ง',                          prods:['imidacloprid'] }],
    /* ก.พ. */ [{ name:'ราแป้ง',          risk:'high',   icon:'🍞', reason:'อากาศยังเย็นแห้ง ราแป้งระบาดต่อเนื่อง',                        prods:['carbendazim'] },
                { name:'ไวรัส CMV',       risk:'medium', icon:'🧬', reason:'เพลี้ยอ่อนระบาดปานกลาง',                                        prods:['imidacloprid'] }],
    /* มี.ค. */ [{ name:'ราแป้ง',         risk:'high',   icon:'🍞', reason:'อากาศร้อนแห้ง ราแป้งยังสูง',                                     prods:['carbendazim'] },
                 { name:'ไวรัส CMV/ZYMV', risk:'high',   icon:'🧬', reason:'เพลี้ยอ่อนระบาดหนักสุดในฤดูแล้งร้อน ระวังไวรัสแพร่เร็ว',      prods:['imidacloprid'] }],
    /* เม.ย. */ [{ name:'ไวรัส ToLCNDV',  risk:'high',   icon:'🧬', reason:'แมลงหวี่ขาว+เพลี้ยระบาดสูงสุด ไวรัสใบงอเหลืองแพร่เร็ว',       prods:['imidacloprid'] },
                 { name:'ราแป้ง',         risk:'medium', icon:'🍞', reason:'อากาศยังร้อนชื้น ระวังราแป้งปลายฤดูแล้ง',                       prods:['carbendazim'] }],
    /* พ.ค. */ [{ name:'ราน้ำค้าง',       risk:'high',   icon:'💧', reason:'ฝนเริ่มตก ความชื้น >75% ราน้ำค้างระบาดแรง',                    prods:['mancozeb','metalaxyl'] },
                { name:'แอนแทรคโนส',     risk:'high',   icon:'🟤', reason:'ฝนพาสปอร์ไปติดใบและผล',                                         prods:['carbendazim','chlorothalonil'] }],
    /* มิ.ย. */ [{ name:'ราน้ำค้าง',      risk:'high',   icon:'💧', reason:'ฤดูฝนเต็มที่ ความชื้น >80% ราน้ำค้างรุนแรงที่สุดในปี',         prods:['mancozeb','metalaxyl'] },
                 { name:'แอนแทรคโนส',    risk:'high',   icon:'🟤', reason:'ฝนชุก สปอร์กระจายทั่วแปลง ระวังทั้งใบและผล',                   prods:['carbendazim','chlorothalonil'] },
                 { name:'รากเน่า Pythium',risk:'high',   icon:'🌱', reason:'น้ำขัง ดินชื้นจัด Pythium ระบาดรุนแรง',                          prods:['metalaxyl'] },
                 { name:'ใบจุดเหลี่ยม',  risk:'medium', icon:'🦠', reason:'ฝนตกสาดน้ำพาแบคทีเรียติดใบ',                                    prods:['copper'] }],
    /* ก.ค. */ [{ name:'ราน้ำค้าง',       risk:'high',   icon:'💧', reason:'ฝนหนักต่อเนื่อง ความชื้นสูงสุด',                                prods:['mancozeb','metalaxyl'] },
                { name:'แอนแทรคโนส',     risk:'high',   icon:'🟤', reason:'ฝนตลอด สปอร์ระบาดหนักมาก',                                      prods:['carbendazim'] },
                { name:'รากเน่า',         risk:'high',   icon:'🌱', reason:'ดินแฉะ น้ำขังนาน',                                              prods:['metalaxyl'] }],
    /* ส.ค. */ [{ name:'ราน้ำค้าง',       risk:'high',   icon:'💧', reason:'ฝนยังชุก ความชื้นสูง',                                           prods:['mancozeb'] },
                { name:'แอนแทรคโนส',     risk:'high',   icon:'🟤', reason:'กลางฤดูฝน สปอร์ระบาด',                                           prods:['carbendazim','chlorothalonil'] },
                { name:'รากเน่า',         risk:'high',   icon:'🌱', reason:'ดินชื้นสูง',                                                     prods:['metalaxyl'] }],
    /* ก.ย. */ [{ name:'ราน้ำค้าง',       risk:'high',   icon:'💧', reason:'ฤดูฝนยังต่อเนื่อง',                                              prods:['mancozeb','metalaxyl'] },
                { name:'รากเน่า',         risk:'medium', icon:'🌱', reason:'ดินยังชื้น เริ่มลดลง',                                           prods:['metalaxyl'] },
                { name:'ใบจุดเหลี่ยม',   risk:'medium', icon:'🦠', reason:'แบคทีเรียช่วงปลายฝน',                                           prods:['copper'] }],
    /* ต.ค. */ [{ name:'รากเน่า Pythium', risk:'high',   icon:'🌱', reason:'ฝนหนักสะสม ดินชื้นมาก',                                          prods:['metalaxyl'] },
                { name:'ราน้ำค้าง',      risk:'medium', icon:'💧', reason:'ความชื้นยังสูงปลายฤดูฝน',                                        prods:['mancozeb'] },
                { name:'ใบจุดเหลี่ยม',  risk:'medium', icon:'🦠', reason:'แบคทีเรียช่วงน้ำชื้น',                                           prods:['copper'] }],
    /* พ.ย. */ [{ name:'รากเน่า',         risk:'medium', icon:'🌱', reason:'ดินยังชื้นจากฝนก่อน',                                            prods:['metalaxyl'] },
                { name:'ราแป้ง',          risk:'medium', icon:'🍞', reason:'อากาศเริ่มเย็น ราแป้งเริ่มระบาด',                               prods:['carbendazim'] },
                { name:'ไวรัส CMV',       risk:'low',    icon:'🧬', reason:'เพลี้ยอ่อนเริ่มกลับมา แต่ยังน้อย',                              prods:['imidacloprid'] }],
    /* ธ.ค. */ [{ name:'ราแป้ง',          risk:'high',   icon:'🍞', reason:'อากาศเย็นแห้ง เหมาะสำหรับราแป้งสูงสุด',                        prods:['carbendazim'] },
                { name:'ไวรัส CMV',       risk:'medium', icon:'🧬', reason:'เพลี้ยอ่อนเริ่มระบาดอีกครั้งในฤดูหนาว',                        prods:['imidacloprid'] }],
  ];

  const SEASONS = [
    { months:[11,0,1], label:'ฤดูหนาว', icon:'❄️', bg:'#dbeafe', color:'#1e40af' },
    { months:[2,3,4],  label:'ฤดูร้อน', icon:'☀️', bg:'#ffedd5', color:'#c2410c' },
    { months:[5,6,7,8,9,10], label:'ฤดูฝน', icon:'🌧️', bg:'#dcfce7', color:'#15803d' },
  ];
  const season = SEASONS.find(s => s.months.includes(m)) || SEASONS[2];
  const diseases = SCHEDULE[m] || [];
  const highCount = diseases.filter(d => d.risk === 'high').length;

  if (bannerEl) {
    bannerEl.innerHTML = `
      <div class="season-tag" style="background:${season.bg};color:${season.color}">
        <span style="font-size:1.2rem">${season.icon} ${season.label} · ${MONTH_TH[m]}</span>
        <span>พบ <b>${highCount} โรค</b> ความเสี่ยงสูงในช่วงนี้</span>
      </div>`;
  }

  const RISK_LABEL = { high:'🔴 ความเสี่ยงสูง', medium:'🟡 ปานกลาง', low:'🟢 ต่ำ' };
  const RISK_CLASS = { high:'risk-high', medium:'risk-med', low:'risk-low' };

  diseases.forEach(d => {
    const prodsHTML = d.prods.map(pid => {
      const pr = P[pid]; if (!pr) return '';
      return `
        <div class="prod-item">
          <div class="prod-info">
            <strong>${pr.name}</strong>
            <span class="prod-brand">${pr.brand}</span>
            <span class="prod-use">ใช้สำหรับ: ${pr.use}</span>
            <span class="prod-dose">📋 ${pr.dose}</span>
          </div>
          <a href="${pr.url}" target="_blank" rel="noopener sponsored" class="lazada-btn">
            🛒 ซื้อบน Lazada
          </a>
        </div>`;
    }).join('');

    const card = document.createElement('div');
    card.className = `season-card ${RISK_CLASS[d.risk]}`;
    card.innerHTML = `
      <div class="sc-head">
        <div>
          <h3>${d.icon} ${d.name}</h3>
          <span class="risk-badge ${RISK_CLASS[d.risk]}">${RISK_LABEL[d.risk]}</span>
        </div>
      </div>
      <p class="sc-reason">⚡ ${d.reason}</p>
      <div class="sc-products">${prodsHTML}</div>`;
    cardsEl.appendChild(card);
  });
})();

// ===== Problem filter tabs =====
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('.pcard').forEach(c => {
      c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
    });
  });
});

// ===== Disease filter tabs =====
const tabs = document.querySelectorAll('.dtab');
const dcards = document.querySelectorAll('.dcard');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    dcards.forEach(card => {
      if (filter === 'all' || card.dataset.type === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== Thailand Map =====
(function initThaiMap() {
  const mapEl  = document.getElementById('thaiMap');
  const listEl = document.getElementById('marketList');
  if (!mapEl || !listEl) return;

  /* shared state — set after Leaflet init */
  let mapRef    = null;
  const markerMap = {};

  /* --- Province data (77 จังหวัด) --- */
  const PD = {
    "Bangkok":{"th":"กรุงเทพมหานคร","area":1569,"pop":10539000,"region":"กลาง"},
    "Samut Prakan":{"th":"สมุทรปราการ","area":1004,"pop":1344000,"region":"กลาง"},
    "Nonthaburi":{"th":"นนทบุรี","area":622,"pop":1592000,"region":"กลาง"},
    "Pathum Thani":{"th":"ปทุมธานี","area":1526,"pop":1202000,"region":"กลาง"},
    "Phra Nakhon Si Ayutthaya":{"th":"พระนครศรีอยุธยา","area":2557,"pop":832000,"region":"กลาง"},
    "Ang Thong":{"th":"อ่างทอง","area":968,"pop":289000,"region":"กลาง"},
    "Lop Buri":{"th":"ลพบุรี","area":6199,"pop":758000,"region":"กลาง"},
    "Sing Buri":{"th":"สิงห์บุรี","area":822,"pop":215000,"region":"กลาง"},
    "Chai Nat":{"th":"ชัยนาท","area":2470,"pop":335000,"region":"กลาง"},
    "Saraburi":{"th":"สระบุรี","area":3576,"pop":661000,"region":"กลาง"},
    "Nakhon Nayok":{"th":"นครนายก","area":2122,"pop":264000,"region":"กลาง"},
    "Suphan Buri":{"th":"สุพรรณบุรี","area":5358,"pop":849000,"region":"กลาง"},
    "Nakhon Pathom":{"th":"นครปฐม","area":2168,"pop":930000,"region":"กลาง"},
    "Samut Sakhon":{"th":"สมุทรสาคร","area":872,"pop":563000,"region":"กลาง"},
    "Samut Songkhram":{"th":"สมุทรสงคราม","area":416,"pop":192000,"region":"กลาง"},
    "Chon Buri":{"th":"ชลบุรี","area":4363,"pop":1542000,"region":"ตะวันออก"},
    "Rayong":{"th":"ระยอง","area":3552,"pop":718000,"region":"ตะวันออก"},
    "Chanthaburi":{"th":"จันทบุรี","area":6338,"pop":541000,"region":"ตะวันออก"},
    "Trat":{"th":"ตราด","area":2819,"pop":240000,"region":"ตะวันออก"},
    "Chachoengsao":{"th":"ฉะเชิงเทรา","area":5351,"pop":726000,"region":"ตะวันออก"},
    "Prachin Buri":{"th":"ปราจีนบุรี","area":4762,"pop":470000,"region":"ตะวันออก"},
    "Sa Kaeo":{"th":"สระแก้ว","area":7195,"pop":562000,"region":"ตะวันออก"},
    "Nakhon Ratchasima":{"th":"นครราชสีมา","area":20494,"pop":2665000,"region":"ตะวันออกเฉียงเหนือ"},
    "Buri Ram":{"th":"บุรีรัมย์","area":10322,"pop":1589000,"region":"ตะวันออกเฉียงเหนือ"},
    "Surin":{"th":"สุรินทร์","area":8124,"pop":1395000,"region":"ตะวันออกเฉียงเหนือ"},
    "Si Sa Ket":{"th":"ศรีสะเกษ","area":8840,"pop":1477000,"region":"ตะวันออกเฉียงเหนือ"},
    "Ubon Ratchathani":{"th":"อุบลราชธานี","area":15745,"pop":1870000,"region":"ตะวันออกเฉียงเหนือ"},
    "Yasothon":{"th":"ยโสธร","area":4162,"pop":545000,"region":"ตะวันออกเฉียงเหนือ"},
    "Chaiyaphum":{"th":"ชัยภูมิ","area":12778,"pop":1132000,"region":"ตะวันออกเฉียงเหนือ"},
    "Amnat Charoen":{"th":"อำนาจเจริญ","area":3161,"pop":376000,"region":"ตะวันออกเฉียงเหนือ"},
    "Bueng Kan":{"th":"บึงกาฬ","area":4305,"pop":411000,"region":"ตะวันออกเฉียงเหนือ"},
    "Nong Bua Lam Phu":{"th":"หนองบัวลำภู","area":3859,"pop":506000,"region":"ตะวันออกเฉียงเหนือ"},
    "Khon Kaen":{"th":"ขอนแก่น","area":10886,"pop":1786000,"region":"ตะวันออกเฉียงเหนือ"},
    "Udon Thani":{"th":"อุดรธานี","area":11730,"pop":1564000,"region":"ตะวันออกเฉียงเหนือ"},
    "Loei":{"th":"เลย","area":11425,"pop":643000,"region":"ตะวันออกเฉียงเหนือ"},
    "Nong Khai":{"th":"หนองคาย","area":3027,"pop":518000,"region":"ตะวันออกเฉียงเหนือ"},
    "Maha Sarakham":{"th":"มหาสารคาม","area":5292,"pop":948000,"region":"ตะวันออกเฉียงเหนือ"},
    "Roi Et":{"th":"ร้อยเอ็ด","area":8299,"pop":1297000,"region":"ตะวันออกเฉียงเหนือ"},
    "Kalasin":{"th":"กาฬสินธุ์","area":6947,"pop":986000,"region":"ตะวันออกเฉียงเหนือ"},
    "Sakon Nakhon":{"th":"สกลนคร","area":9606,"pop":1128000,"region":"ตะวันออกเฉียงเหนือ"},
    "Nakhon Phanom":{"th":"นครพนม","area":5513,"pop":712000,"region":"ตะวันออกเฉียงเหนือ"},
    "Mukdahan":{"th":"มุกดาหาร","area":4340,"pop":358000,"region":"ตะวันออกเฉียงเหนือ"},
    "Chiang Mai":{"th":"เชียงใหม่","area":20107,"pop":1835000,"region":"เหนือ"},
    "Lamphun":{"th":"ลำพูน","area":4507,"pop":408000,"region":"เหนือ"},
    "Lampang":{"th":"ลำปาง","area":12534,"pop":762000,"region":"เหนือ"},
    "Uttaradit":{"th":"อุตรดิตถ์","area":7839,"pop":464000,"region":"เหนือ"},
    "Phrae":{"th":"แพร่","area":6538,"pop":471000,"region":"เหนือ"},
    "Nan":{"th":"น่าน","area":11472,"pop":484000,"region":"เหนือ"},
    "Phayao":{"th":"พะเยา","area":6335,"pop":486000,"region":"เหนือ"},
    "Chiang Rai":{"th":"เชียงราย","area":11678,"pop":1278000,"region":"เหนือ"},
    "Mae Hong Son":{"th":"แม่ฮ่องสอน","area":12681,"pop":280000,"region":"เหนือ"},
    "Nakhon Sawan":{"th":"นครสวรรค์","area":9598,"pop":1120000,"region":"เหนือ"},
    "Uthai Thani":{"th":"อุทัยธานี","area":6730,"pop":337000,"region":"เหนือ"},
    "Kamphaeng Phet":{"th":"กำแพงเพชร","area":8607,"pop":731000,"region":"เหนือ"},
    "Sukhothai":{"th":"สุโขทัย","area":6596,"pop":608000,"region":"เหนือ"},
    "Phitsanulok":{"th":"พิษณุโลก","area":10816,"pop":863000,"region":"เหนือ"},
    "Phichit":{"th":"พิจิตร","area":4531,"pop":526000,"region":"เหนือ"},
    "Phetchabun":{"th":"เพชรบูรณ์","area":12668,"pop":1025000,"region":"เหนือ"},
    "Tak":{"th":"ตาก","area":16406,"pop":538000,"region":"ตะวันตก"},
    "Ratchaburi":{"th":"ราชบุรี","area":5196,"pop":882000,"region":"ตะวันตก"},
    "Kanchanaburi":{"th":"กาญจนบุรี","area":19483,"pop":893000,"region":"ตะวันตก"},
    "Phetchaburi":{"th":"เพชรบุรี","area":6225,"pop":491000,"region":"ตะวันตก"},
    "Prachuap Khiri Khan":{"th":"ประจวบคีรีขันธ์","area":6368,"pop":551000,"region":"ตะวันตก"},
    "Nakhon Si Thammarat":{"th":"นครศรีธรรมราช","area":9942,"pop":1556000,"region":"ใต้"},
    "Krabi":{"th":"กระบี่","area":4708,"pop":472000,"region":"ใต้"},
    "Phang Nga":{"th":"พังงา","area":4170,"pop":261000,"region":"ใต้"},
    "Phuket":{"th":"ภูเก็ต","area":576,"pop":418000,"region":"ใต้"},
    "Surat Thani":{"th":"สุราษฎร์ธานี","area":12891,"pop":1065000,"region":"ใต้"},
    "Ranong":{"th":"ระนอง","area":3298,"pop":186000,"region":"ใต้"},
    "Chumphon":{"th":"ชุมพร","area":6009,"pop":521000,"region":"ใต้"},
    "Songkhla":{"th":"สงขลา","area":7394,"pop":1436000,"region":"ใต้"},
    "Satun":{"th":"สตูล","area":2479,"pop":324000,"region":"ใต้"},
    "Trang":{"th":"ตรัง","area":4941,"pop":625000,"region":"ใต้"},
    "Phatthalung":{"th":"พัทลุง","area":3424,"pop":524000,"region":"ใต้"},
    "Pattani":{"th":"ปัตตานี","area":1940,"pop":750000,"region":"ใต้"},
    "Yala":{"th":"ยะลา","area":4521,"pop":523000,"region":"ใต้"},
    "Narathiwat":{"th":"นราธิวาส","area":4475,"pop":827000,"region":"ใต้"}
  };

  /* aliases ที่ GeoJSON อาจใช้ชื่อต่างออกไป */
  const ALIAS = {
    "Krung Thep Maha Nakhon":"Bangkok","Bangkok Metropolis":"Bangkok",
    "Lopburi":"Lop Buri","Prachinburi":"Prachin Buri",
    "Phang-nga":"Phang Nga","Phangnga":"Phang Nga",
    "Samut Songkram":"Samut Songkhram","Nakhon Ratchasima":"Nakhon Ratchasima",
    "Buriram":"Buri Ram","Sisaket":"Si Sa Ket","Ubon Ratchathani":"Ubon Ratchathani",
    "Nong Bualamphu":"Nong Bua Lam Phu","Khon Kaen":"Khon Kaen",
    "Mahasarakham":"Maha Sarakham","Roi-Et":"Roi Et",
    "Sakonnakhon":"Sakon Nakhon","Nakonphanom":"Nakhon Phanom",
    "Chiangmai":"Chiang Mai","Chiangrai":"Chiang Rai",
    "Maehongson":"Mae Hong Son","Nakornsawan":"Nakhon Sawan",
    "Kamphaengphet":"Kamphaeng Phet","Phitsanulok":"Phitsanulok",
    "Phetchaboon":"Phetchabun","Kanchanaburi":"Kanchanaburi",
    "Petchaburi":"Phetchaburi","Prachuap Khiri Khan":"Prachuap Khiri Khan",
    "Nakorn Si Thammarat":"Nakhon Si Thammarat","Suratthani":"Surat Thani",
    "Songkla":"Songkhla","Phattalung":"Phatthalung"
  };

  function getPD(name) { return PD[name] || PD[ALIAS[name]] || null; }

  const regionColor = {
    "เหนือ":"#10b981","กลาง":"#3b82f6","ตะวันออก":"#8b5cf6",
    "ตะวันออกเฉียงเหนือ":"#f59e0b","ตะวันตก":"#ec4899","ใต้":"#ef4444"
  };

  /* --- Market data --- */
  const MARKETS = [
    { id:1,  name:"ตลาดไท",                    region:"กลาง",                   lat:14.064, lon:100.684, province:"ปทุมธานี",      type:"ค้าส่งผักผลไม้", area:"380 ไร่",  time:"24 ชั่วโมง",      detail:"ตลาดค้าส่งสินค้าเกษตรที่ใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้ รองรับสินค้ากว่า 10,000 ตัน/วัน ผู้ค้ากว่า 3,000 ราย" },
    { id:2,  name:"ตลาดสี่มุมเมือง",            region:"กลาง",                   lat:13.856, lon:100.530, province:"นนทบุรี",       type:"ค้าส่งผักผลไม้", area:"200 ไร่",  time:"02:00–08:00 น.",  detail:"ตลาดค้าส่งขนาดใหญ่ฝั่งตะวันตกของกรุงเทพ รองรับพ่อค้าแม่ค้ารายย่อยทั่วปริมณฑล" },
    { id:3,  name:"ตลาดสินค้าเกษตรเชียงใหม่",  region:"เหนือ",                  lat:18.788, lon:98.986,  province:"เชียงใหม่",    type:"ค้าส่งผักผลไม้", area:"120 ไร่",  time:"01:00–07:00 น.",  detail:"ศูนย์กระจายสินค้าเกษตรภาคเหนือ รวบรวมผักจากเชียงใหม่ เชียงราย ลำปาง และแม่ฮ่องสอน" },
    { id:4,  name:"ตลาดสินค้าเกษตรเชียงราย",   region:"เหนือ",                  lat:19.907, lon:99.833,  province:"เชียงราย",     type:"ค้าส่งผักผลไม้", area:"60 ไร่",   time:"02:00–08:00 น.",  detail:"ตลาดกลางภาคเหนือตอนบน รับสินค้าเกษตรจากเชียงราย พะเยา น่าน และชายแดน" },
    { id:5,  name:"ตลาดสินค้าเกษตรพิษณุโลก",   region:"เหนือ",                  lat:16.825, lon:100.264, province:"พิษณุโลก",     type:"ค้าส่งผักผลไม้", area:"55 ไร่",   time:"02:00–08:00 น.",  detail:"ตลาดกลางภาคเหนือตอนล่าง รองรับสินค้าจากพิษณุโลก เพชรบูรณ์ พิจิตร สุโขทัย" },
    { id:6,  name:"ตลาดกลาง นครราชสีมา",        region:"ตะวันออกเฉียงเหนือ",    lat:14.979, lon:102.098, province:"นครราชสีมา",   type:"ค้าส่งผักผลไม้", area:"100 ไร่",  time:"22:00–06:00 น.",  detail:"ศูนย์กระจายสินค้าเกษตรอีสานใต้ รองรับผักจากโคราช บุรีรัมย์ สุรินทร์ และชัยภูมิ" },
    { id:7,  name:"ตลาดกลาง ขอนแก่น",           region:"ตะวันออกเฉียงเหนือ",    lat:16.432, lon:102.834, province:"ขอนแก่น",      type:"ค้าส่งผักผลไม้", area:"90 ไร่",   time:"01:00–07:00 น.",  detail:"ตลาดกลางอีสานกลาง ครอบคลุมขอนแก่น มหาสารคาม กาฬสินธุ์ และร้อยเอ็ด" },
    { id:8,  name:"ตลาดกลาง อุดรธานี",          region:"ตะวันออกเฉียงเหนือ",    lat:17.417, lon:102.788, province:"อุดรธานี",      type:"ค้าส่งผักผลไม้", area:"80 ไร่",   time:"02:00–08:00 น.",  detail:"ศูนย์กระจายสินค้าเกษตรอีสานเหนือ ครอบคลุมอุดร หนองคาย เลย หนองบัวลำภู" },
    { id:9,  name:"ตลาดสินค้าเกษตร นครปฐม",     region:"ตะวันตก",               lat:13.819, lon:100.047, province:"นครปฐม",       type:"ค้าส่งผักผลไม้", area:"70 ไร่",   time:"02:00–07:00 น.",  detail:"ตลาดกลางฝั่งตะวันตก รับสินค้าจากนครปฐม ราชบุรี สุพรรณบุรี และกาญจนบุรี" },
    { id:10, name:"ตลาดกลาง ชลบุรี",            region:"ตะวันออก",              lat:13.366, lon:100.987, province:"ชลบุรี",        type:"ค้าส่ง-ปลีก",    area:"50 ไร่",   time:"04:00–10:00 น.",  detail:"ตลาดผักผลไม้ภาคตะวันออก รองรับพื้นที่ชลบุรี ระยอง จันทบุรี และตราด" },
    { id:11, name:"ตลาดกลาง สุราษฎร์ธานี",      region:"ใต้",                   lat:9.138,  lon:99.327,  province:"สุราษฎร์ธานี", type:"ค้าส่งผักผลไม้", area:"60 ไร่",   time:"02:00–08:00 น.",  detail:"ศูนย์กระจายสินค้าเกษตรภาคใต้ตอนบน ครอบคลุมสุราษฎร์ ชุมพร และนครศรีธรรมราช" },
    { id:12, name:"ตลาดกลาง หาดใหญ่",           region:"ใต้",                   lat:7.007,  lon:100.477, province:"สงขลา",        type:"ค้าส่งผักผลไม้", area:"80 ไร่",   time:"01:00–07:00 น.",  detail:"ตลาดผักผลไม้ใหญ่ที่สุดในภาคใต้ตอนล่าง รองรับสงขลา ปัตตานี ยะลา นราธิวาส" }
  ];
  const regionEmoji = { "เหนือ":"🏔️","กลาง":"🌾","ตะวันออก":"🌊","ตะวันออกเฉียงเหนือ":"🌻","ตะวันตก":"🌲","ใต้":"🌴" };

  // ── STEP 1: Sidebar cards (ไม่ขึ้นกับ Leaflet) ──
  MARKETS.forEach(m => {
    const card = document.createElement('div');
    card.className = 'market-item';
    card.dataset.region = m.region;
    card.id = `mcard-${m.id}`;
    card.innerHTML = `
      <div class="mi-icon">${regionEmoji[m.region]}</div>
      <div class="mi-body">
        <strong>${m.name}</strong>
        <div class="mi-meta">
          <span class="mi-region reg-${m.region}">${m.region}</span>${m.province} · ${m.time}
        </div>
      </div>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.market-item').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (mapRef) {
        mapRef.flyTo([m.lat, m.lon], 10, { duration: 0.9 });
        setTimeout(() => markerMap[m.id]?.openPopup(), 950);
      }
    });
    listEl.appendChild(card);
  });

  // ── STEP 2: Region filter tabs (ไม่ขึ้นกับ Leaflet) ──
  document.querySelectorAll('.rtab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.rtab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const r = btn.dataset.region;
      document.querySelectorAll('.market-item').forEach(c => {
        c.classList.toggle('hidden', r !== 'all' && c.dataset.region !== r);
      });
      if (mapRef) {
        if (r !== 'all') {
          const first = MARKETS.find(m => m.region === r);
          if (first) mapRef.flyTo([first.lat, first.lon], 8, { duration: 0.8 });
        } else {
          mapRef.flyTo([13.0, 101.5], 6, { duration: 0.8 });
        }
      }
    });
  });

  // ── STEP 3: Leaflet map (graceful degradation) ──
  if (typeof L === 'undefined') {
    mapEl.innerHTML = `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:linear-gradient(135deg,#dcfce7,#bbf7d0);border-radius:18px;font-family:Kanit;color:#374151;text-align:center;padding:20px"><span style="font-size:3rem">🗺️</span><p style="font-weight:600">โหลด Leaflet ไม่สำเร็จ</p><small style="color:#6b7280">กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</small></div>`;
    return;
  }

  // Loading indicator inside map container
  mapEl.insertAdjacentHTML('afterbegin',
    '<div id="mapLoader" style="position:absolute;inset:0;z-index:500;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:linear-gradient(135deg,#dcfce7,#f0fdf4);border-radius:18px;font-family:Kanit;color:#374151"><div style="width:40px;height:40px;border-radius:50%;border:4px solid #bbf7d0;border-top-color:#16a34a;animation:spin 0.8s linear infinite"></div><span style="font-weight:500">กำลังโหลดแผนที่...</span></div>');

  const map = L.map(mapEl, { center: [13.0, 101.5], zoom: 6, maxZoom: 11, minZoom: 5 });
  mapRef = map;

  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    opacity: 0.7
  }).addTo(map);

  const removeLoader = () => document.getElementById('mapLoader')?.remove();
  tiles.once('tileload', removeLoader);
  setTimeout(removeLoader, 10000); // fallback

  // InvalidateSize เมื่อ section เลื่อนเข้ามา
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) map.invalidateSize({ animate: false });
  }, { threshold: 0.05 }).observe(mapEl);

  // ── Province GeoJSON ──
  let geojsonLayer = null;
  fetch('https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json')
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(data => {
      geojsonLayer = L.geoJSON(data, {
        style: f => {
          const p = getPD(f.properties.Province);
          return { color:'#fff', weight:0.8,
            fillColor: p ? regionColor[p.region] || '#22c55e' : '#22c55e',
            fillOpacity: 0.38 };
        },
        onEachFeature: (f, layer) => {
          const p = getPD(f.properties.Province);
          if (!p) return;
          layer.bindTooltip(`
            <div style="font-family:'Kanit',sans-serif;min-width:190px;line-height:1.7">
              <strong style="font-size:14px;color:#14532d">${p.th}</strong>
              <div style="font-size:11px;color:#6b7280">${f.properties.Province}</div>
              <hr style="border:0;border-top:1px solid #e5e7eb;margin:6px 0">
              <span style="font-size:12px">
                📐 พื้นที่ <b>${p.area.toLocaleString()}</b> ตร.กม.<br>
                👥 ประชากร <b>${p.pop.toLocaleString()}</b> คน<br>
                🗺️ ภาค <b>${p.region}</b>
              </span>
            </div>`, { sticky:true, opacity:1 });
          layer.on({
            mouseover: e => { e.target.setStyle({ fillOpacity:0.75, weight:2, color:'#14532d' }); e.target.bringToFront(); },
            mouseout:  e => { geojsonLayer.resetStyle(e.target); }
          });
        }
      }).addTo(map);
    })
    .catch(() => {}); // provinces optional — markers still work

  // ── Market markers ──
  MARKETS.forEach(m => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#15803d);border:3px solid #fff;box-shadow:0 4px 12px rgba(21,128,61,.45);display:flex;align-items:center;justify-content:center;font-size:14px">🏪</div>`,
      iconSize:[32,32], iconAnchor:[16,16]
    });
    const popup = `
      <div style="font-family:'Kanit',sans-serif;min-width:240px;line-height:1.65">
        <div style="font-size:15px;font-weight:700;color:#14532d">${m.name}</div>
        <div style="font-size:12px;color:#16a34a;font-weight:600;margin:2px 0 8px">${regionEmoji[m.region]} ภาค${m.region} · ${m.province}</div>
        <hr style="border:0;border-top:1px solid #e5e7eb;margin:0 0 8px">
        <div style="font-size:12px;color:#374151">
          🏪 <b>${m.type}</b><br>📐 พื้นที่ <b>${m.area}</b><br>⏰ เวลา <b>${m.time}</b>
        </div>
        <div style="margin-top:8px;padding:8px 10px;background:#f0fdf4;border-radius:8px;font-size:11.5px;color:#374151;line-height:1.6">${m.detail}</div>
      </div>`;
    const mk = L.marker([m.lat, m.lon], { icon }).bindPopup(popup, { maxWidth:280 }).addTo(map);
    markerMap[m.id] = mk;
  });
})();

// ===== Active nav link highlight =====
const sections = document.querySelectorAll('section[id]');
const linkMap = {};
document.querySelectorAll('.nav-links a').forEach(a => {
  linkMap[a.getAttribute('href').slice(1)] = a;
});

const navIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Object.values(linkMap).forEach(a => a.style.color = '');
      const active = linkMap[entry.target.id];
      if (active) active.style.color = 'var(--green-700)';
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => navIO.observe(s));
