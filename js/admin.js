const API_URL = '/api/v1';
let currentUser = null;
let stores = [];
let categories = [];
let products = [];

// ==================== LOGIN ====================
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user && user.role === 'admin') {
      currentUser = user;
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('admin-panel').classList.remove('hidden');
      document.getElementById('admin-name').textContent = `(${user.name})`;
      await loadAllData();
    } else {
      showLoginError('Credenciales inválidas o no eres administrador');
    }
  } catch (error) {
    showLoginError('Error al conectar con el servidor');
    console.error(error);
  }
});

function showLoginError(message) {
  const errorDiv = document.getElementById('login-error');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function logout() {
  currentUser = null;
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('login-error').classList.add('hidden');
}

// ==================== TABS ====================
function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.getElementById(tab + '-section').classList.add('active');
}

async function loadAllData() {
  await loadStores();
  await loadCategories();
  await loadProducts();
  await loadUsers();
  await loadOrders();
  await loadDiscounts();
}

async function loadStores() {
  try {
    const response = await fetch(`${API_URL}/stores`);
    stores = await response.json();
    
    // Poblar select de tiendas en formularios
    const storeSelects = ['product-store', 'category-store'];
    storeSelects.forEach(selectId => {
      const select = document.getElementById(selectId);
      select.innerHTML = '<option value="">Seleccionar tienda...</option>' +
        stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    });
    
    // Poblar tabla
    const tbody = document.getElementById('stores-tbody');
    tbody.innerHTML = stores.map(s => `
      <tr>
        <td><img src="${s.logo || 'https://via.placeholder.com/60'}" class="product-image"></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.description || 'Sin descripción'}</td>
        <td><span class="badge ${s.isActive ? 'badge-success' : 'badge-danger'}">${s.isActive ? 'Activa' : 'Inactiva'}</span></td>
        <td>${s.products ? s.products.length : 0} productos</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-edit" onclick="editStore(${s.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteStore(${s.id})">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading stores:', error);
  }
}

async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    categories = await response.json();
    
    // Poblar select de categorías
    const select = document.getElementById('product-category');
    select.innerHTML = '<option value="">Seleccionar categoría...</option>' +
      categories.map(c => `<option value="${c.id}">${c.name} (${c.store ? c.store.name : 'Sin tienda'})</option>`).join('');
    
    // Poblar tabla
    const tbody = document.getElementById('categories-tbody');
    tbody.innerHTML = categories.map(c => `
      <tr>
        <td><img src="${c.image || 'https://via.placeholder.com/60'}" class="product-image"></td>
        <td><strong>${c.name}</strong></td>
        <td>${c.store ? c.store.name : 'Sin tienda'}</td>
        <td>${c.products ? c.products.length : 0} productos</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-edit" onclick="editCategory(${c.id})">Editar</button>
            <button class="btn btn-danger" onclick="deleteCategory(${c.id})">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    products = await response.json();
    
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = products.map(p => {
      const finalPrice = p.price - (p.price * p.discount / 100);
      return `
        <tr>
          <td><img src="${p.image}" class="product-image" onerror="this.src='https://via.placeholder.com/60'"></td>
          <td>
            <strong>${p.name}</strong>
            ${p.isFlashSale ? '<span class="badge badge-flash">🔥 REMATE</span>' : ''}
            <br><small>${p.description || ''}</small>
          </td>
          <td>${p.store ? p.store.name : 'N/A'}</td>
          <td>${p.category ? p.category.name : 'N/A'}</td>
          <td>
            ${p.discount > 0 ? `<del>₡${p.price}</del> ` : ''}
            <strong>₡${finalPrice.toFixed(2)}</strong>
            ${p.discount > 0 ? `<span class="badge badge-warning">-${p.discount}%</span>` : ''}
          </td>
          <td>${p.discount}%</td>
          <td><span class="badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}">${p.stock}</span></td>
          <td>
            <span class="badge badge-info">${p.condition}</span>
            ${p.size ? `<br><small>Talla: ${p.size}</small>` : ''}
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-edit" onclick="editProduct('${p.id}')">Editar</button>
              <button class="btn btn-danger" onclick="deleteProduct('${p.id}')">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}">${u.role === 'admin' ? '👑 Admin' : '👤 Cliente'}</span></td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

async function loadOrders() {
  try {
    const response = await fetch(`${API_URL}/orders`);
    const orders = await response.json();
    
    const tbody = document.getElementById('orders-tbody');
    
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No hay órdenes</td></tr>';
      return;
    }
    
    tbody.innerHTML = orders.map(o => {
      const statusColors = {
        'pendiente': 'badge-warning',
        'pago_verificado': 'badge-info',
        'enviado': 'badge-info',
        'entregado': 'badge-success',
        'cancelado': 'badge-danger'
      };
      
      const statusLabels = {
        'pendiente': '⏳ Pendiente',
        'pago_verificado': '✅ Pago Verificado',
        'enviado': '📦 Enviado',
        'entregado': '🎉 Entregado',
        'cancelado': '❌ Cancelado'
      };
      
      const itemsCount = o.items ? o.items.length : 0;
      
      return `
        <tr>
          <td><strong>#${o.id}</strong></td>
          <td>
            ${o.customerName}<br>
            <small style="color: #999;">${o.customerEmail}</small><br>
            <small style="color: #999;">📱 ${o.customerPhone}</small>
          </td>
          <td>
            ${new Date(o.createdAt).toLocaleDateString()}<br>
            <small style="color: #999;">${new Date(o.createdAt).toLocaleTimeString()}</small>
          </td>
          <td>
            <strong>₡${parseFloat(o.total).toFixed(2)}</strong><br>
            <small style="color: #999;">${itemsCount} producto(s)</small>
          </td>
          <td>
            📱 ${o.sinpePhone}<br>
            <small style="color: #999;">Ref: ${o.sinpeReference}</small><br>
            ${o.sinpeProof ? '<a href="#" onclick="viewProof(\'' + o.sinpeProof + '\', event)" style="color: #667eea;">Ver comprobante</a>' : ''}
          </td>
          <td>
            <span class="badge ${statusColors[o.status]}">${statusLabels[o.status]}</span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-edit" onclick="viewOrder(${o.id})">Ver Detalles</button>
              <select onchange="updateOrderStatus(${o.id}, this.value)" style="padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <option value="">Cambiar estado...</option>
                <option value="pago_verificado">✅ Verificar Pago</option>
                <option value="enviado">📦 Marcar Enviado</option>
                <option value="entregado">🎉 Entregado</option>
                <option value="cancelado">❌ Cancelar</option>
              </select>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

async function viewOrder(id) {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`);
    const order = await response.json();
    
    let itemsHTML = order.items.map(item => `
      <div style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${item.productImage}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
          <div style="flex: 1;">
            <strong>${item.productName}</strong><br>
            <small>Cantidad: ${item.quantity} × ₡${parseFloat(item.price).toFixed(2)}</small>
          </div>
          <strong>₡${(item.quantity * parseFloat(item.price)).toFixed(2)}</strong>
        </div>
      </div>
    `).join('');
    
    const modalContent = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
        <div style="background: white; padding: 32px; border-radius: 16px; max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto;" onclick="event.stopPropagation()">
          <h2 style="margin-bottom: 24px;">📋 Orden #${order.id}</h2>
          
          <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;">👤 Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${order.customerName}</p>
            <p><strong>Cédula:</strong> ${order.customerIdNumber}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Teléfono:</strong> ${order.customerPhone}</p>
          </div>
          
          <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;">📦 Dirección de Envío</h3>
            <p><strong>Provincia:</strong> ${order.shippingProvince}</p>
            <p><strong>Cantón:</strong> ${order.shippingCanton}</p>
            <p><strong>Distrito:</strong> ${order.shippingDistrict}</p>
            <p><strong>Dirección:</strong> ${order.shippingAddress}</p>
            ${order.shippingPostalCode ? `<p><strong>Código Postal:</strong> ${order.shippingPostalCode}</p>` : ''}
          </div>
          
          <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;">🛍️ Productos</h3>
            ${itemsHTML}
          </div>
          
          <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;">💳 Información de Pago SINPE</h3>
            <p><strong>Teléfono:</strong> ${order.sinpePhone}</p>
            <p><strong>Referencia:</strong> ${order.sinpeReference}</p>
            <p><strong>Monto:</strong> ₡${parseFloat(order.sinpeAmount).toFixed(2)}</p>
          </div>
          
          ${order.notes ? `
          <div style="margin-bottom: 24px;">
            <h3 style="margin-bottom: 12px;">📝 Notas</h3>
            <p>${order.notes}</p>
          </div>
          ` : ''}
          
          <div style="border-top: 2px solid #e2e8f0; padding-top: 16px;">
            <h3 style="font-size: 20px;"><strong>Total:</strong> ₡${parseFloat(order.total).toFixed(2)}</h3>
          </div>
          
          <button onclick="this.closest('div[style*=fixed]').remove()" style="margin-top: 24px; width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
            Cerrar
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
  } catch (error) {
    alert('Error al cargar detalles de la orden');
    console.error(error);
  }
}

function viewProof(proofData, event) {
  event.preventDefault();
  const modalContent = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
      <div style="max-width: 90%; max-height: 90vh; position: relative;" onclick="event.stopPropagation()">
        <img src="${proofData}" style="max-width: 100%; max-height: 90vh; border-radius: 8px;">
        <button onclick="this.closest('div[style*=fixed]').remove()" style="position: absolute; top: 20px; right: 20px; background: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
          Cerrar
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalContent);
}

async function updateOrderStatus(id, newStatus) {
  if (!newStatus) return;
  
  if (!confirm(`¿Cambiar estado de la orden #${id} a "${newStatus}"?`)) return;
  
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (response.ok) {
      showSuccess('Estado de orden actualizado');
      loadOrders();
    }
  } catch (error) {
    alert('Error al actualizar estado');
    console.error(error);
  }
}

// ==================== SCHEDULED DISCOUNTS ====================
async function loadDiscounts() {
  try {
    const response = await fetch(`${API_URL}/scheduled-discounts`);
    const discounts = await response.json();
    
    const storeSelect = document.getElementById('discount-store');
    storeSelect.innerHTML = '<option value="">Todas las tiendas</option>' +
      stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    const tbody = document.getElementById('discounts-tbody');
    
    if (discounts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No hay descuentos programados</td></tr>';
      return;
    }
    
    tbody.innerHTML = discounts.map(d => {
      const now = new Date();
      const startDate = new Date(d.startDate);
      const endDate = new Date(d.endDate);
      
      let statusText = '';
      let statusClass = '';
      
      if (!d.isActive) {
        statusText = '⏸️ Pausado';
        statusClass = 'badge-danger';
      } else if (now < startDate) {
        statusText = '⏳ Programado';
        statusClass = 'badge-warning';
      } else if (now > endDate) {
        statusText = '✅ Finalizado';
        statusClass = 'badge-info';
      } else {
        statusText = '🔴 ACTIVO';
        statusClass = 'badge-success';
      }
      
      return `
        <tr>
          <td><strong>${d.name}</strong></td>
          <td><strong style="color: #e74c3c; font-size: 18px;">-${d.discountPercentage}%</strong></td>
          <td>${d.store ? d.store.name : '🌍 Todas las tiendas'}</td>
          <td>${new Date(d.startDate).toLocaleString('es-CR')}</td>
          <td>${new Date(d.endDate).toLocaleString('es-CR')}</td>
          <td><span class="badge ${statusClass}">${statusText}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-edit" onclick="editDiscount(${d.id})">Editar</button>
              <button class="btn btn-success" onclick="applyDiscount(${d.id})" style="padding: 8px 15px; font-size: 0.9em;">Aplicar Ahora</button>
              <button class="btn btn-danger" onclick="deleteDiscount(${d.id})">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading discounts:', error);
  }
}

document.getElementById('discount-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const discountId = document.getElementById('discount-id').value;
  const discountData = {
    name: document.getElementById('discount-name').value,
    discountPercentage: parseFloat(document.getElementById('discount-percentage').value),
    startDate: document.getElementById('discount-start').value,
    endDate: document.getElementById('discount-end').value,
    isActive: document.getElementById('discount-active').checked,
    applyToStoreId: document.getElementById('discount-store').value || null
  };

  try {
    let response;
    if (discountId) {
      response = await fetch(`${API_URL}/scheduled-discounts/${discountId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountData)
      });
    } else {
      response = await fetch(`${API_URL}/scheduled-discounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountData)
      });
    }

    if (response.ok) {
      showSuccess(discountId ? 'Descuento actualizado exitosamente' : 'Descuento creado y aplicado exitosamente');
      document.getElementById('discount-form').reset();
      cancelDiscountEdit();
      loadDiscounts();
      loadProducts();
    }
  } catch (error) {
    alert('Error al guardar descuento');
    console.error(error);
  }
});

async function editDiscount(id) {
  try {
    const response = await fetch(`${API_URL}/scheduled-discounts/${id}`);
    const discount = await response.json();
    
    document.getElementById('discount-id').value = discount.id;
    document.getElementById('discount-name').value = discount.name;
    document.getElementById('discount-percentage').value = discount.discountPercentage;
    
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    
    document.getElementById('discount-start').value = formatDateTimeLocal(startDate);
    document.getElementById('discount-end').value = formatDateTimeLocal(endDate);
    
    document.getElementById('discount-store').value = discount.applyToStoreId || '';
    document.getElementById('discount-active').checked = discount.isActive;
    
    document.getElementById('discount-form-title').textContent = '✏️ Editar Descuento Programado';
    document.getElementById('discount-cancel-btn').classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    alert('Error al cargar descuento');
    console.error(error);
  }
}

function cancelDiscountEdit() {
  document.getElementById('discount-form').reset();
  document.getElementById('discount-id').value = '';
  document.getElementById('discount-form-title').textContent = '💰 Crear Descuento Programado';
  document.getElementById('discount-cancel-btn').classList.add('hidden');
}

async function applyDiscount(id) {
  if (!confirm('¿Aplicar este descuento a todos los productos ahora?')) return;
  
  try {
    const response = await fetch(`${API_URL}/scheduled-discounts/${id}/apply`, {
      method: 'POST'
    });
    
    if (response.ok) {
      const result = await response.json();
      showSuccess(`Descuento aplicado a ${result.productsAffected} productos`);
      loadProducts();
    }
  } catch (error) {
    alert('Error al aplicar descuento');
    console.error(error);
  }
}

async function deleteDiscount(id) {
  if (!confirm('¿Eliminar este descuento? Se removerá el descuento de todos los productos afectados.')) return;
  
  try {
    const response = await fetch(`${API_URL}/scheduled-discounts/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      showSuccess('Descuento eliminado');
      loadDiscounts();
      loadProducts();
    }
  } catch (error) {
    alert('Error al eliminar descuento');
    console.error(error);
  }
}

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// ==================== HELPER FUNCTIONS ====================
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==================== PRODUCTS CRUD ====================
document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const productId = document.getElementById('product-id').value;
  const imageFile = document.getElementById('product-image').files[0];
  
  let imageData = '';
  if (imageFile) {
    imageData = await fileToBase64(imageFile);
  } else if (productId) {
    // Si estamos editando y no hay nueva imagen, mantener la anterior
    const product = products.find(p => p.id == productId);
    imageData = product ? product.image : '';
  }
  
  const productData = {
    name: document.getElementById('product-name').value,
    price: parseFloat(document.getElementById('product-price').value),
    image: imageData,
    description: document.getElementById('product-description').value,
    stock: parseInt(document.getElementById('product-stock').value),
    discount: parseFloat(document.getElementById('product-discount').value),
    isFlashSale: document.getElementById('product-flash-sale').checked,
    condition: document.getElementById('product-condition').value,
    size: document.getElementById('product-size').value,
    storeId: parseInt(document.getElementById('product-store').value),
    categoryId: parseInt(document.getElementById('product-category').value)
  };

  try {
    let response;
    if (productId) {
      response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    } else {
      response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      alert('Error: ' + (errorData.message || JSON.stringify(errorData)));
      return;
    }

    showSuccess(productId ? 'Producto actualizado exitosamente' : 'Producto agregado exitosamente');
    document.getElementById('product-form').reset();
    cancelProductEdit();
    loadProducts();
  } catch (error) {
    alert('Error al guardar producto: ' + error.message);
    console.error(error);
  }
});

async function editProduct(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const product = await response.json();
    
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-discount').value = product.discount;
    document.getElementById('product-flash-sale').checked = product.isFlashSale;
    document.getElementById('product-condition').value = product.condition;
    document.getElementById('product-size').value = product.size || '';
    document.getElementById('product-store').value = product.storeId || '';
    document.getElementById('product-category').value = product.categoryId || '';
    
    // Limpiar el input file y hacer que no sea requerido al editar
    document.getElementById('product-image').value = '';
    document.getElementById('product-image').removeAttribute('required');
    
    document.getElementById('product-form-title').textContent = '✏️ Editar Producto (mantiene imagen actual si no seleccionas una nueva)';
    document.getElementById('product-submit-btn').textContent = 'Actualizar Producto';
    document.getElementById('product-cancel-btn').classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    alert('Error al cargar producto');
    console.error(error);
  }
}

function cancelProductEdit() {
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  document.getElementById('product-form-title').textContent = '➕ Agregar Nuevo Producto';
  document.getElementById('product-submit-btn').textContent = 'Agregar Producto';
  document.getElementById('product-cancel-btn').classList.add('hidden');
  // Restaurar el required en la imagen
  document.getElementById('product-image').setAttribute('required', 'required');
}

async function deleteProduct(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  
  try {
    const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    if (response.ok) {
      showSuccess('Producto eliminado exitosamente');
      loadProducts();
    }
  } catch (error) {
    alert('Error al eliminar producto');
    console.error(error);
  }
}

// ==================== STORES CRUD ====================
document.getElementById('store-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const storeId = document.getElementById('store-id').value;
  const logoFile = document.getElementById('store-logo').files[0];
  
  let logoData = '';
  if (logoFile) {
    logoData = await fileToBase64(logoFile);
  } else if (storeId) {
    const store = stores.find(s => s.id == storeId);
    logoData = store ? store.logo : '';
  }
  
  const storeData = {
    name: document.getElementById('store-name').value,
    description: document.getElementById('store-description').value,
    logo: logoData,
    isActive: document.getElementById('store-active').checked
  };

  try {
    let response;
    if (storeId) {
      response = await fetch(`${API_URL}/stores/${storeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData)
      });
    } else {
      response = await fetch(`${API_URL}/stores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData)
      });
    }

    if (response.ok) {
      showSuccess(storeId ? 'Tienda actualizada exitosamente' : 'Tienda creada exitosamente');
      document.getElementById('store-form').reset();
      cancelStoreEdit();
      loadStores();
    }
  } catch (error) {
    alert('Error al guardar tienda');
    console.error(error);
  }
});

async function editStore(id) {
  try {
    const response = await fetch(`${API_URL}/stores/${id}`);
    const store = await response.json();
    
    document.getElementById('store-id').value = store.id;
    document.getElementById('store-name').value = store.name;
    document.getElementById('store-description').value = store.description || '';
    // No se puede pre-llenar un input file
    document.getElementById('store-active').checked = store.isActive;
    
    document.getElementById('store-form-title').textContent = '✏️ Editar Tienda';
    document.getElementById('store-cancel-btn').classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    alert('Error al cargar tienda');
    console.error(error);
  }
}

function cancelStoreEdit() {
  document.getElementById('store-form').reset();
  document.getElementById('store-id').value = '';
  document.getElementById('store-form-title').textContent = '➕ Agregar Nueva Tienda';
  document.getElementById('store-cancel-btn').classList.add('hidden');
}

async function deleteStore(id) {
  if (!confirm('¿Estás seguro de eliminar esta tienda? Esto afectará a los productos asociados.')) return;
  
  try {
    const response = await fetch(`${API_URL}/stores/${id}`, { method: 'DELETE' });
    if (response.ok) {
      showSuccess('Tienda eliminada exitosamente');
      loadStores();
    }
  } catch (error) {
    alert('Error al eliminar tienda');
    console.error(error);
  }
}

// ==================== CATEGORIES CRUD ====================
document.getElementById('category-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const categoryId = document.getElementById('category-id').value;
  const imageFile = document.getElementById('category-image').files[0];
  
  let imageData = '';
  if (imageFile) {
    imageData = await fileToBase64(imageFile);
  } else if (categoryId) {
    const category = categories.find(c => c.id == categoryId);
    imageData = category ? category.image : '';
  }
  
  const categoryData = {
    name: document.getElementById('category-name').value,
    image: imageData,
    storeId: parseInt(document.getElementById('category-store').value)
  };

  try {
    let response;
    if (categoryId) {
      response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
    } else {
      response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
    }

    if (response.ok) {
      showSuccess(categoryId ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente');
      document.getElementById('category-form').reset();
      cancelCategoryEdit();
      loadCategories();
    }
  } catch (error) {
    alert('Error al guardar categoría');
    console.error(error);
  }
});

async function editCategory(id) {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`);
    const category = await response.json();
    
    document.getElementById('category-id').value = category.id;
    document.getElementById('category-name').value = category.name;
    // No se puede pre-llenar un input file
    document.getElementById('category-store').value = category.storeId || '';
    
    document.getElementById('category-form-title').textContent = '✏️ Editar Categoría';
    document.getElementById('category-cancel-btn').classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    alert('Error al cargar categoría');
    console.error(error);
  }
}

function cancelCategoryEdit() {
  document.getElementById('category-form').reset();
  document.getElementById('category-id').value = '';
  document.getElementById('category-form-title').textContent = '➕ Agregar Nueva Categoría';
  document.getElementById('category-cancel-btn').classList.add('hidden');
}

async function deleteCategory(id) {
  if (!confirm('¿Estás seguro de eliminar esta categoría? Esto afectará a los productos asociados.')) return;
  
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    if (response.ok) {
      showSuccess('Categoría eliminada exitosamente');
      loadCategories();
    }
  } catch (error) {
    alert('Error al eliminar categoría');
    console.error(error);
  }
}

// ==================== UTILS ====================
function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  successDiv.textContent = message;
  successDiv.classList.remove('hidden');
  setTimeout(() => successDiv.classList.add('hidden'), 3000);
}
