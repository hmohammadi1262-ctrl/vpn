// ============================================================
//  لوکسورا جواهرات — Application Logic
//  SPA Router, Cart, Wishlist, Pages, Events
// ============================================================

// ---- Store (cart & wishlist via localStorage) ----
const Store = {
  cart: JSON.parse(localStorage.getItem('luxora_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('luxora_wishlist') || '[]'),
  user: JSON.parse(localStorage.getItem('luxora_user') || 'null'),

  saveCart() { localStorage.setItem('luxora_cart', JSON.stringify(this.cart)); this.updateBadges(); },
  saveWishlist() { localStorage.setItem('luxora_wishlist', JSON.stringify(this.wishlist)); this.updateBadges(); },

  addToCart(productId, qty = 1) {
    const item = this.cart.find(i => i.id === productId);
    if (item) item.qty += qty;
    else this.cart.push({ id: productId, qty });
    this.saveCart();
  },
  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.id !== productId);
    this.saveCart();
  },
  updateQty(productId, qty) {
    const item = this.cart.find(i => i.id === productId);
    if (item) { item.qty = Math.max(1, qty); this.saveCart(); }
  },
  cartCount() { return this.cart.reduce((s, i) => s + i.qty, 0); },
  cartTotal() {
    return this.cart.reduce((sum, item) => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  },

  toggleWishlist(productId) {
    if (this.wishlist.includes(productId)) this.wishlist = this.wishlist.filter(i => i !== productId);
    else this.wishlist.push(productId);
    this.saveWishlist();
  },
  isWishlisted(productId) { return this.wishlist.includes(productId); },

  updateBadges() {
    document.querySelectorAll('.cart-badge').forEach(b => b.textContent = toPersianNum(this.cartCount()));
    document.querySelectorAll('.wishlist-count').forEach(b => b.textContent = toPersianNum(this.wishlist.length));
  }
};

// ---- Toast ----
function toast(msg, type = '') {
  const c = document.querySelector('.toast-container') || (() => {
    const d = document.createElement('div');
    d.className = 'toast-container';
    document.body.appendChild(d);
    return d;
  })();
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'fadeOut 0.3s forwards'; setTimeout(() => t.remove(), 300); }, 2500);
}

// ---- Router ----
function getRoute() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  return { path: '/' + parts.join('/'), parts };
}

function navigate(href) { location.hash = href; }

function router() {
  const { parts } = getRoute();
  const app = document.getElementById('app-content');
  if (typeof killAnimations === 'function') killAnimations();
  window.scrollTo(0, 0);

  if (parts.length === 0) renderHome(app);
  else if (parts[0] === 'products') renderProducts(app, parts);
  else if (parts[0] === 'product' && parts[1]) renderProductDetail(app, parseInt(parts[1]));
  else if (parts[0] === 'cart') renderCart(app);
  else if (parts[0] === 'wishlist') renderWishlist(app);
  else if (parts[0] === 'about') renderAbout(app);
  else if (parts[0] === 'blog') renderBlog(app);
  else if (parts[0] === 'contact') renderContact(app);
  else if (parts[0] === 'account') renderAccount(app);
  else if (parts[0] === 'checkout') renderCheckout(app);
  else if (parts[0] === 'search') renderSearch(app);
  else if (parts[0] === 'admin') renderAdmin(app);
  else renderNotFound(app);

  updateActiveNav();
}

function updateActiveNav() {
  const { parts } = getRoute();
  const current = parts[0] ? '/' + parts[0] : '/';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + (parts[0] || ''));
  });
}

// ---- Star Rating HTML ----
function starRating(rating) {
  let html = '';
  for (let i = 0; i < 5; i++) html += ICONS.star;
  return `<div class="product-rating">${html}</div>`;
}

// ---- Product Card ----
function productCard(p) {
  const wished = Store.isWishlisted(p.id) ? 'active' : '';
  return `
    <div class="product-card" data-id="${p.id}">
      <a href="#/product/${p.id}">
        <div class="product-image-wrap">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
      </a>
      <button class="wishlist-btn ${wished}" data-wishlist="${p.id}" aria-label="افزودن به علاقه‌مندی‌ها">
        ${ICONS.heart}
      </button>
      <div class="product-info">
        <a href="#/product/${p.id}"><h3 class="product-name">${p.name}</h3></a>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="product-old-price">${formatPrice(p.oldPrice)}</span>` : ''}
        </div>
        ${starRating(p.rating)}
      </div>
    </div>`;
}

// ============================================================
// PAGE: HOME
// ============================================================
function renderHome(app) {
  app.innerHTML = `
    <!-- HERO VIDEO -->
    <section class="hero-video-section" id="hero-video">
      <div class="hero-video-bg">
        <video autoplay muted loop playsinline preload="auto"
               poster="${SITE.hero.poster}"
               src="${SITE.hero.video}"></video>
      </div>
      <div class="container hero-video-content">
        <span class="hero-eyebrow">${SITE.hero.eyebrow}</span>
        <h1 class="hero-title">${SITE.hero.title}</h1>
        <p class="hero-desc">${SITE.hero.desc}</p>
        <div class="hero-cta-row">
          <a href="${SITE.hero.ctaHref}" class="btn-primary">${SITE.hero.cta} ${ICONS.arrowLeft}</a>
          <a href="${SITE.hero.cta2Href}" class="btn-outline-light">${SITE.hero.cta2}</a>
        </div>
        <div class="hero-features">
          ${SITE.hero.features.map(f => `<div class="hero-feature">${ICONS.shield}<span>${f}</span></div>`).join('')}
        </div>
      </div>
      <div class="hero-scroll-hint">${ICONS.arrowLeft}<span>اسکرول کنید</span></div>
    </section>

    <!-- STORYTELLING -->
    <section class="storytelling-section" id="storytelling">
      <div class="container storytelling-grid">
        <div class="storytelling-image">
          <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80" alt="هنر جواهرسازی">
          <div class="storytelling-image-badge">
            <span class="gold-line"></span>
            <span>طلای ۱۸ عیار</span>
          </div>
        </div>
        <div class="storytelling-content">
          <span class="eyebrow">هنر ظرافت</span>
          <h2 class="title">داستان هر جواهر</h2>
          <p>هر قطعه از مجموعه لوکسورا، حاصل تلفیق هنر دست، تجربه‌ی سالیان و اشتیاق به خلق زیبایی است. از انتخاب نگین‌های درخشان تا طراحی نهایی، گامی در مسیر کمال برداشته‌ایم.</p>
          <p>ما باور داریم هر جواهر باید روایتی از شخصیت و سلیقه‌ی دارنده‌اش باشد. به همین دلیل، در هر طراحی، ظرافت و اصالت را به هم می‌آمیزیم.</p>
          <a href="#/about" class="btn-primary">داستان ما ${ICONS.arrowLeft}</a>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section categories-section">
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">دسته‌بندی محصولات</span>
          <h2 class="title">زیبایی را انتخاب کنید</h2>
          <p style="color:var(--text-light); margin-top:8px;">برای هر سلیقه، یک درخشش خاص</p>
        </div>
        <div class="categories-grid">
          ${SITE.categories.map(c => `
            <a href="#/products?cat=${c.slug}" class="category-card category-card-3d">
              <div class="category-image"><img src="${c.image}" alt="${c.name}" loading="lazy"></div>
              <h3 class="category-name">${c.name}</h3>
              <span class="category-link">مشاهده محصولات</span>
            </a>`).join('')}
        </div>
      </div>
    </section>

    <!-- BESTSELLERS -->
    <section class="section products-section">
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">محصولات پرفروش</span>
          <h2 class="title">محبوب‌ترین جواهرات</h2>
          <p style="color:var(--text-light); margin-top:8px;">انتخاب‌های درخشان شما</p>
          <a href="#/products" class="link">مشاهده همه محصولات ${ICONS.arrowLeft}</a>
        </div>
        <div class="products-grid">
          ${PRODUCTS.filter(p => p.featured).map(productCard).join('')}
        </div>
      </div>
    </section>

    <!-- SHOWCASE -->
    <section class="showcase-section" id="showcase">
      <div class="showcase-stage">
        <div class="showcase-img"><img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&auto=format&fit=crop&q=80" alt="گردنبند سلطنتی"></div>
        <div class="showcase-img"><img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=80" alt="انگشتر الماس"></div>
        <div class="showcase-img"><img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=80" alt="دستبند کلاسیک"></div>
        <div class="showcase-text">
          <span class="showcase-eyebrow">درخشش سلطنتی</span>
          <h2>ست گردنبند سلطنتی</h2>
          <p>تلفیقی از طلای ۱۸ عیار و نگین‌های درخشان، طراحی‌شده برای لحظه‌های خاص شما.</p>
        </div>
        <div class="showcase-text">
          <span class="showcase-eyebrow">زیبایی در سادگی</span>
          <h2>انگشتر تک‌نگین</h2>
          <p>نگین مرکزی درخشان در قابی از طلای اصیل، نمادی از ظرافت بی‌پایان.</p>
        </div>
        <div class="showcase-text">
          <span class="showcase-eyebrow">کلاسیک ماندگار</span>
          <h2>دستبند نگین‌دار</h2>
          <p>طراحی منحصربه‌فرد با نگین‌های ریزدوز، برازنده‌ی مچ دست شما.</p>
        </div>
      </div>
    </section>

    <!-- TRUST STRIP -->
    <section class="trust-strip">
      <div class="container">
        ${SITE.trustStrip.map(t => `
          <div class="trust-item">
            ${ICONS[t.icon]}
            <div>
              <div class="trust-title">${t.title}</div>
              <div class="trust-desc">${t.desc}</div>
            </div>
          </div>`).join('')}
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter">
      <div class="container">
        <h2 class="newsletter-title">همراه ما بمانید</h2>
        <p class="newsletter-desc">از تازه‌ترین مجموعه‌ها، پیشنهادهای ویژه و اخبار دنیای جواهرات باخبر شوید.</p>
        <form class="newsletter-form" id="newsletter-form">
          <input type="email" placeholder="نشانی ایمیل شما" name="email" required>
          <button type="submit" class="btn-primary">عضویت در خبرنامه</button>
        </form>
        <div class="newsletter-msg" id="newsletter-msg"></div>
      </div>
    </section>
  `;
  bindProductCards();
  bindNewsletterForm();
  if (typeof initAnimations === 'function') initAnimations();
}

// ============================================================
// PAGE: PRODUCTS LISTING
// ============================================================
function renderProducts(app, parts) {
  let categoryFilter = null;
  const hash = location.hash;
  const catMatch = hash.match(/cat=(\w+)/);
  if (catMatch) categoryFilter = catMatch[1];

  app.innerHTML = `
    <div class="products-page-header">
      <div class="container">
        <h1>مجموعه جواهرات</h1>
        <p>کاوش در دنیای درخشش و ظرافت</p>
      </div>
    </div>
    <div class="container">
      <div class="products-toolbar">
        <div class="filter-chips">
          <button class="filter-chip ${!categoryFilter ? 'active' : ''}" data-cat="all">همه</button>
          ${SITE.categories.map(c => `<button class="filter-chip ${categoryFilter === c.slug ? 'active' : ''}" data-cat="${c.slug}">${c.name}</button>`).join('')}
        </div>
        <select id="sort-select">
          <option value="default">مرتب‌سازی پیش‌فرض</option>
          <option value="price-asc">قیمت: کم به زیاد</option>
          <option value="price-desc">قیمت: زیاد به کم</option>
          <option value="rating">پرفروش‌ترین</option>
        </select>
      </div>
      <div class="products-grid" id="products-grid">
        ${renderProductsGrid(categoryFilter, 'default')}
      </div>
    </div>
  `;

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.cat;
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const grid = document.getElementById('products-grid');
      grid.innerHTML = renderProductsGrid(cat === 'all' ? null : cat, document.getElementById('sort-select').value);
      bindProductCards();
    });
  });
  document.getElementById('sort-select').addEventListener('change', (e) => {
    const activeCat = document.querySelector('.filter-chip.active')?.dataset.cat;
    const grid = document.getElementById('products-grid');
    grid.innerHTML = renderProductsGrid(activeCat === 'all' ? null : activeCat, e.target.value);
    bindProductCards();
  });
  bindProductCards();
}

function renderProductsGrid(cat, sort) {
  let list = [...PRODUCTS];
  if (cat) list = list.filter(p => p.category === cat);
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  if (list.length === 0) return '<div class="empty-state"><p>محصولی در این دسته یافت نشد.</p></div>';
  return list.map(productCard).join('');
}

// ============================================================
// PAGE: PRODUCT DETAIL
// ============================================================
function renderProductDetail(app, id) {
  const p = PRODUCTS.find(pr => pr.id === id);
  if (!p) return renderNotFound(app);

  app.innerHTML = `
    <div class="container">
      <div class="breadcrumb">
        <a href="#/">خانه</a><span>›</span>
        <a href="#/products">مجموعه‌ها</a><span>›</span>
        ${p.name}
      </div>
      <div class="product-detail">
        <div>
          <div class="product-gallery-main">
            <img src="${p.gallery[0]}" alt="${p.name}" id="gallery-main-img">
          </div>
          <div class="product-gallery-thumbs">
            ${p.gallery.map((g, i) => `<div class="product-gallery-thumb ${i === 0 ? 'active' : ''}" data-img="${g}"><img src="${g}" alt=""></div>`).join('')}
          </div>
        </div>
        <div class="product-detail-info">
          <h1 class="product-detail-name">${p.name}</h1>
          ${starRating(p.rating)}
          <div class="product-detail-price">${formatPrice(p.price)}</div>
          ${p.oldPrice ? `<div class="product-detail-old-price">${formatPrice(p.oldPrice)}</div>` : ''}
          <p class="product-detail-desc">${p.desc}</p>
          <div class="qty-row">
            <div class="qty-control">
              <button id="qty-dec">−</button>
              <input type="text" id="qty-input" value="۱" readonly>
              <button id="qty-inc">+</button>
            </div>
            <button class="wishlist-btn ${Store.isWishlisted(p.id) ? 'active' : ''}" data-wishlist="${p.id}" style="position:static;width:44px;height:44px;background:var(--pale-pink)">${ICONS.heart}</button>
          </div>
          <div class="product-detail-actions">
            <button class="btn-primary" id="add-to-cart-btn">افزودن به سبد خرید ${ICONS.cart}</button>
            <a href="#/cart" class="btn-outline">مشاهده سبد</a>
          </div>
        </div>
      </div>
    </div>
  `;

  let qty = 1;
  const qtyInput = document.getElementById('qty-input');
  document.getElementById('qty-inc').addEventListener('click', () => { qty++; qtyInput.value = toPersianNum(qty); });
  document.getElementById('qty-dec').addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyInput.value = toPersianNum(qty); });
  document.getElementById('add-to-cart-btn').addEventListener('click', () => { Store.addToCart(p.id, qty); toast('به سبد خرید اضافه شد', 'success'); });
  document.querySelectorAll('.product-gallery-thumb').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.product-gallery-thumb').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById('gallery-main-img').src = t.dataset.img;
    });
  });
  bindProductCards();
}

// ============================================================
// PAGE: CART
// ============================================================
function renderCart(app) {
  if (Store.cart.length === 0) {
    app.innerHTML = `
      <div class="cart-page container">
        <div class="cart-empty">
          ${ICONS.cart}
          <h2>سبد خرید شما خالی است</h2>
          <p>هنوز محصولی به سبد خرید اضافه نکرده‌اید.</p>
          <a href="#/products" class="btn-primary">مشاهده محصولات</a>
        </div>
      </div>`;
    return;
  }

  app.innerHTML = `
    <div class="cart-page">
      <div class="container">
        <h1>سبد خرید</h1>
        <div class="cart-layout">
          <div class="cart-items">
            ${Store.cart.map(item => {
              const p = PRODUCTS.find(pr => pr.id === item.id);
              if (!p) return '';
              return `
                <div class="cart-item">
                  <img src="${p.image}" alt="${p.name}">
                  <div class="cart-item-info">
                    <h3><a href="#/product/${p.id}">${p.name}</a></h3>
                    <div class="cart-item-price">${formatPrice(p.price)}</div>
                    <div class="qty-control" style="margin-top:8px;width:fit-content;">
                      <button data-qty-dec="${p.id}">−</button>
                      <input type="text" value="${toPersianNum(item.qty)}" readonly data-qty-val="${p.id}">
                      <button data-qty-inc="${p.id}">+</button>
                    </div>
                  </div>
                  <div class="cart-item-actions">
                    <button class="cart-item-remove" data-remove="${p.id}">${ICONS.trash} حذف</button>
                  </div>
                </div>`;
            }).join('')}
          </div>
          <div class="cart-summary">
            <h2>خلاصه سفارش</h2>
            <div class="summary-row"><span>تعداد اقلام</span><span>${toPersianNum(Store.cartCount())}</span></div>
            <div class="summary-row"><span>جمع کل</span><span>${formatPrice(Store.cartTotal())}</span></div>
            <div class="summary-row"><span>هزینه ارسال</span><span>رایگان</span></div>
            <div class="summary-row total"><span>مبلغ نهایی</span><span>${formatPrice(Store.cartTotal())}</span></div>
            <a href="#/checkout" class="btn-primary" style="width:100%;justify-content:center;margin-top:16px;">تکمیل خرید</a>
            <a href="#/products" class="btn-outline" style="width:100%;justify-content:center;margin-top:10px;">ادامه خرید</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('[data-qty-inc]').forEach(b => b.addEventListener('click', () => { Store.updateQty(+b.dataset.qtyInc, Store.cart.find(i=>i.id===+b.dataset.qtyInc).qty+1); router(); }));
  document.querySelectorAll('[data-qty-dec]').forEach(b => b.addEventListener('click', () => { Store.updateQty(+b.dataset.qtyDec, Store.cart.find(i=>i.id===+b.dataset.qtyDec).qty-1); router(); }));
  document.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { Store.removeFromCart(+b.dataset.remove); toast('از سبد خرید حذف شد'); router(); }));
}

// ============================================================
// PAGE: CHECKOUT
// ============================================================
function renderCheckout(app) {
  if (Store.cart.length === 0) { navigate('#/cart'); return router(); }
  app.innerHTML = `
    <div class="container" style="padding:32px 0 64px;">
      <h1 style="font-size:28px;font-weight:800;color:var(--plum);margin-bottom:24px;">تکمیل خرید</h1>
      <div class="cart-layout">
        <div class="form-card" style="margin:0;max-width:none;">
          <h2 style="font-size:18px;color:var(--plum);margin-bottom:20px;">اطرات تحویل</h2>
          <form id="checkout-form">
            <div class="form-group"><label>نام و نام خانوادگی</label><input type="text" name="name" required></div>
            <div class="form-group"><label>شماره تماس</label><input type="tel" name="phone" required></div>
            <div class="form-group"><label>نشانی ایمیل</label><input type="email" name="email" required></div>
            <div class="form-group"><label>نشانی کامل</label><textarea name="address" required></textarea></div>
            <div class="form-group"><label>کد پستی</label><input type="text" name="postal" required></div>
            <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">ثبت سفارش</button>
            <div id="checkout-msg"></div>
          </form>
        </div>
        <div class="cart-summary">
          <h2>خلاصه سفارش</h2>
          ${Store.cart.map(item => {
            const p = PRODUCTS.find(pr => pr.id === item.id);
            return p ? `<div class="summary-row"><span>${p.name} (${toPersianNum(item.qty)})</span><span>${formatPrice(p.price*item.qty)}</span></div>` : '';
          }).join('')}
          <div class="summary-row total"><span>مبلغ نهایی</span><span>${formatPrice(Store.cartTotal())}</span></div>
          <p style="font-size:13px;color:var(--text-light);margin-top:12px;">پرداخت درگاه پرداخت به‌زودی فعال خواهد شد.</p>
        </div>
      </div>
    </div>
  `;
  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('checkout-msg').innerHTML = '<div class="form-success">سفارش شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.</div>';
    Store.cart = [];
    Store.saveCart();
    toast('سفارش شما ثبت شد', 'success');
  });
}

// ============================================================
// PAGE: WISHLIST
// ============================================================
function renderWishlist(app) {
  const items = PRODUCTS.filter(p => Store.wishlist.includes(p.id));
  if (items.length === 0) {
    app.innerHTML = `
      <div class="cart-page container">
        <div class="cart-empty">
          ${ICONS.heart}
          <h2>فهرست علاقه‌مندی‌های شما خالی است</h2>
          <p>محصولات مورد علاقه خود را اینجا ذخیره کنید.</p>
          <a href="#/products" class="btn-primary">مشاهده محصولات</a>
        </div>
      </div>`;
    return;
  }
  app.innerHTML = `
    <div class="section products-section">
      <div class="container">
        <div class="section-heading">
          <h2 class="title">علاقه‌مندی‌های شما</h2>
        </div>
        <div class="products-grid">
          ${items.map(productCard).join('')}
        </div>
      </div>
    </div>`;
  bindProductCards();
}

// ============================================================
// PAGE: ABOUT
// ============================================================
function renderAbout(app) {
  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <h1>درباره لوکسورا</h1>
        <p>لوکسورا، نامی است که در دنیای جواهرات ایرانیان، نماد ظرافت، اصالت و زیبایی ماندگار است. ما با تکیه بر هنر دست و استفاده از بهترین متریال‌ها، جواهراتی می‌آفرینیم که هر یک داستانی از زیبایی و شکوه را روایت می‌کند.</p>
        <p>از سال‌ها پیش، لوکسورا با هدف ارائه جواهراتی منحصربه‌فرد و باکیفیت به مشتریان خود فعالیت می‌کند. مجموعه ما شامل گردنبندها، گوشواره‌ها، انگشترها، دستبندها و آویزهایی است که هر یک با وسواس و دقت طراحی و ساخته شده‌اند.</p>
        <h2>چرا لوکسورا؟</h2>
        <p>ما به اصالت و کیفیت جواهرات خود متعهد هستیم. تمامی محصولات لوکسورا با ضمانت اصالت و کیفیت عرضه می‌شوند. تیم حرفه‌ای ما همواره در کنار شماست تا تجربه‌ای لذت‌بخش از خرید جواهرات را برای شما رقم بزند.</p>
        <h2>تعهد ما به شما</h2>
        <p>ضمانت اصالت کالا، پرداخت امن، ارسال رایگان، خدمات پس از فروش و بازگشت آسان کالا، تنها بخشی از تعهدات ما به مشتریان عزیز است. ما با افتخار در خدمت شما هستیم.</p>
      </div>
    </div>`;
}

// ============================================================
// PAGE: BLOG
// ============================================================
function renderBlog(app) {
  const posts = [
    { title: 'راهنمای انتخاب گردنبند مناسب', excerpt: 'چگونه گردنبندی انتخاب کنیم که با سبک پوشش ما هماهنگ باشد و درخشش خاصی به ظاهر ما ببخشد.', date: '۱۴ مهر ۱۴۰۵' },
    { title: 'مراقبت از جواهرات در خانه', excerpt: 'نکات ساده اما مهم برای نگهداری و مراقبت از جواهرات شما در خانه تا زیبایی آن‌ها ماندگار بماند.', date: '۷ مهر ۱۴۰۵' },
    { title: 'ترندهای جواهرات سال ۱۴۰۵', excerpt: 'نگاهی به جدیدترین ترندهای طراحی جواهرات در سال جدید و آنچه در دنیای مد و جواهرات رایج است.', date: '۱ مهر ۱۴۰۵' }
  ];
  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <h1>مجله لوکسورا</h1>
        <p>جدیدترین مقالات و راهنماهای دنیای جواهرات را اینجا بخوانید.</p>
        <div class="products-grid" style="margin-top:32px;">
          ${posts.map(post => `
            <div class="product-card">
              <div class="product-image-wrap" style="aspect-ratio:16/10;">
                <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80" alt="${post.title}">
              </div>
              <div class="product-info">
                <span style="font-size:12px;color:var(--dusty-rose);">${post.date}</span>
                <h3 class="product-name">${post.title}</h3>
                <p style="font-size:14px;color:var(--text-light);margin-top:6px;">${post.excerpt}</p>
                <a href="#/blog" class="category-link" style="display:inline-block;margin-top:10px;">ادامه مطلب</a>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

// ============================================================
// PAGE: CONTACT
// ============================================================
function renderContact(app) {
  app.innerHTML = `
    <div class="page-content">
      <div class="container">
        <h1>تماس با ما</h1>
        <p>سوالات، پیشنهادها و پیام‌های خود را با ما در میان بگذارید. تیم پشتیبانی لوکسورا در کوتاه‌ترین زمان پاسخ‌گوی شما خواهد بود.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:32px;" class="contact-layout">
          <form class="form-card" id="contact-form" style="margin:0;max-width:none;">
            <div class="form-group"><label>نام و نام خانوادگی</label><input type="text" name="name" required></div>
            <div class="form-group"><label>نشانی ایمیل</label><input type="email" name="email" required></div>
            <div class="form-group"><label>شماره تماس</label><input type="tel" name="phone"></div>
            <div class="form-group"><label>پیام شما</label><textarea name="message" required></textarea></div>
            <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">ارسال پیام</button>
            <div id="contact-msg"></div>
          </form>
          <div>
            <h2 style="font-size:18px;color:var(--plum);margin-bottom:16px;">اطرات تماس</h2>
            <p style="margin-bottom:12px;"><strong>تلفن:</strong> ۰۲۱-۱۲۳۴۵۶۷۸</p>
            <p style="margin-bottom:12px;"><strong>ایمیل:</strong> info@luxora.ir</p>
            <p style="margin-bottom:12px;"><strong>نشانی:</strong> تهران، خیابان ولیعصر، پاساژ جواهرات، طبقه دوم</p>
            <p style="margin-bottom:12px;"><strong>ساعات کاری:</strong> شنبه تا پنجشنبه، ۱۰ صبح تا ۸ شب</p>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contact-msg').innerHTML = '<div class="form-success">پیام شما با موفقیت ارسال شد. به‌زودی پاسخ خواهیم داد.</div>';
    e.target.reset();
    toast('پیام شما ارسال شد', 'success');
  });
}

// ============================================================
// PAGE: ACCOUNT
// ============================================================
function renderAccount(app) {
  if (Store.user) {
    app.innerHTML = `
      <div class="page-content container">
        <h1>حساب کاربری</h1>
        <p>خوش آمدید، ${Store.user.name}.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:32px;">
          <div class="form-card" style="margin:0;max-width:none;">
            <h2 style="font-size:18px;color:var(--plum);margin-bottom:16px;">اطرات حساب</h2>
            <p><strong>نام:</strong> ${Store.user.name}</p>
            <p><strong>ایمیل:</strong> ${Store.user.email}</p>
            <button class="btn-outline" id="logout-btn" style="margin-top:20px;">خروج از حساب</button>
          </div>
          <div class="form-card" style="margin:0;max-width:none;">
            <h2 style="font-size:18px;color:var(--plum);margin-bottom:16px;">سفارش‌های من</h2>
            <p style="color:var(--text-light);">شما هنوز سفارشی ثبت نکرده‌اید.</p>
          </div>
        </div>
      </div>`;
    document.getElementById('logout-btn').addEventListener('click', () => { Store.user = null; localStorage.removeItem('luxora_user'); toast('از حساب خارج شدید'); router(); });
    return;
  }
  let mode = 'login';
  app.innerHTML = `
    <div class="form-card">
      <div class="form-tabs">
        <button class="form-tab active" data-tab="login">ورود</button>
        <button class="form-tab" data-tab="register">ثبت‌نام</button>
      </div>
      <div id="auth-form-area"></div>
    </div>`;
  function renderAuth() {
    const area = document.getElementById('auth-form-area');
    area.innerHTML = mode === 'login' ? `
      <h1>ورود به حساب</h1>
      <p class="sub">برای دسترسی به حساب و سفارش‌های خود وارد شوید.</p>
      <form id="login-form">
        <div class="form-group"><label>ایمیل</label><input type="email" name="email" required></div>
        <div class="form-group"><label>رمز عبور</label><input type="password" name="password" required></div>
        <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">ورود</button>
        <div id="auth-msg"></div>
      </form>` : `
      <h1>ثبت‌نام</h1>
      <p class="sub">حساب کاربری خود را ایجاد کنید.</p>
      <form id="register-form">
        <div class="form-group"><label>نام و نام خانوادگی</label><input type="text" name="name" required></div>
        <div class="form-group"><label>ایمیل</label><input type="email" name="email" required></div>
        <div class="form-group"><label>رمز عبور</label><input type="password" name="password" required></div>
        <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">ثبت‌نام</button>
        <div id="auth-msg"></div>
      </form>`;
    bindAuthForm();
  }
  function bindAuthForm() {
    const form = document.querySelector(mode === 'login' ? '#login-form' : '#register-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (!data.email || !data.password) return;
      Store.user = { name: data.name || 'کاربر لوکسورا', email: data.email };
      localStorage.setItem('luxora_user', JSON.stringify(Store.user));
      toast('خوش آمدید', 'success');
      router();
    });
  }
  document.querySelectorAll('.form-tab').forEach(t => t.addEventListener('click', () => {
    mode = t.dataset.tab;
    document.querySelectorAll('.form-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderAuth();
  }));
  renderAuth();
}

// ============================================================
// PAGE: SEARCH
// ============================================================
function renderSearch(app) {
  app.innerHTML = `
    <div class="page-content container">
      <h1>جست‌وجو</h1>
      <input type="text" id="search-page-input" placeholder="نام محصول را وارد کنید..." style="width:100%;max-width:500px;padding:14px 20px;border:1px solid var(--border);border-radius:50px;font-size:16px;outline:none;margin-bottom:24px;">
      <div id="search-results" class="products-grid"></div>
    </div>`;
  const input = document.getElementById('search-page-input');
  input.addEventListener('input', () => {
    const q = input.value.trim();
    const results = document.getElementById('search-results');
    if (!q) { results.innerHTML = ''; return; }
    const found = PRODUCTS.filter(p => p.name.includes(q));
    results.innerHTML = found.length > 0 ? found.map(productCard).join('') : '<p style="color:var(--text-light);">نتیجه‌ای یافت نشد.</p>';
    bindProductCards();
  });
}

// ============================================================
// PAGE: NOT FOUND
// ============================================================
function renderNotFound(app) {
  app.innerHTML = `
    <div class="cart-empty" style="padding:120px 20px;">
      <h2 style="font-size:28px;color:var(--plum);">صفحه مورد نظر یافت نشد</h2>
      <p style="color:var(--text-light);margin-bottom:24px;">نشانی که دنبال آن هستید وجود ندارد.</p>
      <a href="#/" class="btn-primary">بازگشت به خانه</a>
    </div>`;
}

// ============================================================
// PAGE: ADMIN PANEL
// ============================================================
let adminAuthed = sessionStorage.getItem('luxora_admin') === '1';

function renderAdmin(app) {
  if (!adminAuthed) {
    app.innerHTML = `
      <div class="form-card">
        <h1>پنل مدیریت</h1>
        <p class="sub">برای ورود به پنل مدیریت، رمز عبور را وارد کنید.</p>
        <form id="admin-login-form">
          <div class="form-group"><label>رمز عبور</label><input type="password" name="password" required placeholder="رمز عبور مدیریت"></div>
          <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">ورود</button>
          <div id="admin-login-msg" class="form-error"></div>
        </form>
        <p style="font-size:13px;color:var(--text-light);margin-top:16px;">پیش‌فرض: admin123 — این یک احراز هویت سمت کلاینت است و برای محیط تولید نیاز به بک‌اند امن دارد.</p>
      </div>`;
    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const pw = e.target.password.value;
      if (pw === 'admin123') {
        adminAuthed = true;
        sessionStorage.setItem('luxora_admin', '1');
        router();
      } else {
        document.getElementById('admin-login-msg').textContent = 'رمز عبور نادرست است.';
      }
    });
    return;
  }

  const editableProducts = JSON.parse(localStorage.getItem('luxora_products') || JSON.stringify(PRODUCTS));

  app.innerHTML = `
    <div style="padding:32px 0 64px;" class="admin-panel">
      <div class="container">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <h1 style="font-size:26px;font-weight:800;color:var(--plum);">پنل مدیریت لوکسورا</h1>
          <button class="btn-outline" id="admin-logout" style="padding:10px 24px;font-size:14px;">خروج از پنل</button>
        </div>

        <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;">
          <button class="filter-chip active" data-admin-tab="products">محصولات</button>
          <button class="filter-chip" data-admin-tab="content">محتوای صفحه</button>
          <button class="filter-chip" data-admin-tab="orders">سفارش‌ها</button>
        </div>

        <div id="admin-content"></div>
      </div>
    </div>`;

  function renderAdminTab(tab) {
    const content = document.getElementById('admin-content');
    if (tab === 'products') {
      content.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h2 style="font-size:20px;font-weight:700;color:var(--plum);">مدیریت محصولات</h2>
          <button class="btn-primary" id="add-product-btn" style="padding:10px 24px;font-size:14px;">افزودن محصول</button>
        </div>
        <div id="admin-products-list">
          ${editableProducts.map(p => `
            <div style="background:var(--white);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px;display:flex;gap:16px;align-items:center;">
              <img src="${p.image}" alt="${p.name}" style="width:60px;height:60px;border-radius:8px;object-fit:cover;">
              <div style="flex:1;">
                <h3 style="font-size:15px;font-weight:700;">${p.name}</h3>
                <p style="font-size:14px;color:var(--plum);font-weight:600;">${formatPrice(p.price)}</p>
              </div>
              <button class="btn-outline" data-edit-product="${p.id}" style="padding:8px 16px;font-size:13px;">ویرایش</button>
              <button class="btn-outline" data-del-product="${p.id}" style="padding:8px 16px;font-size:13px;color:#e74c3c;border-color:#e74c3c;">حذف</button>
            </div>`).join('')}
        </div>
        <div id="product-edit-form" class="hidden"></div>
      `;

      document.getElementById('add-product-btn').addEventListener('click', () => showProductForm(content, null, editableProducts));
      document.querySelectorAll('[data-edit-product]').forEach(b => b.addEventListener('click', () => {
        const p = editableProducts.find(pr => pr.id === +b.dataset.editProduct);
        showProductForm(content, p, editableProducts);
      }));
      document.querySelectorAll('[data-del-product]').forEach(b => b.addEventListener('click', () => {
        const id = +b.dataset.delProduct;
        const idx = editableProducts.findIndex(pr => pr.id === id);
        if (idx >= 0) {
          editableProducts.splice(idx, 1);
          localStorage.setItem('luxora_products', JSON.stringify(editableProducts));
          toast('محصول حذف شد', 'success');
          renderAdminTab('products');
        }
      }));
    } else if (tab === 'content') {
      content.innerHTML = `
        <h2 style="font-size:20px;font-weight:700;color:var(--plum);margin-bottom:16px;">مدیریت محتوا</h2>
        <form id="content-form" style="max-width:600px;">
          <div class="form-group"><label>متن بار اعلان (خط ۱)</label><input type="text" name="ann1" value="${SITE.announcement[0]}"></div>
          <div class="form-group"><label>متن بار اعلان (خط ۲)</label><input type="text" name="ann2" value="${SITE.announcement[1]}"></div>
          <div class="form-group"><label>عنوان اصلی هیرو</label><input type="text" name="heroTitle" value="${SITE.hero.title.replace('\n', ' ')}"></div>
          <div class="form-group"><label>توضیحات هیرو</label><textarea name="heroDesc">${SITE.hero.desc}</textarea></div>
          <div class="form-group"><label>متن دکمه هیرو</label><input type="text" name="heroCta" value="${SITE.hero.cta}"></div>
          <div class="form-group"><label>متن دکمه دوم هیرو</label><input type="text" name="heroCta2" value="${SITE.hero.cta2 || ''}"></div>
          <div class="form-group"><label>نشانی ویدیوی هیرو</label><input type="url" name="heroVideo" value="${SITE.hero.video || ''}" placeholder="https://...mp4"></div>
          <div class="form-group"><label>تصویر پشتیبان ویدیو (پوستر)</label><input type="url" name="heroPoster" value="${SITE.hero.poster || ''}" placeholder="https://..."></div>
          <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">ذخیره تغییرات</button>
          <div id="content-save-msg"></div>
        </form>
        <p style="font-size:13px;color:var(--text-light);margin-top:16px;">تغییرات در این نسخه به‌صورت محلی ذخیره می‌شوند. برای ذخیره دائمی نیاز به اتصال بک‌اند پایگاه داده است.</p>`;
      document.getElementById('content-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        SITE.announcement[0] = d.ann1;
        SITE.announcement[1] = d.ann2;
        SITE.hero.title = d.heroTitle;
        SITE.hero.desc = d.heroDesc;
        SITE.hero.cta = d.heroCta;
        SITE.hero.cta2 = d.heroCta2;
        SITE.hero.video = d.heroVideo;
        SITE.hero.poster = d.heroPoster;
        document.getElementById('content-save-msg').innerHTML = '<div class="form-success">تغییرات ذخیره شد.</div>';
        toast('محتوای صفحه به‌روزرسانی شد', 'success');
        renderAnnouncementBar();
      });
    } else if (tab === 'orders') {
      content.innerHTML = `
        <h2 style="font-size:20px;font-weight:700;color:var(--plum);margin-bottom:16px;">سفارش‌ها</h2>
        <div style="background:var(--white);border:1px solid var(--border);border-radius:14px;padding:32px;text-align:center;">
          <p style="color:var(--text-light);">هنوز سفارشی ثبت نشده است.</p>
          <p style="font-size:13px;color:var(--text-light);margin-top:12px;">سفارش‌های مشتریان پس از فعال‌سازی بک‌اند در اینجا نمایش داده می‌شوند.</p>
        </div>`;
    }
  }

  function showProductForm(content, product, list) {
    const formArea = document.getElementById('product-edit-form');
    formArea.classList.remove('hidden');
    const p = product || { id: Date.now(), name: '', price: 0, oldPrice: null, rating: 5, category: 'necklace', image: '', gallery: [], desc: '', badge: null, featured: false };
    formArea.innerHTML = `
      <div class="form-card" style="margin:0;max-width:none;">
        <h2 style="font-size:18px;color:var(--plum);margin-bottom:20px;">${product ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
        <form id="product-form">
          <div class="form-group"><label>نام محصول</label><input type="text" name="name" value="${p.name}" required></div>
          <div class="form-group"><label>قیمت (تومان)</label><input type="number" name="price" value="${p.price}" required></div>
          <div class="form-group"><label>قیمت قبلی (اختیاری)</label><input type="number" name="oldPrice" value="${p.oldPrice || ''}"></div>
          <div class="form-group"><label>دسته</label>
            <select name="category" style="width:100%;padding:12px 16px;border:1px solid var(--border);border-radius:8px;">
              ${SITE.categories.map(c => `<option value="${c.slug}" ${p.category === c.slug ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>نشانی تصویر</label><input type="url" name="image" value="${p.image}" required placeholder="https://..."></div>
          <div class="form-group"><label>توضیحات</label><textarea name="desc" required>${p.desc}</textarea></div>
          <div class="form-group"><label>برچسب (تخفیف/خالی)</label><input type="text" name="badge" value="${p.badge || ''}"></div>
          <div style="display:flex;gap:10px;">
            <button type="submit" class="btn-primary" style="flex:1;justify-content:center;">ذخیره</button>
            <button type="button" class="btn-outline" id="cancel-edit" style="flex:1;justify-content:center;">انصراف</button>
          </div>
        </form>
      </div>`;
    document.getElementById('cancel-edit').addEventListener('click', () => { formArea.classList.add('hidden'); formArea.innerHTML = ''; });
    document.getElementById('product-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target));
      const newP = {
        id: p.id,
        name: d.name,
        price: +d.price,
        oldPrice: d.oldPrice ? +d.oldPrice : null,
        rating: p.rating,
        category: d.category,
        image: d.image,
        gallery: [d.image],
        desc: d.desc,
        badge: d.badge || null,
        featured: p.featured
      };
      const idx = list.findIndex(pr => pr.id === p.id);
      if (idx >= 0) list[idx] = newP;
      else list.push(newP);
      localStorage.setItem('luxora_products', JSON.stringify(list));
      toast('محصول ذخیره شد', 'success');
      formArea.classList.add('hidden');
      renderAdminTab('products');
    });
  }

  document.getElementById('admin-logout').addEventListener('click', () => { adminAuthed = false; sessionStorage.removeItem('luxora_admin'); router(); });
  document.querySelectorAll('[data-admin-tab]').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('[data-admin-tab]').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderAdminTab(t.dataset.adminTab);
  }));
  renderAdminTab('products');
}

// ============================================================
// EVENT BINDING
// ============================================================
function bindProductCards() {
  document.querySelectorAll('[data-wishlist]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = +btn.dataset.wishlist;
      Store.toggleWishlist(id);
      btn.classList.toggle('active');
      toast(Store.isWishlisted(id) ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد', 'success');
    });
  });
}

function bindNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('newsletter-msg');
    const email = form.email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      msg.textContent = 'نشانی ایمیل معتبر نیست.';
      msg.className = 'newsletter-msg error';
      return;
    }
    msg.textContent = 'عضویت شما با موفقیت ثبت شد!';
    msg.className = 'newsletter-msg success';
    form.reset();
    toast('عضویت در خبرنامه ثبت شد', 'success');
  });
}

// ---- Mobile Nav ----
function toggleMobileNav(open) {
  document.querySelector('.mobile-nav')?.classList.toggle('open', open);
  document.querySelector('.mobile-nav-overlay')?.classList.toggle('open', open);
}

// ---- Search Overlay ----
function toggleSearch(open) {
  const overlay = document.getElementById('search-overlay');
  if (open) {
    overlay.classList.add('open');
    setTimeout(() => overlay.querySelector('input')?.focus(), 100);
  } else {
    overlay.classList.remove('open');
  }
}

function searchProducts(query) {
  const results = document.getElementById('search-results-list');
  if (!query.trim()) { results.innerHTML = ''; return; }
  const found = PRODUCTS.filter(p => p.name.includes(query));
  results.innerHTML = found.map(p => `
    <a href="#/product/${p.id}" class="search-result-item">
      <img src="${p.image}" alt="${p.name}">
      <div>
        <div class="name">${p.name}</div>
        <div class="price">${formatPrice(p.price)}</div>
      </div>
    </a>`).join('') || '<p style="color:var(--text-light);padding:12px;">نتیجه‌ای یافت نشد.</p>';
}

// ============================================================
// RENDER HEADER & FOOTER
// ============================================================
function renderHeader() {
  const header = document.getElementById('header');
  header.innerHTML = `
    <div class="main-header">
      <div class="container">
        <a href="#/" class="logo">
          <span class="logo-icon">${ICONS.flower}</span>
          <span class="logo-text">
            <span class="brand">${SITE.brand}</span>
            <span class="sub">${SITE.brandSub}</span>
          </span>
        </a>
        <nav class="nav-links">
          ${SITE.nav.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
        </nav>
        <div class="header-icons">
          <button class="icon-btn" id="search-btn" aria-label="جست‌وجو">${ICONS.search}</button>
          <a href="#/account" class="icon-btn" aria-label="حساب کاربری">${ICONS.user}</a>
          <a href="#/wishlist" class="icon-btn" aria-label="علاقه‌مندی‌ها">${ICONS.heart}</a>
          <a href="#/cart" class="icon-btn" aria-label="سبد خرید">${ICONS.cart}<span class="cart-badge">۰</span></a>
          <button class="icon-btn mobile-menu-btn" id="mobile-menu-btn" aria-label="منو">${ICONS.menu}</button>
        </div>
      </div>
    </div>
    <div class="mobile-nav" id="mobile-nav">
      <button class="mobile-nav-close" id="mobile-nav-close">${ICONS.close}</button>
      <nav class="nav-links">
        ${SITE.nav.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
      </nav>
    </div>
    <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>
    <div class="search-overlay" id="search-overlay">
      <button class="icon-btn" id="search-close" style="position:absolute;top:24px;left:24px;width:48px;height:48px;">${ICONS.close}</button>
      <input type="text" id="search-input" placeholder="جست‌وجوی محصول...">
      <div class="search-results" id="search-results-list"></div>
    </div>
  `;

  document.getElementById('mobile-menu-btn').addEventListener('click', () => toggleMobileNav(true));
  document.getElementById('mobile-nav-close').addEventListener('click', () => toggleMobileNav(false));
  document.getElementById('mobile-nav-overlay').addEventListener('click', () => toggleMobileNav(false));
  document.getElementById('search-btn').addEventListener('click', () => toggleSearch(true));
  document.getElementById('search-close').addEventListener('click', () => toggleSearch(false));
  document.getElementById('search-input').addEventListener('input', (e) => searchProducts(e.target.value));
  document.querySelectorAll('.mobile-nav .nav-links a').forEach(a => a.addEventListener('click', () => toggleMobileNav(false)));
}

function renderFooter() {
  const footer = document.getElementById('footer');
  footer.innerHTML = `
    <footer class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#/" class="logo" style="margin-bottom:8px;">
              <span class="footer-logo-icon">${ICONS.flower}</span>
              <span class="logo-text">
                <span class="brand">${SITE.brand}</span>
                <span class="sub">${SITE.brandSub}</span>
              </span>
            </a>
            <p class="footer-brand-desc">${SITE.footer.about}</p>
            <div class="footer-social">
              <a href="#" aria-label="اینستاگرام">${ICONS.instagram}</a>
              <a href="#" aria-label="فیسبوک">${ICONS.facebook}</a>
              <a href="#" aria-label="پینترست">${ICONS.pinterest}</a>
              <a href="#" aria-label="یوتیوب">${ICONS.youtube}</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>دسترسی سریع</h4>
            <ul>${SITE.footer.quickLinks.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
          </div>
          <div class="footer-col">
            <h4>خدمات مشتریان</h4>
            <ul>${SITE.footer.customerService.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
          </div>
          <div class="footer-col">
            <h4>اطلاعات</h4>
            <ul>${SITE.footer.information.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
          </div>
          <div class="footer-payments">
            <h4>روش‌های پرداخت</h4>
            <div class="payment-icons">
              <span class="payment-badge">VISA</span>
              <span class="payment-badge">Mastercard</span>
              <span class="payment-badge">نکا کارت</span>
              <span class="payment-badge">زرین‌پال</span>
              <span class="payment-badge">پی‌پینگ</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">© ${toPersianNum(1404)} ${SITE.brand} ${SITE.brandSub} — ${SITE.footer.copyright}</div>
    </footer>
  `;
}

function renderAnnouncementBar() {
  const bar = document.getElementById('announcement-bar');
  bar.innerHTML = `
    <div class="announcement-bar">
      <div class="container">
        <div class="announcement-left">
          ${SITE.announcement.map((a, i) => `
            <span class="item">${ICONS.check}<span>${a}</span></span>
            ${i < SITE.announcement.length - 1 ? '<span class="sep">|</span>' : ''}
          `).join('')}
        </div>
        <div class="announcement-right">
          ${SITE.announcementLinks.map((l, i) => `
            <a href="${l.href}">${l.label}</a>
            ${i < SITE.announcementLinks.length - 1 ? '<span class="sep">|</span>' : ''}
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// INIT
// ============================================================
function init() {
  // Load admin-edited products if available
  const savedProducts = localStorage.getItem('luxora_products');
  if (savedProducts) {
    try {
      const parsed = JSON.parse(savedProducts);
      PRODUCTS.length = 0;
      PRODUCTS.push(...parsed);
    } catch(e) {}
  }
  renderAnnouncementBar();
  renderHeader();
  renderFooter();
  Store.updateBadges();
  router();
  window.addEventListener('hashchange', router);
}

document.addEventListener('DOMContentLoaded', init);
