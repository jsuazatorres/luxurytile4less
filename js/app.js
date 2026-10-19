/**
 * LUXURY TILE 4 LESS - CLIENT ENGINE & BILINGUAL CMS MANAGER
 */

const STORAGE_KEYS = {
  CONFIG: 'lt4l_site_config',
  PRODUCTS: 'lt4l_products',
  SERVICES: 'lt4l_services',
  GALLERY: 'lt4l_gallery',
  LANG: 'lt4l_language_pref',
  AUTH: 'lt4l_admin_authenticated'
};

// Application State
let appState = {
  config: null,
  products: [],
  services: [],
  gallery: [],
  currentLang: 'en',
  currentCategory: 'all',
  currentFinish: 'all',
  searchQuery: '',
  editingProductId: null,
  isAdmin: false
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  bindEvents();
  renderApp();
});

/**
 * Load data & language preference
 */
function loadData() {
  const storedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
  const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
  const storedGallery = localStorage.getItem(STORAGE_KEYS.GALLERY);
  const storedLang = localStorage.getItem(STORAGE_KEYS.LANG);

  appState.config = storedConfig ? JSON.parse(storedConfig) : { ...DEFAULT_SITE_CONFIG };
  appState.products = storedProducts ? JSON.parse(storedProducts) : [ ...DEFAULT_PRODUCTS ];
  appState.services = storedServices ? JSON.parse(storedServices) : [ ...DEFAULT_SERVICES ];
  appState.gallery = storedGallery ? JSON.parse(storedGallery) : [ ...DEFAULT_GALLERY ];
  appState.currentLang = storedLang || 'en';

  if (!storedConfig) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(appState.config));
  if (!storedProducts) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(appState.products));
  if (!storedServices) localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(appState.services));
  if (!storedGallery) localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(appState.gallery));
  if (!storedLang) localStorage.setItem(STORAGE_KEYS.LANG, appState.currentLang);
}

function persistState() {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(appState.config));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(appState.products));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(appState.services));
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(appState.gallery));
  localStorage.setItem(STORAGE_KEYS.LANG, appState.currentLang);
}

/**
 * Helper to get translation key
 */
function t(key) {
  const lang = appState.currentLang;
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
    return TRANSLATIONS[lang][key];
  }
  // Fallback to English
  return TRANSLATIONS.en[key] || key;
}

/**
 * Switch language function
 */
window.switchLanguage = function(lang) {
  if (lang !== 'en' && lang !== 'es') return;
  appState.currentLang = lang;
  localStorage.setItem(STORAGE_KEYS.LANG, lang);

  // Update switcher button active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  renderApp();
  showToast(lang === 'es' ? 'Idioma cambiado a Español 🇪🇸' : 'Language switched to English 🇺🇸', 'info');
};

/**
 * Bind DOM events
 */
function bindEvents() {
  // Language button clicks
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });

  // Search input
  const searchInput = document.getElementById('productSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Finish filter
  const finishFilter = document.getElementById('finishFilterSelect');
  if (finishFilter) {
    finishFilter.addEventListener('change', (e) => {
      appState.currentFinish = e.target.value;
      renderProducts();
    });
  }

  // Category filter pills
  const categoryPillsContainer = document.getElementById('categoryPills');
  if (categoryPillsContainer) {
    categoryPillsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('cat-pill')) {
        categoryPillsContainer.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        appState.currentCategory = e.target.dataset.category;
        renderProducts();
      }
    });
  }

  // Tile Calculator
  const calcWidth = document.getElementById('calcWidth');
  const calcLength = document.getElementById('calcLength');
  const calcWaste = document.getElementById('calcWaste');
  if (calcWidth && calcLength) {
    const runCalc = () => {
      const w = parseFloat(calcWidth.value) || 0;
      const l = parseFloat(calcLength.value) || 0;
      const wastePercent = parseFloat(calcWaste ? calcWaste.value : 10) / 100;
      
      const netSqft = w * l;
      const totalSqft = Math.ceil(netSqft * (1 + wastePercent));
      
      const resultEl = document.getElementById('calcResultSqft');
      const netEl = document.getElementById('calcResultNet');
      if (resultEl) resultEl.textContent = totalSqft;
      if (netEl) {
        const template = t('calcBaseAreaText');
        netEl.textContent = template.replace('{net}', netSqft.toFixed(1)).replace('{waste}', (wastePercent * 100));
      }
    };

    calcWidth.addEventListener('input', runCalc);
    calcLength.addEventListener('input', runCalc);
    if (calcWaste) calcWaste.addEventListener('change', runCalc);
  }

  // Contact Form
  const contactForm = document.getElementById('contactLeadForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const phone = document.getElementById('contactPhone').value;
      const interest = document.getElementById('contactInterest').value;
      const message = document.getElementById('contactMessage').value;

      const isEs = appState.currentLang === 'es';
      const text = isEs
        ? `Hola Luxury Tile 4 Less! Mi nombre es ${name} (${phone}). Me interesa: ${interest}. Mensaje: ${message}`
        : `Hi Luxury Tile 4 Less! My name is ${name} (${phone}). I am interested in: ${interest}. Notes: ${message}`;
        
      const waUrl = `https://wa.me/${appState.config.whatsappPhone}?text=${encodeURIComponent(text)}`;
      
      showToast(isEs ? '¡Gracias! Redirigiendo a WhatsApp...' : 'Thank you! Redirecting to WhatsApp...', 'success');
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);
      contactForm.reset();
    });
  }

  // Admin trigger & modals
  const adminBtn = document.getElementById('openAdminBtn');
  const footerAdminBtn = document.getElementById('footerAdminBtn');
  if (adminBtn) adminBtn.addEventListener('click', openAdminModal);
  if (footerAdminBtn) footerAdminBtn.addEventListener('click', openAdminModal);

  // Close modals
  document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.classList.contains('modal-close-btn')) {
        closeAllModals();
      }
    });
  });

  // Admin tabs
  const adminTabs = document.getElementById('adminTabs');
  if (adminTabs) {
    adminTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('admin-tab-btn')) {
        adminTabs.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const targetTab = e.target.dataset.tab;
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        const activeContent = document.getElementById(targetTab);
        if (activeContent) activeContent.classList.add('active');
      }
    });
  }

  // Product Image upload in Admin
  const productImageFileInput = document.getElementById('productImageFile');
  const productImagePreview = document.getElementById('productImagePreview');
  const productImageUrlInput = document.getElementById('productImageUrl');

  if (productImageFileInput) {
    productImageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (productImageUrlInput) productImageUrlInput.value = event.target.result;
          if (productImagePreview) {
            productImagePreview.src = event.target.result;
            productImagePreview.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (productImageUrlInput) {
    productImageUrlInput.addEventListener('input', (e) => {
      if (productImagePreview && e.target.value) {
        productImagePreview.src = e.target.value;
        productImagePreview.style.display = 'block';
      }
    });
  }

  // Save Product Form in Admin
  const productForm = document.getElementById('adminProductForm');
  if (productForm) {
    productForm.addEventListener('submit', handleSaveProduct);
  }

  // Save Settings Form in Admin
  const settingsForm = document.getElementById('adminSettingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', handleSaveSettings);
  }

  // Export / Import / Reset buttons
  const exportBtn = document.getElementById('adminExportBtn');
  const importFileInput = document.getElementById('adminImportFile');
  const resetBtn = document.getElementById('adminResetBtn');

  if (exportBtn) exportBtn.addEventListener('click', handleExportData);
  if (importFileInput) importFileInput.addEventListener('change', handleImportData);
  if (resetBtn) resetBtn.addEventListener('click', handleResetData);
}

/**
 * Render complete application UI
 */
function renderApp() {
  applyTranslations();
  renderConfig();
  renderProducts();
  renderServices();
  renderGallery();
}

/**
 * Apply translations to DOM elements
 */
function applyTranslations() {
  const isEs = appState.currentLang === 'es';

  // Update active state in language selector
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === appState.currentLang);
  });

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.innerHTML = val;
      }
    }
  });
}

/**
 * Render dynamic config info
 */
function renderConfig() {
  const cfg = appState.config;
  const isEs = appState.currentLang === 'es';
  if (!cfg) return;

  // Title
  document.title = `${cfg.businessName} - ${cfg.tagline}`;
  
  // Announcement
  const banner = document.getElementById('announcementBannerText');
  if (banner) banner.textContent = isEs ? (cfg.bannerAnnouncementEs || t('topAnnouncement')) : (cfg.bannerAnnouncement || t('topAnnouncement'));

  // Contacts
  const phoneEls = document.querySelectorAll('.bind-phone');
  phoneEls.forEach(el => {
    el.textContent = cfg.phoneDisplay || cfg.phone;
    el.href = `tel:${cfg.phone.replace(/[^0-9]/g, '')}`;
  });

  const waLinks = document.querySelectorAll('.bind-whatsapp-link');
  const defaultWaText = isEs 
    ? 'Hola Luxury Tile 4 Less! Quisiera consultar sobre sus baldosas y servicios.'
    : 'Hello Luxury Tile 4 Less! I would like to inquire about your tiles and services.';
  waLinks.forEach(el => {
    el.href = `https://wa.me/${cfg.whatsappPhone}?text=${encodeURIComponent(defaultWaText)}`;
  });

  const emailEls = document.querySelectorAll('.bind-email');
  emailEls.forEach(el => {
    el.textContent = cfg.email;
    el.href = `mailto:${cfg.email}`;
  });

  const addressEls = document.querySelectorAll('.bind-address');
  addressEls.forEach(el => {
    el.textContent = cfg.address;
  });

  const mapsLinks = document.querySelectorAll('.bind-maps-link');
  mapsLinks.forEach(el => { el.href = cfg.googleMapsUrl; });

  const fbLinks = document.querySelectorAll('.bind-facebook-link');
  fbLinks.forEach(el => { el.href = cfg.facebookUrl; });

  const igLinks = document.querySelectorAll('.bind-instagram-link');
  igLinks.forEach(el => { el.href = cfg.instagramUrl; });

  // Hours
  const hoursWeekdayEl = document.getElementById('hoursWeekday');
  if (hoursWeekdayEl) hoursWeekdayEl.textContent = isEs ? cfg.hoursWeekdayEs : cfg.hoursWeekday;
  const hoursSaturdayEl = document.getElementById('hoursSaturday');
  if (hoursSaturdayEl) hoursSaturdayEl.textContent = isEs ? cfg.hoursSaturdayEs : cfg.hoursSaturday;
  const hoursSundayEl = document.getElementById('hoursSunday');
  if (hoursSundayEl) hoursSundayEl.textContent = isEs ? cfg.hoursSundayEs : cfg.hoursSunday;
}

/**
 * Render products in catalog with bilingual support
 */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const isEs = appState.currentLang === 'es';

  // Filter products
  const filtered = appState.products.filter(item => {
    const matchesCategory = (appState.currentCategory === 'all') || (item.category === appState.currentCategory);
    const matchesFinish = (appState.currentFinish === 'all') || (item.finish === appState.currentFinish);
    const nameToSearch = (isEs && item.nameEs ? item.nameEs : item.name).toLowerCase();
    const descToSearch = (isEs && item.descriptionEs ? item.descriptionEs : item.description).toLowerCase();
    const matchesQuery = !appState.searchQuery || 
      nameToSearch.includes(appState.searchQuery) ||
      item.size.toLowerCase().includes(appState.searchQuery) ||
      descToSearch.includes(appState.searchQuery);

    return matchesCategory && matchesFinish && matchesQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #FFFFFF; border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
        <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 0.5rem;">
          ${isEs ? 'No se encontraron baldosas' : 'No matching tiles found'}
        </h3>
        <p style="color: var(--color-text-muted); margin-bottom: 1.25rem;">
          ${isEs ? 'Intenta ajustando tus términos de búsqueda o filtros.' : 'Try adjusting your search terms or filters.'}
        </p>
        <button class="btn btn-outline-dark btn-sm" onclick="resetFilters()">
          ${isEs ? 'Limpiar Filtros' : 'Clear All Filters'}
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(prod => {
    const displayName = isEs && prod.nameEs ? prod.nameEs : prod.name;
    const displayDesc = isEs && prod.descriptionEs ? prod.descriptionEs : prod.description;
    const displayBadge = isEs && prod.badgeEs ? prod.badgeEs : prod.badge;

    const waText = isEs
      ? encodeURIComponent(`Hola Luxury Tile 4 Less! Me interesa cotizar: ${displayName} (${prod.size}, acabado ${prod.finish}).`)
      : encodeURIComponent(`Hi Luxury Tile 4 Less! I am interested in quoting: ${displayName} (${prod.size}, ${prod.finish}).`);
    const waUrl = `https://wa.me/${appState.config.whatsappPhone}?text=${waText}`;

    return `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-media" onclick="openProductDetail('${prod.id}')">
          <img src="${prod.image}" alt="${displayName}" loading="lazy" onerror="this.src='assets/product-calacatta.jpg'">
          ${displayBadge ? `<span class="product-badge">${displayBadge}</span>` : ''}
          <span class="product-finish-pill">${prod.finish}</span>
        </div>
        <div class="product-content">
          <div class="product-specs">
            <span>📐 ${prod.size}</span>
            ${prod.thickness ? `<span>• ${prod.thickness}</span>` : ''}
          </div>
          <h3 class="product-name" onclick="openProductDetail('${prod.id}')" style="cursor: pointer;">${displayName}</h3>
          <p class="product-desc">${displayDesc}</p>
          <div class="product-footer">
            <div class="product-price-block">
              <span class="price-label">${t('priceLabel')}</span>
              <span class="product-price">${prod.price || 'Quote'}</span>
            </div>
            <div class="product-actions-row">
              <button class="btn-quick-view" onclick="openProductDetail('${prod.id}')" title="${t('viewDetails')}">👁</button>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-quote-wa" title="${t('quoteBtn')} WhatsApp">
                <span>💬 ${t('quoteBtn')}</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Reset all filters
 */
window.resetFilters = function() {
  appState.currentCategory = 'all';
  appState.currentFinish = 'all';
  appState.searchQuery = '';

  const searchInput = document.getElementById('productSearchInput');
  if (searchInput) searchInput.value = '';

  const finishSelect = document.getElementById('finishFilterSelect');
  if (finishSelect) finishSelect.value = 'all';

  const categoryPillsContainer = document.getElementById('categoryPills');
  if (categoryPillsContainer) {
    categoryPillsContainer.querySelectorAll('.cat-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.category === 'all');
    });
  }

  renderProducts();
};

/**
 * Render Services
 */
function renderServices() {
  const container = document.getElementById('servicesGrid');
  if (!container) return;

  const isEs = appState.currentLang === 'es';

  container.innerHTML = appState.services.map(serv => {
    const title = isEs && serv.titleEs ? serv.titleEs : serv.title;
    const subtitle = isEs && serv.subtitleEs ? serv.subtitleEs : serv.subtitle;
    const desc = isEs && serv.descriptionEs ? serv.descriptionEs : serv.description;

    return `
      <div class="service-card">
        <div class="service-image-wrapper">
          <img src="${serv.image}" alt="${title}" loading="lazy">
        </div>
        <div class="service-body">
          <span class="service-subtitle">${subtitle}</span>
          <h3 class="service-title">${title}</h3>
          <p class="service-desc">${desc}</p>
          <div style="margin-top: auto;">
            <a href="#contact" class="btn btn-outline-dark btn-sm">${t('requestEstimate')}</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Gallery
 */
function renderGallery() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  const isEs = appState.currentLang === 'es';

  container.innerHTML = appState.gallery.map(item => {
    const title = isEs && item.titleEs ? item.titleEs : item.title;
    const tag = isEs && item.tagEs ? item.tagEs : item.tag;

    return `
      <div class="gallery-item" onclick="openGalleryLightbox('${item.image}', '${title}')">
        <img src="${item.image}" alt="${title}" loading="lazy">
        <div class="gallery-overlay">
          <span class="gallery-tag">${tag}</span>
          <h4 class="gallery-title">${title}</h4>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Open Product Detail Modal
 */
window.openProductDetail = function(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  const isEs = appState.currentLang === 'es';
  const modal = document.getElementById('productDetailModal');
  const container = document.getElementById('productDetailContent');
  if (!modal || !container) return;

  const displayName = isEs && product.nameEs ? product.nameEs : product.name;
  const displayDesc = isEs && product.descriptionEs ? product.descriptionEs : product.description;

  const waText = isEs 
    ? encodeURIComponent(`Hola Luxury Tile 4 Less! Me interesa cotizar/ordenar: ${displayName} (${product.size}).`)
    : encodeURIComponent(`Hi Luxury Tile 4 Less! I am interested in ordering/quoting: ${displayName} (${product.size}).`);
  const waUrl = `https://wa.me/${appState.config.whatsappPhone}?text=${waText}`;

  container.innerHTML = `
    <div class="product-modal-grid">
      <div>
        <img src="${product.image}" alt="${displayName}" class="modal-product-img">
      </div>
      <div class="modal-product-details">
        <span class="section-tag" style="align-self: flex-start;">${product.category.toUpperCase()}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-bottom: 0.5rem; color: var(--color-text-main);">${displayName}</h2>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-brand-red); margin-bottom: 1rem;">
          ${product.price}
        </div>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${displayDesc}
        </p>
        
        <ul class="modal-spec-list">
          <li class="modal-spec-item">
            <span>${isEs ? 'Dimensiones' : 'Dimensions'}</span>
            <span>${product.size}</span>
          </li>
          <li class="modal-spec-item">
            <span>${isEs ? 'Acabado' : 'Surface Finish'}</span>
            <span style="text-transform: capitalize;">${product.finish}</span>
          </li>
          <li class="modal-spec-item">
            <span>${isEs ? 'Espesor' : 'Thickness'}</span>
            <span>${product.thickness || 'Standard'}</span>
          </li>
          <li class="modal-spec-item">
            <span>${isEs ? 'Disponibilidad' : 'Stock Status'}</span>
            <span style="color: ${product.inStock ? '#10B981' : '#F59E0B'};">
              ${product.inStock ? `● ${t('modalInStock')}` : `● ${t('modalSpecialOrder')}`}
            </span>
          </li>
        </ul>

        <div style="display: flex; gap: 1rem; margin-top: auto; flex-wrap: wrap;">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex: 1;">
            <span>💬 ${t('modalQuoteWa')}</span>
          </a>
          <a href="tel:${appState.config.phone.replace(/[^0-9]/g, '')}" class="btn btn-outline-dark" style="flex: 1;">
            <span>📞 ${t('modalCall')}</span>
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

/**
 * Gallery Lightbox
 */
window.openGalleryLightbox = function(imageUrl, title) {
  const modal = document.getElementById('productDetailModal');
  const container = document.getElementById('productDetailContent');
  if (!modal || !container) return;

  container.innerHTML = `
    <div style="padding: 2rem; text-align: center;">
      <img src="${imageUrl}" alt="${title}" style="max-height: 70vh; width: auto; margin: 0 auto; border-radius: var(--radius-md);">
      <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #1A1D20; margin-top: 1.25rem;">${title}</h3>
      <p style="color: var(--color-brand-red); font-size: 0.9rem; margin-top: 0.25rem; font-weight: 700;">Luxury Tile 4 Less Project Portfolio</p>
    </div>
  `;

  modal.classList.add('active');
};

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

/**
 * ADMIN CMS MODAL
 */
function openAdminModal() {
  const modal = document.getElementById('adminModal');
  if (!modal) return;

  const isAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
  if (!isAuth) {
    const pin = prompt('Enter Admin Password / Contraseña (Default: admin123):');
    if (pin !== appState.config.adminPin) {
      alert('Incorrect password. Access denied.');
      return;
    }
    sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  }

  populateAdminProductTable();
  populateAdminSettingsForm();
  modal.classList.add('active');
}

function populateAdminProductTable() {
  const tbody = document.getElementById('adminProductTableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.products.map(prod => `
    <tr>
      <td>
        <img src="${prod.image}" alt="${prod.name}" class="admin-thumb" onerror="this.src='assets/product-calacatta.jpg'">
      </td>
      <td>
        <strong>${prod.name}</strong><br>
        <small style="color: var(--color-text-muted);">${prod.size} | ${prod.finish}</small>
      </td>
      <td><span class="cat-pill" style="padding: 2px 8px; font-size: 0.7rem;">${prod.category}</span></td>
      <td><strong style="color: var(--color-brand-red);">${prod.price}</strong></td>
      <td>
        <span style="color: ${prod.inStock ? '#10B981' : '#F59E0B'}; font-size: 0.8rem; font-weight: 700;">
          ${prod.inStock ? '● In Stock' : '● Special Order'}
        </span>
      </td>
      <td>
        <button class="btn-icon-action edit" onclick="editProduct('${prod.id}')" title="Edit">✏️</button>
        <button class="btn-icon-action delete" onclick="deleteProduct('${prod.id}')" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function populateAdminSettingsForm() {
  const cfg = appState.config;
  if (!cfg) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('settingPhone', cfg.phone);
  setVal('settingWhatsapp', cfg.whatsappPhone);
  setVal('settingEmail', cfg.email);
  setVal('settingAddress', cfg.address);
  setVal('settingAdminPin', cfg.adminPin);
}

window.editProduct = function(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  appState.editingProductId = productId;

  document.getElementById('productFormTitle').textContent = `Edit Product: ${product.name}`;
  document.getElementById('prodId').value = product.id;
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodNameEs').value = product.nameEs || product.name;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodFinish').value = product.finish;
  document.getElementById('prodSize').value = product.size;
  document.getElementById('prodThickness').value = product.thickness || '';
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('productImageUrl').value = product.image;
  document.getElementById('prodDesc').value = product.description;
  document.getElementById('prodDescEs').value = product.descriptionEs || product.description;
  document.getElementById('prodBadge').value = product.badge || '';
  document.getElementById('prodInStock').checked = !!product.inStock;
  document.getElementById('prodFeatured').checked = !!product.featured;

  const preview = document.getElementById('productImagePreview');
  if (preview) {
    preview.src = product.image;
    preview.style.display = 'block';
  }

  const formTabBtn = document.querySelector('[data-tab="adminTabProductForm"]');
  if (formTabBtn) formTabBtn.click();
};

window.resetProductForm = function() {
  appState.editingProductId = null;
  document.getElementById('productFormTitle').textContent = '➕ Add New Tile / Product';
  document.getElementById('adminProductForm').reset();
  document.getElementById('prodId').value = '';
  const preview = document.getElementById('productImagePreview');
  if (preview) preview.style.display = 'none';
};

window.deleteProduct = function(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
    appState.products = appState.products.filter(p => p.id !== productId);
    persistState();
    populateAdminProductTable();
    renderProducts();
    showToast(`Product "${product.name}" deleted.`, 'info');
  }
};

function handleSaveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('prodId').value || `prod-${Date.now()}`;
  const name = document.getElementById('prodName').value.trim();
  const nameEs = document.getElementById('prodNameEs').value.trim() || name;
  const category = document.getElementById('prodCategory').value;
  const finish = document.getElementById('prodFinish').value;
  const size = document.getElementById('prodSize').value.trim();
  const thickness = document.getElementById('prodThickness').value.trim();
  const price = document.getElementById('prodPrice').value.trim();
  const image = document.getElementById('productImageUrl').value.trim() || 'assets/product-calacatta.jpg';
  const description = document.getElementById('prodDesc').value.trim();
  const descriptionEs = document.getElementById('prodDescEs').value.trim() || description;
  const badge = document.getElementById('prodBadge').value.trim();
  const inStock = document.getElementById('prodInStock').checked;
  const featured = document.getElementById('prodFeatured').checked;

  const productData = {
    id,
    name,
    nameEs,
    category,
    finish,
    size,
    thickness,
    price,
    image,
    description,
    descriptionEs,
    badge,
    badgeEs: badge,
    inStock,
    featured
  };

  const existingIndex = appState.products.findIndex(p => p.id === id);
  if (existingIndex >= 0) {
    appState.products[existingIndex] = productData;
    showToast(`Updated "${name}" successfully!`, 'success');
  } else {
    appState.products.unshift(productData);
    showToast(`Added new product "${name}"!`, 'success');
  }

  persistState();
  populateAdminProductTable();
  renderProducts();

  resetProductForm();
  const listTabBtn = document.querySelector('[data-tab="adminTabProducts"]');
  if (listTabBtn) listTabBtn.click();
}

function handleSaveSettings(e) {
  e.preventDefault();

  appState.config.phone = document.getElementById('settingPhone').value.trim();
  appState.config.whatsappPhone = document.getElementById('settingWhatsapp').value.replace(/[^0-9]/g, '');
  appState.config.email = document.getElementById('settingEmail').value.trim();
  appState.config.address = document.getElementById('settingAddress').value.trim();
  
  const newPin = document.getElementById('settingAdminPin').value.trim();
  if (newPin) appState.config.adminPin = newPin;

  persistState();
  renderConfig();
  showToast('Settings saved successfully!', 'success');
}

function handleExportData() {
  const exportPayload = {
    config: appState.config,
    products: appState.products,
    services: appState.services,
    gallery: appState.gallery,
    exportedAt: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `luxurytile4less_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Database exported to JSON file!', 'success');
}

function handleImportData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.products && Array.isArray(data.products)) {
        appState.products = data.products;
        if (data.config) appState.config = data.config;
        if (data.services) appState.services = data.services;
        if (data.gallery) appState.gallery = data.gallery;

        persistState();
        renderApp();
        populateAdminProductTable();
        populateAdminSettingsForm();

        showToast('Database restored successfully from backup!', 'success');
      } else {
        alert('Invalid file format. Must contain a valid products array.');
      }
    } catch (err) {
      alert('Error parsing JSON backup file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function handleResetData() {
  if (confirm('Are you sure you want to reset all products and texts to the original defaults?')) {
    localStorage.clear();
    loadData();
    renderApp();
    populateAdminProductTable();
    populateAdminSettingsForm();
    showToast('Database reset to defaults.', 'info');
  }
}

function showToast(message, type = 'info') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #1A1D20;
      color: #FFFFFF;
      border: 1px solid var(--color-brand-red);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      border-radius: var(--radius-full);
      padding: 0.85rem 1.75rem;
      font-size: 0.925rem;
      font-weight: 700;
      z-index: 9999;
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  const icons = { success: '✅', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
  }, 3500);
}
