// ============================================================
//  داده‌های فروشگاه جواهرات لوکسورا
//  Luxora Jewellery — Product & Content Data
// ============================================================

const SITE = {
  brand: 'لوکسورا',
  brandSub: 'جواهرات',
  announcement: [
    'ارسال رایگان برای تمام سفارش‌ها',
    'ضمانت اصالت و کیفیت جواهرات'
  ],
  announcementLinks: [
    { label: 'فروشگاه‌ها', href: '#/stores' },
    { label: 'پیگیری سفارش', href: '#/track' },
    { label: 'علاقه‌مندی‌ها', href: '#/wishlist' }
  ],
  nav: [
    { label: 'خانه', href: '#/' },
    { label: 'مجموعه‌ها', href: '#/products' },
    { label: 'جواهرات', href: '#/products' },
    { label: 'درباره ما', href: '#/about' },
    { label: 'مجله', href: '#/blog' },
    { label: 'تماس با ما', href: '#/contact' }
  ],
  hero: {
    eyebrow: 'زیبایی، به سبک شما',
    title: 'درخشش ماندگار،\nبرای همیشه شما',
    desc: 'مجموعه‌ای چشم‌نواز از جواهرات ظریف و اصیل؛ تلفیقی از هنر، زیبایی و شکوهی ماندگار.',
    cta: 'مشاهده مجموعه‌ها',
    ctaHref: '#/products',
    features: [
      'ضمانت اصالت کالا',
      'پرداخت امن',
      'ارسال رایگان'
    ]
  },
  categories: [
    { slug: 'necklace', name: 'گردنبند', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=80' },
    { slug: 'earrings', name: 'گوشواره', image: 'https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?w=500&auto=format&fit=crop&q=80' },
    { slug: 'ring', name: 'انگشتر', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80' },
    { slug: 'bracelet', name: 'دستبند', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&auto=format&fit=crop&q=80' },
    { slug: 'pendant', name: 'آویز', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&auto=format&fit=crop&q=80' }
  ],
  trustStrip: [
    { title: 'تضمین اصالت جواهرات', desc: 'کیفیت و اصالت قابل اعتماد', icon: 'shield' },
    { title: 'بازگشت آسان', desc: 'مطابق شرایط بازگشت کالا', icon: 'return' },
    { title: 'خدمات پس از فروش', desc: 'همراه شما پس از خرید', icon: 'service' },
    { title: 'پشتیبانی مشتریان', desc: 'پاسخ‌گوی پرسش‌های شما', icon: 'support' }
  ],
  footer: {
    about: 'جواهراتی برای لحظه‌های خاص؛ ترکیبی از ظرافت، اصالت و زیبایی ماندگار.',
    quickLinks: [
      { label: 'صفحه اصلی', href: '#/' },
      { label: 'مجموعه‌ها', href: '#/products' },
      { label: 'جواهرات', href: '#/products' },
      { label: 'درباره ما', href: '#/about' },
      { label: 'تماس با ما', href: '#/contact' }
    ],
    customerService: [
      { label: 'پیگیری سفارش', href: '#/track' },
      { label: 'راهنمای خرید', href: '#/guide' },
      { label: 'ارسال و تحویل', href: '#/shipping' },
      { label: 'بازگشت و تعویض', href: '#/returns' },
      { label: 'پرسش‌های متداول', href: '#/faq' }
    ],
    information: [
      { label: 'مجله', href: '#/blog' },
      { label: 'فروشگاه‌ها', href: '#/stores' },
      { label: 'حریم خصوصی', href: '#/privacy' },
      { label: 'شرایط و قوانین', href: '#/terms' }
    ],
    copyright: 'تمامی حقوق این وب‌سایت محفوظ است.'
  }
};

const PRODUCTS = [
  {
    id: 1,
    name: 'ست گردنبند سلطنتی',
    category: 'necklace',
    price: 175000000,
    oldPrice: 190000000,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    desc: 'ست گردنبند سلطنتی با طراحی بی‌نظیر و نگین‌های درخشان. ساخت از طلای ۱۸ عیار و الماس طبیعی. مناسب برای مجالس و مناسبت‌های خاص.',
    badge: 'تخفیف',
    featured: true
  },
  {
    id: 2,
    name: 'گوشواره جواهری طرح جومکا',
    category: 'earrings',
    price: 78500000,
    oldPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1722410180687-b05b50922362?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1722410180687-b05b50922362?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?w=800&auto=format&fit=crop&q=80'
    ],
    desc: 'گوشواره ظریف با طرح جومکا و نگین‌های درخشان. ساخت از طلای سفید و الماس. کیفیت و زیبایی استثنایی.',
    badge: null,
    featured: true
  },
  {
    id: 3,
    name: 'انگشتر تک‌نگین ظریف',
    category: 'ring',
    price: 45000000,
    oldPrice: 52000000,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80'
    ],
    desc: 'انگشتر تک‌نگین با طراحی ظریف و نگین مرکزی درخشان. ساخت از طلای ۱۸ عیار. مناسب برای استفاده روزمره و مجلسی.',
    badge: 'تخفیف',
    featured: true
  },
  {
    id: 4,
    name: 'دستبند کلاسیک نگین‌دار',
    category: 'bracelet',
    price: 125000000,
    oldPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    desc: 'دستبند کلاسیک نگین‌دار با طراحی منحصربه‌فرد و نگین‌های ریزدوز. ساخت از طلای ۱۸ عیار. انتخابی برازنده برای مzőن خاص شما.',
    badge: null,
    featured: true
  },
  {
    id: 5,
    name: 'گردنبند آویز طلایی',
    category: 'pendant',
    price: 92000000,
    oldPrice: 105000000,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80'
    ],
    desc: 'گردنبند آویز طلایی با طراحی ظریف و نگین مرکزی. ساخت از طلای ۱۸ عیار و سنگ قیمتی. نمادی از ظرافت و زیبایی.',
    badge: 'تخفیف',
    featured: false
  },
  {
    id: 6,
    name: 'ست گوشواره و گردنبند',
    category: 'necklace',
    price: 150000000,
    oldPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'
    ],
    desc: 'ست کامل گوشواره و گردنبند با هماهنگی بی‌نظیر. ساخت از طلای سفید و الماس. هدیه‌ای ماندگار برای عزیزانتان.',
    badge: null,
    featured: false
  },
  {
    id: 7,
    name: 'انگشتر الماس نقره',
    category: 'ring',
    price: 68000000,
    oldPrice: 75000000,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'
    ],
    desc: 'انگشتر الماس نقره با طراحی مدرن و نگین درخشان. ساخت از نقره عیار ۹۲۵ و الماس طبیعی. زیبایی در سادگی.',
    badge: 'تخفیف',
    featured: false
  },
  {
    id: 8,
    name: 'دستبند ظریف طلایی',
    category: 'bracelet',
    price: 55000000,
    oldPrice: null,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&auto=format&fit=crop&q=80'
    ],
    desc: 'دستبند ظریف طلایی با طراحی مینیمال و انعطاف‌پذیر. ساخت از طلای ۱۸ عیار. مناسب برای استفاده روزمره.',
    badge: null,
    featured: false
  }
];

// Convert English digits to Persian
function toPersianNum(n) {
  const fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(n).replace(/\d/g, d => fa[+d]);
}

// Format price in Toman with Persian digits
function formatPrice(price) {
  return toPersianNum(price.toLocaleString('en-US')) + ' تومان';
}
