/**
 * LUXURY TILE 4 LESS - CLIENT ENGINE & CMS MANAGER
 */

// Storage keys
const STORAGE_KEYS = {
  CONFIG: 'lt4l_site_config',
  PRODUCTS: 'lt4l_products',
  SERVICES: 'lt4l_services',
  GALLERY: 'lt4l_gallery',
  AUTH: 'lt4l_admin_authenticated'
};

// Application State
let appState = {
  config: null,
  products: [],
  services: [],
  gallery: [],
  currentCategory: 'all',
  currentFinish: 'all',
  searchQuery: '',
  editingProductId: null,
  isAdmin: false
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  bindEvents();
  renderApp();
});

/**
 * Load data from localStorage or fallback to defaults
 */
function loadData() {
  const storedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
  const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
  const storedGallery = localStorage.getItem(STORAGE_KEYS.GALLERY);

  appState.config = storedConfig ? JSON.parse(storedConfig) : { ...DEFAULT_SITE_CONFIG };
  appState.products = storedProducts ? JSON.parse(storedProducts) : [ ...DEFAULT_PRODUCTS ];
  appState.services = storedServices ? JSON.parse(storedServices) : [ ...DEFAULT_SERVICES ];
  appState.gallery = storedGallery ? JSON.parse(storedGallery) : [ ...DEFAULT_GALLERY ];

  // Save if not present
  if (!storedConfig) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(appState.config));
  if (!storedProducts) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(appState.products));
  if (!storedServices) localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(appState.services));
  if (!storedGallery) localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(appState.gallery));
}

/**
 * Save state back to localStorage
 */
function persistState() {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(appState.config));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(appState.products));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(appState.services));
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(appState.gallery));
}

/**
 * Bind DOM events
 */
function bindEvents() {
  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }

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
      if (netEl) netEl.textContent = `Base Area: ${netSqft.toFixed(1)} sq.ft + ${(wastePercent * 100)}% for cuts & corners`;
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

      // Create WhatsApp message
      const text = `Hi Luxury Tile 4 Less! My name is ${name} (${phone}). I am interested in: ${interest}. Notes: ${message}`;
      const waUrl = `https://wa.me/${appState.config.whatsappPhone}?text=${encodeURIComponent(text)}`;
      
      showToast('Thank you! Redirecting to WhatsApp for instant quote...', 'success');
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1200);
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

  // Admin tab switching
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

  // Product Image file input in Admin
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
  renderConfig();
  renderProducts();
  renderServices();
  renderGallery();
}

/**
 * Render dynamic config info across the site
 */
function renderConfig() {
  const cfg = appState.config;
  if (!cfg) return;

  // Title & Tagline
  document.title = `${cfg.businessName} - ${cfg.tagline}`;
  
  // Ticker Announcement
  const banner = document.getElementById('announcementBannerText');
  if (banner) banner.textContent = cfg.bannerAnnouncement;

  // Contact info elements
  const phoneEls = document.querySelectorAll('.bind-phone');
  phoneEls.forEach(el => {
    el.textContent = cfg.phone;
    el.href = `tel:${cfg.phone.replace(/[^0-9]/g, '')}`;
  });

  const waLinks = document.querySelectorAll('.bind-whatsapp-link');
  waLinks.forEach(el => {
    el.href = `https://wa.me/${cfg.whatsappPhone}?text=${encodeURIComponent('Hello Luxury Tile 4 Less! I would like to inquire about your tiles and services.')}`;
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
  mapsLinks.forEach(el => {
    el.href = cfg.googleMapsUrl;
  });

  const fbLinks = document.querySelectorAll('.bind-facebook-link');
  fbLinks.forEach(el => { el.href = cfg.facebookUrl; });

  const igLinks = document.querySelectorAll('.bind-instagram-link');
  igLinks.forEach(el => { el.href = cfg.instagramUrl; });

  // Hero elements
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) heroTitle.innerHTML = cfg.heroTitle.replace('Wholesale Prices', '<span class="text-gold">Wholesale Prices</span>');

  const heroSubtitle = document.getElementById('heroSubtitle');
  if (heroSubtitle) heroSubtitle.textContent = cfg.heroSubtitle;

  // Showroom Hours
  const hoursWeekdayEl = document.getElementById('hoursWeekday');
  if (hoursWeekdayEl) hoursWeekdayEl.textContent = cfg.hoursWeekday;
  const hoursSaturdayEl = document.getElementById('hoursSaturday');
  if (hoursSaturdayEl) hoursSaturdayEl.textContent = cfg.hoursSaturday;
  const hoursSundayEl = document.getElementById('hoursSunday');
  if (hoursSundayEl) hoursSundayEl.textContent = cfg.hoursSunday;
}

/**
 * Render products in catalog
 */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // Filter products
  const filtered = appState.products.filter(item => {
    const matchesCategory = (appState.currentCategory === 'all') || (item.category === appState.currentCategory);
    const matchesFinish = (appState.currentFinish === 'all') || (item.finish === appState.currentFinish);
    const matchesQuery = !appState.searchQuery || 
      item.name.toLowerCase().includes(appState.searchQuery) ||
      item.size.toLowerCase().includes(appState.searchQuery) ||
      item.description.toLowerCase().includes(appState.searchQuery);

    return matchesCategory && matchesFinish && matchesQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty-state">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
        <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 0.5rem;">No matching tiles found</h3>
        <p style="color: var(--color-text-muted); margin-bottom: 1.25rem;">Try adjusting your search terms or filters.</p>
        <button class="btn btn-outline btn-sm" onclick="resetFilters()">Clear All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(prod => {
    const waText = encodeURIComponent(`Hi Luxury Tile 4 Less! I am interested in quoting: ${prod.name} (${prod.size}, ${prod.finish}).`);
    const waUrl = `https://wa.me/${appState.config.whatsappPhone}?text=${waText}`;

    return `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-media" onclick="openProductDetail('${prod.id}')">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy" onerror="this.src='assets/product-calacatta.jpg'">
          ${prod.badge ? `<span class="product-badge">${prod.badge}</span>` : ''}
          <span class="product-finish-pill">${prod.finish}</span>
        </div>
        <div class="product-content">
          <div class="product-specs">
            <span>📐 ${prod.size}</span>
            ${prod.thickness ? `<span>• ${prod.thickness}</span>` : ''}
          </div>
          <h3 class="product-name" onclick="openProductDetail('${prod.id}')" style="cursor: pointer;">${prod.name}</h3>
          <p class="product-desc">${prod.description}</p>
          <div class="product-footer">
            <div class="product-price-block">
              <span class="price-label">Price / Unit</span>
              <span class="product-price">${prod.price || 'Contact for Quote'}</span>
            </div>
            <div class="product-actions-row">
              <button class="btn-quick-view" onclick="openProductDetail('${prod.id}')" title="View details">👁</button>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-quote-wa" title="Quote on WhatsApp">
                <span>💬 Quote</span>
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

  container.innerHTML = appState.services.map(serv => `
    <div class="service-card">
      <div class="service-image-wrapper">
        <img src="${serv.image}" alt="${serv.title}" loading="lazy">
      </div>
      <div class="service-body">
        <span class="service-subtitle">${serv.subtitle}</span>
        <h3 class="service-title">${serv.title}</h3>
        <p class="service-desc">${serv.description}</p>
        <div style="margin-top: auto;">
          <a href="#contact" class="btn btn-outline btn-sm">Request Free Estimate →</a>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render Gallery
 */
function renderGallery() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  container.innerHTML = appState.gallery.map(item => `
    <div class="gallery-item" onclick="openGalleryLightbox('${item.image}', '${item.title}')">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-tag">${item.tag}</span>
        <h4 class="gallery-title">${item.title}</h4>
      </div>
    </div>
  `).join('');
}

/**
 * Open Product Detail Modal
 */
window.openProductDetail = function(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productDetailModal');
  const container = document.getElementById('productDetailContent');
  if (!modal || !container) return;

  const waText = encodeURIComponent(`Hi Luxury Tile 4 Less! I am interested in ordering/quoting: ${product.name} (${product.size}).`);
  const waUrl = `https://wa.me/${appState.config.whatsappPhone}?text=${waText}`;

  container.innerHTML = `
    <div class="product-modal-grid">
      <div>
        <img src="${product.image}" alt="${product.name}" class="modal-product-img">
      </div>
      <div class="modal-product-details">
        <span class="section-tag" style="align-self: flex-start;">${product.category.toUpperCase()}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-bottom: 0.5rem;">${product.name}</h2>
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem;">
          ${product.price}
        </div>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${product.description}
        </p>
        
        <ul class="modal-spec-list">
          <li class="modal-spec-item">
            <span>Dimensions</span>
            <span>${product.size}</span>
          </li>
          <li class="modal-spec-item">
            <span>Surface Finish</span>
            <span style="text-transform: capitalize;">${product.finish}</span>
          </li>
          <li class="modal-spec-item">
            <span>Thickness</span>
            <span>${product.thickness || 'Standard'}</span>
          </li>
          <li class="modal-spec-item">
            <span>Stock Status</span>
            <span style="color: ${product.inStock ? '#10B981' : '#F59E0B'};">
              ${product.inStock ? '● In Stock (Port St. Lucie)' : '● Special Order'}
            </span>
          </li>
          ${product.applications ? `
            <li class="modal-spec-item">
              <span>Ideal Applications</span>
              <span>${product.applications.join(', ')}</span>
            </li>
          ` : ''}
        </ul>

        <div style="display: flex; gap: 1rem; margin-top: auto; flex-wrap: wrap;">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex: 1;">
            <span>💬 Quote via WhatsApp</span>
          </a>
          <a href="tel:${appState.config.phone.replace(/[^0-9]/g, '')}" class="btn btn-outline" style="flex: 1;">
            <span>📞 Call Showroom</span>
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
      <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #FFFFFF; margin-top: 1.25rem;">${title}</h3>
      <p style="color: var(--color-primary); font-size: 0.9rem; margin-top: 0.25rem;">Luxury Tile 4 Less Project Portfolio</p>
    </div>
  `;

  modal.classList.add('active');
};

/**
 * Close all open modals
 */
function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

/**
 * ADMIN CMS LOGIC
 */
function openAdminModal() {
  const modal = document.getElementById('adminModal');
  if (!modal) return;

  // Check authentication
  const isAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
  if (!isAuth) {
    const pin = prompt('Enter Admin Password / PIN (Default is: admin123):');
    if (pin !== appState.config.adminPin) {
      alert('Incorrect password. Access denied.');
      return;
    }
    sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  }

  // Populate Admin views
  populateAdminProductTable();
  populateAdminSettingsForm();

  modal.classList.add('active');
}

/**
 * Populate products list in Admin
 */
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
      <td><strong>${prod.price}</strong></td>
      <td>
        <span style="color: ${prod.inStock ? '#10B981' : '#F59E0B'}; font-size: 0.8rem;">
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

/**
 * Populate settings form in Admin
 */
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
  setVal('settingHeroTitle', cfg.heroTitle);
  setVal('settingHeroSubtitle', cfg.heroSubtitle);
  setVal('settingBanner', cfg.bannerAnnouncement);
  setVal('settingAdminPin', cfg.adminPin);
}

/**
 * Edit existing product
 */
window.editProduct = function(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  appState.editingProductId = productId;

  // Switch to Form tab or populate modal
  document.getElementById('productFormTitle').textContent = `Edit Product: ${product.name}`;
  document.getElementById('prodId').value = product.id;
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodFinish').value = product.finish;
  document.getElementById('prodSize').value = product.size;
  document.getElementById('prodThickness').value = product.thickness || '';
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('productImageUrl').value = product.image;
  document.getElementById('prodDesc').value = product.description;
  document.getElementById('prodBadge').value = product.badge || '';
  document.getElementById('prodInStock').checked = !!product.inStock;
  document.getElementById('prodFeatured').checked = !!product.featured;

  const preview = document.getElementById('productImagePreview');
  if (preview) {
    preview.src = product.image;
    preview.style.display = 'block';
  }

  // Switch to products form tab
  const formTabBtn = document.querySelector('[data-tab="adminTabProductForm"]');
  if (formTabBtn) formTabBtn.click();
};

/**
 * Reset Product Form to "Add New"
 */
window.resetProductForm = function() {
  appState.editingProductId = null;
  document.getElementById('productFormTitle').textContent = '➕ Add New Tile / Product';
  document.getElementById('adminProductForm').reset();
  document.getElementById('prodId').value = '';
  const preview = document.getElementById('productImagePreview');
  if (preview) preview.style.display = 'none';
};

/**
 * Delete product
 */
window.deleteProduct = function(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  if (confirm(`Are you sure you want to delete "${product.name}"? This cannot be undone.`)) {
    appState.products = appState.products.filter(p => p.id !== productId);
    persistState();
    populateAdminProductTable();
    renderProducts();
    showToast(`Product "${product.name}" deleted.`, 'info');
  }
};

/**
 * Save Product Handler (Create or Update)
 */
function handleSaveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('prodId').value || `prod-${Date.now()}`;
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const finish = document.getElementById('prodFinish').value;
  const size = document.getElementById('prodSize').value.trim();
  const thickness = document.getElementById('prodThickness').value.trim();
  const price = document.getElementById('prodPrice').value.trim();
  const image = document.getElementById('productImageUrl').value.trim() || 'assets/product-calacatta.jpg';
  const description = document.getElementById('prodDesc').value.trim();
  const badge = document.getElementById('prodBadge').value.trim();
  const inStock = document.getElementById('prodInStock').checked;
  const featured = document.getElementById('prodFeatured').checked;

  const productData = {
    id,
    name,
    category,
    finish,
    size,
    thickness,
    price,
    image,
    description,
    badge,
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

  // Reset form and return to table tab
  resetProductForm();
  const listTabBtn = document.querySelector('[data-tab="adminTabProducts"]');
  if (listTabBtn) listTabBtn.click();
}

/**
 * Save Settings Handler
 */
function handleSaveSettings(e) {
  e.preventDefault();

  appState.config.phone = document.getElementById('settingPhone').value.trim();
  appState.config.whatsappPhone = document.getElementById('settingWhatsapp').value.replace(/[^0-9]/g, '');
  appState.config.email = document.getElementById('settingEmail').value.trim();
  appState.config.address = document.getElementById('settingAddress').value.trim();
  appState.config.heroTitle = document.getElementById('settingHeroTitle').value.trim();
  appState.config.heroSubtitle = document.getElementById('settingHeroSubtitle').value.trim();
  appState.config.bannerAnnouncement = document.getElementById('settingBanner').value.trim();
  
  const newPin = document.getElementById('settingAdminPin').value.trim();
  if (newPin) appState.config.adminPin = newPin;

  persistState();
  renderConfig();
  showToast('Settings saved successfully!', 'success');
}

/**
 * Export data as JSON file for backup
 */
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

/**
 * Import data from JSON file
 */
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

/**
 * Reset database to default
 */
function handleResetData() {
  if (confirm('Are you sure you want to reset all products and texts to the original defaults? Custom additions will be overwritten.')) {
    localStorage.clear();
    loadData();
    renderApp();
    populateAdminProductTable();
    populateAdminSettingsForm();
    showToast('Database reset to defaults.', 'info');
  }
}

/**
 * Toast Notification Utility
 */
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
      background: #14181E;
      color: #FFFFFF;
      border: 1px solid var(--color-primary);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border-radius: var(--radius-full);
      padding: 0.85rem 1.75rem;
      font-size: 0.925rem;
      font-weight: 600;
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

  const icons = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️'
  };

  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
  }, 3500);
}
