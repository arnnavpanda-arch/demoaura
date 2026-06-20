if (window.location.search.includes('reset=true')) {
  localStorage.clear();
  alert('Local Browser Data Cleared Successfully!');
  window.location.href = '/';
}

// --- MOCK DATABASE (SHOPS & PRODUCTS) ---
const initialShops = [
  {
    id: 'SHOP-001',
    name: 'Aura Gourmet Grocery',
    category: 'Grocery',
    area: 'Connaught Place, Delhi',
    password: 'admin123',
    isLive: true,
    requestedCouriers: 1,
    assignedCouriers: 1,
    desc: 'Premium organic fruits, farm-fresh vegetables, dairy, artisanal cheeses, and daily essentials delivered within 30 minutes.',
    products: [
      {
        id: 'g1',
        name: 'Organic Hass Avocados (Pack of 2)',
        price: 180.00,
        discount: 15,
        stock: 25,
        rating: 4.7,
        reviews: 32,
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800',
        desc: 'Perfectly ripe, creamy organic Hass avocados. Packed with healthy monounsaturated fats, potassium, and dietary fibers. Handpicked from local organic farms.',
        sizes: ['Standard Pack'],
        colors: ['Organic Fresh']
      },
      {
        id: 'g2',
        name: 'Alphonso Mangoes (1 Kg)',
        price: 350.00,
        stock: 12,
        rating: 4.9,
        reviews: 64,
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800',
        desc: 'Naturally sweet, rich, and aromatic handpicked export-quality Alphonso mangoes. Known as the king of mangoes, delivered ripe and ready to eat.',
        sizes: ['1 Kg Box'],
        colors: ['Sweet Ripe']
      },
      {
        id: 'g3',
        name: 'Unprocessed Raw Forest Honey (500g)',
        price: 290.00,
        stock: 30,
        rating: 4.5,
        reviews: 21,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800',
        desc: '100% pure, raw, and unfiltered forest honey collected from wild hives. Retains all natural pollen, enzymes, and antioxidants. Healthy sugar alternative.',
        sizes: ['500g Glass Jar'],
        colors: ['Golden Amber']
      }
    ]
  },
  {
    id: 'SHOP-002',
    name: 'Apex Wellness Pharmacy',
    category: 'Pharmacy',
    area: 'Saket, Delhi',
    password: 'pass123',
    isLive: false, // Starts offline by default
    requestedCouriers: 1,
    assignedCouriers: 1,
    desc: 'Authorized prescription drugs, wellness supplements, first-aid kits, baby care, and daily healthcare hygiene essentials.',
    products: [
      {
        id: 'p1',
        name: 'Daily Multivitamin Supplement (60 Capsules)',
        price: 420.00,
        stock: 40,
        rating: 4.6,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800',
        desc: 'Comprehensive daily multivitamin and mineral formula for vitality, immunity, and overall metabolic health. Gelatin-free, vegetarian capsules.',
        sizes: ['60 Capsule Pack'],
        colors: ['Supplement']
      },
      {
        id: 'p2',
        name: 'Premium First-Aid Emergency Kit',
        price: 750.00,
        stock: 15,
        rating: 4.8,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800',
        desc: 'All-in-one medical response bag containing sterile bandages, antiseptic wipes, burn creams, medical tape, tweezers, scissors, and instant cold packs.',
        sizes: ['Compact Case'],
        colors: ['Emergency Red']
      }
    ]
  },
  {
    id: 'SHOP-003',
    name: 'Bistro Delhi Restaurant',
    category: 'Restaurant',
    area: 'Karol Bagh, Delhi',
    password: 'bistro123',
    isLive: true,
    requestedCouriers: 1,
    assignedCouriers: 1,
    desc: 'Hot, fresh, and authentic North Indian delicacies, clay-oven tandoori starters, rich gravies, and premium biryanis.',
    products: [
      {
        id: 'r1',
        name: 'Mughlai Butter Chicken & Naan Combo',
        price: 380.00,
        discount: 10,
        stock: 50,
        rating: 4.8,
        reviews: 142,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800',
        desc: 'Clay-oven roasted chicken tikka cooked in a velvety rich butter-tomato-cashew gravy. Served with 2 hot butter naans, mint chutney, and salad.',
        sizes: ['Serves 1-2'],
        colors: ['Mild Spicy']
      },
      {
        id: 'r2',
        name: 'Tandoori Paneer Tikka Platter',
        price: 290.00,
        stock: 35,
        rating: 4.4,
        reviews: 58,
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800',
        desc: 'Fresh cubes of cottage cheese, bell peppers, and onions marinated in yogurt and hand-ground spices, grilled to perfection in a clay oven.',
        sizes: ['8 Pieces Platter'],
        colors: ['Medium Spicy']
      }
    ]
  }
];

// --- APP GLOBAL STATE ---
let shops = [];
let cart = JSON.parse(localStorage.getItem('delivery_cart')) || [];
let totalCouriersPool = 10;
let baseDeliveryFee = 30.00;
let perKmDeliveryFee = 10.00;
let currentCheckoutDistance = 0.0;
let deliveryToDeliverIndex = null;
let deliveries = [];
let activeOffers = [];


let activePortal = 'customer'; // customer | shop | agency
let activeShopSession = JSON.parse(sessionStorage.getItem('active_shop_session')) || null;
let activeCustomerShop = null; // Shop object being viewed by customer
let customers = JSON.parse(localStorage.getItem('delivery_customers')) || [];
let activeCustomer = JSON.parse(sessionStorage.getItem('active_customer_session')) || null;
let discountPercent = 0;
let appliedPromo = '';
let dailyCommissions = {};
let tieredCommissionRules = {
  enabled: false,
  tier1Limit: 5,
  tier1Rate: 10,
  tier2Limit: 10,
  tier2Rate: 15,
  tier3Rate: 20
};

function getTodayDateString() {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// --- PROMO CODE LOGIC ---
let activePromoCode = null; // Store the currently applied promo code string

function generateDailyPromoCodes(shopId, dateStr) {
  // Pseudo-random seed based on shopId and dateStr
  let seed = 0;
  const str = shopId + dateStr;
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) % 100000000;
  }
  
  const codes = [];
  for (let i = 0; i < 10; i++) {
    let pseudoRand = ((seed + i * 12345) * 98765) % 1679616;
    let codeStr = pseudoRand.toString(36).toUpperCase().padStart(4, '0');
    codes.push(`${shopId.replace('SHOP-', '')}-${codeStr}`);
  }
  return codes;
}

function isPromoCodeUsed(code, dateStr) {
  return deliveries.some(d => (d.date || 'May 30, 2026') === dateStr && d.promoCode === code);
}

// --- DOM ELEMENTS SELECTION ---
const body = document.body;
const appBackdrop = document.getElementById('app-backdrop');
const toastContainer = document.getElementById('toast-container');

// Portals & Nav
const portalTabs = document.querySelectorAll('.portal-tab-btn');
const portalCustomerView = document.getElementById('portal-customer-view');
const portalShopView = document.getElementById('portal-shop-view');
const portalAgencyView = document.getElementById('portal-agency-view');

const navLogo = document.getElementById('nav-logo');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');

// Customer Views
const custAuthView = document.getElementById('cust-auth-view');
const custShopsDirectory = document.getElementById('cust-shops-directory');
const custShopCatalog = document.getElementById('cust-shop-catalog');
const custCheckoutView = document.getElementById('cust-checkout-view');
const custSuccessView = document.getElementById('cust-success-view');
const custOrdersView = document.getElementById('cust-orders-view');

// Auth View Elements
const showRegisterBtn = document.getElementById('show-register-btn');
const showLoginBtn = document.getElementById('show-login-btn');
const custRegisterForm = document.getElementById('cust-register-form');
const custLoginForm = document.getElementById('cust-login-form');
const authOptions = document.getElementById('auth-options');
const authWaitMsg = document.getElementById('auth-wait-msg');
const waitMsgText = document.getElementById('wait-msg-text');


const shopsDirectoryGrid = document.getElementById('shops-directory-grid');
const catalogProductsGrid = document.getElementById('catalog-products-grid');
const directorySearch = document.getElementById('directory-search');
const catalogShopName = document.getElementById('catalog-shop-name');
const catalogShopCategory = document.getElementById('catalog-shop-category');
const catalogShopArea = document.getElementById('catalog-shop-area');
const catalogBackBtn = document.getElementById('catalog-back-btn');
const shopCatalogSearch = document.getElementById('shop-catalog-search');
const catalogSort = document.getElementById('catalog-sort');

// Cart Drawer
const cartDrawer = document.getElementById('cart-drawer');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTax = document.getElementById('cart-tax');
const cartTotal = document.getElementById('cart-total');
const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

// Checkout Wizard
const stepInds = [
  document.getElementById('step-ind-1'),
  document.getElementById('step-ind-2'),
  document.getElementById('step-ind-3')
];
const panels = [
  document.getElementById('checkout-panel-1'),
  document.getElementById('checkout-panel-2'),
  document.getElementById('checkout-panel-3')
];
const registeredAddressDisplay = document.getElementById('registered-address-display');
const paymentForm = document.getElementById('payment-form');
const cardNumInput = document.getElementById('pay-card-num');
const cardNameInput = document.getElementById('pay-name');
const cardExpiryInput = document.getElementById('pay-expiry');

const cardBrandDisplay = document.getElementById('card-brand-display');
const cardNumDisplay = document.getElementById('card-num-display');
const cardNameDisplay = document.getElementById('card-name-display');
const cardExpDisplay = document.getElementById('card-exp-display');

const next1 = document.getElementById('checkout-next-1');
const back2 = document.getElementById('checkout-back-2');
const next2 = document.getElementById('checkout-next-2');
const back3 = document.getElementById('checkout-back-3');
const confirmBtn = document.getElementById('checkout-confirm-btn');

const checkoutSummaryItems = document.getElementById('checkout-summary-items');
const checkoutPromoInput = document.getElementById('checkout-promo-input');
const checkoutPromoApplyBtn = document.getElementById('checkout-promo-apply-btn');
const checkoutPromoMsg = document.getElementById('checkout-promo-msg');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutShipping = document.getElementById('checkout-shipping');
const checkoutDiscount = document.getElementById('checkout-discount');
const checkoutTotal = document.getElementById('checkout-total');

// Order Success
const successOrderId = document.getElementById('success-order-id');
const successReceiptItems = document.getElementById('success-receipt-items');
const successReceiptTotal = document.getElementById('success-receipt-total');
const successContinueBtn = document.getElementById('success-continue-btn');
const successPrintBtn = document.getElementById('success-print-btn');

// Shop Portal Elements
const shopLoginPanel = document.getElementById('shop-login-panel');
const shopDashboardPanel = document.getElementById('shop-dashboard-panel');
const shopLoginForm = document.getElementById('shop-login-form');
const loginShopIdInput = document.getElementById('login-shop-id');
const loginShopPassInput = document.getElementById('login-shop-pass');

const partnerShopName = document.getElementById('partner-shop-name');
const partnerShopId = document.getElementById('partner-shop-id');
const partnerShopCategory = document.getElementById('partner-shop-category');
const partnerShopArea = document.getElementById('partner-shop-area');
const partnerStatusLabel = document.getElementById('partner-status-label');
const partnerStatusToggleBtn = document.getElementById('partner-status-toggle-btn');
const partnerLogoutBtn = document.getElementById('partner-logout-btn');

const shopAddProductForm = document.getElementById('shop-add-product-form');
const partnerInventoryRows = document.getElementById('partner-inventory-rows');
const partnerDeliveryRows = document.getElementById('partner-delivery-rows');

// Agency Portal Panels & Links
const dbNavLinks = document.querySelectorAll('.db-nav-link[data-panel]');
const dbPanels = document.querySelectorAll('.db-panel');

const agStatTotalShops = document.getElementById('ag-stat-total-shops');
const agStatLiveShops = document.getElementById('ag-stat-live-shops');
const agStatPendingDeliveries = document.getElementById('ag-stat-pending-deliveries');
const agStatCompletedDeliveries = document.getElementById('ag-stat-completed-deliveries');

const agencyDeliveriesRows = document.getElementById('agency-deliveries-rows');
const agencyRegisterShopForm = document.getElementById('agency-register-shop-form');
const agencyShopsRows = document.getElementById('agency-shops-rows');

// Registration Modal
const regSuccessModal = document.getElementById('registration-success-modal');
const successRegName = document.getElementById('success-reg-name');
const successRegId = document.getElementById('success-reg-id');
const successRegPass = document.getElementById('success-reg-pass');
const closeRegSuccessBtn = document.getElementById('close-reg-success-btn');

// Details Modal
const modalDialog = document.getElementById('product-detail-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');


// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'alert-octagon';
  if (type === 'warning') icon = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}


// --- THEME MANAGEMENT DELETED ---
// --- REAL-TIME CROSS-DEVICE SYNC ---
let _lastServerHash = null;
let _isSyncing = false;
// 🔒 CRITICAL: blocks syncStorage() until server data is fully loaded
// Prevents Device 2 from overwriting Device 1's data with empty state on page load
let _stateReady = false;

function _hashState(data) {
  const sortedShops = (data.shops || []).slice().sort((a,b) => (a.id || '').localeCompare(b.id || ''));
  const sortedDeliveries = (data.deliveries || []).slice().sort((a,b) => (a.id || '').localeCompare(b.id || ''));
  const sortedOffers = (data.offers || []).slice().sort((a,b) => (a.id || '').localeCompare(b.id || ''));
  const sortedCustomers = (data.customers || []).slice().sort((a,b) => (a.phone || '').localeCompare(b.phone || ''));

  return JSON.stringify({
    shopCount: sortedShops.length,
    shopNames: sortedShops.map(s => s.name + s.isLive).join(','),
    deliveryCount: sortedDeliveries.length,
    deliveryIds: sortedDeliveries.map(d => d.id + d.status).join(','),
    offerCount: sortedOffers.length,
    offerIds: sortedOffers.map(o => o.id).join(','),
    customerCount: sortedCustomers.length,
    customerPhones: sortedCustomers.map(c => c.phone).join(','),
    settings: data.settings ? `${data.settings.totalCouriersPool}-${data.settings.baseDeliveryFee}-${data.settings.perKmDeliveryFee}` : ''
  });
}

function _showSyncIndicator(status) {
  // HIDDEN: User requested that synchronization happens entirely in the background
  // without any visible indicators on the screen.
  return;
}

async function loadStateFromServer(silent = false) {
  try {
    _showSyncIndicator('loading');
    const response = await fetch('/api/state?t=' + new Date().getTime(), { cache: 'no-store' });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    const newHash = _hashState(data);

    if (_isSyncing) {
      console.warn("⏳ Sync in progress. Ignoring incoming state pull to prevent wiping local modifications.");
      return;
    }

    if (!silent || newHash !== _lastServerHash) {
      _lastServerHash = newHash;

      shops        = data.shops      || [];
      // Reverse deliveries so the newest orders appear at the top
      deliveries   = (data.deliveries || []).slice().reverse();
      activeOffers = data.offers   || [];
      customers    = data.customers  || [];

      if (data.settings) {
        totalCouriersPool = data.settings.totalCouriersPool || 10;
        baseDeliveryFee   = data.settings.baseDeliveryFee   || 30.00;
        perKmDeliveryFee  = data.settings.perKmDeliveryFee  || 10.00;
        dailyCommissions  = data.settings.dailyCommissions  || {};
        if (data.settings.dailyCommissions && typeof data.settings.dailyCommissions === 'object') {
          dailyCommissions = data.settings.dailyCommissions;
        }
        tieredCommissionRules = data.settings.tieredCommissionRules || {
          enabled: false, tier1Limit: 5, tier1Rate: 10,
          tier2Limit: 10, tier2Rate: 15, tier3Rate: 20
        };
      }

      renderShopsDirectory();
      renderPartnerDeliveries();
      renderPartnerInventory();
      renderAgencyDeliveries();
      renderAgencyCommissionSettings();
      renderAgencyDailyReports();
      renderCourierAllocation();
      renderCustomerApprovals();
      updateAgencyStats();
      
      if (typeof renderAgencyActiveOffers === 'function') renderAgencyActiveOffers();
      if (typeof renderCustomerOffersBanner === 'function') renderCustomerOffersBanner();
      
      const trackModal = document.getElementById('track-order-modal');
      if (trackModal && trackModal.classList.contains('active')) {
        const openId = document.getElementById('track-order-id').innerText;
        if (openId) {
          openTrackOrder(openId);
        }
      }
      
      if (document.getElementById('customer-orders-list')) {
        renderCustomerOrders();
      }

      if (silent) {
        // Silently updated from another device
      } else {
        console.log('✅ State loaded from MongoDB.');
      }
    }

    // ✅ Unlock syncStorage ONLY after server data is successfully loaded
    _stateReady = true;
    _showSyncIndicator('ok');

  } catch (err) {
    _showSyncIndicator('error');
    if (!silent) {
      console.error('Failed to load from server, falling back to localStorage:', err);
      shops = JSON.parse(localStorage.getItem('delivery_shops')) || initialShops;
      shops.forEach(s => { if (s.commissionRate === undefined) s.commissionRate = 20; });
      deliveries        = JSON.parse(localStorage.getItem('delivery_orders'))          || [];
      activeOffers      = JSON.parse(localStorage.getItem('delivery_offers'))          || [];
      totalCouriersPool = parseInt(localStorage.getItem('total_couriers_pool'))        || 10;
      baseDeliveryFee   = parseFloat(localStorage.getItem('agency_base_delivery_fee')) || 30.00;
      perKmDeliveryFee  = parseFloat(localStorage.getItem('agency_per_km_delivery_fee'))|| 10.00;
      dailyCommissions  = JSON.parse(localStorage.getItem('agency_daily_commissions')) || {};
      tieredCommissionRules = JSON.parse(localStorage.getItem('agency_commission_rules')) || {
        enabled: false, tier1Limit: 5, tier1Rate: 10,
        tier2Limit: 10, tier2Rate: 15, tier3Rate: 20
      };
      renderShopsDirectory();
      renderPartnerDeliveries();
      renderPartnerInventory();
      renderAgencyDeliveries();
      renderAgencyCommissionSettings();
      renderAgencyDailyReports();
      renderCourierAllocation();
      updateAgencyStats();
      // DO NOT unlock syncStorage here! If we couldn't reach the server,
      // we must not allow the client to push stale/initial local data to the DB.
      // It will unlock automatically on the next successful 5-second auto-poll.
    }
  }
}

// Silent 5-second background polling for robust synchronization
function startRealTimeSync() {
  setInterval(async () => {
    if (_isSyncing) return;
    _isSyncing = true;
    _showSyncIndicator('syncing');
    await loadStateFromServer(true);
    _isSyncing = false;
  }, 5000);
  console.log('🔄 Silent background sync started (5s polling)');
}

function syncStorage() {
  // 🔒 GUARD: Do NOT write to MongoDB until server state is loaded
  // This prevents Device 2 from wiping Device 1's data on page load
  if (!_stateReady) {
    console.warn('⏳ syncStorage blocked - waiting for server state to load first.');
    return;
  }

  // Save to localStorage as quick local cache
  localStorage.setItem('delivery_shops',             JSON.stringify(shops));
  localStorage.setItem('delivery_cart',              JSON.stringify(cart));
  localStorage.setItem('delivery_orders',            JSON.stringify(deliveries));
  localStorage.setItem('delivery_offers',            JSON.stringify(activeOffers));
  localStorage.setItem('total_couriers_pool',        totalCouriersPool);
  localStorage.setItem('agency_base_delivery_fee',   baseDeliveryFee);
  localStorage.setItem('agency_per_km_delivery_fee', perKmDeliveryFee);
  localStorage.setItem('agency_daily_commissions',   JSON.stringify(dailyCommissions));
  localStorage.setItem('agency_commission_rules',    JSON.stringify(tieredCommissionRules));
  localStorage.setItem('delivery_customers',         JSON.stringify(customers));

  _showSyncIndicator('syncing');

  // Sync to MongoDB backend
  fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shops, deliveries, offers: activeOffers, customers, totalCouriersPool,
      baseDeliveryFee, perKmDeliveryFee,
      dailyCommissions, tieredCommissionRules
    })
  })
  .then(res => {
    if (!res.ok) throw new Error('API Sync Failed');
    return res.json();
  })
  .then(data => {
    _lastServerHash = _hashState({ shops, deliveries, settings: {
      totalCouriersPool, baseDeliveryFee, perKmDeliveryFee
    }});
    _showSyncIndicator('ok');
    console.log('✅ MongoDB synced:', data.message);
  })
  .catch(err => {
    _showSyncIndicator('error');
    console.error('Error syncing to MongoDB:', err);
  });
}


// --- VIEW PORTAL CONTROL ---
function switchPortal(portal) {
  activePortal = portal;
  
  // Update Tab States
  portalTabs.forEach(tab => {
    if (tab.dataset.portal === portal) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Toggle Visibility
  portalCustomerView.classList.remove('active');
  portalShopView.classList.remove('active');
  portalAgencyView.classList.remove('active');
  cartBtn.style.display = 'none';

  if (portal === 'customer') {
    initCustomerTheme(); // Restore customer's chosen theme
    portalCustomerView.classList.add('active');
    cartBtn.style.display = 'flex';
    if (!activeCustomer) {
      switchCustomerSubview('cust-auth-view');
    } else {
      switchCustomerSubview('cust-shops-directory');
      renderShopsDirectory();
    }
  } else if (portal === 'shop') {
    document.body.classList.remove('theme-dark', 'theme-glass', 'dark-theme'); // Enforce light mode
    portalShopView.classList.add('active');
    renderShopPartnerPortal();
  } else if (portal === 'agency') {
    document.body.classList.remove('theme-dark', 'theme-glass', 'dark-theme'); // Enforce light mode
    portalAgencyView.classList.add('active');
    renderAgencyPortal();
  }
}

// Subview router inside Customer Portal
function switchCustomerSubview(subviewId) {
  const subviews = [custAuthView, custShopsDirectory, custShopCatalog, custCheckoutView, custSuccessView, custOrdersView];
  subviews.forEach(view => {
    if (view.id === subviewId) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Handle Global Customer Nav Visibility
  const globalNav = document.getElementById('customer-global-nav');
  if (globalNav) {
    if (subviewId === 'cust-auth-view') {
      globalNav.style.display = 'none';
    } else {
      globalNav.style.display = 'flex';
      
      // Set location if logged in
      const locElement = document.getElementById('dash-user-location');
      if (activeCustomer && locElement) {
        const fullLocationStr = `${activeCustomer.address}, ${activeCustomer.city}, ${activeCustomer.pin}`;
        locElement.innerText = fullLocationStr;
        locElement.title = fullLocationStr;
      }
    }
  }
}


// --- PORTAL A: CUSTOMER STOREFRONT LOGIC ---

// --- CATEGORY FILTERING ---
let activeCategoryFilter = null;

function setCategoryFilter(category) {
  if (activeCategoryFilter === category) {
    activeCategoryFilter = null; // Toggle off if clicked again
    showToast('Category filter cleared', 'info');
  } else {
    activeCategoryFilter = category;
    showToast(`Filtering by ${category}`, 'info');
  }
  renderShopsDirectory();
}

// Render live online shops directory
function renderShopsDirectory() {
  if (document.getElementById('dash-welcome-name')) {
    document.getElementById('dash-welcome-name').innerText = activeCustomer ? activeCustomer.name : 'Guest';
  }
  if (typeof renderCustomerOffersBanner === 'function') renderCustomerOffersBanner();
  const popularStoresGrid = document.getElementById('shops-directory-grid');
  const nearbyStoresRow = document.getElementById('nearby-stores-row');
  
  if (popularStoresGrid) popularStoresGrid.innerHTML = '';
  if (nearbyStoresRow) nearbyStoresRow.innerHTML = '';

  const searchVal = directorySearch ? directorySearch.value.trim().toLowerCase() : '';

  if (!activeCategoryFilter && !searchVal) {
    if (popularStoresGrid) {
      popularStoresGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i data-lucide="layout-grid" style="width: 48px; height: 48px; display: block; margin: 0 auto 12px auto; opacity: 0.5;"></i>
          <p>Please select a category above to view shops.</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    const liveShopsCountEl = document.getElementById('live-shops-count');
    if (liveShopsCountEl) liveShopsCountEl.innerText = shops.filter(s => s.isLive).length;
    return;
  }

  // Filter only Live shops or shops matching query
  const liveShops = shops.filter(s => {
    if (!s.isLive) return false;
    
    // Exact Category Match Filter
    if (activeCategoryFilter && s.category !== activeCategoryFilter) {
      return false;
    }

    if (searchVal) {
      const matchName = s.name.toLowerCase().includes(searchVal);
      const matchCat = s.category.toLowerCase().includes(searchVal);
      const matchArea = s.area.toLowerCase().includes(searchVal);
      return matchName || matchCat || matchArea;
    }
    return true;
  });

  const liveShopsCountEl = document.getElementById('live-shops-count');
  if (liveShopsCountEl) liveShopsCountEl.innerText = shops.filter(s => s.isLive).length;

  if (liveShops.length === 0) {
    popularStoresGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i data-lucide="store" style="width: 48px; height: 48px; display: block; margin: 0 auto 12px auto;"></i>
        <p>No online shops found.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  liveShops.forEach(shop => {
    // Delivery calculation
    const freeCouriers = getFreeCouriersCount(shop);
    const totalCouriers = shop.assignedCouriers || 1;
    const estDeliveryTime = freeCouriers > 0 ? '15-30 mins' : '45-60 mins (Busy)';

    // Modern Dashboard Store Card Structure
    const cardHTML = `
      <div class="dash-cat-card" style="padding: 24px; min-width: 280px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; cursor: default;">
        <h4 style="margin: 0; font-size: 1.4rem; color: var(--text-primary); margin-bottom: 4px;">${shop.name}</h4>
        <span style="font-size: 0.95rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 20px;">
          <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i> ${shop.area || 'Local Area'}
        </span>
        <button class="next-btn" onclick="enterShopCatalog('${shop.id}')" style="width: 100%; padding: 12px; justify-content: center; background: var(--accent-color); color: white; border-radius: var(--border-radius-md);">
          View Store
        </button>
      </div>
    `;
    
    // Add to both grids for demonstration purposes
    if (popularStoresGrid) popularStoresGrid.innerHTML += cardHTML;
    
    // Minimal card for Nearby Stores
    const nearbyCard = `
      <div class="dash-cat-card" style="flex-direction: row; align-items: center; justify-content: space-between; min-width: 260px; padding: 16px;">
        <div style="flex: 1;">
          <h4 style="margin: 0; font-size: 1.1rem; margin-bottom: 4px;">${shop.name}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">${shop.category}</p>
          <a href="#" onclick="enterShopCatalog('${shop.id}'); return false;" style="font-size: 0.85rem; color: var(--accent-color); font-weight: 600; text-decoration: none; padding: 6px 12px; background: rgba(108, 77, 255, 0.1); border-radius: var(--border-radius-sm);">View Store</a>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); align-self: flex-start; font-weight: 500;">
           2.5 km
        </div>
      </div>
    `;
    if (nearbyStoresRow) nearbyStoresRow.innerHTML += nearbyCard;
  });

  renderTrendingProducts(liveShops);
  lucide.createIcons();
}

function renderTrendingProducts(liveShops) {
  const trendingGrid = document.getElementById('trending-products-grid');
  if (!trendingGrid) return;
  
  trendingGrid.innerHTML = '';
  
  // Extract up to 8 random products from live shops
  let allProducts = [];
  liveShops.forEach(shop => {
    shop.products.forEach(p => {
      allProducts.push({ ...p, shopId: shop.id, shopName: shop.name });
    });
  });
  
  // Shuffle and pick 8
  allProducts.sort(() => 0.5 - Math.random());
  const trending = allProducts.slice(0, 8);

  if (trending.length === 0) {
    trendingGrid.innerHTML = `<p style="color: var(--text-muted);">No products available right now.</p>`;
    return;
  }

  trending.forEach(product => {
    const pCard = `
      <div class="dash-cat-card" style="padding: 12px; align-items: stretch; min-width: unset; text-align: left; cursor: default;">
        <h4 style="font-size: 0.9rem; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.name}</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">${product.shopName}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: bold; font-size: 1rem;">₹${product.price}</span>
          <button class="nav-btn" onclick="addToCart('${product.shopId}', '${product.id}')" style="background: var(--bg-tertiary); border: 1px solid var(--accent-color); color: var(--accent-color); width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center;">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </div>
    `;
    trendingGrid.innerHTML += pCard;
  });
}

if (directorySearch) directorySearch.addEventListener('input', renderShopsDirectory);

// Enter specific shop products list
function enterShopCatalog(shopId) {
  const shop = shops.find(s => s.id === shopId);
  if (!shop) return;

  activeCustomerShop = shop;
  
  // Set Catalog Titles
  catalogShopName.innerText = shop.name;
  catalogShopCategory.innerText = shop.category + ' department';
  catalogShopArea.innerHTML = `<i data-lucide="map-pin" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i> ${shop.area}`;
  
  const deliverySpan = document.getElementById('catalog-shop-delivery');
  if (deliverySpan) {
    deliverySpan.innerHTML = `<i data-lucide="truck" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i> ₹${perKmDeliveryFee.toFixed(2)}/km (+ ₹${baseDeliveryFee.toFixed(2)} base)`;
  }

  // Reset filters
  document.getElementById('shop-catalog-search').value = '';
  catalogSort.value = 'featured';

  switchCustomerSubview('cust-shop-catalog');
  renderShopCatalog();
}

function renderShopCatalog() {
  if (!activeCustomerShop) return;
  catalogProductsGrid.innerHTML = '';

  const searchVal = shopCatalogSearch.value.trim().toLowerCase();
  const sortBy = catalogSort.value;

  let filteredProducts = [...activeCustomerShop.products].filter(p => {
    if (searchVal) {
      return p.name.toLowerCase().includes(searchVal) || p.desc.toLowerCase().includes(searchVal);
    }
    return true;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (filteredProducts.length === 0) {
    catalogProductsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i data-lucide="help-circle" style="width: 48px; height: 48px; display: block; margin: 0 auto 12px auto;"></i>
        <p>No products cataloged by this shop match your query.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  filteredProducts.forEach(p => {
    const isOutOfStock = p.stock === 0;
    const hasDiscount = p.discount && p.discount > 0;
    const finalPrice = hasDiscount ? getDiscountedPrice(p) : p.price;
    const discountBadgeHTML = hasDiscount ? `<span class="discount-badge" style="position: static; display: inline-block; margin-left: auto;">${p.discount}% OFF</span>` : '';
    const priceHTML = hasDiscount 
      ? `<span class="product-price">₹${finalPrice.toFixed(2)}<span class="original-price-crossed">₹${p.price.toFixed(2)}</span></span>` 
      : `<span class="product-price">₹${p.price.toFixed(2)}</span>`;

    const itemHTML = `
      <div class="product-card glass-card" style="padding: 20px; display: flex; flex-direction: column;">
        ${discountBadgeHTML}
        <h3 class="product-name" onclick="openProductDetails('${p.id}')" style="cursor: pointer; margin-bottom: 8px; font-size: 1.1rem; color: var(--text-primary);">${p.name}</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5; flex-grow: 1;">${p.desc || 'No description available.'}</p>
        <div class="product-footer" style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; border-top: 1px solid var(--border-color); padding-top: 16px;">
          ${priceHTML}
          ${isOutOfStock ? 
            `<span style="color: var(--error-color); font-weight: 700; font-size: 0.9rem; text-transform: uppercase;">Sold Out</span>` :
            `<button class="primary-btn" onclick="triggerQuickAdd('${p.id}')" style="padding: 10px 20px; border-radius: 24px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <i data-lucide="shopping-cart" style="width: 18px; height: 18px;"></i> Add to Cart
             </button>`
          }
        </div>
      </div>
    `;
    catalogProductsGrid.innerHTML += itemHTML;
  });

  lucide.createIcons();
}

catalogBackBtn.addEventListener('click', () => {
  activeCustomerShop = null;
  switchCustomerSubview('cust-shops-directory');
  renderShopsDirectory();
});

shopCatalogSearch.addEventListener('input', renderShopCatalog);
catalogSort.addEventListener('change', renderShopCatalog);


// --- PRODUCT DETAILS MODAL ---
let activeModalProduct = null;

function openProductDetails(productId) {
  if (!activeCustomerShop) return;
  const p = activeCustomerShop.products.find(prod => prod.id === productId);
  if (!p) return;

  activeModalProduct = p;
  
  activeModalProduct = p;
  
  const isOutOfStock = p.stock === 0;

  let sizeOptionsHTML = p.sizes.map((s, idx) => `
    <button class="option-pill ${idx === 0 ? 'active' : ''}" onclick="selectModalSize(this, '${s}')">${s}</button>
  `).join('');

  let colorOptionsHTML = p.colors.map((c, idx) => `
    <div class="color-dot ${idx === 0 ? 'active' : ''}" style="background-color: ${getColorHex(c)};" title="${c}" onclick="selectModalColor(this, '${c}')"></div>
  `).join('');

  const detailContainer = document.getElementById('modal-details-container');
  detailContainer.innerHTML = `
    <span class="modal-shop">${activeCustomerShop.name}</span>
    <h2 class="modal-title">${p.name}</h2>
    
    <div class="modal-meta">
      <div class="modal-stock ${isOutOfStock ? 'out' : ''}">
        <i data-lucide="${isOutOfStock ? 'x-circle' : 'check-circle'}"></i>
        <span>${isOutOfStock ? 'Out of Stock' : `${p.stock} In Stock`}</span>
      </div>
    </div>
    
    <div class="modal-price">
      ${(() => {
        const hasDiscount = p.discount && p.discount > 0;
        const finalPrice = hasDiscount ? getDiscountedPrice(p) : p.price;
        return hasDiscount 
          ? `₹${finalPrice.toFixed(2)} <span class="original-price-crossed">₹${p.price.toFixed(2)}</span> <span style="font-size:0.8rem;background:rgba(239,68,68,0.1);color:#ef4444;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:8px;">${p.discount}% OFF</span>` 
          : `₹${p.price.toFixed(2)}`;
      })()}
    </div>
    
    <p class="modal-desc">${p.desc}</p>
    
    <div class="modal-options">
      ${p.sizes.length > 0 ? `
        <div class="option-group">
          <div class="option-label">Option Pack / Size</div>
          <div class="option-selector" id="modal-size-selector">
            ${sizeOptionsHTML}
          </div>
        </div>
      ` : ''}
      
      ${p.colors.length > 0 ? `
        <div class="option-group">
          <div class="option-label">Variant Preference</div>
          <div class="option-selector" id="modal-color-selector">
            ${colorOptionsHTML}
          </div>
        </div>
      ` : ''}
    </div>
    
    <div class="modal-purchase">
      <div class="quantity-picker">
        <button class="qty-btn" id="modal-qty-dec">-</button>
        <div class="qty-num" id="modal-qty-val">1</div>
        <button class="qty-btn" id="modal-qty-inc">+</button>
      </div>
      <button class="modal-buy-btn" id="modal-add-to-cart-btn" style="background: var(--accent-color);" ${isOutOfStock ? 'disabled style="opacity: 0.5; cursor: not-allowed; background: var(--text-muted);"' : ''}>
        <i data-lucide="shopping-bag"></i>
        <span>${isOutOfStock ? 'Sold Out' : 'Add to Delivery Basket'}</span>
      </button>
    </div>
  `;
  
  activeModalProduct.chosenSize = p.sizes[0];
  activeModalProduct.chosenColor = p.colors[0];
  activeModalProduct.chosenQty = 1;

  const qtyVal = document.getElementById('modal-qty-val');
  document.getElementById('modal-qty-dec').addEventListener('click', () => {
    let q = parseInt(qtyVal.innerText);
    if (q > 1) {
      q--;
      qtyVal.innerText = q;
      activeModalProduct.chosenQty = q;
    }
  });

  document.getElementById('modal-qty-inc').addEventListener('click', () => {
    let q = parseInt(qtyVal.innerText);
    if (q < p.stock) {
      q++;
      qtyVal.innerText = q;
      activeModalProduct.chosenQty = q;
    } else {
      showToast(`Stock limit of ${p.stock} reached.`, 'warning');
    }
  });

  document.getElementById('modal-add-to-cart-btn').addEventListener('click', () => {
    addToCart(p.id, activeModalProduct.chosenQty, activeModalProduct.chosenColor, activeModalProduct.chosenSize);
    modalDialog.close();
    modalDialog.classList.remove('active');
  });

  lucide.createIcons();
  modalDialog.showModal();
  modalDialog.classList.add('active');
}

function selectModalSize(btn, size) {
  document.querySelectorAll('#modal-size-selector .option-pill').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');
  activeModalProduct.chosenSize = size;
}

function selectModalColor(dot, color) {
  document.querySelectorAll('#modal-color-selector .color-dot').forEach(el => el.classList.remove('active'));
  dot.classList.add('active');
  activeModalProduct.chosenColor = color;
}

// Calculate the discounted price of a product
function getDiscountedPrice(product) {
  if (!product) return 0;
  const price = product.price || 0;
  const discount = product.discount || 0;
  return price - (price * discount / 100);
}

// Calculate distance-based delivery fee (Base + per-km fee configured by agency)
function calculateDeliveryFee(distance) {
  return baseDeliveryFee + (distance * perKmDeliveryFee);
}

// Get commission percentage for a specific date and shop (default falls back to shop settings)
function getDailyCommissionRate(dateStr, shopName) {
  const key = `${dateStr}_${shopName}`;
  if (dailyCommissions[key] !== undefined) {
    return dailyCommissions[key];
  }
  return getShopCommissionRate(shopName);
}

// Calculate or retrieve default commission percentage for a shop based on historical orders (manual vs. auto tiered)
function getShopCommissionRate(shopName) {
  const shop = shops.find(s => s.name === shopName);
  if (!shop) return 20.00;

  const totalOrdersCount = deliveries.filter(d => d.shopName === shopName).length;

  if (tieredCommissionRules.enabled) {
    if (totalOrdersCount < tieredCommissionRules.tier1Limit) {
      return tieredCommissionRules.tier1Rate;
    } else if (totalOrdersCount < tieredCommissionRules.tier2Limit) {
      return tieredCommissionRules.tier2Rate;
    } else {
      return tieredCommissionRules.tier3Rate;
    }
  }

  return shop.commissionRate !== undefined ? shop.commissionRate : 20.00;
}

// Calculate the number of free couriers for a shop
function getFreeCouriersCount(shop) {
  if (!shop) return 0;
  if (shop.assignedCouriers === undefined) shop.assignedCouriers = 1;
  const busyCount = deliveries.filter(d => d.shopName === shop.name && d.status === 'Dispatched').length;
  return Math.max(0, shop.assignedCouriers - busyCount);
}

function generateRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHTML += '<i data-lucide="star" class="fill"></i>';
    } else if (i === fullStars + 1 && halfStar) {
      starsHTML += '<i data-lucide="star-half"></i>';
    } else {
      starsHTML += '<i data-lucide="star" style="fill: none;"></i>';
    }
  }
  return starsHTML;
}

function triggerQuickAdd(id) {
  if (!activeCustomerShop) return;
  const p = activeCustomerShop.products.find(prod => prod.id === id);
  if (!p) return;
  addToCart(p.id, 1, p.colors[0], p.sizes[0]);
}

function getColorHex(colorName) {
  const colors = {
    'Organic Fresh': '#556B2F',
    'Sweet Ripe': '#FFD700',
    'Golden Amber': '#FFBF00',
    'Supplement': '#87CEEB',
    'Emergency Red': '#B22222',
    'Mild Spicy': '#FF8C00',
    'Medium Spicy': '#FF4500'
  };
  return colors[colorName] || '#CCCCCC';
}

modalCloseBtn.addEventListener('click', () => {
  modalDialog.close();
  modalDialog.classList.remove('active');
});


// --- CART / BASKET ACTIONS ---
function openCart() {
  cartDrawer.classList.add('active');
  appBackdrop.classList.add('active');
}

function closeCart() {
  cartDrawer.classList.remove('active');
  appBackdrop.classList.remove('active');
}

function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.innerText = totalQty;
  const cartBadge2 = document.getElementById('cart-count-badge');
  if (cartBadge2) cartBadge2.innerText = totalQty;
}

function addToCart(productId, quantity, color, size) {
  if (!activeCustomerShop) return;
  const product = activeCustomerShop.products.find(p => p.id === productId);
  if (!product) return;

  // Enforce single-shop cart consistency (cannot mix items from multiple shops in one delivery)
  if (cart.length > 0 && cart[0].shopId !== activeCustomerShop.id) {
    if (confirm(`Your basket already contains items from "${cart[0].shopName}". Would you like to clear your basket to order from "${activeCustomerShop.name}" instead?`)) {
      cart = [];
    } else {
      return;
    }
  }

  const existingIndex = cart.findIndex(item => 
    item.product.id === productId && 
    item.selectedColor === color && 
    item.selectedSize === size
  );

  if (existingIndex > -1) {
    if (cart[existingIndex].quantity + quantity > product.stock) {
      showToast(`Stock limit of ${product.stock} items reached.`, 'warning');
      return;
    }
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      product,
      quantity,
      selectedColor: color,
      selectedSize: size,
      shopId: activeCustomerShop.id,
      shopName: activeCustomerShop.name
    });
  }

  showToast(`Added ${quantity} ${product.name} to Delivery Basket!`, 'success');
  renderCart();
  
  cartBtn.style.transform = 'scale(1.2)';
  setTimeout(() => cartBtn.style.transform = '', 300);
}

function renderCart() {
  updateCartBadge();
  syncStorage();

  if (currentCheckoutDistance === 0.0) {
    currentCheckoutDistance = parseFloat((Math.random() * 6.5 + 1.5).toFixed(1));
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px;"></i>
        <p>Your basket is empty.</p>
      </div>
    `;
    cartSubtotal.innerText = '₹0.00';
    cartTax.innerText = '₹0.00';
    cartTotal.innerText = '₹0.00';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemSubtotal = getDiscountedPrice(item.product) * item.quantity;
    subtotal += itemSubtotal;

    const cartItemHTML = `
      <div class="cart-item">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-meta">Store: ${item.shopName} | Option: ${item.selectedSize}</div>
          <div class="cart-item-footer">
            <div class="quantity-picker" style="transform: scale(0.85); transform-origin: left center;">
              <button class="qty-btn" onclick="adjustCartQty(${index}, -1)">-</button>
              <div class="qty-num">${item.quantity}</div>
              <button class="qty-btn" onclick="adjustCartQty(${index}, 1)">+</button>
            </div>
            <div class="cart-item-price">₹${itemSubtotal.toFixed(2)}</div>
          </div>
        </div>
        <div class="cart-item-remove" onclick="removeCartItem(${index})" title="Remove item">
          <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
        </div>
      </div>
    `;
    cartItemsContainer.innerHTML += cartItemHTML;
  });

  const total = subtotal;

  cartSubtotal.innerText = `₹${subtotal.toFixed(2)}`;
  cartTax.innerHTML = `<span style="color:var(--warning-color);font-weight:600;">Pending</span> <span style="font-size:0.75rem;color:var(--text-muted);font-weight:normal;">(Assigned after delivery)</span>`;
  cartTotal.innerText = `₹${total.toFixed(2)}`;

  // --- DASHBOARD CART INTEGRATION ---
  const dashCartItems = document.getElementById('dashboard-cart-items');
  const dashCartSubtotal = document.getElementById('dash-cart-subtotal');
  const dashCartDelivery = document.getElementById('dash-cart-delivery');
  const dashCartTotal = document.getElementById('dash-cart-total');

  if (dashCartItems) {
    if (cart.length === 0) {
      dashCartItems.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-top: 20px;">
          <i data-lucide="shopping-cart" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.5;"></i><br>
          Cart is empty
        </div>`;
    } else {
      dashCartItems.innerHTML = '';
      cart.forEach((item, index) => {
        const itemSubtotal = getDiscountedPrice(item.product) * item.quantity;
        dashCartItems.innerHTML += `
          <div class="cart-item-sm">
            <div style="flex: 1; overflow: hidden;">
              <h4 style="font-size: 0.85rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.product.name}</h4>
              <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; margin-top: 4px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="cursor:pointer;" onclick="adjustCartQty(${index}, -1)">-</span>
                  <strong>${item.quantity}</strong>
                  <span style="cursor:pointer;" onclick="adjustCartQty(${index}, 1)">+</span>
                </div>
                <span>₹${itemSubtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        `;
      });
    }
    if (dashCartSubtotal) dashCartSubtotal.innerText = `₹${subtotal.toFixed(2)}`;
    if (dashCartDelivery) dashCartDelivery.innerText = `Pending`;
    if (dashCartTotal) dashCartTotal.innerText = `₹${total.toFixed(2)}`;
  }

  lucide.createIcons();
}

function adjustCartQty(index, change) {
  const item = cart[index];
  
  // Find product stock limit in active shop list
  const shop = shops.find(s => s.id === item.shopId);
  const product = shop ? shop.products.find(p => p.id === item.product.id) : null;
  const maxStock = product ? product.stock : 99;

  const newQty = item.quantity + change;
  if (newQty <= 0) {
    removeCartItem(index);
    return;
  }
  if (newQty > maxStock) {
    showToast(`Maximum stock limit of ${maxStock} reached.`, 'warning');
    return;
  }

  item.quantity = newQty;
  renderCart();
}

function removeCartItem(index) {
  const name = cart[index].product.name;
  cart.splice(index, 1);
  showToast(`Removed ${name} from Delivery Basket`, 'info');
  renderCart();
}




// --- CHECKOUT FLOW ---
let selectedPaymentMethod = 'cod';
const paymentMethodSelector = document.getElementById('payment-method-selector');
const cardContainer = document.getElementById('payment-method-card-container');
const upiContainer = document.getElementById('payment-method-upi-container');
const codContainer = document.getElementById('payment-method-cod-container');
const payUpiInput = document.getElementById('pay-upi-id');

if (paymentMethodSelector) {
  paymentMethodSelector.addEventListener('click', (e) => {
    const pill = e.target.closest('.option-pill');
    if (!pill) return;

    paymentMethodSelector.querySelectorAll('.option-pill').forEach(btn => btn.classList.remove('active'));
    pill.classList.add('active');

    selectedPaymentMethod = pill.dataset.method;
    
    cardContainer.style.display = selectedPaymentMethod === 'card' ? 'block' : 'none';
    upiContainer.style.display = selectedPaymentMethod === 'upi' ? 'block' : 'none';
    codContainer.style.display = selectedPaymentMethod === 'cod' ? 'block' : 'none';

    // Required toggles
    const cardName = document.getElementById('pay-name');
    const cardNum = document.getElementById('pay-card-num');
    const cardExp = document.getElementById('pay-expiry');
    const cardCvv = document.getElementById('pay-cvv');

    if (selectedPaymentMethod === 'card') {
      cardName.setAttribute('required', 'true');
      cardNum.setAttribute('required', 'true');
      cardExp.setAttribute('required', 'true');
      cardCvv.setAttribute('required', 'true');
      payUpiInput.removeAttribute('required');
    } else if (selectedPaymentMethod === 'upi') {
      cardName.removeAttribute('required');
      cardNum.removeAttribute('required');
      cardExp.removeAttribute('required');
      cardCvv.removeAttribute('required');
      payUpiInput.setAttribute('required', 'true');
    } else {
      cardName.removeAttribute('required');
      cardNum.removeAttribute('required');
      cardExp.removeAttribute('required');
      cardCvv.removeAttribute('required');
      payUpiInput.removeAttribute('required');
    }
  });
}

function renderCheckoutSummary() {
  checkoutSummaryItems.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = getDiscountedPrice(item.product) * item.quantity;
    subtotal += itemSubtotal;

    const html = `
      <div class="checkout-summary-item">
        <div>
          <div class="checkout-summary-name" style="max-width:200px;font-weight:600;">${item.product.name}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Qty: ${item.quantity} | ${item.shopName}</span>
        </div>
        <strong>₹${itemSubtotal.toFixed(2)}</strong>
      </div>
    `;
    checkoutSummaryItems.innerHTML += html;
  });

  const shopId = cart.length > 0 ? cart[0].shopId : (activeCustomerShop ? activeCustomerShop.id : null);
  const dbShop = shopId ? shops.find(s => s.id === shopId) : null;
  const currentDiscountRate = dbShop && dbShop.promoDiscountRate !== undefined ? dbShop.promoDiscountRate : 70;

  const discountAmount = activePromoCode ? (subtotal * (currentDiscountRate / 100)) : (subtotal * (discountPercent / 100));
  const grandTotal = subtotal - discountAmount;

  checkoutSubtotal.innerText = `₹${subtotal.toFixed(2)}`;
  checkoutShipping.innerHTML = `<span style="color:var(--warning-color);font-weight:600;">Pending</span> <span style="font-size:0.75rem;color:var(--text-muted);font-weight:normal;">(Assigned after delivery)</span>`;
  checkoutDiscount.innerText = `-₹${discountAmount.toFixed(2)}`;
  if (activePromoCode) {
    checkoutDiscount.innerHTML += ` <span style="font-size:0.75rem;background:rgba(34,197,94,0.1);color:var(--success-color);padding:2px 6px;border-radius:4px;font-weight:700;margin-left:8px;">(PROMO ${currentDiscountRate}%)</span>`;
  }
  checkoutTotal.innerText = `₹${grandTotal.toFixed(2)}`;
}

if (checkoutPromoApplyBtn) {
  checkoutPromoApplyBtn.addEventListener('click', () => {
    const code = checkoutPromoInput.value.trim().toUpperCase();
    if (!code) return;
    
    const dateStr = getTodayDateString();
    const shopId = cart.length > 0 ? cart[0].shopId : (activeCustomerShop ? activeCustomerShop.id : null);
    const validCodes = shopId ? generateDailyPromoCodes(shopId, dateStr) : [];
    
    if (!validCodes.includes(code)) {
      checkoutPromoMsg.innerText = "Invalid Promo Code for this shop.";
      checkoutPromoMsg.style.color = "var(--error-color)";
      activePromoCode = null;
      renderCheckoutSummary();
      return;
    }
    
    if (isPromoCodeUsed(code, dateStr)) {
      checkoutPromoMsg.innerText = "Promo Code has already been used today.";
      checkoutPromoMsg.style.color = "var(--error-color)";
      activePromoCode = null;
      renderCheckoutSummary();
      return;
    }
    
    const dbShop = shopId ? shops.find(s => s.id === shopId) : null;
    const currentDiscountRate = dbShop && dbShop.promoDiscountRate !== undefined ? dbShop.promoDiscountRate : 70;
    
    // Apply the discount
    activePromoCode = code;
    checkoutPromoMsg.innerText = `${currentDiscountRate}% Discount Applied Successfully!`;
    checkoutPromoMsg.style.color = "var(--success-color)";
    
    renderCheckoutSummary(); // re-render totals
  });
}

cartCheckoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast("Your basket is empty.", "warning");
    return;
  }
  closeCart();
  currentCheckoutDistance = parseFloat((Math.random() * 6.5 + 1.5).toFixed(1));
  switchCustomerSubview('cust-checkout-view');

  if (activeCustomer) {
    document.getElementById('registered-address-display').innerHTML = `
      <strong>${activeCustomer.name}</strong><br>
      ${activeCustomer.address}<br>
      ${activeCustomer.city}, ${activeCustomer.state} - ${activeCustomer.pin}<br>
      <i data-lucide="phone" style="width:12px; height:12px; display:inline-block; vertical-align:middle;"></i> ${activeCustomer.phone}
    `;
    lucide.createIcons();
  }

  setCheckoutStep(1);
  renderCheckoutSummary();
});

function setCheckoutStep(step) {
  // Toggle forms panels
  panels.forEach((p, idx) => {
    if (idx === step - 1) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // Toggle markers
  stepInds.forEach((ind, idx) => {
    ind.classList.remove('active', 'completed');
    if (idx === step - 1) {
      ind.classList.add('active');
    } else if (idx < step - 1) {
      ind.classList.add('completed');
    }
  });
}

next1.addEventListener('click', (e) => {
  e.preventDefault();
  setCheckoutStep(2);
});

back2.addEventListener('click', () => setCheckoutStep(1));

next2.addEventListener('click', (e) => {
  e.preventDefault();
  
  let isValid = false;
  if (selectedPaymentMethod === 'card') {
    isValid = paymentForm.checkValidity();
  } else if (selectedPaymentMethod === 'upi') {
    isValid = payUpiInput.checkValidity();
  } else {
    isValid = true; // COD
  }

  if (isValid) {
    // Populate review summary values
    const name = activeCustomer ? activeCustomer.name : 'Guest';
    const address = activeCustomer ? activeCustomer.address : '';
    const city = activeCustomer ? activeCustomer.city : '';
    const zip = activeCustomer ? activeCustomer.pin : '';
    
    document.getElementById('review-shipping-address').innerText = 
      `${name}, ${address}, ${city}, ${zip}`;

    const reviewPaymentMethod = document.getElementById('review-payment-method');
    if (selectedPaymentMethod === 'card') {
      const cardNumVal = cardNumInput.value.replace(/\s+/g, '');
      const last4 = cardNumVal.slice(-4) || '4444';
      const cardBrand = cardBrandDisplay.innerText;
      reviewPaymentMethod.innerText = `${cardBrand} ending in ${last4}`;
    } else if (selectedPaymentMethod === 'upi') {
      const upiId = payUpiInput.value.trim();
      reviewPaymentMethod.innerText = `UPI ID: ${upiId}`;
    } else if (selectedPaymentMethod === 'cod') {
      reviewPaymentMethod.innerText = 'Cash on Delivery (COD)';
    }

    setCheckoutStep(3);
  } else {
    if (selectedPaymentMethod === 'card') {
      paymentForm.reportValidity();
    } else if (selectedPaymentMethod === 'upi') {
      payUpiInput.reportValidity();
    }
  }
});

back3.addEventListener('click', () => setCheckoutStep(2));

// Live payment card graphics sync
cardNumInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  let formatted = '';
  for (let i = 0; i < val.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += val[i];
  }
  e.target.value = formatted;
  cardNumDisplay.innerText = formatted || '•••• •••• •••• ••••';

  if (val.startsWith('4')) {
    cardBrandDisplay.innerText = 'VISA';
  } else if (val.startsWith('5')) {
    cardBrandDisplay.innerText = 'MASTERCARD';
  } else if (val.startsWith('3')) {
    cardBrandDisplay.innerText = 'AMEX';
  } else {
    cardBrandDisplay.innerText = 'CARD';
  }
});

cardNameInput.addEventListener('input', (e) => {
  cardNameDisplay.innerText = e.target.value.toUpperCase() || 'RAHUL SHARMA';
});

cardExpiryInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 2) {
    e.target.value = val.slice(0,2) + '/' + val.slice(2,4);
  } else {
    e.target.value = val;
  }
  cardExpDisplay.innerText = e.target.value || 'MM/YY';
});

// Place Delivery Dispatch Request
confirmBtn.addEventListener('click', () => {
  // Deduct inventory levels
  cart.forEach(cartItem => {
    const shop = shops.find(s => s.id === cartItem.shopId);
    if (shop) {
      const product = shop.products.find(p => p.id === cartItem.product.id);
      if (product) {
        product.stock = Math.max(0, product.stock - cartItem.quantity);
      }
    }
  });

  const grandTotalText = checkoutTotal.innerText;
  const itemsText = cart.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
  const name = activeCustomer ? activeCustomer.name : 'Guest';
  
  const newOrderId = '#DL-' + Math.floor(1000 + Math.random() * 9000);

  const customerPhone = activeCustomer ? activeCustomer.phone : '0000000000';
  const subtotal = cart.reduce((acc, item) => acc + (getDiscountedPrice(item.product) * item.quantity), 0);
  const shopId = cart.length > 0 ? cart[0].shopId : null;
  const dbShop = shopId ? shops.find(s => s.id === shopId) : null;
  const currentDiscountRate = dbShop && dbShop.promoDiscountRate !== undefined ? dbShop.promoDiscountRate : 70;
  const promoDiscount = activePromoCode ? (subtotal * (currentDiscountRate / 100)) : (subtotal * (discountPercent / 100));

  // Push new courier delivery item to dispatch log
  const computedTotal = parseFloat(grandTotalText.replace('₹', ''));
  deliveries.unshift({
    id: newOrderId,
    customerName: name,
    phone: customerPhone,
    shopName: cart[0].shopName,
    items: itemsText,
    originalTotal: computedTotal,
    discount: 0,
    total: computedTotal,
    status: 'Pending',
    time: 'Just now',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    distance: currentCheckoutDistance,
    deliveryFee: 0.00, // Assigned after delivery
    subtotal: subtotal,
    promoDiscount: promoDiscount,
    promoCode: activePromoCode || null,
    commissionRate: getShopCommissionRate(cart[0].shopName),
    paymentMethod: 'Cash on Delivery (COD)',
    deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
    itemsDetails: JSON.parse(JSON.stringify(cart))
  });

  // Success Receipt details
  successOrderId.innerText = newOrderId;
  successReceiptTotal.innerText = grandTotalText;

  successReceiptItems.innerHTML = '';
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'receipt-row';
    row.innerHTML = `
      <span>${item.quantity}x ${item.product.name}</span>
      <strong>₹${(getDiscountedPrice(item.product) * item.quantity).toFixed(2)}</strong>
    `;
    successReceiptItems.appendChild(row);
  });

  // Clear Basket
  cart = [];
  discountPercent = 0;
  appliedPromo = '';
  activePromoCode = null;
  if (checkoutPromoInput) checkoutPromoInput.value = '';
  if (checkoutPromoMsg) checkoutPromoMsg.innerText = '';

  syncStorage();
  renderCart();
  renderShopsDirectory();
  renderPartnerDeliveries();

  switchCustomerSubview('cust-success-view');
  showToast("Courier dispatched successfully!", "success");
});

successContinueBtn.addEventListener('click', () => {
  activeCustomerShop = null;
  switchCustomerSubview('cust-shops-directory');
  renderShopsDirectory();
});

successPrintBtn.addEventListener('click', () => {
  window.print();
});


// --- PORTAL B: SHOP PARTNER LOGIC ---

function renderShopPartnerPortal() {
  if (activeShopSession) {
    // Show Dashboard
    shopLoginPanel.classList.remove('active');
    shopDashboardPanel.classList.add('active');
    
    // Draw Details
    partnerShopName.innerText = activeShopSession.name;
    partnerShopId.innerText = activeShopSession.id;
    partnerShopCategory.innerText = activeShopSession.category + ' business';
    partnerShopArea.innerText = activeShopSession.area;
    
    // Status Switch layout
    updatePartnerStatusDisplay();
    renderPartnerInventory();
    renderPartnerDeliveries();
    renderPartnerPromoCodes();

    // Courier Staffing requirements display
    const dbShop = shops.find(s => s.id === activeShopSession.id);
    if (dbShop) {
      if (dbShop.requestedCouriers === undefined) dbShop.requestedCouriers = 1;
      if (dbShop.assignedCouriers === undefined) dbShop.assignedCouriers = 1;
      
      const assignedDisplay = document.getElementById('partner-assigned-couriers-display');
      const requiredSelect = document.getElementById('s-couriers-required');
      if (assignedDisplay) assignedDisplay.innerText = dbShop.assignedCouriers;
      if (requiredSelect) requiredSelect.value = dbShop.requestedCouriers;
    }
  } else {
    // Show Login
    shopLoginPanel.classList.add('active');
    shopDashboardPanel.classList.remove('active');
  }
}

// Render Daily Promo Codes for Partner
function renderPartnerPromoCodes() {
  const promoList = document.getElementById('partner-promo-codes-list');
  const titleEl = document.getElementById('partner-promo-title');
  const inputEl = document.getElementById('partner-promo-rate-input');
  if (!promoList || !activeShopSession) return;
  
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  const discountRate = dbShop && dbShop.promoDiscountRate !== undefined ? dbShop.promoDiscountRate : 70;
  
  if (titleEl) titleEl.innerText = `Today's ${discountRate}% Promo Codes`;
  if (inputEl) inputEl.value = discountRate;
  
  promoList.innerHTML = '';
  const dateStr = getTodayDateString();
  const codes = generateDailyPromoCodes(activeShopSession.id, dateStr);
  
  codes.forEach(code => {
    const isUsed = isPromoCodeUsed(code, dateStr);
    const badgeHTML = isUsed 
      ? `<span style="font-size: 0.75rem; background: rgba(239, 68, 68, 0.15); color: var(--error-color); padding: 2px 8px; border-radius: 12px; font-weight: 600;">Used</span>`
      : `<span style="font-size: 0.75rem; background: rgba(34, 197, 94, 0.15); color: var(--success-color); padding: 2px 8px; border-radius: 12px; font-weight: 600;">Available</span>`;
      
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.padding = '10px 14px';
    div.style.background = 'var(--bg-tertiary)';
    div.style.borderRadius = 'var(--border-radius-sm)';
    div.style.border = '1px solid var(--border-color)';
    
    div.innerHTML = `
      <code style="font-weight: 700; color: var(--accent-color); font-size: 1.05rem; letter-spacing: 1px;">${code}</code>
      ${badgeHTML}
    `;
    promoList.appendChild(div);
  });
}

const partnerPromoRateBtn = document.getElementById('partner-promo-rate-btn');
if (partnerPromoRateBtn) {
  partnerPromoRateBtn.addEventListener('click', () => {
    if (!activeShopSession) return;
    const inputEl = document.getElementById('partner-promo-rate-input');
    let val = parseInt(inputEl.value);
    if (isNaN(val) || val < 0 || val > 100) {
      showToast('Please enter a valid percentage between 0 and 100', 'warning');
      return;
    }
    const dbShop = shops.find(s => s.id === activeShopSession.id);
    if (dbShop) {
      dbShop.promoDiscountRate = val;
      activeShopSession.promoDiscountRate = val;
      syncStorage();
      renderPartnerPromoCodes();
      showToast(`Promo discount set to ${val}%`, 'success');
    }
  });
}

// Shop Login form submit
shopLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputId = loginShopIdInput.value.trim();
  const inputPass = loginShopPassInput.value.trim();

  const matchedShop = shops.find(s => s.id === inputId && s.password === inputPass);
  
  if (matchedShop) {
    activeShopSession = matchedShop;
    sessionStorage.setItem('active_shop_session', JSON.stringify(activeShopSession));
    
    loginShopIdInput.value = '';
    loginShopPassInput.value = '';

    showToast(`Welcome back, ${matchedShop.name}!`, 'success');
    renderShopPartnerPortal();
  } else {
    showToast("Invalid Shop Partner ID or Password", "error");
  }
});

// Logout — shop stays ONLINE even after logout until admin manually sets it offline
partnerLogoutBtn.addEventListener('click', () => {
  if (activeShopSession) {
    const shopName = activeShopSession.name;
    const wasLive = activeShopSession.isLive;

    // Clear session only — do NOT change isLive status
    activeShopSession = null;
    sessionStorage.removeItem('active_shop_session');

    if (wasLive) {
      showToast(`Logged out from ${shopName}. Shop remains ONLINE for customers.`, 'info');
    } else {
      showToast(`Logged out from ${shopName}.`, 'info');
    }

    renderShopPartnerPortal();
    renderShopsDirectory();
  }
});

// Toggle partner live online status
partnerStatusToggleBtn.addEventListener('click', () => {
  if (!activeShopSession) return;

  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  dbShop.isLive = !dbShop.isLive;
  activeShopSession.isLive = dbShop.isLive;
  sessionStorage.setItem('active_shop_session', JSON.stringify(activeShopSession));

  syncStorage();
  updatePartnerStatusDisplay();

  // Update Customer Front
  renderShopsDirectory();

  if (dbShop.isLive) {
    showToast("🟢 Shop is now LIVE! Stays online even if you log out.", "success");
  } else {
    showToast("🔴 Shop is now OFFLINE. Customers cannot see your shop.", "info");
  }
});

function updatePartnerStatusDisplay() {
  if (!activeShopSession) return;
  
  if (activeShopSession.isLive) {
    partnerStatusLabel.innerText = "Live (Online)";
    partnerStatusLabel.style.color = "var(--success-color)";
    partnerStatusToggleBtn.className = "nav-btn live";
    partnerStatusToggleBtn.innerHTML = '<i data-lucide="wifi"></i>';
  } else {
    partnerStatusLabel.innerText = "Offline (Closed)";
    partnerStatusLabel.style.color = "var(--error-color)";
    partnerStatusToggleBtn.className = "nav-btn offline";
    partnerStatusToggleBtn.innerHTML = '<i data-lucide="wifi-off"></i>';
  }
  lucide.createIcons();
}

// Render shop catalog inventory
function renderPartnerInventory() {
  partnerInventoryRows.innerHTML = '';
  if (!activeShopSession) return;

  // Find shop listing from actual dynamic memory
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  if (dbShop.products.length === 0) {
    partnerInventoryRows.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No products listed yet. Add items using the left form.
        </td>
      </tr>
    `;
    return;
  }

  dbShop.products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="display:flex; flex-direction: column; gap:4px; max-width: 250px;">
          <div style="font-weight:600; font-size: 1rem; color: var(--text-primary);">${p.name} <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;margin-left:6px;">${p.id}</span></div>
          <div style="font-size:0.85rem;color:var(--text-secondary); white-space: normal; line-height: 1.4;">${p.desc || 'No description provided.'}</div>
        </div>
      </td>
      <td>
        ${(() => {
          const hasDiscount = p.discount && p.discount > 0;
          return hasDiscount 
            ? `<strong>₹${getDiscountedPrice(p).toFixed(2)}</strong> <span style="font-size:0.75rem;color:var(--error-color);font-weight:700;">(-${p.discount}%)</span><div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through;">₹${p.price.toFixed(2)}</div>` 
            : `<strong>₹${p.price.toFixed(2)}</strong>`;
        })()}
      </td>
      <td>
        <span class="inv-stock-badge ${p.stock === 0 ? 'out' : (p.stock <= 5 ? 'low' : 'in')}">
          ${p.stock} units
        </span>
      </td>
      <td>
        <div style="display:flex; gap:8px;">
          <button class="inv-action-btn" onclick="editPartnerProductPrice('${p.id}')" title="Modify Price" style="color: #10b981; border-color: rgba(16, 185, 129, 0.2);"><i data-lucide="dollar-sign" style="width:14px;height:14px;"></i></button>
          <button class="inv-action-btn" onclick="editPartnerProductStock('${p.id}')" title="Modify Stock count"><i data-lucide="edit-2" style="width:14px;height:14px;"></i></button>
          <button class="inv-action-btn" onclick="editPartnerProductDiscount('${p.id}')" title="Modify Discount percentage" style="color: #f97316; border-color: rgba(249, 115, 22, 0.2);"><i data-lucide="percent" style="width:14px;height:14px;"></i></button>
          <button class="inv-action-btn delete" onclick="deletePartnerProduct('${p.id}')" title="Delete listing"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
        </div>
      </td>
    `;
    partnerInventoryRows.appendChild(tr);
  });

  lucide.createIcons();
}

// Adjust stock count inside shop portal
function editPartnerProductStock(prodId) {
  if (!activeShopSession) return;
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const product = dbShop.products.find(p => p.id === prodId);
  if (!product) return;

  const inputStock = prompt(`Update stock units for "${product.name}":`, product.stock);
  if (inputStock === null) return;

  const newStock = parseInt(inputStock);
  if (isNaN(newStock) || newStock < 0) {
    showToast("Invalid stock count.", 'error');
    return;
  }

  product.stock = newStock;
  syncStorage();
  renderPartnerInventory();
  showToast(`Updated stock to ${newStock} units.`, 'success');
}

// Adjust discount percentage inside shop portal
function editPartnerProductDiscount(prodId) {
  if (!activeShopSession) return;
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const product = dbShop.products.find(p => p.id === prodId);
  if (!product) return;

  const inputDiscount = prompt(`Update discount percentage (0-99%) for "${product.name}":`, product.discount || 0);
  if (inputDiscount === null) return;

  const newDiscount = parseInt(inputDiscount);
  if (isNaN(newDiscount) || newDiscount < 0 || newDiscount > 99) {
    showToast("Invalid discount percentage. Must be between 0 and 99.", 'error');
    return;
  }

  product.discount = newDiscount;
  syncStorage();
  renderPartnerInventory();
  showToast(`Updated discount for "${product.name}" to ${newDiscount}%.`, 'success');
}
window.editPartnerProductDiscount = editPartnerProductDiscount;

// Adjust product price inside shop portal
function editPartnerProductPrice(prodId) {
  if (!activeShopSession) return;
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const product = dbShop.products.find(p => p.id === prodId);
  if (!product) return;

  const inputPrice = prompt(`Update retail price (₹) for "${product.name}":`, product.price);
  if (inputPrice === null) return;

  const newPrice = parseFloat(inputPrice);
  if (isNaN(newPrice) || newPrice <= 0) {
    showToast("Invalid price. Must be greater than 0.", 'error');
    return;
  }

  product.price = newPrice;
  syncStorage();
  renderPartnerInventory();
  showToast(`Updated price for "${product.name}" to ₹${newPrice.toFixed(2)}.`, 'success');
}
window.editPartnerProductPrice = editPartnerProductPrice;

// Delete product inside shop portal
function deletePartnerProduct(prodId) {
  if (!activeShopSession) return;
  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const idx = dbShop.products.findIndex(p => p.id === prodId);
  if (idx === -1) return;

  if (confirm(`Remove "${dbShop.products[idx].name}" from your shop catalog?`)) {
    const name = dbShop.products[idx].name;
    dbShop.products.splice(idx, 1);
    
    syncStorage();
    renderPartnerInventory();
    showToast(`Removed product listing: ${name}`, 'info');
  }
}

// Shop lists new product storefront
shopAddProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!activeShopSession) return;

  const dbShop = shops.find(s => s.id === activeShopSession.id);
  if (!dbShop) return;

  const name = document.getElementById('s-prod-name').value.trim();
  const price = parseFloat(document.getElementById('s-prod-price').value);
  const discountInput = document.getElementById('s-prod-discount');
  const discount = discountInput && discountInput.value ? parseInt(discountInput.value) : 0;
  const stock = parseInt(document.getElementById('s-prod-stock').value);
  const desc = document.getElementById('s-prod-desc').value.trim();

  // Assign category-based default image
  let image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800'; // default Grocery
  if (dbShop.category === 'Pharmacy') {
    image = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800';
  } else if (dbShop.category === 'Restaurant') {
    image = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800';
  } else if (dbShop.category === 'Boutique') {
    image = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800';
  }

  if (price <= 0 || stock < 0) {
    showToast("Price must be positive and stock non-negative.", "error");
    return;
  }
  if (discount < 0 || discount > 99) {
    showToast("Discount must be between 0% and 99%.", "error");
    return;
  }

  const newProduct = {
    id: 'p-' + dbShop.id.toLowerCase() + '-' + Math.floor(100 + Math.random() * 900),
    name,
    price,
    discount,
    stock,
    rating: 5.0,
    reviews: 0,
    image,
    desc,
    sizes: ['Standard Size'],
    colors: ['Standard Variant']
  };

  dbShop.products.push(newProduct);
  syncStorage();

  shopAddProductForm.reset();
  renderPartnerInventory();
  showToast(`Successfully listed "${name}"!`, 'success');
});

// Render delivery dispatches for the logged-in shop partner
function renderPartnerDeliveries() {
  if (!partnerDeliveryRows) return;
  partnerDeliveryRows.innerHTML = '';

  if (!activeShopSession) return;

  const shopDeliveries = deliveries.filter(d => d.shopName === activeShopSession.name);

  if (shopDeliveries.length === 0) {
    partnerDeliveryRows.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No active dispatches.
        </td>
      </tr>
    `;
    return;
  }

  shopDeliveries.forEach(del => {
    let badgeHTML = '';
    if (del.status === 'Pending') {
      const shopOfDelivery = shops.find(s => s.name === del.shopName);
      const freeCouriersOfShop = shopOfDelivery ? getFreeCouriersCount(shopOfDelivery) : 0;
      if (freeCouriersOfShop <= 0) {
        badgeHTML = `<span class="delivery-badge pending" style="background: rgba(249, 115, 22, 0.15); color: #f97316;">Queued (Waiting)</span>`;
      } else {
        badgeHTML = `<span class="delivery-badge pending">Pending Dispatch</span>`;
      }
    } else if (del.status === 'Dispatched') {
      badgeHTML = `<span class="delivery-badge dispatched">Out for Delivery</span>`;
    } else {
      badgeHTML = `<span class="delivery-badge delivered">Delivered</span>`;
    }

    const hasOrderDiscount = del.discount && del.discount > 0;
    const displayTotalHTML = hasOrderDiscount 
      ? `<strong>₹${del.total.toFixed(2)}</strong><div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through;">₹${(del.originalTotal || del.total).toFixed(2)}</div>`
      : `<strong>₹${del.total.toFixed(2)}</strong>`;

    const isDelivered = del.status === 'Delivered';
    const discountOptions = [0, 5, 10, 15, 20, 30, 50].map(opt => {
      const isSelected = (del.discount || 0) === opt ? 'selected' : '';
      return `<option value="${opt}" ${isSelected}>${opt}% OFF</option>`;
    }).join('');

    const selectDisabled = isDelivered ? 'disabled' : '';
    const discountSelectorHTML = `
      <select onchange="applyOrderDiscount('${del.id}', this.value)" ${selectDisabled} style="background:var(--bg-tertiary);border:1px solid var(--border-color);color:var(--text-primary);padding:4px 8px;border-radius:var(--border-radius-sm);font-size:0.8rem;outline:none;">
        ${discountOptions}
      </select>
    `;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><a href="#" onclick="viewThermalReceipt('${del.id}'); return false;" style="color: var(--accent-color); font-weight: bold; text-decoration: underline;">${del.id}</a></td>
      <td><strong>${del.customerName}</strong></td>
      <td><div style="font-size: 0.85rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${del.items}">${del.items}</div></td>
      <td>${displayTotalHTML}</td>
      <td>${discountSelectorHTML}</td>
      <td>${badgeHTML}</td>
      <td>
        <button class="back-btn delete-order-track-btn" style="padding: 6px 12px; border-color: rgba(239, 68, 68, 0.3); color: var(--error-color); font-size: 0.8rem; border-radius: var(--border-radius-sm);">
          <i data-lucide="trash-2" style="width:12px; height:12px; vertical-align:middle; margin-right:4px;"></i> Delete
        </button>
      </td>
    `;

    // Bind delete tracking button
    const deleteBtn = tr.querySelector('.delete-order-track-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete order tracking for "${del.id}"?`)) {
          const delId = del.id;

          // Remove from local state immediately
          deliveries = deliveries.filter(d => d.id !== delId);

          // Call dedicated DELETE endpoint so ALL devices see this deletion
          fetch(`/api/deliveries/${encodeURIComponent(delId)}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => console.log(`✅ Delivery ${delId} deleted from MongoDB.`))
            .catch(err => console.error('Error deleting delivery from server:', err));

          syncStorage();
          renderPartnerDeliveries();
          renderAgencyDeliveries();
          updateAgencyStats();
          showToast(`Order tracking for "${delId}" deleted successfully.`, "success");
        }
      });
    }

    partnerDeliveryRows.appendChild(tr);
  });

  lucide.createIcons();
  renderPartnerDailyReports();
}


// --- PORTAL C: DELIVERY AGENCY HUB LOGIC ---

const adminPanelPasswords = {
  'agency-deliveries': 'dispatch123',
  'agency-customer-approvals': 'approve123',
  'agency-reports': 'reports123',
  'agency-register-shops': 'manage123',
  'agency-shops-list': 'manage123',
  'agency-courier-allocation': 'manage123',
  'agency-commission-settings': 'manage123',
  'agency-fee-settings': 'manage123'
};

dbNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.dataset.panel;
    
    const unlockedGroups = JSON.parse(sessionStorage.getItem('unlocked_admin_groups') || '{}');
    const requiredPass = adminPanelPasswords[target];
    
    if (requiredPass && unlockedGroups[requiredPass] !== true) {
      const pass = prompt('Enter sub-admin password for this section:');
      if (pass !== requiredPass) {
        showToast('Incorrect password. Access denied.', 'error');
        return;
      }
      unlockedGroups[requiredPass] = true;
      sessionStorage.setItem('unlocked_admin_groups', JSON.stringify(unlockedGroups));
      showToast('Section unlocked successfully', 'success');
    }

    dbNavLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    dbPanels.forEach(panel => {
      if (panel.id === target) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  });
});

// Render Agency Portal (checks login session)
function renderAgencyPortal() {
  const agencyLoginPanel = document.getElementById('agency-login-panel');
  const agencyDashboardPanel = document.getElementById('agency-dashboard-panel');
  const isAgencyLoggedIn = sessionStorage.getItem('active_agency_session') === 'true';

  if (isAgencyLoggedIn) {
    if (agencyLoginPanel) agencyLoginPanel.classList.remove('active');
    if (agencyDashboardPanel) agencyDashboardPanel.classList.add('active');
    
    // Check initial panel lock
    const activeLink = document.querySelector('.db-nav-link.active');
    if (activeLink) {
      const target = activeLink.dataset.panel;
      const unlockedGroups = JSON.parse(sessionStorage.getItem('unlocked_admin_groups') || '{}');
      const requiredPass = adminPanelPasswords[target];
      if (requiredPass && unlockedGroups[requiredPass] !== true) {
         dbPanels.forEach(p => p.classList.remove('active'));
         activeLink.classList.remove('active');
         // Use setTimeout to allow UI to render the blank state before blocking with prompt
         setTimeout(() => {
           activeLink.click();
         }, 100);
      }
    }
    updateAgencyStats();
    renderAgencyDeliveries();
    renderAgencyShops();
    renderCourierAllocation();
    renderAgencyCommissionSettings();

    // Load delivery fee inputs
    const baseFeeInput = document.getElementById('agency-base-fee-input');
    const perKmInput = document.getElementById('agency-per-km-input');
    if (baseFeeInput) baseFeeInput.value = baseDeliveryFee.toFixed(2);
    if (perKmInput) perKmInput.value = perKmDeliveryFee.toFixed(2);
  } else {
    if (agencyLoginPanel) agencyLoginPanel.classList.add('active');
    if (agencyDashboardPanel) agencyDashboardPanel.classList.remove('active');
  }
}

// Update top statistics panel
function updateAgencyStats() {
  agStatTotalShops.innerText = shops.length;
  agStatLiveShops.innerText = shops.filter(s => s.isLive).length;
  
  const pending = deliveries.filter(d => d.status === 'Pending' || d.status === 'Dispatched').length;
  const completed = deliveries.filter(d => d.status === 'Delivered').length;

  agStatPendingDeliveries.innerText = pending;
  agStatCompletedDeliveries.innerText = completed;

  // Courier Pool Allocation Stats
  const totalAssigned = shops.reduce((sum, s) => sum + (s.assignedCouriers || 0), 0);
  const availableCouriers = Math.max(0, totalCouriersPool - totalAssigned);

  const statTotalCouriers = document.getElementById('ag-stat-total-couriers');
  const statAvailableCouriers = document.getElementById('ag-stat-available-couriers');
  if (statTotalCouriers) statTotalCouriers.innerText = totalCouriersPool;
  if (statAvailableCouriers) statAvailableCouriers.innerText = availableCouriers;
}

let activeMonitorShopId = null;

// Render active dispatches deliveries monitor
function renderAgencyDeliveries() {
  const loginView = document.getElementById('agency-monitor-login-view');
  const tableView = document.getElementById('agency-monitor-table-view');
  const activeShopNameEl = document.getElementById('monitor-active-shop-name');
  
  if (!activeMonitorShopId) {
    if (loginView) loginView.style.display = 'block';
    if (tableView) tableView.style.display = 'none';
    
    const shopSelect = document.getElementById('monitor-shop-select');
    if (shopSelect) {
      shopSelect.innerHTML = '<option value="" disabled selected>Select a Shop</option>';
      shops.forEach(shop => {
        shopSelect.innerHTML += `<option value="${shop.id}">${shop.name} (${shop.area})</option>`;
      });
    }
    return;
  }
  
  if (loginView) loginView.style.display = 'none';
  if (tableView) tableView.style.display = 'block';
  
  const monitorShop = shops.find(s => s.id === activeMonitorShopId);
  if (activeShopNameEl && monitorShop) {
    activeShopNameEl.innerText = `(${monitorShop.name})`;
  }

  agencyDeliveriesRows.innerHTML = '';
  const dateFilterVal = document.getElementById('monitor-date-filter') ? document.getElementById('monitor-date-filter').value : '';
  const filteredDeliveries = deliveries.filter(d => {
    const matchesShop = d.shopName === (monitorShop ? monitorShop.name : null);
    let matchesDate = true;
    if (dateFilterVal && d.date) {
      const dObj = new Date(d.date);
      if (!isNaN(dObj)) {
        const localDateStr = dObj.getFullYear() + '-' + String(dObj.getMonth() + 1).padStart(2, '0') + '-' + String(dObj.getDate()).padStart(2, '0');
        matchesDate = localDateStr === dateFilterVal;
      }
    }
    return matchesShop && matchesDate;
  });

  if (filteredDeliveries.length === 0) {
    agencyDeliveriesRows.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
          No active delivery requests for this shop.
        </td>
      </tr>
    `;
    return;
  }

  filteredDeliveries.sort((a, b) => new Date(b.date) - new Date(a.date));
  const groupedDeliveries = {};
  filteredDeliveries.forEach(del => {
    const day = new Date(del.date).toLocaleDateString();
    if (!groupedDeliveries[day]) groupedDeliveries[day] = [];
    groupedDeliveries[day].push(del);
  });

  Object.keys(groupedDeliveries).forEach(day => {
    const headerTr = document.createElement('tr');
    headerTr.innerHTML = `<td colspan="7" style="background-color: var(--bg-tertiary); font-weight: bold; color: var(--text-primary); text-align: left; padding: 8px 12px; border-top: 2px solid var(--border-color);"><i data-lucide="calendar" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px;"></i>${day}</td>`;
    agencyDeliveriesRows.appendChild(headerTr);

    groupedDeliveries[day].forEach((del) => {
      const realIndex = deliveries.findIndex(d => d.id === del.id);
      let badgeHTML = '';
    if (del.status === 'Pending') {
      const shopOfDelivery = shops.find(s => s.name === del.shopName);
      const freeCouriersOfShop = shopOfDelivery ? getFreeCouriersCount(shopOfDelivery) : 0;
      if (freeCouriersOfShop <= 0) {
        badgeHTML = `<span class="delivery-badge pending" style="background: rgba(249, 115, 22, 0.15); color: #f97316;">Queued (Waiting)</span>`;
      } else {
        badgeHTML = `<span class="delivery-badge pending">Pending Dispatch</span>`;
      }
    } else if (del.status === 'Dispatched') {
      badgeHTML = `<span class="delivery-badge dispatched">Out for Delivery</span>`;
    } else {
      badgeHTML = `<span class="delivery-badge delivered">Delivered</span>`;
    }

    let actionButton = '';
    if (del.status === 'Pending') {
      const shopOfDelivery = shops.find(s => s.name === del.shopName);
      const freeCouriersOfShop = shopOfDelivery ? getFreeCouriersCount(shopOfDelivery) : 0;
      if (freeCouriersOfShop <= 0) {
        actionButton = `<button class="next-btn" onclick="progressDeliveryStatus(${realIndex}, 'Dispatched')" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; background: var(--text-muted); cursor: not-allowed; opacity: 0.65;" title="All delivery boys busy">Queue Order</button>`;
      } else {
        actionButton = `<button class="next-btn" onclick="progressDeliveryStatus(${realIndex}, 'Dispatched')" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px;">Assign & Dispatch</button>`;
      }
    } else if (del.status === 'Dispatched') {
      actionButton = `<button class="next-btn" onclick="progressDeliveryStatus(${realIndex}, 'Delivered')" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; background: var(--success-color);">Mark Delivered</button>`;
    } else {
      actionButton = `
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <span style="font-size:0.8rem;color:var(--success-color);font-weight:600;"><i data-lucide="check-circle" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i>Complete</span>
          <button class="nav-btn" onclick="viewCustomerInvoice('${del.id}')" style="padding: 4px 8px; font-size: 0.7rem; border-radius: 4px; background: var(--primary-color); color: white; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px;"><i data-lucide="file-text" style="width:12px;height:12px;"></i> Generate Final Bill</button>
        </div>
      `;
    }
    
    // Add delete button
    actionButton += ` <button class="back-btn delete-dispatch-btn" style="padding: 6px 12px; border-color: rgba(239, 68, 68, 0.3); color: var(--error-color); font-size: 0.8rem; border-radius: var(--border-radius-sm); margin-left: 8px;" title="Delete Dispatch">
      <i data-lucide="trash-2" style="width:14px;height:14px;vertical-align:middle;"></i>
    </button>`;

    const tr = document.createElement('tr');
    const phoneVal = del.phone || '9876543210';
    const distanceVal = del.distance || 3.5;
    const distanceLabel = del.status === 'Delivered' 
      ? `<div style="font-size: 0.75rem; color: var(--success-color); font-weight: 600; margin-top: 2px;"><i data-lucide="map-pin" style="width:10px;height:10px;display:inline-block;margin-right:2px;vertical-align:middle;"></i>Covered: ${distanceVal} km</div>`
      : `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;"><i data-lucide="map-pin" style="width:10px;height:10px;display:inline-block;margin-right:2px;vertical-align:middle;"></i>Distance: ${distanceVal} km</div>`;

    tr.innerHTML = `
      <td>
        <a href="#" onclick="viewThermalReceipt('${del.id}'); return false;" style="color: var(--accent-color); font-weight: bold; text-decoration: underline;">${del.id}</a>
        <div style="font-size: 0.85rem; font-weight:600;">${del.customerName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);"><i data-lucide="phone" style="width:10px;height:10px;display:inline-block;margin-right:2px;vertical-align:middle;"></i>${phoneVal}</div>
        ${distanceLabel}
      </td>
      <td><strong>${del.shopName}</strong></td>
      <td><div style="font-size:0.85rem;max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${del.items}">${del.items}</div></td>
      <td>
        ${(() => {
          const hasOrderDiscount = del.discount && del.discount > 0;
          return hasOrderDiscount 
            ? `<strong>₹${del.total.toFixed(2)}</strong> <span style="font-size:0.7rem;color:var(--error-color);font-weight:700;">(-${del.discount}%)</span><div style="font-size:0.75rem;color:var(--text-muted);text-decoration:line-through;">₹${(del.originalTotal || del.total).toFixed(2)}</div>`
            : `<strong>₹${del.total.toFixed(2)}</strong>`;
        })()}
      </td>
      <td>${badgeHTML}</td>
      <td style="display: flex; align-items: center;">${actionButton}</td>
      <td>
        <div style="display: flex; gap: 4px;">
          <input type="text" id="quick-msg-${del.id}" placeholder="Type delay msg..." value="${del.quickMessage || ''}" style="width: 120px; font-size: 0.75rem; padding: 4px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary);">
          <button class="next-btn" onclick="sendQuickMessage('${del.id}')" style="padding: 4px 8px; font-size: 0.7rem; border-radius: 4px;">Send</button>
        </div>
      </td>
    `;
    
    // Bind delete button logic
    const deleteBtn = tr.querySelector('.delete-dispatch-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to completely delete the dispatch log for "${del.id}"?`)) {
          const delId = del.id;
          
          deliveries = deliveries.filter(d => d.id !== delId);
          
          fetch(`/api/deliveries/${encodeURIComponent(delId)}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => console.log(`✅ Dispatch ${delId} deleted from MongoDB.`))
            .catch(err => console.error('Error deleting dispatch from server:', err));
            
          syncStorage();
          renderAgencyDeliveries();
          renderPartnerDeliveries();
          updateAgencyStats();
          showToast(`Dispatch log "${delId}" deleted successfully.`, "success");
        }
      });
    }
    agencyDeliveriesRows.appendChild(tr);
    });
  });

  lucide.createIcons();
  renderAgencyDailyReports();
}

window.sendQuickMessage = (orderId) => {
  const msgInput = document.getElementById(`quick-msg-${orderId}`);
  if (!msgInput) return;
  const msg = msgInput.value.trim();
  const order = deliveries.find(d => d.id === orderId);
  if (order) {
    order.quickMessage = msg;
    syncStorage();
    showToast('Quick message sent to customer tracking page.', 'success');
  }
};

const monitorLoginForm = document.getElementById('agency-monitor-login-form');
if (monitorLoginForm) {
  monitorLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const shopId = document.getElementById('monitor-shop-select').value;
    const pass = document.getElementById('monitor-shop-password').value;
    const shop = shops.find(s => s.id === shopId);
    if (!shop) return;
    
    const expectedPass = shop.monitorPassword || "monitor123";
    if (pass === expectedPass) {
      activeMonitorShopId = shopId;
      document.getElementById('monitor-shop-password').value = '';
      renderAgencyDeliveries();
      showToast('Monitor login successful', 'success');
    } else {
      showToast('Incorrect monitor password', 'error');
    }
  });
}

const monitorLogoutBtn = document.getElementById('monitor-logout-btn');
if (monitorLogoutBtn) {
  monitorLogoutBtn.addEventListener('click', () => {
    activeMonitorShopId = null;
    renderAgencyDeliveries();
  });
}

const monitorDateFilter = document.getElementById('monitor-date-filter');
if (monitorDateFilter) {
  monitorDateFilter.addEventListener('change', () => {
    renderAgencyDeliveries();
  });
}

const monitorGenerateReportBtn = document.getElementById('monitor-generate-report-btn');
if (monitorGenerateReportBtn) {
  monitorGenerateReportBtn.addEventListener('click', () => {
    if (!activeMonitorShopId) {
      showToast('Please login to a shop monitor first', 'error');
      return;
    }
    
    const shop = shops.find(s => s.id === activeMonitorShopId);
    const dateFilterVal = document.getElementById('monitor-date-filter') ? document.getElementById('monitor-date-filter').value : '';
    const shopDeliveries = deliveries.filter(d => {
      const matchesShop = d.shopName === shop.name;
      let matchesDate = true;
      if (dateFilterVal && d.date) {
        const dObj = new Date(d.date);
        if (!isNaN(dObj)) {
          const localDateStr = dObj.getFullYear() + '-' + String(dObj.getMonth() + 1).padStart(2, '0') + '-' + String(dObj.getDate()).padStart(2, '0');
          matchesDate = localDateStr === dateFilterVal;
        }
      }
      return matchesShop && matchesDate;
    });
    
    const container = document.getElementById('print-report-container');
    
    let html = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div style="flex: 1;"></div>
        <div style="text-align: center; flex: 2;">
          <img src="/aura_logo.png" alt="AURA Dispatch" style="height: 60px; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
          <h2>Mall Agency Operations - Final Shop Report</h2>
          <h3>Shop: ${shop.name} (${shop.area})</h3>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        <div class="no-print" style="flex: 1; display: flex; justify-content: flex-end; gap: 8px;">
          <button onclick="window.print()" style="padding: 8px 16px; background: var(--primary-color); color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px; height: fit-content;"><i data-lucide="printer" style="width:14px;height:14px;"></i> Print Final Report</button>
          <button onclick="document.getElementById('print-report-container').style.display='none'" style="padding: 8px 16px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; font-weight: bold; cursor: pointer; height: fit-content;">Close</button>
        </div>
      </div>
      <table class="print-table">
        <thead>
          <tr>
            <th style="width: 20%;">Ref / Customer</th>
            <th style="width: 20%;">Merchant Shop</th>
            <th style="width: 20%;">Price Due</th>
            <th style="width: 20%;">Courier Status</th>
            <th style="width: 20%;">Actions</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    if (shopDeliveries.length === 0) {
      html += `<tr><td colspan="8" style="text-align: center;">No deliveries recorded.</td></tr>`;
    } else {
      shopDeliveries.sort((a, b) => new Date(b.date) - new Date(a.date));
      const groupedReport = {};
      shopDeliveries.forEach(d => {
        const day = new Date(d.date).toLocaleDateString();
        if (!groupedReport[day]) groupedReport[day] = [];
        groupedReport[day].push(d);
      });
      
      Object.keys(groupedReport).forEach(day => {
        html += `<tr><th colspan="5" style="background-color: #f1f5f9; text-align: left; padding: 8px; font-size: 1.05em; color: #1e293b; border-bottom: 2px solid #ccc;">Date: ${day}</th></tr>`;
        groupedReport[day].forEach(d => {
          html += `
          <tr>
            <td><strong>${d.id}</strong><br>${d.customerName}<br><small>${d.phone || 'N/A'}</small></td>
            <td>${d.shopName}</td>
            <td>₹${d.total.toFixed(2)}</td>
            <td>${d.status}<br><small>${d.courierName || 'Unassigned'}</small></td>
            <td>____________________</td>
          </tr>
        `;
        });
      });
    }
    
    html += `
        </tbody>
      </table>
    `;
    
    container.innerHTML = html;
    
    // Show the container on the screen so the user can see it and click Print or Close
    container.style.display = 'block';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.background = 'white';
    container.style.zIndex = '999999';
    container.style.overflowY = 'auto';
    container.style.padding = '40px';
    
    lucide.createIcons();

    // Automatically trigger the print dialog for convenience
    setTimeout(() => {
      window.print();
    }, 500);
  });
}

let deliveryToAssignCourierIndex = null;

const assignCourierForm = document.getElementById('assign-courier-form');
const cancelAssignBtn = document.getElementById('cancel-assign-btn');
const assignCourierModal = document.getElementById('assign-courier-modal');

if (assignCourierForm) {
  assignCourierForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (deliveryToAssignCourierIndex === null) return;
    
    const courierName = document.getElementById('courier-name').value.trim();
    const courierId = document.getElementById('courier-id').value.trim();
    
    const order = deliveries[deliveryToAssignCourierIndex];
    if (order) {
      order.courierName = courierName;
      order.courierId = courierId;
      order.status = 'Dispatched';
      
      syncStorage();
      updateAgencyStats();
      renderAgencyDeliveries();
      renderPartnerDeliveries();
      renderShopsDirectory();
      renderCourierAllocation();
      showToast(`Assigned ${courierName} and dispatched ${order.id}`, 'success');
    }
    
    assignCourierModal.close();
    assignCourierModal.classList.remove('active');
    deliveryToAssignCourierIndex = null;
  });
}

if (cancelAssignBtn) {
  cancelAssignBtn.addEventListener('click', () => {
    assignCourierModal.close();
    assignCourierModal.classList.remove('active');
    deliveryToAssignCourierIndex = null;
  });
}

function progressDeliveryStatus(index, newStatus) {
  const order = deliveries[index];
  if (!order) return;

  if (newStatus === 'Dispatched') {
    const shop = shops.find(s => s.name === order.shopName);
    const freeCouriers = getFreeCouriersCount(shop);
    if (freeCouriers <= 0) {
      showToast(`All delivery boys for "${order.shopName}" are busy. Order ${order.id} is queued.`, 'warning');
      return; // Block status transition, keep in Pending queue
    }
    
    // Trigger Courier Assignment Modal instead of direct dispatch
    deliveryToAssignCourierIndex = index;
    if (assignCourierModal) {
      document.getElementById('courier-name').value = '';
      document.getElementById('courier-id').value = '';
      assignCourierModal.showModal();
      assignCourierModal.classList.add('active');
    }
    return;
  }

  if (newStatus === 'Delivered') {
    deliveryToDeliverIndex = index;
    const distModal = document.getElementById('enter-distance-modal');
    if (distModal) {
      document.getElementById('dist-modal-order-id').innerText = order.id;
      document.getElementById('actual-distance-input').value = order.distance !== undefined ? order.distance : 3.5;
      distModal.showModal();
      distModal.classList.add('active');
    }
    return;
  }

  deliveries[index].status = newStatus;

  syncStorage();
  updateAgencyStats();
  renderAgencyDeliveries();
  renderPartnerDeliveries();
  renderShopsDirectory();
  renderCourierAllocation();
  showToast(`Delivery status updated to ${newStatus.toUpperCase()}`, 'success');
}

function showDeliveryInvoice(order) {
  const modal = document.getElementById('delivery-invoice-modal');
  if (!modal) return;

  // Set Order Ref ID
  document.getElementById('invoice-order-id').innerText = order.id;

  // Customer Details
  document.getElementById('inv-cust-name').innerText = order.customerName || '-';
  document.getElementById('inv-cust-phone').innerText = order.phone || '9876543210';
  document.getElementById('inv-store-name').innerText = order.shopName || '-';
  document.getElementById('inv-pay-method').innerText = order.paymentMethod || 'Cash on Delivery (COD)';

  // Subtotal, Distance, Delivery Fee
  const distance = order.distance !== undefined ? order.distance : 3.5;
  const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : calculateDeliveryFee(distance);
  const promoDiscount = order.promoDiscount !== undefined ? order.promoDiscount : 0;
  const shopDiscountPercent = order.discount || 0;

  // Subtotal calculation fallback if not saved
  let subtotal = order.subtotal;
  if (subtotal === undefined) {
    subtotal = order.total;
  }

  // Calculate order-level discount amount
  const baseTotalForShopDiscount = subtotal + deliveryFee - promoDiscount;
  const shopDiscountAmount = baseTotalForShopDiscount * (shopDiscountPercent / 100);
  const finalGrandTotal = order.total;

  document.getElementById('inv-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById('inv-distance').innerText = distance;
  document.getElementById('inv-delivery-fee').innerText = `₹${deliveryFee.toFixed(2)}`;

  const discountRow = document.getElementById('inv-discount-row');
  if (shopDiscountPercent > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('inv-discount-percent').innerText = shopDiscountPercent;
    document.getElementById('inv-discount-amount').innerText = `-₹${shopDiscountAmount.toFixed(2)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('inv-grand-total').innerText = `₹${finalGrandTotal.toFixed(2)}`;

  // Render Items List
  const itemsContainer = document.getElementById('inv-items-list');
  itemsContainer.innerHTML = '';

  if (order.itemsDetails && order.itemsDetails.length > 0) {
    order.itemsDetails.forEach(item => {
      const itemRow = document.createElement('div');
      itemRow.style.display = 'flex';
      itemRow.style.justifyContent = 'space-between';
      const discountedPrice = getDiscountedPrice(item.product);
      itemRow.innerHTML = `
        <span>${item.quantity}x ${item.product.name} <span style="font-size:0.75rem;color:var(--text-muted);">(${item.selectedSize})</span></span>
        <strong>₹${(discountedPrice * item.quantity).toFixed(2)}</strong>
      `;
      itemsContainer.appendChild(itemRow);
    });
  } else {
    const fallbackRow = document.createElement('div');
    fallbackRow.style.display = 'flex';
    fallbackRow.style.justifyContent = 'space-between';
    fallbackRow.innerHTML = `
      <span>${order.items}</span>
      <strong>₹${subtotal.toFixed(2)}</strong>
    `;
    itemsContainer.appendChild(fallbackRow);
  }

  // Agency Hub Statement details
  const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const orderDate = order.date || todayStr;
  const commissionRate = order.commissionRate !== undefined ? order.commissionRate : getDailyCommissionRate(orderDate, order.shopName);
  const riderPayout = deliveryFee;
  const agencyCommission = subtotal * (commissionRate / 100);
  const netStorePayout = Math.max(0, finalGrandTotal - riderPayout - agencyCommission);

  document.getElementById('inv-agency-collected').innerText = `₹${finalGrandTotal.toFixed(2)}`;
  document.getElementById('inv-agency-distance').innerText = `${distance} km`;
  document.getElementById('inv-agency-rider-payout').innerText = `₹${riderPayout.toFixed(2)}`;
  document.getElementById('inv-agency-commission').innerText = `₹${agencyCommission.toFixed(2)}`;
  if (document.getElementById('inv-commission-percent')) {
    document.getElementById('inv-commission-percent').innerText = commissionRate;
  }
  document.getElementById('inv-agency-store-payout').innerText = `₹${netStorePayout.toFixed(2)}`;

  // SMS Simulator text
  const smsBody = document.getElementById('inv-sms-body');
  const customerPhone = order.phone || '9876543210';
  smsBody.innerText = `Aura Dispatch SMS to +91 ${customerPhone}:
"Hi ${order.customerName || 'Customer'}, your order ${order.id} from ${order.shopName} has been delivered by Aura Dispatch!
Total Cash Collected (COD): ₹${finalGrandTotal.toFixed(2)} (Subtotal: ₹${subtotal.toFixed(2)}${shopDiscountPercent > 0 ? `, Shop Discount: ${shopDiscountPercent}%` : ''}).
Rider covered ${distance} km. Thank you for choosing Aura Plaza!"`;

  // Open modal
  modal.showModal();
  modal.classList.add('active');
}

// Controller to apply shop owner discounts directly to registered orders
function applyOrderDiscount(id, discountVal) {
  const discount = parseInt(discountVal) || 0;
  const order = deliveries.find(d => d.id === id);
  if (!order) return;

  if (order.status === 'Delivered') {
    showToast("Cannot apply discounts to completed deliveries.", "error");
    return;
  }

  if (order.originalTotal === undefined) {
    order.originalTotal = order.total;
  }

  order.discount = discount;
  order.total = order.originalTotal - (order.originalTotal * discount / 100);

  syncStorage();
  renderPartnerDeliveries();
  renderAgencyDeliveries();
  updateAgencyStats();
  showToast(`Applied ${discount}% discount to order ${id}`, 'success');
}
window.applyOrderDiscount = applyOrderDiscount;

// Onboard new shop partner
agencyRegisterShopForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = agencyRegisterShopForm.querySelector('button[type="submit"]');
  if (submitBtn.disabled) return;
  submitBtn.disabled = true;

  const name = document.getElementById('reg-shop-name').value.trim();
  const category = document.getElementById('reg-shop-category').value;
  const area = document.getElementById('reg-shop-area').value.trim();

  // Generate unique Shop ID: SHOP- followed by next index + random padding
  const shopNum = shops.length + 1;
  const shopId = `SHOP-${String(shopNum).padStart(3, '0')}`;
  
  // Generate random 8-character alphabetic/numeric password
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  let monitorPassword = '';
  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
    monitorPassword += chars[Math.floor(Math.random() * chars.length)];
  }

  const newShop = {
    id: shopId,
    name,
    category,
    area,
    password,
    monitorPassword,
    isLive: false, // Default closed upon onboarding
    requestedCouriers: 1,
    assignedCouriers: 1,
    desc: `Local registered partner shop offering quick dispatch delivery in ${area}. Category: ${category}.`,
    products: []
  };

  shops.push(newShop);
  syncStorage();

  // Reset Form
  agencyRegisterShopForm.reset();

  const successRegMonitorPass = document.getElementById('success-reg-monitor-pass');
  
  // Draw credentials on Modal
  successRegName.innerText = name;
  successRegId.innerText = shopId;
  successRegPass.innerText = password;
  if (successRegMonitorPass) successRegMonitorPass.innerText = monitorPassword;

  // Open modal
  regSuccessModal.showModal();
  regSuccessModal.classList.add('active');
  
  setTimeout(() => {
    submitBtn.disabled = false;
  }, 1000);

  // Reload tables
  updateAgencyStats();
  renderAgencyShops();
});

closeRegSuccessBtn.addEventListener('click', () => {
  regSuccessModal.close();
  regSuccessModal.classList.remove('active');
  
  // Take admin back to Shops Registry List
  document.querySelector('.db-nav-link[data-panel="agency-shops-list"]').click();
});

// Render Registered Merchant Registry list
function renderAgencyShops() {
  agencyShopsRows.innerHTML = '';

  shops.forEach(shop => {
    const statusBadge = shop.isLive ? 
      `<span class="status-badge live"><i data-lucide="wifi" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"></i>Online</span>` :
      `<span class="status-badge offline"><i data-lucide="wifi-off" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"></i>Offline</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong style="font-size:0.95rem;">${shop.name}</strong>
        <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;">${shop.category}</div>
      </td>
      <td><code style="font-weight:700;color:var(--accent-color);">${shop.id}</code></td>
      <td><span style="font-size:0.85rem;">${shop.area}</span></td>
      <td>${statusBadge}</td>
      <td>
        <button class="inv-action-btn edit" onclick="toggleAgencyShopStatus('${shop.id}')" title="Toggle Shop Status" style="margin-right: 4px;">
          <i data-lucide="${shop.isLive ? 'wifi-off' : 'wifi'}" style="width:14px;height:14px;"></i>
        </button>
        <button class="inv-action-btn delete" onclick="deleteAgencyShop('${shop.id}')" title="Delete Shop Partner">
          <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
        </button>
      </td>
    `;
    agencyShopsRows.appendChild(tr);
  });

  lucide.createIcons();
}

// Toggle individual shop live status
function toggleAgencyShopStatus(shopId) {
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    shop.isLive = !shop.isLive;
    syncStorage();
    renderAgencyShops();
    updateAgencyStats();
    showToast(`Shop ${shop.name} is now ${shop.isLive ? 'Online' : 'Offline'}`, 'success');
  }
}
window.toggleAgencyShopStatus = toggleAgencyShopStatus;

// Toggle ALL shops live status
function toggleAllShopsStatus(makeLive) {
  if (shops.length === 0) return;
  const action = makeLive ? "Online" : "Offline";
  if (confirm(`Are you sure you want to force ALL ${shops.length} shops to go ${action}?`)) {
    shops.forEach(shop => {
      shop.isLive = makeLive;
    });
    syncStorage();
    renderAgencyShops();
    updateAgencyStats();
    showToast(`All shops forced ${action}!`, 'success');
  }
}
window.toggleAllShopsStatus = toggleAllShopsStatus;

// Delete shop registry entry
function deleteAgencyShop(shopId) {
  const idx = shops.findIndex(s => s.id === shopId);
  if (idx === -1) return;

  const shopName = shops[idx].name;
  if (confirm(`Are you sure you want to remove shop "${shopName}" (${shopId}) from the registered merchants registry? All associated products will also be deleted.`)) {
    if (activeShopSession && activeShopSession.id === shopId) {
      activeShopSession = null;
      sessionStorage.removeItem('active_shop_session');
    }

    // Remove from local state immediately
    shops.splice(idx, 1);

    // Call dedicated DELETE endpoint so ALL devices see this deletion
    fetch(`/api/shops/${encodeURIComponent(shopId)}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => console.log(`✅ Shop ${shopId} deleted from MongoDB.`))
      .catch(err => console.error('Error deleting shop from server:', err));

    // Also sync remaining state
    syncStorage();

    renderShopsDirectory();
    renderAgencyShops();
    updateAgencyStats();

    showToast(`Removed shop: ${shopName}`, 'info');
  }
}

// --- PORTAL C: DELIVERY AGENCY HUB LOGIC CONT. ---

// Agency Login form submission
const agencyLoginForm = document.getElementById('agency-login-form');
const loginAgencyPassInput = document.getElementById('login-agency-pass');
const agencyLogoutBtn = document.getElementById('agency-logout-btn');

if (agencyLoginForm) {
  agencyLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = loginAgencyPassInput.value.trim();

    if (pass === 'agency123') {
      sessionStorage.setItem('active_agency_session', 'true');
      loginAgencyPassInput.value = '';
      showToast("Access Granted. Agency Console Unlocked.", "success");
      renderAgencyPortal();
    } else {
      showToast("Invalid Agency Password", "error");
    }
  });
}

if (agencyLogoutBtn) {
  agencyLogoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('active_agency_session');
    showToast("Agency console locked.", "info");
    renderAgencyPortal();
  });
}

// Shop Courier Requirements Form Listener
const shopCourierRequirementsForm = document.getElementById('shop-courier-requirements-form');
if (shopCourierRequirementsForm) {
  shopCourierRequirementsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeShopSession) return;
    const dbShop = shops.find(s => s.id === activeShopSession.id);
    if (!dbShop) return;

    const requestedCount = parseInt(document.getElementById('s-couriers-required').value);
    dbShop.requestedCouriers = requestedCount;
    syncStorage();
    showToast(`Courier staffing requirements updated to ${requestedCount} delivery boys.`, 'success');
  });
}

// Render active shop-level courier allocations table
function renderCourierAllocation() {
  const allocationRows = document.getElementById('agency-courier-allocation-rows');
  if (!allocationRows) return;
  allocationRows.innerHTML = '';

  shops.forEach(shop => {
    if (shop.requestedCouriers === undefined) shop.requestedCouriers = 1;
    if (shop.assignedCouriers === undefined) shop.assignedCouriers = 1;

    const freeCouriers = getFreeCouriersCount(shop);
    const assignedCouriers = shop.assignedCouriers || 1;
    const assignedCellHTML = `
      <strong>${assignedCouriers} delivery boys</strong>
      <div style="font-size:0.75rem;color:${freeCouriers > 0 ? 'var(--success-color)' : 'var(--warning-color)'};font-weight:600;">
        ${freeCouriers} / ${assignedCouriers} Available
      </div>
    `;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${shop.name}</strong><br><span style="font-size:0.75rem;color:var(--text-muted);">${shop.id}</span></td>
      <td>${shop.area}</td>
      <td><span style="font-weight:600;color:var(--accent-color);">${shop.requestedCouriers} delivery boys</span></td>
      <td>${assignedCellHTML}</td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="inv-action-btn" onclick="adjustCourierAllocation('${shop.id}', -1)" title="Remove 1 Delivery Boy"><i data-lucide="minus" style="width:12px;height:12px;"></i></button>
          <button class="inv-action-btn" onclick="adjustCourierAllocation('${shop.id}', 1)" title="Assign 1 Delivery Boy"><i data-lucide="plus" style="width:12px;height:12px;"></i></button>
        </div>
      </td>
    `;
    allocationRows.appendChild(tr);
  });

  lucide.createIcons();
}
window.renderCourierAllocation = renderCourierAllocation;

// Adjust allocated courier count for a shop
function adjustCourierAllocation(shopId, amount) {
  const shop = shops.find(s => s.id === shopId);
  if (!shop) return;

  if (shop.assignedCouriers === undefined) shop.assignedCouriers = 1;

  const currentTotalAssigned = shops.reduce((sum, s) => sum + (s.assignedCouriers || 0), 0);
  
  if (amount > 0) {
    if (currentTotalAssigned + amount > totalCouriersPool) {
      showToast(`Cannot allocate. Insufficient courier agents in global pool (Total Pool: ${totalCouriersPool}).`, 'error');
      return;
    }
    shop.assignedCouriers += amount;
  } else if (amount < 0) {
    if (shop.assignedCouriers + amount < 0) {
      showToast("Cannot reduce allocation below 0.", 'error');
      return;
    }
    shop.assignedCouriers += amount;
  }

  syncStorage();
  renderCourierAllocation();
  updateAgencyStats();
  showToast(`Updated courier staffing for ${shop.name}.`, 'success');
}
window.adjustCourierAllocation = adjustCourierAllocation;

// Agency Update Pool Size bindings
const agencyUpdatePoolBtn = document.getElementById('agency-update-pool-btn');
const agencyCouriersPoolInput = document.getElementById('agency-couriers-pool-input');

if (agencyUpdatePoolBtn && agencyCouriersPoolInput) {
  agencyCouriersPoolInput.value = totalCouriersPool;
  
  agencyUpdatePoolBtn.addEventListener('click', () => {
    const val = parseInt(agencyCouriersPoolInput.value);
    if (isNaN(val) || val < 1) {
      showToast("Invalid pool size.", 'error');
      return;
    }
    
    const totalAssigned = shops.reduce((sum, s) => sum + (s.assignedCouriers || 0), 0);
    if (val < totalAssigned) {
      showToast(`Cannot reduce pool size to ${val}. Currently ${totalAssigned} couriers are assigned to shops.`, 'error');
      return;
    }
    
    totalCouriersPool = val;
    syncStorage();
    updateAgencyStats();
    renderCourierAllocation();
    showToast(`Global courier pool size updated to ${totalCouriersPool}.`, 'success');
  });
}


// --- INITIALIZATION ---

navLogo.addEventListener('click', () => {
  switchPortal('customer');
});

// Global Portal Selectors
portalTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchPortal(tab.dataset.portal);
  });
});

// Cart Drawer bindings
cartBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
appBackdrop.addEventListener('click', closeCart);

// Launch logic on ready
document.addEventListener('DOMContentLoaded', async () => {
  initCustomerTheme();

  // Initial portal draw
  switchPortal(activePortal);
  renderCart();

  lucide.createIcons();

  // Load state from MongoDB database
  await loadStateFromServer();

  // Start real-time cross-device sync (polls every 5 seconds)
  startRealTimeSync();
});

// Agency Fee Settings Form Listener
const agencyFeeSettingsForm = document.getElementById('agency-fee-settings-form');
if (agencyFeeSettingsForm) {
  agencyFeeSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const baseFee = parseFloat(document.getElementById('agency-base-fee-input').value);
    const perKm = parseFloat(document.getElementById('agency-per-km-input').value);
    
    if (isNaN(baseFee) || baseFee < 0 || isNaN(perKm) || perKm < 0) {
      showToast("Fee rates must be positive numbers.", "error");
      return;
    }
    
    baseDeliveryFee = baseFee;
    perKmDeliveryFee = perKm;
    syncStorage();
    showToast("Delivery fee configuration updated successfully!", "success");
    
    // Trigger redraws
    renderCart();
  });
}

// Delivery Invoice Modal Bindings
const deliveryInvoiceModal = document.getElementById('delivery-invoice-modal');
const printInvoiceBtn = document.getElementById('print-invoice-btn');
const closeInvoiceBtn = document.getElementById('close-invoice-btn');

if (printInvoiceBtn) {
  printInvoiceBtn.addEventListener('click', () => {
    window.print();
  });
}

if (closeInvoiceBtn && deliveryInvoiceModal) {
  closeInvoiceBtn.addEventListener('click', () => {
    deliveryInvoiceModal.close();
    deliveryInvoiceModal.classList.remove('active');
  });
}

if (deliveryInvoiceModal) {
  deliveryInvoiceModal.addEventListener('close', () => {
    deliveryInvoiceModal.classList.remove('active');
  });
}

window.openEnterDistanceModal = function(index) {
  deliveryToDeliverIndex = index;
  const modal = document.getElementById('enter-distance-modal');
  document.getElementById('actual-distance-input').value = '';
  const checkbox = document.getElementById('free-delivery-checkbox');
  if(checkbox) checkbox.checked = false;
  
  if (deliveries[index]) {
    document.getElementById('dist-modal-order-id').innerText = '#' + deliveries[index].id;
  }
  
  modal.showModal();
  modal.classList.add('active');
}

// Enter Distance Modal Bindings
const enterDistanceModal = document.getElementById('enter-distance-modal');
const enterDistanceForm = document.getElementById('enter-distance-form');
const closeDistModalBtn = document.getElementById('close-dist-modal-btn');

if (enterDistanceForm) {
  enterDistanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (deliveryToDeliverIndex === null) return;

    const order = deliveries[deliveryToDeliverIndex];
    if (!order) return;

    const enteredDistance = parseFloat(document.getElementById('actual-distance-input').value);
    if (isNaN(enteredDistance) || enteredDistance <= 0) {
      showToast("Please enter a valid distance.", "error");
      return;
    }

    const oldDistance = order.distance !== undefined ? order.distance : 3.5;
    order.distance = enteredDistance;

    const isFreeDelivery = document.getElementById('free-delivery-checkbox').checked;
    order.isFreeDelivery = isFreeDelivery;

    const newDeliveryFee = calculateDeliveryFee(enteredDistance);
    order.deliveryFee = newDeliveryFee;

    let subtotal = order.subtotal;
    if (subtotal === undefined) {
      const oldDeliveryFee = calculateDeliveryFee(oldDistance);
      subtotal = Math.max(0, order.total - oldDeliveryFee);
    }
    order.subtotal = subtotal;

    const promoDiscount = order.promoDiscount || 0;
    const shopDiscountPercent = order.discount || 0;

    const effectiveDeliveryFee = isFreeDelivery ? 0 : newDeliveryFee;
    const baseTotalForShopDiscount = subtotal + effectiveDeliveryFee - promoDiscount;
    const shopDiscountAmount = baseTotalForShopDiscount * (shopDiscountPercent / 100);

    order.total = baseTotalForShopDiscount - shopDiscountAmount;
    order.originalTotal = subtotal + newDeliveryFee - promoDiscount;

    // Update status to Delivered
    order.status = 'Delivered';

    // Auto-dispatch queue checking if an order was completed (Delivered)
    const shopName = order.shopName;
    let oldestPendingIndex = -1;
    for (let i = deliveries.length - 1; i >= 0; i--) {
      if (deliveries[i].shopName === shopName && deliveries[i].status === 'Pending') {
        oldestPendingIndex = i;
        break;
      }
    }

    if (oldestPendingIndex !== -1) {
      deliveries[oldestPendingIndex].status = 'Dispatched';
      setTimeout(() => {
        showToast(`Delivery boy returned! Queued order ${deliveries[oldestPendingIndex].id} has been auto-dispatched.`, 'success');
        renderAgencyDeliveries();
        renderPartnerDeliveries();
        renderShopsDirectory();
        renderCourierAllocation();
      }, 800);
    }

    // Close modal & sync storage/redraw
    if (enterDistanceModal) {
      enterDistanceModal.close();
      enterDistanceModal.classList.remove('active');
    }

    syncStorage();
    updateAgencyStats();
    renderAgencyDeliveries();
    renderPartnerDeliveries();
    renderShopsDirectory();
    renderCourierAllocation();

    showToast(`Delivery completed. Generating Final Bill...`, "success");
    
    // Check for Active Shop Offer immediately before Final Bill
    const shopOffer = activeOffers.find(o => o.shopName === order.shopName);
    if (shopOffer && order.appliedDiscount === undefined) {
      currentDiscountOrderId = order.id;
      document.getElementById('discount-offer-title').innerText = shopOffer.title || '';
      document.getElementById('discount-offer-details').innerText = shopOffer.details || '';
      document.getElementById('discount-prompt-input').value = '0';
      
      const promptModal = document.getElementById('discount-prompt-modal');
      promptModal.showModal();
      promptModal.classList.add('active');
    } else {
      // If no offer, automatically show the customer final bill
      renderCustomerInvoiceInternal(order);
    }

    // Reset index
    deliveryToDeliverIndex = null;
  });
}

if (closeDistModalBtn && enterDistanceModal) {
  closeDistModalBtn.addEventListener('click', () => {
    enterDistanceModal.close();
    enterDistanceModal.classList.remove('active');
    deliveryToDeliverIndex = null;
  });
}

if (enterDistanceModal) {
  enterDistanceModal.addEventListener('close', () => {
    enterDistanceModal.classList.remove('active');
  });
}

// --- CUSTOMER ORDER TRACKING LOGIC ---
const trackOrderBtn = document.getElementById('track-order-btn');
const customerTrackOrderModal = document.getElementById('customer-track-order-modal');
const closeTrackModalX = document.getElementById('close-track-modal-x');
const trackOrderForm = document.getElementById('track-order-form');
const trackOrderIdInput = document.getElementById('track-order-id-input');
const trackResultContainer = document.getElementById('track-result-container');

if (trackOrderBtn && customerTrackOrderModal) {
  trackOrderBtn.addEventListener('click', () => {
    // Reset track modal states
    if (trackOrderIdInput) trackOrderIdInput.value = '';
    if (trackResultContainer) trackResultContainer.style.display = 'none';
    customerTrackOrderModal.showModal();
    customerTrackOrderModal.classList.add('active');
  });
}

if (closeTrackModalX && customerTrackOrderModal) {
  closeTrackModalX.addEventListener('click', () => {
    customerTrackOrderModal.close();
    customerTrackOrderModal.classList.remove('active');
  });
}

if (customerTrackOrderModal) {
  customerTrackOrderModal.addEventListener('close', () => {
    customerTrackOrderModal.classList.remove('active');
  });
}

if (trackOrderForm) {
  trackOrderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeCustomerShop) return;

    const inputId = trackOrderIdInput.value.trim().toUpperCase();
    const formattedId = inputId.startsWith('#') ? inputId : '#' + inputId;

    // Search for order
    const order = deliveries.find(d => d.id === formattedId);

    if (!order) {
      showToast("Order ID not found.", "error");
      trackResultContainer.style.display = 'none';
      return;
    }

    // Verify shop mismatch
    if (order.shopName !== activeCustomerShop.name) {
      showToast(`Order found, but it belongs to "${order.shopName}", not "${activeCustomerShop.name}".`, "warning");
      trackResultContainer.style.display = 'none';
      return;
    }

    // Render Tracking Result
    trackResultContainer.style.display = 'block';
    document.getElementById('track-order-ref').innerText = order.id;

    const statusBox = document.getElementById('track-status-box');
    const stepPlaced = document.getElementById('track-step-placed');
    const stepDispatched = document.getElementById('track-step-dispatched');
    const stepDelivered = document.getElementById('track-step-delivered');

    const dotPlaced = stepPlaced.querySelector('.stepper-dot');
    const dotDispatched = stepDispatched.querySelector('.stepper-dot');
    const dotDelivered = stepDelivered.querySelector('.stepper-dot');

    // Reset styles
    statusBox.className = '';
    statusBox.style.background = '';
    statusBox.style.color = '';
    
    [stepPlaced, stepDispatched, stepDelivered].forEach(step => {
      step.style.color = 'var(--text-muted)';
      step.querySelector('.stepper-dot').style.background = 'var(--border-color)';
    });

    if (order.status === 'Pending') {
      const shopOfDelivery = shops.find(s => s.name === order.shopName);
      const freeCouriers = shopOfDelivery ? getFreeCouriersCount(shopOfDelivery) : 0;
      
      if (freeCouriers <= 0) {
        statusBox.innerText = 'Queued (Waiting)';
        statusBox.style.background = 'rgba(249, 115, 22, 0.15)';
        statusBox.style.color = '#f97316';
        
        document.getElementById('track-step-placed-title').innerText = 'Queued in Dispatch Queue';
        document.getElementById('track-step-placed-desc').innerText = 'All delivery riders are currently busy.';
      } else {
        statusBox.innerText = 'Pending Dispatch';
        statusBox.style.background = 'rgba(59, 130, 246, 0.15)';
        statusBox.style.color = '#3b82f6';
        
        document.getElementById('track-step-placed-title').innerText = 'Order Placed';
        document.getElementById('track-step-placed-desc').innerText = 'Merchant is preparing your package.';
      }

      stepPlaced.style.color = 'var(--text-primary)';
      dotPlaced.style.background = '#3b82f6';

    } else if (order.status === 'Dispatched') {
      statusBox.innerText = 'Out for Delivery';
      statusBox.style.background = 'rgba(59, 130, 246, 0.15)';
      statusBox.style.color = '#3b82f6';

      stepPlaced.style.color = 'var(--text-primary)';
      stepDispatched.style.color = 'var(--text-primary)';
      
      dotPlaced.style.background = 'var(--success-color)';
      dotDispatched.style.background = '#3b82f6';

      document.getElementById('track-step-placed-title').innerText = 'Order Placed';
      document.getElementById('track-step-placed-desc').innerText = 'Merchant confirmed and assigned courier.';
      document.getElementById('track-step-dispatched-desc').innerText = `Rider is on the way (Distance: ${order.distance || 3.5} km).`;

    } else if (order.status === 'Delivered') {
      // Order ID expires and shows ORDER delivered
      statusBox.innerText = 'ORDER delivered (Expired)';
      statusBox.style.background = 'rgba(16, 185, 129, 0.15)';
      statusBox.style.color = 'var(--success-color)';

      stepPlaced.style.color = 'var(--text-secondary)';
      stepDispatched.style.color = 'var(--text-secondary)';
      stepDelivered.style.color = 'var(--success-color)';

      dotPlaced.style.background = 'var(--success-color)';
      dotDispatched.style.background = 'var(--success-color)';
      dotDelivered.style.background = 'var(--success-color)';

      document.getElementById('track-step-placed-title').innerText = 'Order Placed';
      document.getElementById('track-step-placed-desc').innerText = 'Completed.';
      document.getElementById('track-step-dispatched-desc').innerText = 'Completed.';
      document.getElementById('track-step-delivered-desc').innerText = `Arrived successfully (Total: ${order.distance || 3.5} km covered).`;
    }

    lucide.createIcons();
  });
}

// --- DAILY OPERATIONS & SALES REPORTS ---

function renderPartnerDailyReports() {
  const container = document.getElementById('partner-reports-rows');
  if (!container) return;
  container.innerHTML = '';

  if (!activeShopSession) return;

  // Filter deliveries belonging to this shop
  const shopDeliveries = deliveries.filter(d => d.shopName === activeShopSession.name);

  // Group deliveries by date.
  const grouped = {};
  shopDeliveries.forEach(del => {
    const dStr = del.date || 'May 30, 2026';
    if (!grouped[dStr]) {
      grouped[dStr] = [];
    }
    grouped[dStr].push(del);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  if (sortedDates.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No operational records found.
        </td>
      </tr>
    `;
    return;
  }

  sortedDates.forEach(dateStr => {
    const dayOrders = grouped[dateStr];
    const completedCount = dayOrders.filter(o => o.status === 'Delivered').length;
    const totalCount = dayOrders.length;
    
    // Resolve commission rate for this specific day and shop
    const commissionRate = getDailyCommissionRate(dateStr, activeShopSession.name);

    // Calculate total commission paid for this date
    const totalCommission = dayOrders.reduce((sum, o) => {
      const sub = o.subtotal !== undefined ? o.subtotal : o.total;
      return sum + (sub * (commissionRate / 100));
    }, 0);

    // Revenue calculations net of custom commission percentage
    let netRevenue = dayOrders.reduce((sum, o) => {
      const sub = o.subtotal !== undefined ? o.subtotal : o.total;
      const commission = sub * (commissionRate / 100);
      const payout = Math.max(0, o.total - (o.deliveryFee || 0) - commission);
      return sum + payout;
    }, 0);

    const distanceCovered = dayOrders.reduce((sum, o) => sum + (o.distance || 0), 0);
    const deliveryFeesPaid = dayOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    
    // Add Delivery Fees to Net Revenue as requested
    netRevenue += deliveryFeesPaid;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${dateStr}</td>
      <td>${completedCount} / ${totalCount} Completed</td>
      <td><strong>${commissionRate}%</strong></td>
      <td><strong style="color: var(--error-color);">₹${totalCommission.toFixed(2)}</strong></td>
      <td><strong style="color: var(--success-color);">₹${netRevenue.toFixed(2)}</strong></td>
      <td>${distanceCovered.toFixed(1)} km</td>
      <td>₹${deliveryFeesPaid.toFixed(2)}</td>
      <td>
        <button class="back-btn delete-report-btn" data-date="${dateStr}" style="padding: 6px 12px; border-color: rgba(239, 68, 68, 0.3); color: var(--error-color); font-size: 0.8rem; border-radius: var(--border-radius-sm);">
          <i data-lucide="trash-2" style="width:12px; height:12px; vertical-align:middle; margin-right:4px;"></i> Delete Report
        </button>
      </td>
    `;

    // Bind delete button
    const deleteBtn = tr.querySelector('.delete-report-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete all operations reports and records for ${dateStr}?`)) {
        // Collect IDs to delete from the database
        const toDeleteIds = deliveries
          .filter(d => (d.shopName === activeShopSession.name && (d.date || 'May 30, 2026') === dateStr))
          .map(d => d.id);

        if (toDeleteIds.length > 0) {
          fetch('/api/deliveries/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: toDeleteIds })
          }).catch(err => console.error('Error bulk deleting:', err));
        }

        // Delete all orders for this shop on this day
        deliveries = deliveries.filter(d => !(d.shopName === activeShopSession.name && (d.date || 'May 30, 2026') === dateStr));
        syncStorage();
        renderPartnerDeliveries();
        showToast(`Reports for ${dateStr} deleted.`, 'success');
      }
    });

    container.appendChild(tr);
  });

  lucide.createIcons();
}

function renderAgencyDailyReports() {
  const container = document.getElementById('agency-reports-rows');
  if (!container) return;
  container.innerHTML = '';

  const dateFilterEl = document.getElementById('daily-ops-date-filter');
  const dateFilterVal = dateFilterEl ? dateFilterEl.value : '';

  // Group deliveries by Date AND Shop
  const grouped = {};
  deliveries.forEach(del => {
    let match = true;
    if (dateFilterVal) {
      const d = new Date(del.date);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const standardDate = `${year}-${month}-${day}`;
        if (standardDate !== dateFilterVal) match = false;
      } else {
        match = false;
      }
    }

    if (match) {
      const dStr = del.date || 'May 30, 2026';
      const sName = del.shopName;
      const key = `${dStr}|${sName}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(del);
    }
  });

  // Sort keys: Date desc, Shop Name asc
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const [dateA, shopA] = a.split('|');
    const [dateB, shopB] = b.split('|');
    const dateCompare = new Date(dateB) - new Date(dateA);
    if (dateCompare !== 0) return dateCompare;
    return shopA.localeCompare(shopB);
  });

  if (sortedKeys.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 20px;">
          No operational records found.
        </td>
      </tr>
    `;
    return;
  }

  sortedKeys.forEach(key => {
    const [dateStr, shopName] = key.split('|');
    const dayOrders = grouped[key];
    const totalCount = dayOrders.length;
    const distanceCovered = dayOrders.reduce((sum, o) => sum + (o.distance || 0), 0);
    const deliveryFeesCollected = dayOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    
    // Commission percentage override
    const commissionRate = getDailyCommissionRate(dateStr, shopName);

    // Commission amount on subtotal
    const agencyCommission = dayOrders.reduce((sum, o) => {
      const sub = o.subtotal !== undefined ? o.subtotal : o.total;
      return sum + (sub * (commissionRate / 100));
    }, 0);

    let netMerchantPayouts = dayOrders.reduce((sum, o) => {
      const sub = o.subtotal !== undefined ? o.subtotal : o.total;
      const commission = sub * (commissionRate / 100);
      const payout = Math.max(0, o.total - (o.deliveryFee || 0) - commission);
      return sum + payout;
    }, 0);
    
    // Add Delivery Fees to Net Merchant Payouts as requested
    netMerchantPayouts += deliveryFeesCollected;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;">${dateStr}</td>
      <td style="font-weight: 600;">${shopName}</td>
      <td>${totalCount} Orders</td>
      <td>${distanceCovered.toFixed(1)} km</td>
      <td>₹${deliveryFeesCollected.toFixed(2)}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>₹${agencyCommission.toFixed(2)} <span style="font-size:0.75rem; color:var(--text-muted);">(${commissionRate}%)</span></span>
          <button class="back-btn edit-comm-btn" style="padding: 2px 6px; font-size: 0.7rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 2px;">
            <i data-lucide="edit-3" style="width:10px;height:10px;"></i> Edit
          </button>
        </div>
      </td>
      <td>₹${netMerchantPayouts.toFixed(2)}</td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="back-btn" onclick="printDailyOperationsReport()" style="padding: 6px 12px; border-color: rgba(108, 77, 255, 0.3); color: #6C4DFF; font-size: 0.8rem; border-radius: var(--border-radius-sm); display: flex; align-items: center; gap: 4px;">
            <i data-lucide="printer" style="width:12px; height:12px;"></i> Print
          </button>
          <button class="back-btn delete-report-btn" data-date="${dateStr}" style="padding: 6px 12px; border-color: rgba(239, 68, 68, 0.3); color: var(--error-color); font-size: 0.8rem; border-radius: var(--border-radius-sm); display: flex; align-items: center; gap: 4px;">
            <i data-lucide="trash-2" style="width:12px; height:12px;"></i> Delete
          </button>
        </div>
      </td>
    `;

    // Bind edit commission button
    const editCommBtn = tr.querySelector('.edit-comm-btn');
    editCommBtn.addEventListener('click', () => {
      const currentRate = getDailyCommissionRate(dateStr, shopName);
      const input = prompt(`Enter custom agency commission percentage (0-100) for "${shopName}" on ${dateStr}:`, currentRate);
      if (input === null) return;
      
      const newRate = parseFloat(input);
      if (isNaN(newRate) || newRate < 0 || newRate > 100) {
        showToast("Please enter a valid percentage between 0 and 100.", "error");
        return;
      }
      
      const commKey = `${dateStr}_${shopName}`;
      dailyCommissions[commKey] = newRate;
      localStorage.setItem('agency_daily_commissions', JSON.stringify(dailyCommissions));
      
      renderAgencyPortal();
      showToast(`Commission rate updated to ${newRate}% for "${shopName}" on ${dateStr}.`, "success");
    });

    // Bind delete button
    const deleteBtn = tr.querySelector('.delete-report-btn');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to permanently delete all network operations records and reports for "${shopName}" on ${dateStr}?`)) {
        // Collect IDs to delete from the database
        const toDeleteIds = deliveries
          .filter(d => ((d.date || 'May 30, 2026') === dateStr && d.shopName === shopName))
          .map(d => d.id);

        if (toDeleteIds.length > 0) {
          fetch('/api/deliveries/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: toDeleteIds })
          }).catch(err => console.error('Error bulk deleting:', err));
        }

        // Delete all orders globally for this shop on this day
        deliveries = deliveries.filter(d => !((d.date || 'May 30, 2026') === dateStr && d.shopName === shopName));
        syncStorage();
        renderAgencyPortal();
        showToast(`Reports for "${shopName}" on ${dateStr} deleted.`, 'success');
      }
    });

    container.appendChild(tr);
  });

  lucide.createIcons();
}

// --- SHOP COMMISSIONS CONFIGURATION PORTAL ---

function renderAgencyCommissionSettings() {
  const container = document.getElementById('agency-shop-commission-rows');
  if (!container) return;
  container.innerHTML = '';

  // Setup form fields on volume rules card
  const rulesEnabledCheckbox = document.getElementById('agency-rules-enabled');
  const t1LimitInput = document.getElementById('agency-tier1-limit');
  const t1RateInput = document.getElementById('agency-tier1-rate');
  const t2LimitInput = document.getElementById('agency-tier2-limit');
  const t2RateInput = document.getElementById('agency-tier2-rate');
  const t3RateInput = document.getElementById('agency-tier3-rate');

  if (rulesEnabledCheckbox) {
    rulesEnabledCheckbox.checked = tieredCommissionRules.enabled;
  }
  if (t1LimitInput) t1LimitInput.value = tieredCommissionRules.tier1Limit;
  if (t1RateInput) t1RateInput.value = tieredCommissionRules.tier1Rate;
  if (t2LimitInput) t2LimitInput.value = tieredCommissionRules.tier2Limit;
  if (t2RateInput) t2RateInput.value = tieredCommissionRules.tier2Rate;
  if (t3RateInput) t3RateInput.value = tieredCommissionRules.tier3Rate;

  // Render Shops table rows
  shops.forEach(shop => {
    const totalOrdersCount = deliveries.filter(d => d.shopName === shop.name).length;
    const isAutoMode = tieredCommissionRules.enabled;
    const calculationMode = isAutoMode ? '<span style="color:#06b6d4;font-weight:600;">Auto (Tiered)</span>' : 'Manual (Custom)';
    
    // Calculate total earnings from delivered orders (product price + delivery charge)
    const deliveredOrders = deliveries.filter(d => d.shopName === shop.name && d.status === 'Delivered');
    const totalEarnings = deliveredOrders.reduce((sum, d) => {
      const sub = d.subtotal !== undefined ? d.subtotal : d.total;
      const fee = d.deliveryFee || 0;
      return sum + sub + fee;
    }, 0);

    // Resolve current commission rate
    const currentRate = getShopCommissionRate(shop.name);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${shop.name}</strong><br><small style="color:var(--text-muted);">${shop.id}</small></td>
      <td><strong>${totalOrdersCount} Orders</strong></td>
      <td><strong style="color: var(--success-color);">₹${totalEarnings.toFixed(2)}</strong></td>
      <td>${calculationMode}</td>
      <td><strong>${currentRate}%</strong></td>
      <td>
        <button class="back-btn configure-comm-btn" style="padding: 6px 12px; font-size: 0.8rem; border-radius: var(--border-radius-sm);" ${isAutoMode ? 'disabled' : ''}>
          <i data-lucide="edit-3" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"></i> Configure
        </button>
      </td>
    `;

    // Bind configuration override prompt
    const configureBtn = tr.querySelector('.configure-comm-btn');
    if (configureBtn) {
      configureBtn.addEventListener('click', () => {
        const input = prompt(`Enter custom agency commission percentage (0-100) for "${shop.name}":`, shop.commissionRate !== undefined ? shop.commissionRate : 20);
        if (input === null) return;
        
        const newRate = parseFloat(input);
        if (isNaN(newRate) || newRate < 0 || newRate > 100) {
          showToast("Please enter a valid percentage between 0 and 100.", "error");
          return;
        }

        shop.commissionRate = newRate;
        syncStorage();
        renderAgencyCommissionSettings();
        renderAgencyDailyReports();
        showToast(`Commission rate updated to ${newRate}% for "${shop.name}".`, "success");
      });
    }

    container.appendChild(tr);
  });

  lucide.createIcons();
}

// Bind Tier Rules Form submission
const agencyCommissionRulesForm = document.getElementById('agency-commission-rules-form');
if (agencyCommissionRulesForm) {
  agencyCommissionRulesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rulesEnabledCheckbox = document.getElementById('agency-rules-enabled');
    const t1Limit = parseInt(document.getElementById('agency-tier1-limit').value);
    const t1Rate = parseFloat(document.getElementById('agency-tier1-rate').value);
    const t2Limit = parseInt(document.getElementById('agency-tier2-limit').value);
    const t2Rate = parseFloat(document.getElementById('agency-tier2-rate').value);
    const t3Rate = parseFloat(document.getElementById('agency-tier3-rate').value);

    if (isNaN(t1Limit) || t1Limit <= 0 || isNaN(t1Rate) || t1Rate < 0 || t1Rate > 100 ||
        isNaN(t2Limit) || t2Limit <= 0 || isNaN(t2Rate) || t2Rate < 0 || t2Rate > 100 ||
        isNaN(t3Rate) || t3Rate < 0 || t3Rate > 100) {
      showToast("Please enter valid positive values for limits and rates (0-100%).", "error");
      return;
    }

    if (t1Limit >= t2Limit) {
      showToast("Tier 1 limit must be smaller than Tier 2 limit.", "error");
      return;
    }

    tieredCommissionRules.enabled = rulesEnabledCheckbox ? rulesEnabledCheckbox.checked : false;
    tieredCommissionRules.tier1Limit = t1Limit;
    tieredCommissionRules.tier1Rate = t1Rate;
    tieredCommissionRules.tier2Limit = t2Limit;
    tieredCommissionRules.tier2Rate = t2Rate;
    tieredCommissionRules.tier3Rate = t3Rate;

    syncStorage();
    renderAgencyCommissionSettings();
    renderAgencyDailyReports();
    showToast("Volume-based tiered commission rules updated successfully!", "success");
  });
}

// Bind check switch toggler directly to trigger redraws
const rulesEnabledCheckbox = document.getElementById('agency-rules-enabled');
if (rulesEnabledCheckbox) {
  rulesEnabledCheckbox.addEventListener('change', () => {
    tieredCommissionRules.enabled = rulesEnabledCheckbox.checked;
    syncStorage();
    renderAgencyCommissionSettings();
    renderAgencyDailyReports();
    showToast(`Auto-tiered commissions ${tieredCommissionRules.enabled ? 'Enabled' : 'Disabled'}.`, "info");
  });
}

// --- CUSTOMER AUTH LOGIC ---
if (showRegisterBtn) {
  showRegisterBtn.addEventListener('click', () => {
    authOptions.style.display = 'none';
    custRegisterForm.style.display = 'flex';
  });
}
if (showLoginBtn) {
  showLoginBtn.addEventListener('click', () => {
    authOptions.style.display = 'none';
    custLoginForm.style.display = 'flex';
  });
}

if (custRegisterForm) {
  custRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCust = {
      name: document.getElementById('reg-name').value,
      phone: document.getElementById('reg-phone').value,
      address: document.getElementById('reg-address').value,
      city: document.getElementById('reg-city').value,
      state: document.getElementById('reg-state').value,
      pin: document.getElementById('reg-pin').value,
      status: 'pending'
    };
    if(customers.find(c => c.phone === newCust.phone)) {
      showToast('Phone number already registered!', 'error');
      return;
    }
    customers.push(newCust);
    localStorage.setItem('delivery_customers', JSON.stringify(customers));
    syncStorage();
    
    custRegisterForm.style.display = 'none';
    authWaitMsg.style.display = 'block';
    waitMsgText.innerText = `Mr./Ms. ${newCust.name}, please wait 10 minutes for your account to be approved.`;
    showToast('Registration sent for approval', 'info');
  });
}

if (custLoginForm) {
  custLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const cust = customers.find(c => c.phone === phone);
    
    if (!cust) {
      showToast('Account not found. Please register.', 'error');
      return;
    }
    
    if (cust.status === 'pending') {
      custLoginForm.style.display = 'none';
      authWaitMsg.style.display = 'block';
      waitMsgText.innerText = `Mr./Ms. ${cust.name}, your account is still waiting for approval.`;
      return;
    }
    
    if (cust.status === 'approved') {
      activeCustomer = cust;
      sessionStorage.setItem('active_customer_session', JSON.stringify(cust));
      showToast('Welcome back!', 'success');
      switchCustomerSubview('cust-shops-directory');
      renderShopsDirectory();
      custLoginForm.reset();
      custLoginForm.style.display = 'none';
      authOptions.style.display = 'block';
    }
  });
}

// --- AGENCY APPROVALS LOGIC ---
const unlockBtn = document.getElementById('approvals-unlock-btn');
const passInput = document.getElementById('approvals-pass-input');
const gate = document.getElementById('agency-approvals-gate');
const approvalsContent = document.getElementById('agency-approvals-content');
const approvalsRows = document.getElementById('agency-approvals-rows');

function renderCustomerApprovals() {
  if (!approvalsRows) return;
  approvalsRows.innerHTML = '';
  if (customers.length === 0) {
    approvalsRows.innerHTML = `<tr><td colspan="5" style="text-align: center;">No registrations found</td></tr>`;
    return;
  }
  
  customers.forEach(cust => {
    let statusHtml = cust.status === 'approved' ? `<span style="color: var(--success-color)">Approved</span>` : `<span style="color: var(--warning-color)">Pending</span>`;
    let btnHtml = cust.status === 'pending' ? 
      `<button class="next-btn" style="padding: 4px 10px; font-size: 0.8rem;" onclick="approveCustomer('${cust.phone}')">Approve</button>` :
      `<button class="back-btn" style="padding: 4px 10px; font-size: 0.8rem; background: var(--error-color); color: white;" onclick="rejectCustomer('${cust.phone}')">Revoke</button>`;
      
    approvalsRows.innerHTML += `
      <tr>
        <td>${cust.name}</td>
        <td>${cust.phone}</td>
        <td>${cust.address}</td>
        <td>${statusHtml}</td>
        <td>${btnHtml}</td>
      </tr>
    `;
  });
}

if (unlockBtn) {
  unlockBtn.addEventListener('click', () => {
    if (passInput.value === 'techadmin123') {
      gate.style.display = 'none';
      approvalsContent.style.display = 'block';
      renderCustomerApprovals();
    } else {
      showToast('Invalid password', 'error');
    }
  });
}

// --- AGENCY OFFERS LOGIC ---
const offersUnlockBtn = document.getElementById('offers-unlock-btn');
const offersPassInput = document.getElementById('offers-pass-input');
const offersGate = document.getElementById('agency-offers-gate');
const offersContent = document.getElementById('agency-offers-content');
const activeOffersList = document.getElementById('agency-active-offers-list');
const offerShopSelect = document.getElementById('offer-shop-select');

function renderAgencyOffers() {
  if (!activeOffersList) return;
  
  if (offerShopSelect) {
    offerShopSelect.innerHTML = '<option value="">Select a shop...</option>';
    shops.forEach(s => {
      offerShopSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.area})</option>`;
    });
  }
  
  activeOffersList.innerHTML = '';
  if (activeOffers.length === 0) {
    activeOffersList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No active offers currently.</div>`;
    return;
  }
  
  activeOffers.forEach(offer => {
    activeOffersList.innerHTML += `
      <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; padding: 16px;">
        <div>
          <div style="font-weight: 800; color: #6C4DFF;">${offer.title}</div>
          <div style="font-size: 0.9rem; font-weight: 600;">${offer.details}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">Shop: ${offer.shopName}</div>
        </div>
        <button onclick="deleteAgencyOffer('${offer.id}')" style="background: transparent; border: none; color: var(--error-color); cursor: pointer;"><i data-lucide="trash-2"></i></button>
      </div>
    `;
  });
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

if (offersUnlockBtn) {
  offersUnlockBtn.addEventListener('click', () => {
    if (offersPassInput.value === 'offer123') {
      offersGate.style.display = 'none';
      offersContent.style.display = 'block';
      renderAgencyOffers();
    } else {
      showToast('Invalid password', 'error');
    }
  });
}

const offerGoLiveBtn = document.getElementById('offer-go-live-btn');
if (offerGoLiveBtn) {
  offerGoLiveBtn.addEventListener('click', () => {
    if (!offerShopSelect.value) return showToast('Please select a shop', 'error');
    const title = document.getElementById('offer-title-input').value;
    const details = document.getElementById('offer-details-input').value;
    if (!title || !details) return showToast('Please fill all offer details', 'error');
    
    const shop = shops.find(s => s.id == offerShopSelect.value);
    activeOffers.push({
      id: 'OFFER-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      shopId: shop.id,
      shopName: shop.name,
      title: title,
      details: details,
      date: new Date().toLocaleDateString()
    });
    
    syncStorage();
    renderAgencyOffers();
    document.getElementById('offer-title-input').value = '';
    document.getElementById('offer-details-input').value = '';
    showToast('Offer is now LIVE!', 'success');
  });
}

window.deleteAgencyOffer = function(id) {
  activeOffers = activeOffers.filter(o => o.id !== id);
  
  fetch('/api/offers/' + encodeURIComponent(id), { method: 'DELETE' })
    .then(res => res.json())
    .catch(err => console.error('Error deleting offer from server:', err));
    
  syncStorage();
  renderAgencyOffers();
  showToast('Offer removed.', 'info');
  // Re-render customer dash if active to remove banner
  if (document.getElementById('cust-store-view') && document.getElementById('cust-store-view').classList.contains('active')) {
    renderCustomerOffersBanner();
  }
};

window.approveCustomer = function(phone) {
  const cust = customers.find(c => c.phone === phone);
  if (cust) {
    cust.status = 'approved';
    localStorage.setItem('delivery_customers', JSON.stringify(customers));
    syncStorage();
    renderCustomerApprovals();
    showToast('Customer approved', 'success');
  }
}

window.rejectCustomer = function(phone) {
  const cust = customers.find(c => c.phone === phone);
  if (cust) {
    cust.status = 'pending';
    localStorage.setItem('delivery_customers', JSON.stringify(customers));
    syncStorage();
    renderCustomerApprovals();
    showToast('Customer access revoked', 'info');
  }
}

document.querySelectorAll('.db-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (link.dataset.panel !== 'agency-customer-approvals' && gate) {
      gate.style.display = 'block';
      approvalsContent.style.display = 'none';
      passInput.value = '';
    }
  });
});

// --- CUSTOMER PROFILE ---
function openCustomerProfile() {
  if (!activeCustomer) {
    showToast('Please log in to view your profile.', 'error');
    return;
  }
  document.getElementById('profile-name-display').innerText = activeCustomer.name;
  document.getElementById('profile-phone-display').innerText = '+91 ' + activeCustomer.phone;
  document.getElementById('profile-address-display').innerText = activeCustomer.address;
  document.getElementById('profile-location-display').innerText = activeCustomer.city + ', ' + activeCustomer.state + ' - ' + activeCustomer.pin;
  document.getElementById('customer-profile-modal').classList.add('active');
}

// --- CUSTOMER ORDERS ---
// --- CUSTOMER OFFERS / NOTIFICATIONS ---
window.openCustomerNotifications = function() {
  const modal = document.getElementById('customer-notifications-modal');
  const list = document.getElementById('customer-notifications-list');
  if (!modal || !list) return;
  
  list.innerHTML = '';
  if (activeOffers.length === 0) {
    list.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 20px;">
      <i data-lucide="bell-off" style="width:48px;height:48px;color:var(--text-muted);margin-bottom:16px;"></i>
      <p>You have no new notifications.</p>
    </div>`;
  } else {
    activeOffers.forEach(offer => {
      list.innerHTML += `
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 16px; border-left: 4px solid #6C4DFF;">
          <h4 style="color: #6C4DFF; margin-bottom: 4px;">${offer.title}</h4>
          <p style="font-size: 0.95rem; margin-bottom: 8px;">${offer.details}</p>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary);">
            <span>${offer.shopName}</span>
            <span>${offer.date}</span>
          </div>
        </div>
      `;
    });
  }
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
  modal.classList.add('active');
};

window.renderCustomerOffersBannerInterval = null;

window.renderCustomerOffersBanner = function() {
  const container = document.getElementById('customer-offers-banner-container');
  if (!container) return;
  
  if (window.renderCustomerOffersBannerInterval) {
    clearInterval(window.renderCustomerOffersBannerInterval);
  }
  
  container.innerHTML = '';
  if (activeOffers.length > 0) {
    container.innerHTML = `
      <div class="customer-offer-banner" onclick="openCustomerNotifications()" style="cursor: pointer;">
        <div class="offer-text-content" id="offer-banner-text-content" style="transition: opacity 0.5s ease-in-out;">
          <!-- Content injected by JS -->
        </div>
      </div>
    `;
    
    const textContent = document.getElementById('offer-banner-text-content');
    let currentIndex = 0;
    
    function showOffer(index) {
      const offer = activeOffers[index];
      textContent.style.opacity = 0; // Fade out
      setTimeout(() => {
        textContent.innerHTML = `
          <div style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; color: #facc15; font-weight: 800; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">From: ${offer.shopName}</div>
          <h2 style="font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 8px; color: #1e1e1e; font-weight: 900; line-height: 1.1;">${offer.title}</h2>
          <p style="font-size: 1.2rem; color: #4b5563; font-weight: 600;">${offer.details}</p>
        `;
        textContent.style.opacity = 1; // Fade in
      }, 500);
    }
    
    showOffer(currentIndex);
    
    if (activeOffers.length > 1) {
      window.renderCustomerOffersBannerInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % activeOffers.length;
        showOffer(currentIndex);
      }, 4000); // Switch every 4 seconds
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
};

function openCustomerOrders() {
  if (!activeCustomer) {
    showToast('Please log in to view your orders.', 'error');
    return;
  }
  switchCustomerSubview('cust-orders-view');
  renderCustomerOrders();
}

window.currentCustomerOrderFilter = window.currentCustomerOrderFilter || 'All';

if (!window.customerFilterBound) {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('premium-chip')) {
      document.querySelectorAll('.premium-chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      window.currentCustomerOrderFilter = e.target.getAttribute('data-filter');
      renderCustomerOrders();
    }
  });
  window.customerFilterBound = true;
}

function renderCustomerOrders() {
  const list = document.getElementById('customer-orders-list');
  if (!list) return;
  
  let myOrders = deliveries.filter(d => d.phone === activeCustomer.phone || (activeCustomer.name && d.customerName === activeCustomer.name));
  
  if (window.currentCustomerOrderFilter !== 'All') {
    myOrders = myOrders.filter(d => d.status === window.currentCustomerOrderFilter);
  }
  
  if (myOrders.length === 0) {
    list.innerHTML = `
      <div class="empty-state-illustration">
        <div class="empty-state-icon"><i data-lucide="package-open" style="width: 64px; height: 64px;"></i></div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">No orders found</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 250px;">Looks like you don't have any orders matching this filter.</p>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }
  
  const sortedOrders = [...myOrders].reverse();
  
  let html = '';
  sortedOrders.forEach((order, index) => {
    let finalBillBtn = '';
    if (order.status === 'Delivered') {
      finalBillBtn = `
        <div style="display: flex; gap: 8px; margin-top: 16px;">
          <button onclick="viewCustomerInvoice('${order.id}')" style="flex: 2; padding: 12px; background: var(--success-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;">Generate Final Bill</button>
          <button onclick="viewCustomerInvoice('${order.id}'); setTimeout(()=>window.print(), 300);" style="flex: 1; padding: 12px; background: #6C4DFF; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 6px;"><i data-lucide="printer" style="width: 16px; height: 16px;"></i> Print</button>
        </div>
      `;
    }
    
    let progressWidth = '0%';
    let isPacked = false;
    let isDispatched = false;
    let isDelivered = false;
    
    if (order.status === 'Pending') {
      progressWidth = '33%';
      isPacked = true;
    } else if (order.status === 'Dispatched') {
      progressWidth = '66%';
      isPacked = true;
      isDispatched = true;
    } else if (order.status === 'Delivered') {
      progressWidth = '100%';
      isPacked = true;
      isDispatched = true;
      isDelivered = true;
    }
    
    let trackBtn = '';
    if (order.status !== 'Delivered') {
      trackBtn = `<button onclick="openTrackOrder('${order.id}')" style="margin-top: 16px; padding: 12px 16px; background: transparent; color: #6C4DFF; border: 2px solid #6C4DFF; border-radius: 8px; cursor: pointer; font-weight: 700; width: 100%; transition: all 0.3s ease;">Track Order Live</button>`;
    }
    
    html += `
      <div class="premium-order-card">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">
          <img src="/aura_logo.png" alt="AURA Dispatch" style="height: 40px; object-fit: contain;">
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">Order #${sortedOrders.length - index}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">ID: ${order.id}</div>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <span style="font-size: 0.8rem; padding: 6px 12px; border-radius: 20px; font-weight: 700; background: ${order.status === 'Delivered' ? 'var(--success-light)' : 'rgba(108, 77, 255, 0.1)'}; color: ${order.status === 'Delivered' ? 'var(--success-color)' : '#6C4DFF'};">${order.status}</span>
            <button onclick="deleteCustomerOrder('${order.id}')" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; transition: color 0.3s;" onmouseover="this.style.color='var(--error-color)'" onmouseout="this.style.color='var(--text-muted)'" title="Delete Order">
              <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>
        
        <div style="background: var(--bg-tertiary); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-secondary); font-size: 0.85rem;">Store</span>
            <strong style="color: var(--text-primary); font-size: 0.9rem;">${order.shopName || '-'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-secondary); font-size: 0.85rem;">Placed On</span>
            <strong style="color: var(--text-primary); font-size: 0.9rem;">${order.date || '-'} ${order.time || ''}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-secondary); font-size: 0.85rem;">Payment Method</span>
            <strong style="color: var(--text-primary); font-size: 0.9rem;">Cash on Delivery</strong>
          </div>
          ${order.deliveryOtp ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; background: rgba(108, 77, 255, 0.1); padding: 8px; border-radius: 6px;">
            <span style="color: var(--primary-color); font-size: 0.85rem; font-weight: 600;">Delivery OTP</span>
            <strong style="color: var(--primary-color); font-size: 1.1rem; letter-spacing: 2px;">${order.deliveryOtp}</strong>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border-color);">
            <span style="color: var(--text-primary); font-size: 0.95rem; font-weight: 700;">Total Amount</span>
            <strong style="color: #6C4DFF; font-size: 1.1rem; font-weight: 800;">₹${order.total.toFixed(2)}</strong>
          </div>
        </div>
        
        <div class="timeline-container">
          <div class="timeline-progress-line" style="width: ${progressWidth};"></div>
          
          <div class="timeline-step completed">
            <div class="timeline-icon"><i data-lucide="check" style="width: 14px; height: 14px;"></i></div>
            <div class="timeline-text">Confirmed</div>
          </div>
          
          <div class="timeline-step ${isPacked ? 'completed' : ''}">
            <div class="timeline-icon"><i data-lucide="package" style="width: 14px; height: 14px;"></i></div>
            <div class="timeline-text">Packed</div>
          </div>
          
          <div class="timeline-step ${isDispatched ? (isDelivered ? 'completed' : 'active') : ''}">
            <div class="timeline-icon"><i data-lucide="truck" style="width: 14px; height: 14px;"></i></div>
            <div class="timeline-text">Out for Delivery</div>
          </div>
          
          <div class="timeline-step ${isDelivered ? 'completed' : ''}">
            <div class="timeline-icon"><i data-lucide="home" style="width: 14px; height: 14px;"></i></div>
            <div class="timeline-text">Delivered</div>
          </div>
        </div>
        
        <div style="text-align: center; color: var(--text-secondary); font-size: 0.85rem; margin-top: -8px; margin-bottom: 16px; min-height: 20px;">
          ${order.status === 'Delivered' ? 'Delivered successfully.' : (order.quickMessage ? 'Expected Delivery: ' + order.quickMessage : '')}
        </div>
        
        ${trackBtn}
        ${finalBillBtn}
      </div>
    `;
  });
  list.innerHTML = html;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

let currentDiscountOrderId = null;

function closeDiscountPrompt() {
  const modal = document.getElementById('discount-prompt-modal');
  modal.close();
  modal.classList.remove('active');
  const order = deliveries.find(d => d.id === currentDiscountOrderId);
  if (order) {
    order.appliedDiscount = 0; // Skips offer
    syncStorage();
    renderCustomerInvoiceInternal(order);
  }
}

function applyDiscountPrompt() {
  const modal = document.getElementById('discount-prompt-modal');
  const inputVal = document.getElementById('discount-prompt-input').value;
  modal.close();
  modal.classList.remove('active');
  
  const order = deliveries.find(d => d.id === currentDiscountOrderId);
  if (order) {
    let discountAmount = parseFloat(inputVal) || 0;
    const subtotal = order.subtotal !== undefined ? order.subtotal : order.total;
    const deliveryFee = order.deliveryFee || 0;
    
    if (discountAmount > subtotal) discountAmount = subtotal; // Max discount is subtotal
    order.appliedDiscount = discountAmount;
    order.total = Math.max(0, subtotal + deliveryFee - discountAmount);
    
    syncStorage();
    if (typeof renderAgencyDeliveries === 'function') renderAgencyDeliveries();
    if (typeof renderPartnerDeliveries === 'function') renderPartnerDeliveries();
    
    renderCustomerInvoiceInternal(order);
  }
}

function viewCustomerInvoice(orderId) {
  const order = deliveries.find(d => d.id === orderId);
  if (!order) return;
  
  const shopOffer = activeOffers.find(o => o.shopName === order.shopName);
  if (shopOffer && order.appliedDiscount === undefined) {
    currentDiscountOrderId = orderId;
    document.getElementById('discount-offer-title').innerText = shopOffer.title || '';
    document.getElementById('discount-offer-details').innerText = shopOffer.details || '';
    document.getElementById('discount-prompt-input').value = '0';
    
    const promptModal = document.getElementById('discount-prompt-modal');
    promptModal.showModal();
    promptModal.classList.add('active');
    return; // Wait for user to interact with the custom modal
  }
  
  renderCustomerInvoiceInternal(order);
}

function renderCustomerInvoiceInternal(order) {
  const modal = document.getElementById('customer-invoice-modal');
  if (!modal) return;
  
  document.getElementById('cust-bill-name').innerText = order.customerName || '-';
  document.getElementById('cust-bill-phone').innerText = '+91 ' + (order.phone || '-');
  document.getElementById('cust-bill-id').innerText = order.id;
  document.getElementById('cust-bill-date').innerText = order.date || order.time || '-';
  document.getElementById('cust-bill-shop').innerText = order.shopName || '-';
  
  const itemsList = document.getElementById('cust-bill-items');
  itemsList.innerHTML = '';
  
  if (order.itemsDetails && Array.isArray(order.itemsDetails)) {
    order.itemsDetails.forEach(item => {
      const pName = item.product ? item.product.name : (item.name || 'Item');
      const pPrice = item.product ? getDiscountedPrice(item.product) : (item.price || 0);
      
      let displayName = pName;
      if (item.product && item.product.discount > 0) {
        displayName += ` <span style="color: var(--success-color); font-size: 0.8rem; font-weight: 500;">(${item.product.discount}% Off)</span>`;
      }

      itemsList.innerHTML += `
        <tr>
          <td style="padding: 12px 8px;">${item.quantity}x ${displayName}</td>
          <td style="padding: 12px 8px; text-align: right;">₹${(pPrice * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    });
  } else if (order.items) {
    itemsList.innerHTML = `
      <tr>
        <td style="padding: 12px 8px;">${order.items}</td>
        <td style="padding: 12px 8px; text-align: right;">-</td>
      </tr>
    `;
  }
  
  const subtotal = order.subtotal !== undefined ? order.subtotal : order.total;
  const deliveryFee = order.deliveryFee || 0;
  const discountAmount = order.appliedDiscount || 0;
  const isFreeDelivery = order.isFreeDelivery || false;

  document.getElementById('cust-bill-subtotal').innerText = '₹' + subtotal.toFixed(2);
  document.getElementById('cust-bill-delivery').innerText = deliveryFee ? '+₹' + deliveryFee.toFixed(2) : 'Free';
  
  const freeDelRow = document.getElementById('cust-bill-freedelivery-row');
  if (isFreeDelivery && deliveryFee > 0) {
    freeDelRow.style.display = 'flex';
    document.getElementById('cust-bill-freedelivery').innerText = '-₹' + deliveryFee.toFixed(2);
  } else {
    freeDelRow.style.display = 'none';
  }
  
  const discountRow = document.getElementById('cust-bill-discount-row');
  if (discountAmount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('cust-bill-discount').innerText = '-₹' + discountAmount.toFixed(2);
  } else {
    discountRow.style.display = 'none';
  }
  
  document.getElementById('cust-bill-total').innerText = '₹' + order.total.toFixed(2);
  
  modal.showModal();
  modal.classList.add('active');
  lucide.createIcons();
}

function openTrackOrder(orderId) {
  const order = deliveries.find(d => d.id === orderId);
  if (!order) return;
  
  const modal = document.getElementById('track-order-modal');
  if (!modal) return;
  
  document.getElementById('track-order-id').innerText = order.id;

  const msgContainer = document.getElementById('order-track-message-container');
  const msgText = document.getElementById('order-track-message');
  if (order.quickMessage) {
    msgContainer.style.display = 'block';
    msgText.innerText = order.quickMessage;
  } else {
    msgContainer.style.display = 'none';
    msgText.innerText = '';
  }
  
  const steps = ['pending', 'dispatched', 'delivered'];
  steps.forEach(step => {
    const el = document.getElementById('order-track-step-' + step);
    if (!el) return;
    el.style.opacity = '0.4';
    const dot = el.querySelector('.track-dot');
    if (dot) {
      dot.style.background = 'var(--bg-tertiary)';
      dot.style.color = 'var(--text-muted)';
    }
  });
  
  const setActive = (stepId) => {
    const el = document.getElementById('order-track-step-' + stepId);
    if (!el) return;
    el.style.opacity = '1';
    const dot = el.querySelector('.track-dot');
    if (dot) {
      dot.style.background = 'var(--success-color)';
      dot.style.color = 'white';
    }
  };
  
  if (order.status === 'Pending') {
    setActive('pending');
  } else if (order.status === 'Dispatched') {
    setActive('pending');
    setActive('dispatched');
    document.getElementById('order-track-courier-details').innerText = 'Courier assigned: ' + (order.courier || 'Agent');
  } else if (order.status === 'Delivered') {
    setActive('pending');
    setActive('dispatched');
    setActive('delivered');
    document.getElementById('order-track-courier-details').innerText = 'Courier assigned: ' + (order.courier || 'Agent');
  }
  
  modal.showModal();
  modal.classList.add('active');
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function deleteCustomerOrder(orderId) {
  if (confirm("Are you sure you want to delete this order from your history?")) {
    const idx = deliveries.findIndex(d => d.id === orderId);
    if (idx !== -1) {
      deliveries.splice(idx, 1);
      syncStorage();
      renderCustomerOrders();
      showToast("Order removed from history.", "success");
    }
  }
}

// --- CUSTOMER THEME SWITCHER LOGIC ---
function setCustomerTheme(theme) {
  // Reset classes
  document.body.classList.remove('theme-dark', 'theme-glass');
  
  if (theme === 'dark') {
    document.body.classList.add('theme-dark');
  } else if (theme === 'glass') {
    document.body.classList.add('theme-glass');
  }
  
  // Update buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
      btn.style.background = 'var(--bg-secondary)';
      btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      btn.style.color = 'var(--text-primary)';
      btn.style.fontWeight = '600';
    } else {
      btn.classList.remove('active');
      btn.style.background = 'transparent';
      btn.style.boxShadow = 'none';
      btn.style.color = 'var(--text-secondary)';
      btn.style.fontWeight = '500';
    }
  });

  localStorage.setItem('customerThemePref', theme);
}

function initCustomerTheme() {
  const savedTheme = localStorage.getItem('customerThemePref') || 'light';
  setCustomerTheme(savedTheme);
}

// --- PRINT SECTION FUNCTIONALITY ---
function printSection(btn) {
  const card = btn.closest('.db-inventory-card');
  card.classList.add('print-active');
  window.print();
  card.classList.remove('print-active');
}
window.printSection = printSection;

// --- THERMAL RECEIPT FUNCTIONALITY ---
window.viewThermalReceipt = function(orderId) {
  const delivery = deliveries.find(d => d.id === orderId);
  if (!delivery) return;
  
  const content = document.getElementById('thermal-receipt-content');
  if (!content) return;
  
  let itemsHtml = '';
  // Convert items string into table rows
  const itemsArray = delivery.items.split(', ');
  itemsArray.forEach(item => {
    itemsHtml += `
      <tr>
        <td style="font-size: 11px;">${item}</td>
        <td style="font-size: 11px; text-align: right;">1</td>
      </tr>
    `;
  });

  const receiptHtml = `
    <div class="thermal-receipt">
      <div style="text-align: center; margin-bottom: 10px;">
        <i data-lucide="zap" style="width: 32px; height: 32px; color: #000080;"></i>
      </div>
      <h2>AURA STAFF TICKET</h2>
      <div style="text-align: center; font-size: 10px; margin-bottom: 5px;">STAFF PACKING SLIP</div>
      
      <div class="divider"></div>
      
      <div class="row">
        <span>Receipt No:</span>
        <span class="bold">${delivery.id}</span>
      </div>
      <div class="row">
        <span>Date:</span>
        <span>${new Date(delivery.date).toLocaleString()}</span>
      </div>
      <div class="row">
        <span>Merchant:</span>
        <span class="bold">${delivery.shopName}</span>
      </div>
      
      <div class="divider"></div>
      
      <h4>CUSTOMER DETAILS</h4>
      <div class="row">
        <span>Name:</span>
        <span class="bold">${delivery.customerName}</span>
      </div>
      <div class="row">
        <span>Phone:</span>
        <span>${delivery.phone || 'N/A'}</span>
      </div>
      
      <div class="divider"></div>
      
      <h4>ORDER ITEMS</h4>
      <table>
        <thead>
          <tr>
            <th style="font-size: 11px;">Description</th>
            <th style="font-size: 11px; text-align: right;">Qty</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div class="divider"></div>
      
      <div style="text-align: center; font-size: 10px; margin-top: 20px;">
        <p>This is a packing slip for internal use.</p>
        <p>*** PLEASE PACK CAREFULLY ***</p>
      </div>
    </div>
  `;
  
  content.innerHTML = receiptHtml;
  lucide.createIcons();
  
  document.body.classList.add('printing-thermal');
  document.getElementById('thermal-receipt-modal').style.display = 'flex';
};

// --- DAILY OPERATIONS REPORT PRINT ---
window.printDailyOperationsReport = function() {
  const panel = document.getElementById('agency-reports').querySelector('.db-inventory-card');
  if (!panel) return;
  
  panel.classList.add('print-active');
  window.print();
  panel.classList.remove('print-active');
};
