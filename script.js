// ==================== VARIABLES GLOBALES ====================

// URL base de la API (fallback si no está disponible en api-service.js)
if (typeof API_BASE_URL === 'undefined') {
  window.API_BASE_URL = 'http://localhost:3000/api';
}

let PRODUCTS = {};
const API_URL = `${API_BASE_URL}/productos`;

// Estado actual del dashboard
let currentDashboardTab = 'usuarios';
let usuariosData = [];
let proyectosData = [];
let tareasData = [];

// ==================== FUNCIONES PARA CARGAR PRODUCTOS ====================

// Cargar productos desde la base de datos
async function loadProducts() {
  try {
    const productos = await productosAPI.getAll();
    
    // Convertir array a objeto para mantener compatibilidad
    PRODUCTS = {};
    productos.forEach(producto => {
      PRODUCTS[producto.id] = {
        title: producto.titulo,
        notes: producto.notas,
        abv: producto.abv,
        description: producto.descripcion,
        price: producto.precio,
        image: producto.imagen
      };
    });
    
    // Renderizar productos en el catálogo
    renderProducts(productos);
  } catch (error) {
    handleError(error, 'Error al cargar productos');
    // Mostrar mensaje de error al usuario
    const grid = document.querySelector('.grid');
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
          <p style="color: #c00;">Error al cargar productos. Asegúrate de que el servidor esté corriendo.</p>
          <p style="color: #666; font-size: 0.9rem;">Ejecuta: npm start en la terminal</p>
        </div>
      `;
    }
  }
}

// Renderizar productos en el catálogo
function renderProducts(productos) {
  const grid = document.querySelector('.grid');
  if (!grid) return;
  
  grid.innerHTML = productos.map(producto => `
    <article class="card" data-product="${producto.id}">
      <div class="product-image">${producto.imagen || '🍾'}</div>
      <h3>${producto.titulo}</h3>
      <p>${producto.descripcion || 'Producto premium de calidad'}</p>
      <div class="product-price">$${producto.precio.toLocaleString('es-MX')}</div>
      <div class="card-actions">
        <button class="btn-primary add-cart-btn" onclick="addToCart('${producto.id}')">Agregar al carrito</button>
      </div>
    </article>
  `).join('');
}

// ==================== FUNCIONES DEL CARRITO ====================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productKey) {
  const product = PRODUCTS[productKey];
  if (!product) return;

  const existingItem = cart.find(item => item.id === productKey);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productKey,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showNotification(`${product.title} agregado al carrito`);
}

function removeFromCart(productKey) {
  cart = cart.filter(item => item.id !== productKey);
  saveCart();
  updateCartUI();
}

function updateQuantity(productKey, change) {
  const item = cart.find(item => item.id === productKey);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productKey);
  } else {
    saveCart();
    updateCartUI();
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');

  if (cartCount) {
    const count = getCartItemCount();
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'block' : 'none';
  }

  if (cartItems && cartContent) {
    if (cart.length === 0) {
      cartContent.style.display = 'none';
      if (emptyCart) emptyCart.style.display = 'block';
    } else {
      if (emptyCart) emptyCart.style.display = 'none';
      cartContent.style.display = 'block';
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-image">${item.image}</span>
            <div>
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-price">$${item.price.toLocaleString('es-MX')}</div>
            </div>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')" aria-label="Eliminar">×</button>
          </div>
        </div>
      `).join('');
    }
  }

  if (cartTotal) {
    cartTotal.textContent = `$${getCartTotal().toLocaleString('es-MX')}`;
  }
}

function toggleCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  if (cartSidebar) {
    cartSidebar.classList.toggle('open');
  }
}

function checkout() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  const total = getCartTotal();
  const message = `¡Gracias por tu compra!\n\nTotal: $${total.toLocaleString('es-MX')}\n\nEn un momento te contactaremos para completar tu pedido.`;
  alert(message);
  
  cart = [];
  saveCart();
  updateCartUI();
  toggleCart();
}

// ==================== FUNCIONES DEL DASHBOARD ====================

/**
 * Cambiar tab del dashboard
 */
function switchDashboardTab(tabName) {
  currentDashboardTab = tabName;
  
  // Actualizar botones activos
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Ocultar todos los tabs
  document.querySelectorAll('.dashboard-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Mostrar tab activo
  document.getElementById(`tab-${tabName}`).classList.add('active');
  
  // Cargar datos del tab
  if (tabName === 'usuarios') {
    loadUsuarios();
  } else if (tabName === 'proyectos') {
    loadProyectos();
  } else if (tabName === 'tareas') {
    loadTareas();
  }
}

// ==================== GESTIÓN DE USUARIOS ====================

async function loadUsuarios() {
  try {
    const container = document.getElementById('usuarios-list');
    container.innerHTML = '<p>Cargando usuarios...</p>';
    
    usuariosData = await usuariosAPI.getAll();
    
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${usuariosData.map(usuario => `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.rol}</td>
            <td><span class="badge badge-${usuario.estado}">${usuario.estado}</span></td>
            <td>
              <button class="btn-small" onclick="editUsuario(${usuario.id})">Editar</button>
              <button class="btn-small btn-danger" onclick="deleteUsuario(${usuario.id})">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    container.innerHTML = '';
    container.appendChild(table);
  } catch (error) {
    handleError(error, 'Error al cargar usuarios');
  }
}

function openUsuarioForm() {
  const form = prompt('Ingresa los datos del usuario (formato: nombre,email,contraseña,rol)\n\nEjemplo: Juan Pérez,juan@test.com,password123,admin');
  if (!form) return;
  
  const [nombre, email, contraseña, rol] = form.split(',').map(s => s.trim());
  
  // Validar que todos los datos estén presentes
  if (!nombre || !email || !contraseña) {
    showNotification('Error: Debes ingresar nombre, email y contraseña', 'error');
    return;
  }
  
  createUsuario({ nombre, email, contraseña, rol: rol || 'usuario' });
}

async function createUsuario(data) {
  try {
    console.log('Creando usuario con datos:', data);
    validateRequired(data, ['nombre', 'email', 'contraseña']);
    const resultado = await usuariosAPI.create(data);
    console.log('Usuario creado exitosamente:', resultado);
    showNotification('Usuario creado exitosamente', 'success');
    await loadUsuarios();
  } catch (error) {
    console.error('Error al crear usuario:', error);
    handleError(error, 'Error al crear el usuario');
  }
}

function editUsuario(id) {
  const usuario = usuariosData.find(u => u.id === id);
  if (!usuario) return;
  
  const form = prompt(`Actualizar usuario (nombre,email,rol,estado):\n\n${usuario.nombre},${usuario.email},${usuario.rol},${usuario.estado}`);
  if (!form) return;
  
  const [nombre, email, rol, estado] = form.split(',').map(s => s.trim());
  updateUsuario(id, { nombre, email, rol, estado });
}

async function updateUsuario(id, data) {
  try {
    await usuariosAPI.update(id, data);
    showNotification('Usuario actualizado exitosamente');
    loadUsuarios();
  } catch (error) {
    handleError(error);
  }
}

async function deleteUsuario(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
  
  try {
    await usuariosAPI.delete(id);
    showNotification('Usuario eliminado exitosamente');
    loadUsuarios();
  } catch (error) {
    handleError(error);
  }
}

// ==================== GESTIÓN DE PROYECTOS ====================

async function loadProyectos() {
  try {
    const container = document.getElementById('proyectos-list');
    container.innerHTML = '<p>Cargando proyectos...</p>';
    
    proyectosData = await proyectosAPI.getAll();
    
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Usuario</th>
          <th>Estado</th>
          <th>Prioridad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${proyectosData.map(proyecto => `
          <tr>
            <td>${proyecto.id}</td>
            <td>${proyecto.nombre}</td>
            <td>${proyecto.usuario_nombre || 'N/A'}</td>
            <td><span class="badge badge-${proyecto.estado}">${proyecto.estado}</span></td>
            <td><span class="badge badge-${proyecto.prioridad}">${proyecto.prioridad}</span></td>
            <td>
              <button class="btn-small" onclick="editProyecto(${proyecto.id})">Editar</button>
              <button class="btn-small btn-danger" onclick="deleteProyecto(${proyecto.id})">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    container.innerHTML = '';
    container.appendChild(table);
  } catch (error) {
    handleError(error, 'Error al cargar proyectos');
  }
}

function openProyectoForm() {
  const form = prompt('Ingresa los datos del proyecto (formato: nombre,usuario_id,descripción,estado,prioridad)\n\nEjemplo: Mi Proyecto,1,Descripción,activo,alta');
  if (!form) return;
  
  const [nombre, usuario_id, descripcion, estado, prioridad] = form.split(',').map(s => s.trim());
  
  // Validar que todos los datos estén presentes
  if (!nombre || !usuario_id) {
    showNotification('Error: Debes ingresar nombre y usuario_id', 'error');
    return;
  }
  
  createProyecto({ 
    nombre, 
    usuario_id: parseInt(usuario_id), 
    descripcion,
    estado: estado || 'activo',
    prioridad: prioridad || 'media'
  });
}

async function createProyecto(data) {
  try {
    console.log('Creando proyecto con datos:', data);
    validateRequired(data, ['nombre', 'usuario_id']);
    const resultado = await proyectosAPI.create(data);
    console.log('Proyecto creado exitosamente:', resultado);
    showNotification('Proyecto creado exitosamente', 'success');
    await loadProyectos();
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    handleError(error, 'Error al crear el proyecto');
  }
}

function editProyecto(id) {
  const proyecto = proyectosData.find(p => p.id === id);
  if (!proyecto) return;
  
  const form = prompt(`Actualizar proyecto:\n${proyecto.nombre},${proyecto.usuario_id},${proyecto.descripcion},${proyecto.estado},${proyecto.prioridad}`);
  if (!form) return;
  
  const [nombre, usuario_id, descripcion, estado, prioridad] = form.split(',').map(s => s.trim());
  updateProyecto(id, { nombre, descripcion, estado, prioridad });
}

async function updateProyecto(id, data) {
  try {
    await proyectosAPI.update(id, data);
    showNotification('Proyecto actualizado exitosamente');
    loadProyectos();
  } catch (error) {
    handleError(error);
  }
}

async function deleteProyecto(id) {
  if (!confirm('¿Estás seguro? Se eliminarán todas las tareas asociadas.')) return;
  
  try {
    await proyectosAPI.delete(id);
    showNotification('Proyecto eliminado exitosamente');
    loadProyectos();
  } catch (error) {
    handleError(error);
  }
}

// ==================== GESTIÓN DE TAREAS ====================

async function loadTareas() {
  try {
    const container = document.getElementById('tareas-list');
    container.innerHTML = '<p>Cargando tareas...</p>';
    
    console.log('Obteniendo todas las tareas...');
    tareasData = await tareasAPI.getAll();
    console.log('Tareas obtenidas:', tareasData);
    
    if (!tareasData || tareasData.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #666;">No hay tareas registradas</p>';
      return;
    }
    
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Proyecto</th>
          <th>Usuario</th>
          <th>Estado</th>
          <th>Prioridad</th>
          <th>Vencimiento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${tareasData.map(tarea => `
          <tr>
            <td>${tarea.id}</td>
            <td>${tarea.titulo}</td>
            <td>${tarea.proyecto_nombre || 'N/A'}</td>
            <td>${tarea.usuario_nombre || 'N/A'}</td>
            <td><span class="badge badge-${tarea.estado}">${tarea.estado}</span></td>
            <td><span class="badge badge-${tarea.prioridad}">${tarea.prioridad}</span></td>
            <td>${formatDate(tarea.fecha_vencimiento) || 'Sin fecha'}</td>
            <td>
              <button class="btn-small" onclick="editTarea(${tarea.id})">Editar</button>
              <button class="btn-small btn-danger" onclick="deleteTarea(${tarea.id})">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    container.innerHTML = '';
    container.appendChild(table);
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    handleError(error, 'Error al cargar tareas');
    const container = document.getElementById('tareas-list');
    if (container) {
      container.innerHTML = `<p style="color: #c00; text-align: center;">Error al cargar tareas. Revisa la consola.</p>`;
    }
  }
}

function openTareaForm() {
  const form = prompt('Ingresa los datos de la tarea (formato: proyecto_id,usuario_id,titulo,estado,prioridad)\n\nEjemplo: 1,1,Mi Tarea,pendiente,media');
  if (!form) return;
  
  const [proyecto_id, usuario_id, titulo, estado, prioridad] = form.split(',').map(s => s.trim());
  
  // Validar que todos los datos estén presentes
  if (!proyecto_id || !usuario_id || !titulo) {
    showNotification('Error: Debes ingresar proyecto_id, usuario_id y título', 'error');
    return;
  }
  
  createTarea({ 
    proyecto_id: parseInt(proyecto_id), 
    usuario_id: parseInt(usuario_id),
    titulo,
    estado: estado || 'pendiente',
    prioridad: prioridad || 'media'
  });
}

async function createTarea(data) {
  try {
    console.log('Creando tarea con datos:', data);
    validateRequired(data, ['proyecto_id', 'usuario_id', 'titulo']);
    const resultado = await tareasAPI.create(data);
    console.log('Tarea creada exitosamente:', resultado);
    showNotification('Tarea creada exitosamente', 'success');
    await loadTareas();
  } catch (error) {
    console.error('Error al crear tarea:', error);
    handleError(error, 'Error al crear la tarea');
  }
}

function editTarea(id) {
  const tarea = tareasData.find(t => t.id === id);
  if (!tarea) return;
  
  const form = prompt(`Actualizar tarea:\n${tarea.titulo},${tarea.estado},${tarea.prioridad}`);
  if (!form) return;
  
  const [titulo, estado, prioridad] = form.split(',').map(s => s.trim());
  updateTarea(id, { titulo, estado, prioridad });
}

async function updateTarea(id, data) {
  try {
    await tareasAPI.update(id, data);
    showNotification('Tarea actualizada exitosamente');
    loadTareas();
  } catch (error) {
    handleError(error);
  }
}

async function deleteTarea(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
  
  try {
    await tareasAPI.delete(id);
    showNotification('Tarea eliminada exitosamente');
    loadTareas();
  } catch (error) {
    handleError(error);
  }
}

// ==================== INICIALIZACIÓN ====================

// Menú accesible
const navToggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');

if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(!expanded));
  });
}

// Scroll al catálogo
document.getElementById('ver-catalogo')?.addEventListener('click', () => {
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
});

// Cerrar carrito al hacer clic fuera
document.getElementById('cart-sidebar')?.addEventListener('click', (e) => {
  if (e.target.id === 'cart-sidebar') {
    toggleCart();
  }
});

// Inicializar aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadProducts().then(() => {
    updateCartUI();
  });
});