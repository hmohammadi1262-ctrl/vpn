// ============================================================
//  لوکسورا جواهرات — Scroll-Driven Cinematic Animations
//  GSAP + ScrollTrigger
// ============================================================

let scrollTriggers = [];

function killAnimations() {
  scrollTriggers.forEach(st => st.kill());
  scrollTriggers = [];
  if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(st => st.kill());
}

function initAnimations() {
  killAnimations();
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // A. HERO VIDEO — parallax scale on scroll
  const heroVideo = document.querySelector('.hero-video-bg video');
  const heroContent = document.querySelector('.hero-video-content');
  const heroSection = document.querySelector('.hero-video-section');

  if (heroSection) {
    const st1 = ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        if (heroVideo) {
          gsap.set(heroVideo, {
            scale: 1 + p * 0.15,
            yPercent: p * 10
          });
        }
        if (heroContent) {
          gsap.set(heroContent, {
            opacity: 1 - p * 1.3,
            yPercent: -p * 20
          });
        }
      }
    });
    scrollTriggers.push(st1);
  }

  // B. STORYTELLING — parallax image + staggered text
  const storyImg = document.querySelector('.storytelling-image img');
  const storySection = document.querySelector('.storytelling-section');
  if (storySection) {
    if (storyImg) {
      const st2 = ScrollTrigger.create({
        trigger: storySection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(storyImg, { yPercent: self.progress * -15 });
        }
      });
      scrollTriggers.push(st2);
    }
    const storyEls = storySection.querySelectorAll('.storytelling-content > *');
    if (storyEls.length) {
      const st3 = ScrollTrigger.create({
        trigger: storySection,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          gsap.fromTo(storyEls,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
          );
        }
      });
      scrollTriggers.push(st3);
    }
  }

  // C. CATEGORIES — staggered 3D entrance
  const catCards = document.querySelectorAll('.category-card');
  if (catCards.length) {
    const st4 = ScrollTrigger.create({
      trigger: '.categories-section',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.fromTo(catCards,
          { opacity: 0, y: 60, rotationY: 15 },
          { opacity: 1, y: 0, rotationY: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
        );
      }
    });
    scrollTriggers.push(st4);
  }

  // D. PRODUCTS — sequential reveal with perspective
  const productCards = document.querySelectorAll('.products-section .product-card');
  if (productCards.length) {
    const st5 = ScrollTrigger.create({
      trigger: '.products-section',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.fromTo(productCards,
          { opacity: 0, y: 50, rotationX: 8 },
          { opacity: 1, y: 0, rotationX: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
        );
      }
    });
    scrollTriggers.push(st5);
  }

  // E. SHOWCASE — pinned cinematic sequence
  const showcase = document.querySelector('.showcase-section');
  if (showcase) {
    const showcaseImages = showcase.querySelectorAll('.showcase-img');
    const showcaseTexts = showcase.querySelectorAll('.showcase-text');

    if (showcaseImages.length > 1) {
      // Initialize: hide all except first
      showcaseImages.forEach((img, i) => {
        if (i > 0) gsap.set(img, { opacity: 0, scale: 1.1 });
      });
      showcaseTexts.forEach((t, i) => {
        if (i > 0) gsap.set(t, { opacity: 0, y: 30 });
      });

      const st6 = ScrollTrigger.create({
        trigger: showcase,
        start: 'top top',
        end: '+=' + (showcaseImages.length * 100) + '%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const segments = showcaseImages.length;
          const segSize = 1 / segments;
          showcaseImages.forEach((img, i) => {
            if (i === 0) {
              const fade = gsap.utils.clamp(0, 1, self.progress / segSize);
              gsap.set(img, { opacity: 1 - fade * 0.3, scale: 1 + self.progress * 0.05 });
            } else {
              const segStart = i * segSize;
              const segProgress = gsap.utils.clamp(0, 1, (self.progress - segStart) / segSize);
              const nextStart = (i + 1) * segSize;
              const fadeOut = i < segments - 1 ? gsap.utils.clamp(0, 1, (self.progress - nextStart) / segSize) : 0;
              gsap.set(img, { opacity: segProgress * (1 - fadeOut * 0.3), scale: 1 + (self.progress - segStart) * 0.05 });
            }
          });
          showcaseTexts.forEach((text, i) => {
            const segStart = i * segSize;
            const segProgress = gsap.utils.clamp(0, 1, (self.progress - segStart) / segSize);
            gsap.set(text, { opacity: segProgress, y: (1 - segProgress) * 30 });
          });
        }
      });
      scrollTriggers.push(st6);
    } else {
      // Single image showcase — parallax
      if (showcaseImages[0]) {
        const st6b = ScrollTrigger.create({
          trigger: showcase,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(showcaseImages[0], { yPercent: self.progress * -10, scale: 1 + self.progress * 0.08 });
          }
        });
        scrollTriggers.push(st6b);
      }
    }
  }

  // F. TRUST STRIP & NEWSLETTER — reveal
  const trustItems = document.querySelectorAll('.trust-item');
  if (trustItems.length) {
    const st7 = ScrollTrigger.create({
      trigger: '.trust-strip',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(trustItems,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
        );
      }
    });
    scrollTriggers.push(st7);
  }

  const newsletterEls = document.querySelectorAll('.newsletter > .container > *');
  if (newsletterEls.length) {
    const st8 = ScrollTrigger.create({
      trigger: '.newsletter',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(newsletterEls,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' }
        );
      }
    });
    scrollTriggers.push(st8);
  }

  // Section headings — fade in
  document.querySelectorAll('.section-heading').forEach(heading => {
    const st9 = ScrollTrigger.create({
      trigger: heading,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(heading,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        );
      }
    });
    scrollTriggers.push(st9);
  });

  // Refresh after a tick to ensure all DOM is ready
  setTimeout(() => ScrollTrigger.refresh(), 100);
}
