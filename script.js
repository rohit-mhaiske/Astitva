// Mobile menu toggle
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });
  }
}

// Cart handling
const cartCountEl = document.getElementById('cart-count');

function readCart() {
  try {
    return JSON.parse(localStorage.getItem('astitva_cart') || '[]');
  } catch (e) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem('astitva_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cart = readCart();
  cartCountEl.textContent = cart.length;
}

function initCart() {
  updateCartUI();

  document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product');
      const title = (card && card.getAttribute('data-title')) || 'Item';
      const cart = readCart();
      cart.push({ title, added: Date.now() });
      writeCart(cart);
      updateCartUI();

      e.target.textContent = 'Added';
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
      }, 1200);
    });
  });
}

// Search filter
function initSearch() {
  const searchInput = document.getElementById('site-search');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll('.product').forEach((p) => {
        const t = p.getAttribute('data-title').toLowerCase();
        p.style.display = t.includes(q) ? 'flex' : 'none';
      });
    });
  }
}

// Contact form handler
function initContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = document.getElementById('cname').value.trim();
      const email = document.getElementById('cemail').value.trim();
      const msg = document.getElementById('cmsg').value.trim();

      if (!name || !email || !msg) {
        alert('Please fill all fields');
        return;
      }

      alert(`Thanks, ${name}! We'll get back to you soon.`);
      ev.target.reset();
    });
  }
}

// Initialize all features on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCart();
  initSearch();
  initContactForm();
  initLinkEnhancements();
});

// Enhance links across the site: active nav highlight, external link attrs, optional click ripple
function initLinkEnhancements() {
  const links = Array.from(document.querySelectorAll('a'));

  // Mark active nav links that match current path
  try {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      // simple match by filename
      const target = href.split('/').pop();
      if (target && target === currentPath) {
        a.classList.add('active-link');
        a.setAttribute('aria-current', 'page');
      }
    });
  } catch (e) {
    // ignore
  }

  // Make external links open in new tab and add rel for security
  links.forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http') && !href.includes(window.location.hostname)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.classList.add('external-link');
    }
  });

  // Optional ripple effect for click feedback on links with .ripple class
  document.addEventListener('click', (ev) => {
    const link = ev.target.closest && ev.target.closest('a.ripple');
    if (!link) return;
    const rect = link.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.6;
    circle.style.position = 'absolute';
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (ev.clientX - rect.left - size / 2) + 'px';
    circle.style.top = (ev.clientY - rect.top - size / 2) + 'px';
    circle.style.background = 'rgba(0,0,0,0.08)';
    circle.style.borderRadius = '50%';
    circle.style.pointerEvents = 'none';
    circle.style.transform = 'scale(0.3)';
    circle.style.transition = 'transform 350ms ease, opacity 350ms ease';
    circle.style.opacity = '0.95';
    circle.className = 'ripple-span';
    link.style.position = link.style.position || 'relative';
    link.appendChild(circle);
    requestAnimationFrame(() => {
      circle.style.transform = 'scale(1)';
      circle.style.opacity = '0';
    });
    setTimeout(() => circle.remove(), 450);
  });
}
