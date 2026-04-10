
// ── CONFIGURACIÓN GLOBAL ──
let siteConfig = {};

async function loadConfig() {
  try {
    const res = await fetch('/api/v1/configuracion');
    siteConfig = await res.json();

    // Aplicar logo en navbar
    const navLogos = document.querySelectorAll('.logo');
    navLogos.forEach(img => {
      if (siteConfig.logo) img.src = siteConfig.logo;
    });

    // Aplicar logo en footer
    const footerLogos = document.querySelectorAll('footer img');
    footerLogos.forEach(img => {
      if (siteConfig.logo) img.src = siteConfig.logo;
    });

    // Aplicar nombre tienda
    const brandNames = document.querySelectorAll('.brand-name');
    brandNames.forEach(el => {
      if (siteConfig.nombre_tienda) el.textContent = siteConfig.nombre_tienda;
    });

    // Aplicar hero titulo
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle && siteConfig.hero_titulo) heroTitle.innerHTML = siteConfig.hero_titulo.replace(' ', '<br>');

    // Aplicar hero descripcion
    const heroDesc = document.querySelector('.hero-content p');
    if (heroDesc && siteConfig.hero_descripcion) heroDesc.textContent = siteConfig.hero_descripcion;

    // Aplicar botones hero
    const btn1 = document.querySelector('.btn-primary');
    if (btn1 && siteConfig.hero_btn1_texto) {
      btn1.textContent = siteConfig.hero_btn1_texto;
      btn1.href = siteConfig.hero_btn1_link || '#productos';
    }
    const btn2 = document.querySelector('.btn-secondary');
    if (btn2 && siteConfig.hero_btn2_texto) {
      btn2.textContent = siteConfig.hero_btn2_texto;
      btn2.href = siteConfig.hero_btn2_link || '#';
    }

  } catch(e) {
    console.error('Error cargando config:', e);
  }
}
const API_URL = '/api/v1';
let allProducts = [];
let allStores = [];
let allCategories = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let bannerShown = false;
let currentScrollPosition = 0;

// ==================== LOAD DATA ====================
async function loadAllData() {
  if (!document.getElementById('products-grid')) return;
  await Promise.all([
    loadStores(),
    loadCategories(),
    loadProducts(),
    loadFlashSalesCarousel()
  ]);
}

// Load Stores
async function loadStores() {
  try {
    const response = await fetch(`${API_URL}/stores`);
    allStores = await response.json();

    const filterStore = document.getElementById('filter-store');
    const miniStoresGrid = document.getElementById('mini-stores-grid');

    if (!miniStoresGrid) return;
    miniStoresGrid.innerHTML = allStores.map(store => {
      const productCount = store.products ? store.products.length : 0;
      
      return `
        <div class="mini-store-card" onclick="filterByStore(${store.id})">
          <img src="${store.logo || 'https://placehold.co/80'}" class="mini-store-logo" alt="${store.name}">
          <div class="mini-store-name">${store.name}</div>
          <div class="mini-store-count">${productCount} productos</div>
        </div>
      `;
    }).join('');

    filterStore.innerHTML = '<option value="">Todas las tiendas</option>' +
      allStores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  } catch (error) {
    console.error('Error loading stores:', error);
  }
}

// Load Categories
async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    allCategories = await response.json();

    const filterCategory = document.getElementById('filter-category');
    filterCategory.innerHTML = '<option value="">Todas las categorías</option>' +
      allCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Load Products
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    allProducts = await response.json();
    displayProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('products-grid').innerHTML = `
      <div class="empty-state">
        <h3>Error al cargar productos</h3>
        <p>Por favor, intenta recargar la página</p>
      </div>
    `;
  }
}

// Load Flash Sales Carousel
async function loadFlashSalesCarousel() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const allProducts = await response.json();
    
    const flashSales = allProducts.filter(p => p.isFlashSale);
    
    const carouselTrack = document.getElementById('carousel-track');
    const carouselDots = document.getElementById('carousel-dots');

    if (flashSales.length === 0) {
      carouselTrack.innerHTML = `
        <div class="empty-state" style="color: white; width: 100%;">
          <h3>No hay productos en remate en este momento</h3>
          <p>¡Vuelve pronto para ver nuevas ofertas!</p>
        </div>
      `;
      return;
    }

    carouselTrack.innerHTML = flashSales.map(p => {
      const price = parseFloat(p.price);
      const discount = parseFloat(p.discount) || 0;
      const finalPrice = price - (price * discount / 100);
      const stock = parseInt(p.stock) || 0;

      return `
        <div class="carousel-item">
          <div class="product-card" style="background: white;">
            <div class="product-image-container">
              <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.src='https://placehold.co/300'">
              <div class="product-badges">
                <span class="badge badge-flash">🔥 REMATE</span>
                <span class="badge badge-discount">-${discount}%</span>
              </div>
            </div>
            <div class="product-info">
              <div class="product-category">${p.category ? p.category.name : 'Sin categoría'}</div>
              <h3 class="product-name">${p.name}</h3>
              <p class="product-description">${p.description || ''}</p>
              <div class="product-footer">
                <div class="product-price">
                  <span class="price-original">₡${price.toFixed(2)}</span>
                  <span class="price-current discounted">₡${finalPrice.toFixed(2)}</span>
                </div>
                ${stock > 0 ? 
                  `<button class="add-to-cart" onclick="addToCart('${p.id}', '${p.name}', ${finalPrice}, '${p.image}', event)">Agregar</button>` : 
                  `<span class="stock-badge stock-out">Agotado</span>`
                }
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const dotsCount = Math.max(1, flashSales.length - 2);
    carouselDots.innerHTML = Array(dotsCount).fill(0).map((_, i) => 
      `<div class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="scrollToSlide(${i})"></div>`
    ).join('');

    let currentSlide = 0;
    setInterval(() => {
      currentSlide = (currentSlide + 1) % dotsCount;
      scrollToSlide(currentSlide);
    }, 5000);

  } catch (error) {
    console.error('Error loading flash sales:', error);
  }
}

// Display Products
function displayProducts(products) {
  const grid = document.getElementById('products-grid');

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No se encontraron productos</h3>
        <p>Intenta con otros filtros de búsqueda</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const price = parseFloat(p.price);
    const discount = parseFloat(p.discount) || 0;
    const finalPrice = price - (price * discount / 100);
    const hasDiscount = discount > 0;
    
    const conditionLabels = {
      'nuevo': '🆕 Nuevo',
      'como_nuevo': '✨ Como Nuevo',
      'usado': '👕 Usado',
      'muy_usado': '⚠️ Muy Usado'
    };

    let stockClass = 'stock-out';
    let stockText = 'Agotado';
    const stock = parseInt(p.stock) || 0;
    if (stock > 10) {
      stockClass = 'stock-available';
      stockText = `${stock} disponibles`;
    } else if (stock > 0) {
      stockClass = 'stock-low';
      stockText = `Solo ${stock}`;
    }

    return `
      <div class="product-card" onclick="window.location.href='producto.html?id=${p.id}'" style="cursor:pointer">
        <div class="product-image-container">
          <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.src='https://placehold.co/300'">
          <div class="product-badges">
            ${p.isFlashSale ? '<span class="badge badge-flash">🔥 REMATE</span>' : ''}
            ${hasDiscount && !p.isFlashSale ? `<span class="badge badge-discount">-${discount}%</span>` : ''}
            ${p.condition === 'nuevo' ? '<span class="badge badge-new">NUEVO</span>' : ''}
            <span class="badge badge-condition">${conditionLabels[p.condition] || '👕 Usado'}</span>
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${p.category ? p.category.name : 'Sin categoría'}</div>
          <h3 class="product-name" onclick="window.location.href='producto.html?id=${p.id}'" style="cursor:pointer">${p.name}</h3>
          <p class="product-description">${p.description || ''}</p>
          <div class="product-meta">
            ${p.size ? `<span>📏 Talla ${p.size}</span>` : ''}
            ${p.store ? `<span>🏪 ${p.store.name}</span>` : ''}
          </div>
          <div class="product-footer">
            <div class="product-price">
              ${hasDiscount ? `<span class="price-original">₡${price.toFixed(2)}</span>` : ''}
              <span class="price-current ${hasDiscount ? 'discounted' : ''}">₡${finalPrice.toFixed(2)}</span>
            </div>
            ${stock > 0 ? 
              `<button class="add-to-cart" onclick="addToCart('${p.id}', '${p.name}', ${finalPrice}, '${p.image}', event)">Agregar al Carrito</button>` : 
              `<span class="stock-badge stock-out">${stockText}</span>`
            }
          </div>
          <div style="margin-top: 8px;">
            <span class="stock-badge ${stockClass}">${stockText}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Filter Products
function filterProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const storeFilter = document.getElementById('filter-store').value;
  const categoryFilter = document.getElementById('filter-category').value;
  const conditionFilter = document.getElementById('filter-condition').value;
  const sizeEl = document.getElementById("filter-size");
  const sizeFilter = sizeEl ? sizeEl.value : "";

  const filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm) || 
                      (p.description && p.description.toLowerCase().includes(searchTerm));
    const matchStore = !storeFilter || p.storeId == storeFilter;
    const matchCategory = !categoryFilter || p.categoryId == categoryFilter;
    const matchCondition = !conditionFilter || p.condition === conditionFilter;

    const matchSize = !sizeFilter || (p.size && p.size.toUpperCase() === sizeFilter.toUpperCase());
    return matchSearch && matchStore && matchCategory && matchCondition && matchSize;
  });

  displayProducts(filtered);
}

// Filter by store
function filterByStore(storeId) {
  document.getElementById('filter-store').value = storeId;
  filterProducts();
  document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

// Carousel controls
function moveCarousel(direction) {
  const track = document.getElementById('carousel-track');
  const scrollAmount = 344;
  currentScrollPosition += direction * scrollAmount;
  track.scrollTo({
    left: currentScrollPosition,
    behavior: 'smooth'
  });
  updateActiveDot();
}

function scrollToSlide(index) {
  const track = document.getElementById('carousel-track');
  const scrollAmount = 344;
  currentScrollPosition = index * scrollAmount;
  track.scrollTo({
    left: currentScrollPosition,
    behavior: 'smooth'
  });
  updateActiveDot();
}

function updateActiveDot() {
  const dots = document.querySelectorAll('.carousel-dot');
  const track = document.getElementById('carousel-track');
  const scrollAmount = 344;
  const activeIndex = Math.round(track.scrollLeft / scrollAmount);
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === activeIndex);
  });
}

// ==================== CARRITO ====================
function addToCart(id, name, price, image, event) {
  event.stopPropagation();
  
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification('✅ Producto agregado al carrito');
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function openCartModal() {
  document.getElementById('cart-modal').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  renderCartModal();
}

function closeCartModal() {
  document.getElementById('cart-modal').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

function renderCartModal() {
  const cartBody = document.getElementById('cart-body');
  
  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-cart-msg">
        <h3>Tu carrito está vacío</h3>
        <p>¡Agrega productos para comenzar!</p>
      </div>
    `;
    document.getElementById('cart-footer').style.display = 'none';
    return;
  }

  document.getElementById('cart-footer').style.display = 'block';
  
  cartBody.innerHTML = cart.map((item, index) => `
    <div class="cart-item-modal">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₡${parseFloat(item.price).toFixed(2)}</div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');

  updateCartSummary();
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartModal();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartModal();
}

function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const shipping = 2500;
  const total = subtotal + shipping;

  document.getElementById('cart-subtotal').textContent = `₡${subtotal.toFixed(2)}`;
  document.getElementById('cart-shipping').textContent = `₡${shipping.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `₡${total.toFixed(2)}`;
}

function goToCheckout() {
  if (cart.length === 0) {
    openCartModal();
    return;
  }
  window.location.href = 'checkout.html';
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #48bb78;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 3000;
    font-weight: 600;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ==================== SPACE BACKGROUND ====================
function createStarfield() {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;
  
  const numStars = 200;
  
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const size = Math.random() * 3;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    
    starsContainer.appendChild(star);
  }
}

// ==================== WHATSAPP BANNER ====================
function showWhatsAppBanner() {
  if (bannerShown) return;
  
  const banner = document.getElementById('whatsapp-banner');
  banner.classList.add('show');
  bannerShown = true;
  
  setTimeout(() => {
    hideWhatsAppBanner();
  }, 8000);
}

function hideWhatsAppBanner() {
  const banner = document.getElementById('whatsapp-banner');
  banner.classList.remove('show');
}

function joinWhatsApp() {
  // REEMPLAZA ESTE ENLACE CON TU GRUPO DE WHATSAPP
  const whatsappGroupLink = 'https://chat.whatsapp.com/TU_ENLACE_DE_GRUPO_AQUI';
  window.open(whatsappGroupLink, '_blank');
  hideWhatsAppBanner();
}

// ==================== 3D LOGO (THREE.JS) ====================
function init3DLogo() {
  const canvas = document.getElementById('logo-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true,
    antialias: true 
  });
  
  renderer.setSize(120, 120);
  
  const geometry = new THREE.TorusKnotGeometry(0.7, 0.3, 100, 16);
  const material = new THREE.MeshPhongMaterial({
    color: 0x667eea,
    shininess: 100,
    specular: 0x764ba2
  });
  
  const logo = new THREE.Mesh(geometry, material);
  scene.add(logo);
  
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(1, 1, 1);
  scene.add(light1);
  
  const light2 = new THREE.DirectionalLight(0x764ba2, 0.5);
  light2.position.set(-1, -1, -1);
  scene.add(light2);
  
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  
  camera.position.z = 3;
  
  function animate() {
    requestAnimationFrame(animate);
    logo.rotation.x += 0.01;
    logo.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  
  animate();
}

// ==================== PARTICLE EFFECTS ====================
function createParticleEffect(x, y) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.width = '10px';
  particle.style.height = '10px';
  
  document.body.appendChild(particle);
  
  const angle = Math.random() * Math.PI * 2;
  const velocity = 2;
  let posX = x;
  let posY = y;
  let opacity = 1;
  
  function animateParticle() {
    posX += Math.cos(angle) * velocity;
    posY += Math.sin(angle) * velocity;
    opacity -= 0.02;
    
    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;
    particle.style.opacity = opacity;
    
    if (opacity > 0) {
      requestAnimationFrame(animateParticle);
    } else {
      particle.remove();
    }
  }
  
  animateParticle();
}

// ==================== SPACE BACKGROUND 3D ====================
// ==================== SPACE BACKGROUND 3D ====================
function initSpaceBackground() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true,
    alpha: false
  });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene.background = new THREE.Color(0x0a0e27);
  scene.fog = new THREE.FogExp2(0x0a0e27, 0.001);

  // Prendas de ropa flotando - MÁS TRANSPARENTES
  const clothingTextures = ['👕', '👔', '👗', '👚', '🧥', '👖', '🩳', '👘', '🥼', '🦺', '👙', '🩱', '🧣', '🧤', '🧦', '👟', '👠', '🥾', '👞', '🎩', '🧢', '👒'];
  
  const clothingGroup = new THREE.Group();
  
  for (let i = 0; i < 100; i++) {
    const canvas2 = document.createElement('canvas');
    const size = 64;
    canvas2.width = size;
    canvas2.height = size;
    const ctx = canvas2.getContext('2d');
    
    // Dibujar emoji de prenda
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(clothingTextures[Math.floor(Math.random() * clothingTextures.length)], size/2, size/2);
    
    const texture = new THREE.CanvasTexture(canvas2);
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      opacity: 0.25  // MÁS TRANSPARENTE (era 0.7)
    });
    
    const sprite = new THREE.Sprite(material);
    
    // Posicionar solo en el fondo (z negativo para que esté detrás)
    sprite.position.set(
      (Math.random() - 0.5) * 1500,
      (Math.random() - 0.5) * 1500,
      -Math.random() * 800 - 200  // Solo valores negativos (detrás)
    );
    sprite.scale.set(30, 30, 1);
    
    clothingGroup.add(sprite);
  }
  
  scene.add(clothingGroup);

  // Partículas flotantes
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 500;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 1000;
    particlePositions[i + 1] = (Math.random() - 0.5) * 1000;
    particlePositions[i + 2] = (Math.random() - 0.5) * 1000;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x667eea,
    size: 3,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Nebulosa
  const nebulaGeometry = new THREE.SphereGeometry(200, 32, 32);
  const nebulaMaterial = new THREE.MeshBasicMaterial({
    color: 0x764ba2,
    transparent: true,
    opacity: 0.1,
    wireframe: true
  });
  const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
  scene.add(nebula);

  camera.position.z = 500;

  // Animación
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.001;

    clothingGroup.rotation.y += 0.0002;
    clothingGroup.rotation.x += 0.0001;

    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    nebula.rotation.y += 0.002;
    nebula.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

    renderer.render(scene, camera);
  }

  animate();

  // Responsive
  window.addEventListener('resize', () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}


// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  // Filters - solo si existen los elementos
  const searchInput = document.getElementById('search-input');
  const filterStore = document.getElementById('filter-store');
  const filterCategory = document.getElementById('filter-category');
  const filterCondition = document.getElementById('filter-condition');

  if (searchInput) searchInput.addEventListener('input', filterProducts);
  if (filterStore) filterStore.addEventListener('change', filterProducts);
  if (filterCategory) filterCategory.addEventListener('change', filterProducts);
  const filterSize = document.getElementById("filter-size");
  if (filterSize) filterSize.addEventListener("change", filterProducts);
  if (filterCondition) filterCondition.addEventListener('change', filterProducts);

  // Carousel scroll
  const track = document.getElementById('carousel-track');
  if (track) {
    track.addEventListener('scroll', updateActiveDot);
  }

  // Update cart count
  updateCartCount();

  // Load all data
  loadAllData();

  // Initialize space background
  createStarfield();
  
  // Initialize 3D logo
  init3DLogo();

  initSpaceBackground();

  
  // Particle effects on mouse move
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
      createParticleEffect(e.clientX, e.clientY);
    }
  });

  // Show WhatsApp banner after 30 seconds
  setTimeout(() => {
    showWhatsAppBanner();
  }, 30000);
});

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('open');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.remove('open');
}

function toggleFilters() {
  const panel = document.getElementById('filters-panel');
  const btn = document.querySelector('.filter-toggle-btn');
  panel.classList.toggle('open');
  btn.style.background = panel.classList.contains('open') ? '#667eea' : '#f7f7ff';
  btn.style.color = panel.classList.contains('open') ? 'white' : '#667eea';
}
