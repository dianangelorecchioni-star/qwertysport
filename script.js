// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
  inicializarAplicacion();
});

// ===== VARIABLES GLOBALES =====
let usuarios = [];
let usuarioLogueado = null;
let carrito = [];
let productos = [];
let filtrosActivos = {};
let deporteSeleccionado = null;
let consultas = [];
let trabajadores = [];

// ===== INICIALIZAR USUARIOS ADMINISTRADORES POR DEFECTO =====
function inicializarAdminPorDefecto() {
  // Administradores por defecto
  const adminsData = [
    {
      nombre: "admin",
      email: "administrador@gmail.com",
      pass: "admin",
      rol: "administrador"
    },
    {
      nombre: "dian",
      email: "dianadmin@gmail.com",
      pass: "dianqwerty",
      rol: "administrador"
    }
  ];
  
  // Agregar cada administrador si no existe
  adminsData.forEach(adminData => {
    const adminIndex = usuarios.findIndex(u => u.email === adminData.email);
    
    if (adminIndex === -1) {
      // No existe, crear nuevo
      usuarios.push(adminData);
      console.log("✅ Usuario administrador creado:", adminData);
    } else {
      // Existe, actualizar para asegurar que tenga los datos correctos
      usuarios[adminIndex] = adminData;
      console.log("✅ Usuario administrador actualizado:", adminData);
    }
  });
  
  // Guardar en localStorage
  // Persistencia deshabilitada: sin localStorage
  
  // Verificar que se guardaron correctamente
  // Persistencia deshabilitada: sin verificación en localStorage
}

// ===== VERIFICAR SESIÓN PHP DEL SERVIDOR =====
async function verificarSesionServidor() {
  try {
    const resp = await fetch('sesion.php', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include' // Importante para enviar cookies de sesión PHP
    });
    
    const data = await resp.json().catch(() => ({}));
    if (resp.ok && data.ok && data.usuario) {
      usuarioLogueado = {
        nombre: data.usuario.nombre,
        email: data.usuario.email,
        rol: data.usuario.rol || 'cliente'
      };
      return true;
    }
  } catch (error) {
    console.error('Error al verificar sesión:', error);
  }
  return false;
}

// ===== INICIALIZACIÓN =====
async function inicializarAplicacion() {
  inicializarAdminPorDefecto();
  cargarProductos();
  
  // Verificar sesión PHP del servidor al cargar la página
  const haySesion = await verificarSesionServidor();
  
  inicializarEventos();
  actualizarCarrito();
  inicializarMenuMobile();
  
  if (haySesion && usuarioLogueado) {
    mostrarUsuario(usuarioLogueado.nombre);
  }
  
  // Función de prueba para verificar los administradores
  window.testAdmin = function() {
    console.log("🧪 PRUEBA DE ADMINISTRADORES");
    console.log("Usuarios en memoria:", usuarios);
    console.log("Persistencia local deshabilitada");
    
    const admins = [
      { email: "administrador@gmail.com", nombre: "admin" },
      { email: "dianadmin@gmail.com", nombre: "dian" }
    ];
    
    admins.forEach(adminInfo => {
      const admin = usuarios.find(u => u.email === adminInfo.email);
      console.log(`Admin ${adminInfo.nombre} encontrado:`, admin);
      
      if (admin) {
        console.log(`✅ Administrador ${adminInfo.nombre} existe`);
        console.log("Credenciales:", {
          nombre: admin.nombre,
          email: admin.email,
          pass: admin.pass,
          rol: admin.rol
        });
      } else {
        console.log(`❌ Administrador ${adminInfo.nombre} NO existe`);
      }
    });
  };
  
  // Ejecutar prueba automáticamente
  setTimeout(() => {
    window.testAdmin();
  }, 1000);
}

// ===== MENÚ MÓVIL =====
function inicializarMenuMobile() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Cambiar icono
      const icon = mobileMenuBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
      });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = 'fas fa-bars';
      }
    });
  }
}

// ===== PRODUCTOS Y CATÁLOGO =====
function cargarProductos() {
  // Intentar cargar productos desde localStorage
  // Persistencia deshabilitada: siempre usar productos por defecto en memoria
  
  // Si no hay productos guardados, usar los productos por defecto
  productos = [
    // ===== FÚTBOL =====
    { id: 1, nombre: "Remera Argentina", precio: 100000, categoria: "remeras", deporte: "futbol", imagen: "futbol/futbol1/fproducto1.WEBP", descripcion: "Remera de Argentina oficial", medidas: "Tallas: S, M, L, XL, XXL" },
    { id: 2, nombre: "Botines Fútbol", precio: 90000, categoria: "zapatillas", deporte: "futbol", imagen: "futbol/futbol1/fproducto2.WEBP", descripcion: "Botines de alto rendimiento", medidas: "Tallas: 36-46, Material: Cuero sintético" },
    { id: 3, nombre: "Botines papi futbol", precio: 73000, categoria: "zapatillas", deporte: "futbol", imagen: "futbol/futbol1/fproducto3.WEBP", descripcion: "Botines de entrenamiento", medidas: "Tallas: 36-46, Material: Cuero sintético" },
    { id: 4, nombre: "Remera Juventus", precio: 50000, categoria: "remeras", deporte: "futbol", imagen: "futbol/futbol1/fproducto4.WEBP", descripcion: "Remera de Juventus oficial", medidas: "Tallas: S, M, L, XL, XXL" },
      { id: 5, nombre: "Pelota Fùtbol", precio: 19000, categoria: "equipamiento", deporte: "futbol", imagen: "futbol/futbol1/fproducto5.WEBP", descripcion: "Pelota Nassua" },
    { id: 6, nombre: "Canilleras", precio: 12000, categoria: "equipamiento", deporte: "futbol", imagen: "futbol/futbol1/fproducto6.WEBP", descripcion: "Canilleras de alta calidad", medidas: "Altura: 15cm" },
   
    
    // ===== BÁSQUET =====
    { id: 8, nombre: "Zapatillas Basquet", precio: 72999, categoria: "zapatillas", deporte: "basquet", imagen: "basquet/basquet1/baproducto1.WEBP", descripcion: "Zapatillas antideslizantes", medidas: "Tallas: 36-46" },
      { id: 9, nombre: "Muñequeras", precio: 13500, categoria: "accesorios", deporte: "basquet", imagen: "basquet/basquet1/baproducto2.WEBP", descripcion: "Muñequera para sudor", medidas: "Circuferencia 15cm" },
    { id: 10, nombre: "Zapatillas basquet blancas", precio: 59999, categoria: "zapatillas", deporte: "basquet", imagen: "basquet/basquet1/baproducto3.WEBP", descripcion: "Zapatillas de entrenamiento", medidas: "Tallas: 36-46" },
    { id: 11, nombre: "Zapatillas White Edition", precio: 67999, categoria: "zapatillas", deporte: "basquet", imagen: "basquet/basquet1/baproducto4.WEBP", descripcion: "Zapatillas para piso de concreto", medidas: "Tallas: 36-46" },
    { id: 12, nombre: "Pelota Bàsquet", precio: 33999, categoria: "equipamiento", deporte: "basquet", imagen: "basquet/basquet1/baproducto5.WEBP", descripcion: "Pelota básquet" },
   
    // ===== TENIS =====
    { id: 14, nombre: "Pelotas Tenis x4", precio: 10000, categoria: "equipamiento", deporte: "tenis", imagen: "tenis/tenis1/tproducto1.WEBP", descripcion: "Pack de 4 pelotas profesionales" },
    { id: 15, nombre: "Pelota Tenis", precio: 3250, categoria: "equipamiento", deporte: "tenis", imagen: "tenis/tenis1/tproducto2.WEBP", descripcion: "Pelota individual profesional" },
    { id: 16, nombre: "Raqueta Tenis", precio: 36100, categoria: "equipamiento", deporte: "tenis", imagen: "tenis/tenis1/tproducto3.WEBP", descripcion: "Raqueta profesional de tenis"  },
    { id: 17, nombre: "Bolso Tenis", precio: 45000, categoria: "equipamiento", deporte: "tenis", imagen: "tenis/tenis1/tproducto4.WEBP", descripcion: "Bolso deportivo de tenis"},
    
    // ===== NATACIÓN =====
    { id: 20, nombre: "Traje Baño Mujer", precio: 54999, categoria: "pantalones", deporte: "natacion", imagen: "natacion/natacion1/nproducto1.WEBP", descripcion: "Traje de baño profesional de mujer", medidas: "Tallas: S, M, L, XL, XXL" },
    { id: 21, nombre: "Antiparras", precio: 2999, categoria: "equipamiento", deporte: "natacion", imagen: "natacion/natacion1/nproducto2.WEBP", descripcion: "Antiparras de natación de profesionales" },
    { id: 22, nombre: "Pinza Nariz", precio: 1000, categoria: "accesorios", deporte: "natacion", imagen: "natacion/natacion1/nproducto3.WEBP", descripcion: "Pinza de nariz" },
    { id: 23, nombre: "Malla Hombre", precio: 44999, categoria: "pantalones", deporte: "natacion", imagen: "natacion/natacion1/nproducto4.WEBP", descripcion: "Malla de hombre para competencias", medidas: "Tallas: S, M, L, XL, XXL" },
    { id: 24, nombre: "Patas de Rana", precio: 35499, categoria: "equipamiento", deporte: "natacion", imagen: "natacion/natacion1/nproducto5.WEBP", descripcion: "Patas de rana para entrenamiento", medidas: "36-46" },
  
    // ===== VOLEY =====
    { id: 25, nombre: "Rodilleras", precio: 6999, categoria: "accesorios", deporte: "voley", imagen: "voley/voley1/vproducto1.WEBP", descripcion: "Rodilleras de voley" , medidas: "Tallas: S, M, L"},
    { id: 26, nombre: "Cinta Voley", precio: 3999, categoria: "accesorios", deporte: "voley", imagen: "voley/voley1/vproducto2.WEBP", descripcion: "Cinta antilesiones " , medidas: "2 metros"},
    { id: 27, nombre: "Mangas Voley", precio: 7499, categoria: "accesorios", deporte: "voley", imagen: "voley/voley1/vproducto3.WEBP", descripcion: "Mangas para voley" , medidas: "Tallas: S, M, L"},
    { id: 28, nombre: "Pelota Mikasa", precio: 41000, categoria: "equipamiento", deporte: "voley", imagen: "voley/voley1/vproducto4.WEBP", descripcion: "Pelota mikasa profesional" },
    { id: 29, nombre: "Zapatillas Voley", precio: 83999, categoria: "zapatillas", deporte: "voley", imagen: "voley/voley1/vproducto5.WEBP", descripcion: "Zapatillas para voley", medidas: "Tallas: 36-46" },
    
    // ===== BOXEO =====
    { id: 30, nombre: "Pantalon Short box", precio: 45999, categoria: "shorts", deporte: "boxeo", imagen: "boxeo/boxeo1/bproducto1.WEBP", descripcion: "Short de boxeo" , medidas: "Tallas: S, M, L, XL, XXL"},
    { id: 31, nombre: "Zapatillas boxeo", precio: 65499, categoria: "zapatillas", deporte: "boxeo", imagen: "boxeo/boxeo1/bproducto2.WEBP", descripcion: "Zapatillas de boxeo profesionales", medidas: "Tallas: 36-46" },
    { id: 32, nombre: "Protector Bucal", precio: 2999, categoria: "equipamiento", deporte: "boxeo", imagen: "boxeo/boxeo1/bproducto3.WEBP", descripcion: "Protector bucal deportivo" },
    { id: 33, nombre: "Guantes boxeo", precio: 34999, categoria: "equipamiento", deporte: "boxeo", imagen: "boxeo/boxeo1/bproducto4.WEBP", descripcion: "Guantes profesionales de boxeo" , medidas: "Tallas: S,M,L"},
    { id: 34, nombre: "short rojo/negro box", precio: 45499, categoria: "shorts", deporte: "boxeo", imagen: "boxeo/boxeo1/bproducto5.WEBP", descripcion: "Short de boxeo profesionales", medidas: "Tallas: S, M, L, XL, XXL" },
    { id: 35, nombre: "Short rosa Mujer box", precio: 45999, categoria: "shorts", deporte: "boxeo", imagen: "boxeo/boxeo1/bproducto6.WEBP", descripcion: "Short de boxeo para mujer" , medidas: "Tallas: S, M, L, XL, XXL"},
    
    // ===== GIMNASIO =====
    { id: 36, nombre: "Hand Grips", precio: 8999, categoria: "accesorios", deporte: "gimnasio", imagen: "gimnasio/gimnasio1/gproducto1.WEBP", descripcion: "Entrenador de antebrazo" },
    { id: 37, nombre: "Straps", precio: 12999, categoria: "accesorios", deporte: "gimnasio", imagen: "gimnasio/gimnasio1/gproducto2.WEBP", descripcion: "Straps de agarre " },
    { id: 38, nombre: "Pesa", precio: 15499, categoria: "equipamiento", deporte: "gimnasio", imagen: "gimnasio/gimnasio1/gproducto3.WEBP", descripcion: "Pesa 5kg" },
    { id: 39, nombre: "Mancuernas", precio: 9999, categoria: "equipamiento", deporte: "gimnasio", imagen: "gimnasio/gimnasio1/gproducto4.WEBP", descripcion: "Mancuernas de 15kg" },
    { id: 40, nombre: "Discos", precio: 5999, categoria: "equipamiento", deporte: "gimnasio", imagen: "gimnasio/gimnasio1/gproducto5.WEBP", descripcion: "Discos de 10kg" },
    
    // ===== RUNNING =====
    { id: 42, nombre: "Zapatillas Running Black", precio: 55999, categoria: "zapatillas", deporte: "running", imagen: "running/running1/rproducto1.WEBP", descripcion: "Zapatillas de running profesionales", medidas: "Tallas: 36-46" },
    { id: 43, nombre: "Short Running", precio: 43999, categoria: "shorts", deporte: "running", imagen: "running/running1/rproducto2.WEBP", descripcion: "Short para running" , medidas: "Tallas: S, M, L, XL, XXL"},
    { id: 44, nombre: "Zapatillas Running", precio: 61999, categoria: "zapatillas", deporte: "running", imagen: "running/running1/rproducto3.WEBP", descripcion: "Zapatillas deportivas para running", medidas: "Tallas: 36-46" },
    { id: 45, nombre: "Shorts Running", precio: 54499, categoria: "shorts", deporte: "running", imagen: "running/running1/rproducto4.WEBP", descripcion: "Shorts para running profesional", medidas: "Tallas: S, M, L, XL, XXL" },
    { id: 46, nombre: "Zapatillas Adidas", precio: 52999, categoria: "zapatillas", deporte: "running", imagen: "running/running1/rproducto5.WEBP", descripcion: "Zapatillas adidas", medidas: "Tallas: 36-46" },
    { id: 47, nombre: "Zapatillas Adidas Black", precio: 60999, categoria: "zapatillas", deporte: "running", imagen: "running/running1/rproducto1.WEBP", descripcion: "Zapatillas adidas black", medidas: "Tallas: 36-46" },
    
  ];
  
  // Guardar productos por defecto en localStorage
  // Persistencia deshabilitada: sin localStorage
  mostrarProductos(productos);
}

function mostrarProductos(productosAMostrar) {
  const grid = document.getElementById('productosGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  if (productosAMostrar.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
        <h3>No se encontraron productos</h3>
        <p>Intenta con otros filtros o categorías</p>
      </div>
    `;
    return;
  }
  
  productosAMostrar.forEach(producto => {
    const card = crearProductoCard(producto);
    grid.appendChild(card);
  });
}

function crearProductoCard(producto) {
  const card = document.createElement('div');
  card.className = 'producto-card';
  card.style.cursor = 'pointer';
  
  // Determinar si es una imagen o un emoji
  const esImagen = producto.imagen.includes('.png') || producto.imagen.includes('.jpg') || producto.imagen.includes('.jpeg') || producto.imagen.includes('.webp') || producto.imagen.includes('.WEBP') || producto.imagen.startsWith('data:image/');
  
  card.innerHTML = `
    <div class="producto-imagen" onclick="abrirModalProducto(${producto.id})" style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #e9ecef;">
      ${esImagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">` : producto.imagen}
    </div>
    <div class="producto-info">
      <h3 class="producto-titulo" onclick="abrirModalProducto(${producto.id})">${producto.nombre}</h3>
      <p class="producto-descripcion">${producto.descripcion}</p>
      <div class="producto-precio">$${producto.precio}</div>
      <div class="producto-acciones">
        <button class="btn-agregar" onclick="event.stopPropagation(); agregarAlCarrito(${producto.id})">
          <i class="fas fa-cart-plus"></i>
          Agregar
        </button>
        <button class="btn-favorito" onclick="event.stopPropagation(); toggleFavorito(${producto.id})">
          <i class="fas fa-heart"></i>
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// ===== FUNCIONES DE DEPORTES =====
function abrirSeccionDeporte(deporte) {
  deporteSeleccionado = deporte;
  
  // Actualizar filtro de deporte
  document.getElementById('deporteFiltro').value = deporte;
  
  // Aplicar filtros
  aplicarFiltros();
  
  // Scroll a la tienda
  scrollToSection('tienda');
  
  // Mostrar notificación
  const nombresDeportes = {
    'futbol': 'Fútbol',
    'basquet': 'Básquet',
    'tenis': 'Tenis',
    'natacion': 'Natación',
    'voley': 'Voley',
    'boxeo': 'Boxeo',
    'gimnasio': 'Gimnasio',
    'running': 'Running'
  };
  
  mostrarNotificacion(`Mostrando productos de ${nombresDeportes[deporte]}`);
}

function filtrarPorCategoria(categoria) {
  document.getElementById('categoriaFiltro').value = categoria;
  aplicarFiltros();
  
  // Mostrar notificación
  const nombresCategorias = {
    'remeras': 'Remeras',
    'pantalones': 'Pantalones',
    'zapatillas': 'Zapatillas',
    'shorts': 'Shorts',
    'buzos': 'Buzos',
    'medias': 'Medias',
    'equipamiento': 'Equipamiento',
    'accesorios': 'Accesorios'
  };
  
  mostrarNotificacion(`Mostrando ${nombresCategorias[categoria]}`);
}

// ===== FILTROS Y BÚSQUEDA =====
function aplicarFiltros() {
  const categoriaFiltro = document.getElementById('categoriaFiltro');
  const deporteFiltro = document.getElementById('deporteFiltro');
  const precioFiltro = document.getElementById('precioFiltro');
  
  const categoria = categoriaFiltro ? categoriaFiltro.value : '';
  const deporte = deporteFiltro ? deporteFiltro.value : '';
  const precio = precioFiltro ? precioFiltro.value : '';
  
  // Obtener el deporte actual de la página si estamos en una subpágina
  const deporteActual = obtenerDeporteActual();
  
  // Si estamos en una subpágina, filtrar por el deporte actual
  let productosFiltrados = deporteActual ? 
    productos.filter(p => p.deporte === deporteActual || p.deporte === 'general') : 
    productos;
  
  if (categoria) {
    productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
  }
  
  // Solo aplicar filtro de deporte si estamos en el index (donde existe el selector)
  if (deporte && deporteFiltro) {
    productosFiltrados = productosFiltrados.filter(p => p.deporte === deporte || p.deporte === 'general');
  }
  
  if (precio) {
    // Mapear los valores del filtro a rangos de precios en pesos argentinos
    let min, max;
    switch(precio) {
      case '0-50':
        min = 0;
        max = 25000;
        break;
      case '50-100':
        min = 25000;
        max = 50000;
        break;
      case '100-200':
        min = 50000;
        max = 100000;
        break;
      case '200+':
        min = 100000;
        max = Infinity;
        break;
      default:
        // Si viene en formato antiguo, intentar parsearlo
        const partes = precio.split('-');
        if (partes.length === 2) {
          min = partes[0] === '+' ? Infinity : Number(partes[0]);
          max = partes[1] === '+' ? Infinity : Number(partes[1]);
        } else {
          min = 0;
          max = Infinity;
        }
    }
    
    productosFiltrados = productosFiltrados.filter(p => {
      if (max === Infinity) return p.precio >= min;
      return p.precio >= min && p.precio <= max;
    });
  }
  
  mostrarProductos(productosFiltrados);
}

function scrollToSection(seccionId) {
  const seccion = document.getElementById(seccionId);
  if (seccion) {
    const header = document.querySelector('.header');
    const headerOffset = header ? header.offsetHeight : 80;
    const elementPosition = seccion.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset - 10;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
}

// ===== CARRITO DE COMPRAS =====
function agregarAlCarrito(productoId) {
  const producto = productos.find(p => p.id === productoId);
  if (!producto) return;
  
  const itemExistente = carrito.find(item => item.id === productoId);
  
  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }
  
  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

function quitarDelCarrito(productoId) {
  carrito = carrito.filter(item => item.id !== productoId);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCantidad(productoId, nuevaCantidad) {
  const item = carrito.find(item => item.id === productoId);
  if (item) {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(productoId);
    } else {
      item.cantidad = nuevaCantidad;
      guardarCarrito();
      actualizarCarrito();
    }
  }
}

function actualizarCarrito() {
  const cartCount = document.querySelector('.cart-count');
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
  
  // Actualizar panel del carrito
  const cartItems = document.getElementById('cartItems');
  if (cartItems) {
    cartItems.innerHTML = '';
    
    if (carrito.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
      return;
    }
    
    carrito.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.nombre}</h4>
          <p>$${item.precio}</p>
        </div>
        <div class="cart-item-controls">
          <button onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
          <span>${item.cantidad}</span>
          <button onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
          <button onclick="quitarDelCarrito(${item.id})" class="remove-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });
  }
  
  // Actualizar total
  const cartTotal = document.getElementById('cartTotal');
  if (cartTotal) {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
}

function guardarCarrito() {
  // Persistencia deshabilitada: sin localStorage
}

function checkout() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  if (!usuarioLogueado) {
    alert('Debes iniciar sesión para continuar');
    document.getElementById('loginModal').style.display = 'block';
    return;
  }
  
  // Aquí iría la lógica de checkout
  alert('¡Gracias por tu compra! Redirigiendo al pago...');
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  cerrarCarrito();
}

// ===== FUNCIONES DEL CARRITO =====
function abrirCarrito() {
  document.getElementById('cartPanel').classList.add('active');
}

function cerrarCarrito() {
  document.getElementById('cartPanel').classList.remove('active');
}

// ===== FUNCIONES DEL PANEL DE USUARIO =====
function cerrarPanel() {
  document.getElementById('userPanel').classList.remove('active');
}

// ===== BÚSQUEDA =====
function inicializarBusqueda() {
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  
  if (searchBtn && searchBar) {
    searchBtn.addEventListener('click', () => {
      searchBar.classList.toggle('active');
      if (searchBar.classList.contains('active')) {
        searchInput.focus();
      }
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length > 0) {
        const resultados = productos.filter(producto => {
          const nombre = producto.nombre.toLowerCase();
          const descripcion = producto.descripcion.toLowerCase();
          const deporte = producto.deporte.toLowerCase();
          const categoria = producto.categoria.toLowerCase();
          
          // Búsqueda por coincidencia exacta o que empiece con la palabra
          return nombre.includes(query) || 
                 nombre.startsWith(query) ||
                 descripcion.includes(query) ||
                 deporte.includes(query) ||
                 categoria.includes(query) ||
                 // Búsqueda por iniciales (ej: "pelo" encuentra "pelota")
                 nombre.split(' ').some(palabra => palabra.startsWith(query));
        });
        mostrarProductos(resultados);
        
        // Mostrar mensaje si no hay resultados
        if (resultados.length === 0) {
          mostrarNotificacion(`No se encontraron productos para "${e.target.value}"`);
        }
      } else {
        mostrarProductos(productos);
      }
    });
  }
}

// ===== SISTEMA DE USUARIOS =====
function mostrarUsuario(nombre) {
  const header = document.querySelector(".header-actions");
  const loginBtn = document.getElementById("loginBtn");
  
  if (!header || !loginBtn) return;
  
  // Botón con avatar + nombre
  const userBtn = document.createElement("button");
  userBtn.classList.add("usuarioLogueado");
  userBtn.innerHTML = `
    <i class="fas fa-user"></i>
    <span>${nombre}</span>
  `;
  
  // Reemplazar login por el botón
  loginBtn.replaceWith(userBtn);
  
  // Evento: abrir panel lateral
  userBtn.addEventListener('click', () => {
    const usuario = usuarios.find(u => u.email === usuarioLogueado.email);
    
    document.getElementById("panelNombre").textContent = usuarioLogueado.nombre;
    document.getElementById("panelEmail").textContent = censurarEmail(usuario.email);
    document.getElementById("panelPass").textContent = censurarPass(usuario.pass);
    
    // Restaurar botones originales
    const userActions = document.querySelector('.user-actions');
    if (userActions) {
      userActions.innerHTML = `
        <button id="editUserBtn" class="btn-edit-enhanced">
          <i class="fas fa-edit"></i>
          <span>Editar Perfil</span>
          <div class="btn-shine"></div>
        </button>
        <button id="logoutBtn" class="btn-logout">
          <i class="fas fa-sign-out-alt"></i>
          Cerrar Sesión
        </button>
      `;
      
      // Agregar botón de panel según el rol
      console.log("Usuario logueado:", usuarioLogueado);
      console.log("Rol del usuario:", usuarioLogueado.rol);
      
      if (usuarioLogueado.rol === 'administrador') {
        console.log("Creando botón de administrador");
        const adminBtn = document.createElement('button');
        adminBtn.className = 'btn-primary';
        adminBtn.innerHTML = '<i class="fas fa-crown"></i> Panel Admin';
        adminBtn.onclick = () => {
          cerrarPanel();
          abrirPanelAdmin();
        };
        userActions.insertBefore(adminBtn, userActions.firstChild);
        console.log("Botón de administrador creado y agregado");
      } else if (usuarioLogueado.rol === 'trabajador') {
        const trabajadorBtn = document.createElement('button');
        trabajadorBtn.className = 'btn-primary';
        trabajadorBtn.innerHTML = '<i class="fas fa-user-tie"></i> Panel Trabajador';
        trabajadorBtn.onclick = () => {
          cerrarPanel();
          abrirPanelTrabajador();
        };
        userActions.insertBefore(trabajadorBtn, userActions.firstChild);
      }
    }
    
    // Inicializar eventos de los botones
    inicializarEventosPanelUsuario();
    
    document.getElementById("userPanel").classList.add("active");
  });
}

// ===== FUNCIONES DE CENSURADO =====
function censurarEmail(email) {
  const [usuario, dominio] = email.split("@");
  if (usuario.length <= 2) return usuario[0] + "*****@" + dominio;
  return usuario.slice(0, 2) + "*****@" + dominio;
}

function censurarPass(pass) {
  if (!pass) return "";
  if (pass.length <= 2) return pass[0] + "******";
  return pass.slice(0, 2) + "*".repeat(pass.length - 2);
}

// ===== FUNCIONES UTILITARIAS =====
function mostrarNotificacion(mensaje) {
  // Crear notificación temporal
  const notificacion = document.createElement('div');
  notificacion.className = 'notificacion';
  notificacion.textContent = mensaje;
  notificacion.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--gradient-primary);
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}

function toggleFavorito(productoId) {
  // Implementar sistema de favoritos
  mostrarNotificacion('Función de favoritos próximamente');
}

// ===== MODAL DE PRODUCTO DETALLADO =====
function abrirModalProducto(productoId) {
  const producto = productos.find(p => p.id === productoId);
  if (!producto) return;
  
  const modal = document.getElementById('productoModal');
  if (!modal) return;
  
  // Determinar si es una imagen o un emoji
  const esImagen = (producto.imagen || '').startsWith('data:image/') || /\.(png|jpg|jpeg|gif|webp)$/i.test(producto.imagen || '');
  
  // Actualizar contenido del modal
  modal.innerHTML = `
    <div class="modal-content producto-modal-content">
      <div class="modal-header">
        <h2>${producto.nombre}</h2>
        <button class="close-modal" onclick="cerrarModalProducto()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="producto-modal-body">
        <div class="producto-imagen-grande">
          ${esImagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='foto_ropa/ropa_1_mujer.jfif'">` : `<div class="emoji-grande">${producto.imagen}</div>`}
        </div>
        
        <div class="producto-detalles">
          <div class="producto-precio-grande">$${producto.precio}</div>
          <p class="producto-descripcion-grande">${producto.descripcion}</p>
          
          <div class="producto-estadisticas">
            <h3>Especificaciones</h3>
            <div class="estadistica-item">
              <span class="estadistica-label">Nombre:</span>
              <span class="estadistica-valor">${producto.nombre}</span>
            </div>
            <div class="estadistica-item">
              <span class="estadistica-label">Categoría:</span>
              <span class="estadistica-valor">${producto.categoria}</span>
            </div>
            <div class="estadistica-item">
              <span class="estadistica-label">Deporte:</span>
              <span class="estadistica-valor">${producto.deporte}</span>
            </div>
            ${producto.medidas ? `
            <div class="estadistica-item">
              <span class="estadistica-label">Medidas:</span>
              <span class="estadistica-valor">${producto.medidas}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="producto-acciones-modal">
            <button class="btn-agregar-modal" onclick="agregarAlCarrito(${producto.id}); cerrarModalProducto();">
              <i class="fas fa-cart-plus"></i>
              Agregar al Carrito
            </button>
            <button class="btn-favorito-modal" onclick="toggleFavorito(${producto.id})">
              <i class="fas fa-heart"></i>
              Favorito
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function cerrarModalProducto() {
  const modal = document.getElementById('productoModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// ===== BUSCADOR DE PRODUCTOS =====
function inicializarBuscadorProductos() {
  const buscadorInput = document.getElementById('buscadorProductos');
  const btnLimpiar = document.querySelector('.btn-limpiar-busqueda');
  
  if (buscadorInput) {
    buscadorInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      // Mostrar/ocultar botón de limpiar
      if (btnLimpiar) {
        btnLimpiar.style.display = query.length > 0 ? 'block' : 'none';
      }
      
      if (query.length > 0) {
        const resultados = productos.filter(producto => {
          const nombre = producto.nombre.toLowerCase();
          const descripcion = producto.descripcion.toLowerCase();
          const deporte = producto.deporte.toLowerCase();
          const categoria = producto.categoria.toLowerCase();
          
          // Búsqueda inteligente por coincidencia exacta, que empiece con la palabra, o por iniciales
          return nombre.includes(query) || 
                 nombre.startsWith(query) ||
                 descripcion.includes(query) ||
                 deporte.includes(query) ||
                 categoria.includes(query) ||
                 // Búsqueda por iniciales (ej: "pelo" encuentra "pelota")
                 nombre.split(' ').some(palabra => palabra.startsWith(query)) ||
                 // Búsqueda por palabras parciales
                 nombre.split(' ').some(palabra => palabra.includes(query));
        });
        
        // Filtrar por deporte si estamos en una página específica
        const deporteActual = obtenerDeporteActual();
        const productosFiltrados = deporteActual ? 
          resultados.filter(p => p.deporte === deporteActual || p.deporte === 'general') : 
          resultados;
          
        mostrarProductos(productosFiltrados);
        
        // Mostrar mensaje si no hay resultados
        if (productosFiltrados.length === 0) {
          mostrarNotificacion(`No se encontraron productos para "${e.target.value}"`);
        }
      } else {
        // Mostrar todos los productos del deporte actual
        const deporteActual = obtenerDeporteActual();
        const productosAMostrar = deporteActual ? 
          productos.filter(p => p.deporte === deporteActual || p.deporte === 'general') : 
          productos;
        mostrarProductos(productosAMostrar);
      }
    });
  }
}

function limpiarBusqueda() {
  const buscadorInput = document.getElementById('buscadorProductos');
  const btnLimpiar = document.querySelector('.btn-limpiar-busqueda');
  
  if (buscadorInput) {
    buscadorInput.value = '';
    if (btnLimpiar) {
      btnLimpiar.style.display = 'none';
    }
    
    // Mostrar todos los productos del deporte actual
    const deporteActual = obtenerDeporteActual();
    const productosAMostrar = deporteActual ? 
      productos.filter(p => p.deporte === deporteActual || p.deporte === 'general') : 
      productos;
    mostrarProductos(productosAMostrar);
  }
}

function obtenerDeporteActual() {
  const path = window.location.pathname;
  if (path.includes('futbol.html')) return 'futbol';
  if (path.includes('basquet.html')) return 'basquet';
  if (path.includes('tenis.html')) return 'tenis';
  if (path.includes('natacion.html')) return 'natacion';
  if (path.includes('voley.html')) return 'voley';
  if (path.includes('boxeo.html')) return 'boxeo';
  if (path.includes('gimnasio.html')) return 'gimnasio';
  if (path.includes('running.html')) return 'running';
  return null;
}

// ===== INICIALIZACIÓN DE EVENTOS =====
function inicializarEventos() {
  // Búsqueda
  inicializarBusqueda();
  
  // Buscador de productos
  inicializarBuscadorProductos();
  
  // Carrito
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', abrirCarrito);
  }
  
  // Login
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      document.getElementById('loginModal').style.display = 'block';
    });
  }
  
  // Formularios
  inicializarFormularios();
  
  // Cerrar modales
  inicializarCierreModales();
  
  // Navegación suave
  inicializarNavegacionSuave();
}

function inicializarFormularios() {
  // Formulario de Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Formulario de Registro
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    
    // Validación en tiempo real para email
    const regEmail = document.getElementById('regEmail');
    const regEmailError = document.getElementById('regEmailError');
    if (regEmail && regEmailError) {
      regEmail.addEventListener('blur', () => {
        const email = regEmail.value.trim();
        if (email) {
          const validacion = validarEmailGmailHotmail(email);
          if (!validacion.valido) {
            regEmailError.textContent = validacion.mensaje;
            regEmailError.style.display = 'block';
            regEmail.style.borderColor = '#e74c3c';
          } else {
            regEmailError.style.display = 'none';
            regEmail.style.borderColor = '#27ae60';
          }
        } else {
          regEmailError.style.display = 'none';
          regEmail.style.borderColor = '';
        }
      });
      
      regEmail.addEventListener('input', () => {
        if (regEmailError.style.display === 'block') {
          regEmailError.style.display = 'none';
          regEmail.style.borderColor = '';
        }
      });
    }
    
    // Validación en tiempo real para contraseña
    const regPassword = document.getElementById('regPassword');
    const regPasswordError = document.getElementById('regPasswordError');
    if (regPassword && regPasswordError) {
      regPassword.addEventListener('blur', () => {
        const pass = regPassword.value;
        if (pass) {
          const validacion = validarContrasena(pass);
          if (!validacion.valido) {
            regPasswordError.textContent = validacion.mensaje;
            regPasswordError.style.display = 'block';
            regPassword.style.borderColor = '#e74c3c';
          } else {
            regPasswordError.style.display = 'none';
            regPassword.style.borderColor = '#27ae60';
          }
        } else {
          regPasswordError.style.display = 'none';
          regPassword.style.borderColor = '';
        }
      });
      
      regPassword.addEventListener('input', () => {
        if (regPasswordError.style.display === 'block') {
          regPasswordError.style.display = 'none';
          regPassword.style.borderColor = '';
        }
      });
    }
  }
  
  // Formulario de Edición
  const editUserForm = document.getElementById('editUserForm');
  if (editUserForm) {
    editUserForm.addEventListener('submit', handleEditUser);
  }
  
  // Formulario de Contacto
  const contactoForm = document.getElementById('contactoForm');
  if (contactoForm) {
    contactoForm.addEventListener('submit', handleContacto);
  }
  
  // Abrir registro desde login
  const openRegister = document.getElementById('openRegister');
  if (openRegister) {
    openRegister.addEventListener('click', () => {
      document.getElementById('loginModal').style.display = 'none';
      document.getElementById('registerModal').style.display = 'block';
    });
  }
  
  // Toggle contraseñas
  inicializarTogglePassword();
}

function inicializarTogglePassword() {
  const toggleLoginPass = document.getElementById('toggleLoginPass');
  const loginPassword = document.getElementById('loginPassword');
  const toggleRegPass = document.getElementById('toggleRegPass');
  const regPassword = document.getElementById('regPassword');
  
  if (toggleLoginPass && loginPassword) {
    toggleLoginPass.addEventListener('click', () => {
      if (loginPassword.type === 'password') {
        loginPassword.type = 'text';
        toggleLoginPass.textContent = '❌👁️';
      } else {
        loginPassword.type = 'password';
        toggleLoginPass.textContent = '👁️';
      }
    });
  }
  
  if (toggleRegPass && regPassword) {
    toggleRegPass.addEventListener('click', () => {
      if (regPassword.type === 'password') {
        regPassword.type = 'text';
        toggleRegPass.textContent = '❌👁️';
      } else {
        regPassword.type = 'password';
        toggleRegPass.textContent = '👁️';
      }
    });
  }
}

function inicializarCierreModales() {
  // Cerrar modales si clickea afuera
  window.addEventListener('click', function(event) {
    const modals = ['loginModal', 'registerModal', 'logoutModal', 'editUserModal', 'productoModal'];
    modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (event.target === modal) {
        if (modalId === 'productoModal') {
          cerrarModalProducto();
        } else {
          cerrarModal(modalId);
        }
      }
    });
  });
  
  // Botones de cerrar
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
}

function inicializarNavegacionSuave() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#')) {
        e.preventDefault();
        scrollToSection(href.substring(1));
        return;
      }

      if (href.includes('#')) {
        e.preventDefault();
        window.location.href = href;
        return;
      }
    });
  });
}


// ===== MANEJADORES DE FORMULARIOS =====
async function handleLogin(e) {
  e.preventDefault();
  const nombre = document.getElementById('loginNombre').value;
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;

  try {
    const resp = await fetch('login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, pass })
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.ok) {
      const msg = (data && data.error) ? data.error : 'Error al iniciar sesión';
      mostrarNotificacion(msg);
      return;
    }
    const u = data.usuario;
    usuarioLogueado = { nombre: u.nombre || nombre, email: u.email, rol: u.rol || 'cliente' };
    cerrarModal('loginModal');
    mostrarUsuario(usuarioLogueado.nombre);
    mostrarNotificacion(`¡Bienvenido, ${usuarioLogueado.nombre}!`);
  } catch (err) {
    console.error('Login error:', err);
    mostrarNotificacion('No se pudo conectar con el servidor');
  }
}

// ===== VALIDACIONES DE SEGURIDAD =====
function validarEmailGmailHotmail(email) {
  const emailLower = email.toLowerCase().trim();
  // Validar formato de email básico
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
    return { valido: false, mensaje: 'El formato del email no es válido' };
  }
  
  // Extraer el dominio
  const dominio = emailLower.split('@')[1];
  
  // Validar que sea Gmail o Hotmail/Outlook
  const dominiosPermitidos = ['gmail.com', 'hotmail.com', 'hotmail.es', 'outlook.com', 'outlook.es', 'live.com', 'live.es'];
  
  if (!dominiosPermitidos.includes(dominio)) {
    return { 
      valido: false, 
      mensaje: 'Solo se permiten cuentas de Gmail o Hotmail/Outlook. Por favor, usa un email válido de estos servicios.' 
    };
  }
  
  return { valido: true };
}

function validarContrasena(pass) {
  // Validar longitud: mínimo 6, máximo 14 caracteres
  if (pass.length < 6) {
    return { valido: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (pass.length > 14) {
    return { valido: false, mensaje: 'La contraseña no puede tener más de 14 caracteres' };
  }
  
  // Validar que tenga al menos una mayúscula
  if (!/[A-Z]/.test(pass)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos una letra mayúscula' };
  }
  
  // Validar que tenga al menos un signo/carácter especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos un signo especial (!@#$%^&*()_+-=[]{}|;:,.<>?)' };
  }
  
  return { valido: true };
}

async function handleRegister(e) {
  e.preventDefault();
  
  const nombre = document.getElementById('regNombre').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;

  // Validar campos vacíos
  if (!nombre || !email || !pass) {
    mostrarNotificacion('Por favor complete todos los campos');
    return;
  }

  // Validar email (solo Gmail o Hotmail)
  const validacionEmail = validarEmailGmailHotmail(email);
  if (!validacionEmail.valido) {
    mostrarNotificacion(validacionEmail.mensaje);
    return;
  }

  // Validar contraseña
  const validacionPass = validarContrasena(pass);
  if (!validacionPass.valido) {
    mostrarNotificacion(validacionPass.mensaje);
    return;
  }

  try {
    const resp = await fetch('registro.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, email, pass })
    });
    
    const data = await resp.json().catch(() => ({}));
    
    if (!resp.ok || !data.ok) {
      const msg = (data && data.error) ? data.error : 'Error al registrar';
      mostrarNotificacion(msg);
      return;
    }
    
    // Usar los datos devueltos por el servidor
    usuarioLogueado = data.usuario;
    cerrarModal('registerModal');
    mostrarUsuario(usuarioLogueado.nombre);
    mostrarNotificacion(`¡Cuenta creada exitosamente, ${usuarioLogueado.nombre}!`);
    document.getElementById('registerForm').reset();
  } catch (err) {
    console.error('Register error:', err);
    mostrarNotificacion('No se pudo conectar con el servidor');
  }
}

function handleEditUser(e) {
  e.preventDefault();
  const nuevoNombre = document.getElementById('editNombre').value;
  const nuevoEmail = document.getElementById('editEmail').value;
  const nuevoPass = document.getElementById('editPassword').value;
  
  // Buscar usuario actual
  const index = usuarios.findIndex(u => u.email === usuarioLogueado.email);
  
  if (index !== -1) {
    // Actualizar datos manteniendo el rol
    const rolActual = usuarios[index].rol || 'cliente';
    usuarios[index] = { nombre: nuevoNombre, email: nuevoEmail, pass: nuevoPass, rol: rolActual };
    // Persistencia deshabilitada: sin localStorage
    
    // Actualizar usuario logueado
    usuarioLogueado = { nombre: nuevoNombre, email: nuevoEmail, rol: rolActual };
    // Persistencia deshabilitada: sin localStorage
    
    cerrarModal('editUserModal');
    location.reload(); // recargar para refrescar header + panel
  }
}

// ===== FUNCIONES DE MODALES =====
function handleContacto(e) {
  e.preventDefault();
  const nombre = document.getElementById('contactoNombre').value;
  const email = document.getElementById('contactoEmail').value;
  const mensaje = document.getElementById('contactoMensaje').value;
  
  enviarConsulta(nombre, email, mensaje);
  
  // Limpiar formulario
  document.getElementById('contactoForm').reset();
}

// ===== FUNCIÓN PARA ENVIAR CONSULTAS =====
function enviarConsulta(nombre, email, mensaje) {
  const consulta = {
    id: Date.now(),
    nombre,
    email,
    mensaje,
    fecha: new Date().toISOString(),
    respuesta: null,
    fechaRespuesta: null,
    respondidoPor: null
  };
  
  consultas.push(consulta);
  // Persistencia deshabilitada: sin localStorage
  
  mostrarNotificacion('Consulta enviada exitosamente. Te responderemos pronto.');
}

// ===== FUNCIONES DE MODALES =====
function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Función para inicializar eventos del panel de usuario
function inicializarEventosPanelUsuario() {
  // Botón de cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      document.getElementById('logoutModal').style.display = 'block';
    });
  }
  
  // Confirmar logout
  const confirmLogout = document.getElementById('confirmLogout');
  if (confirmLogout) {
    confirmLogout.addEventListener('click', async () => {
      try {
        // Cerrar sesión en el servidor
        await fetch('logout.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
      usuarioLogueado = null;
      cerrarModal('logoutModal');
      location.reload();
    });
  }
  
  // Botón abrir modal de edición
  const editUserBtn = document.getElementById('editUserBtn');
  if (editUserBtn) {
    editUserBtn.addEventListener('click', () => {
      const usuario = usuarios.find(u => u.email === usuarioLogueado.email);
      
      document.getElementById('editNombre').value = usuarioLogueado.nombre;
      document.getElementById('editEmail').value = usuarioLogueado.email;
      document.getElementById('editPassword').value = usuario.pass || '';
      
      document.getElementById('editUserModal').style.display = 'block';
    });
  }
}

// ===== EVENTOS ADICIONALES =====
document.addEventListener('DOMContentLoaded', function() {
  // Estos eventos se manejan dinámicamente en mostrarUsuario()
});

// ===== SISTEMA DE ROLES Y PANELES =====

// ===== PANEL DE ADMINISTRADOR =====
function abrirPanelAdmin() {
  const modal = document.getElementById('adminPanel');
  if (!modal) {
    crearPanelAdmin();
  }
  document.getElementById('adminPanel').style.display = 'block';
}

function crearPanelAdmin() {
  const modal = document.createElement('div');
  modal.id = 'adminPanel';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content admin-panel-content-modern">
      <div class="admin-header-modern">
        <div class="admin-header-left">
          <i class="fas fa-crown admin-crown"></i>
          <h2>Panel de Administrador</h2>
        </div>
        <button class="close-modal-modern" onclick="cerrarModal('adminPanel')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="admin-tabs-modern">
        <button class="tab-btn-modern active" onclick="cambiarTabAdmin('trabajadores')">
          <i class="fas fa-users"></i> 
          <span>Trabajadores</span>
        </button>
        <button class="tab-btn-modern" onclick="cambiarTabAdmin('catalogos')">
          <i class="fas fa-box"></i> 
          <span>Catálogos</span>
        </button>
        <button class="tab-btn-modern" onclick="cambiarTabAdmin('consultas')">
          <i class="fas fa-comments"></i> 
          <span>Consultas</span>
        </button>
      </div>
      
      <div class="admin-content-modern">
        <div id="tab-trabajadores" class="tab-content-modern active">
          <div class="section-header-modern">
            <div class="section-title-modern">
              <i class="fas fa-users-cog"></i>
              <h3>Gestión de Trabajadores</h3>
            </div>
            <button class="btn-primary-modern" onclick="abrirModalAgregarTrabajador()">
              <i class="fas fa-user-plus"></i> 
              <span>Agregar Trabajador</span>
            </button>
          </div>
          <div id="listaTrabajadores" class="lista-trabajadores-modern">
            <!-- Lista de trabajadores -->
          </div>
        </div>
        
        <div id="tab-catalogos" class="tab-content-modern">
          <div class="section-header-modern">
            <div class="section-title-modern">
              <i class="fas fa-shopping-bag"></i>
              <h3>Gestión de Catálogos</h3>
            </div>
            <button class="btn-primary-modern" onclick="abrirModalAgregarProducto()">
              <i class="fas fa-plus"></i> 
              <span>Agregar Producto</span>
            </button>
          </div>
          <div id="listaProductos" class="lista-productos-modern">
            <!-- Lista de productos -->
          </div>
        </div>
        
        <div id="tab-consultas" class="tab-content-modern">
          <div class="section-header-modern">
            <div class="section-title-modern">
              <i class="fas fa-headset"></i>
              <h3>Consultas de Clientes</h3>
            </div>
          </div>
          <div id="listaConsultas" class="lista-consultas-modern">
            <!-- Lista de consultas -->
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  cargarDatosAdmin();
}

function cambiarTabAdmin(tab) {
  // Remover active de todos los tabs (usar las nuevas clases)
  document.querySelectorAll('.tab-btn-modern').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content-modern').forEach(content => content.classList.remove('active'));
  
  // Activar tab seleccionado
  event.target.classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
  
  // Cargar datos del tab
  if (tab === 'trabajadores') {
    cargarTrabajadores();
  } else if (tab === 'catalogos') {
    cargarProductosAdmin();
  } else if (tab === 'consultas') {
    cargarConsultas();
  }
}

function cargarDatosAdmin() {
  cargarTrabajadores();
  cargarProductosAdmin();
  cargarConsultas();
}

function cargarTrabajadores() {
  const lista = document.getElementById('listaTrabajadores');
  if (!lista) return;
  
  const trabajadoresData = trabajadores.length > 0 ? trabajadores : 
    usuarios.filter(u => u.rol === 'trabajador');
  
  if (trabajadoresData.length === 0) {
    lista.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 40px; color: #666;">
        <i class="fas fa-users" style="font-size: 48px; margin-bottom: 20px; color: #ddd;"></i>
        <h3>No hay trabajadores registrados</h3>
        <p>Agrega el primer trabajador para comenzar a gestionar tu equipo</p>
      </div>
    `;
    return;
  }
  
  lista.innerHTML = trabajadoresData.map(trabajador => `
    <div class="trabajador-item">
      <div class="trabajador-info">
        <div class="trabajador-datos">
          <h5>${trabajador.nombre}</h5>
          <p>${trabajador.email}</p>
          <div class="permisos-badges">
            ${trabajador.permisos?.contactos ? '<span class="permiso-badge contactos">Contactos</span>' : ''}
            ${trabajador.permisos?.catalogos ? '<span class="permiso-badge catalogos">Catálogos</span>' : ''}
            ${trabajador.permisos?.usuarios ? '<span class="permiso-badge usuarios">Usuarios</span>' : ''}
            ${trabajador.permisos?.reportes ? '<span class="permiso-badge reportes">Reportes</span>' : ''}
          </div>
        </div>
        <div class="trabajador-actions">
          <button class="btn-editar-trabajador" onclick="editarTrabajador('${trabajador.email}')">
            <i class="fas fa-edit"></i>
            Editar
          </button>
          <button class="btn-eliminar-trabajador" onclick="eliminarTrabajador('${trabajador.email}')">
            <i class="fas fa-trash"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function cargarProductosAdmin() {
  const lista = document.getElementById('listaProductos');
  if (!lista) return;
  
  if (productos.length === 0) {
    lista.innerHTML = '<p class="empty-state">No hay productos registrados</p>';
    return;
  }
  
  lista.innerHTML = productos.map(producto => `
    <div class="producto-item">
      <div class="producto-imagen-mini">
        ${producto.imagen.includes('.png') || producto.imagen.includes('.jpg') || producto.imagen.startsWith('data:image/') ? 
          `<img src="${producto.imagen}" alt="${producto.nombre}">` : 
          `<div class="emoji-mini">${producto.imagen}</div>`}
      </div>
      <div class="producto-info">
        <h4>${producto.nombre}</h4>
        <p>ARS $${producto.precio} - ${producto.categoria} - ${producto.deporte}</p>
      </div>
      <div class="producto-acciones">
        <button class="btn-edit" onclick="editarProducto(${producto.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-delete" onclick="eliminarProducto(${producto.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function cargarConsultas() {
  const lista = document.getElementById('listaConsultas');
  if (!lista) return;
  
  if (consultas.length === 0) {
    lista.innerHTML = '<p class="empty-state">No hay consultas pendientes</p>';
    return;
  }
  
  lista.innerHTML = consultas.map((consulta, index) => `
    <div class="consulta-item ${consulta.respuesta ? 'respondida' : 'pendiente'}">
      <div class="consulta-header">
        <h4>${consulta.nombre}</h4>
        <span class="consulta-fecha">${new Date(consulta.fecha).toLocaleDateString()}</span>
        <span class="consulta-estado">${consulta.respuesta ? 'Respondida' : 'Pendiente'}</span>
      </div>
      <div class="consulta-content">
        <p><strong>Email:</strong> ${consulta.email}</p>
        <p><strong>Mensaje:</strong> ${consulta.mensaje}</p>
        ${consulta.respuesta ? `
          <div class="respuesta">
            <strong>Respuesta:</strong> ${consulta.respuesta}
          </div>
        ` : `
          <div class="responder-form">
            <textarea placeholder="Escribe tu respuesta..." id="respuesta-${index}"></textarea>
            <button class="btn-primary" onclick="responderConsulta(${index})">
              <i class="fas fa-reply"></i> Responder
            </button>
          </div>
        `}
      </div>
    </div>
  `).join('');
}

// ===== FUNCIONES PARA GESTIONAR TRABAJADORES =====
function abrirModalAgregarTrabajador() {
  // Cerrar modal si ya existe
  const modalExistente = document.getElementById('modalAgregarTrabajador');
  if (modalExistente) {
    modalExistente.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'modalAgregarTrabajador';
  modal.className = 'modal-trabajador';
  modal.style.display = 'flex';
  
  modal.innerHTML = `
    <div class="modal-trabajador-content">
      <div class="modal-trabajador-header">
        <h3><i class="fas fa-user-plus"></i> Agregar Trabajador</h3>
        <button class="close-modal" onclick="cerrarModalTrabajador()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-trabajador-body">
        <form id="formAgregarTrabajador">
          <div class="form-group">
            <label for="trabajadorNombre"><i class="fas fa-user"></i> Nombre del Trabajador</label>
            <input type="text" id="trabajadorNombre" placeholder="Escribe el nombre completo" required>
          </div>
          
          <div class="form-group">
            <label for="trabajadorEmail"><i class="fas fa-envelope"></i> Gmail del Trabajador</label>
            <input type="email" id="trabajadorEmail" placeholder="trabajador@ejemplo.com" required>
          </div>
          
          <div class="form-group">
            <label for="trabajadorPass"><i class="fas fa-lock"></i> Contraseña del Trabajador</label>
            <input type="password" id="trabajadorPass" placeholder="Escribe una contraseña segura" required>
          </div>
          
          <div class="permisos-section">
            <h4><i class="fas fa-shield-alt"></i> Permisos del Trabajador</h4>
            <div class="permisos-grid">
              <div class="permiso-item">
                <input type="checkbox" id="permisoContactos" checked>
                <label for="permisoContactos">Responder contactos y consultas</label>
              </div>
              <div class="permiso-item">
                <input type="checkbox" id="permisoCatalogos" checked>
                <label for="permisoCatalogos">Editar, borrar o agregar catálogos</label>
              </div>
              <div class="permiso-item">
                <input type="checkbox" id="permisoUsuarios">
                <label for="permisoUsuarios">Gestionar otros trabajadores</label>
              </div>
              <div class="permiso-item">
                <input type="checkbox" id="permisoReportes">
                <label for="permisoReportes">Ver reportes y estadísticas</label>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div class="modal-trabajador-footer">
        <button type="button" class="btn-cancelar" onclick="cerrarModalTrabajador()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" class="btn-guardar" onclick="guardarTrabajador()">
          <i class="fas fa-save"></i> Crear Trabajador
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function cerrarModalTrabajador() {
  const modal = document.getElementById('modalAgregarTrabajador');
  if (modal) {
    modal.remove();
  }
}

function guardarTrabajador() {
  const nombre = document.getElementById('trabajadorNombre').value.trim();
  const email = document.getElementById('trabajadorEmail').value.trim();
  const pass = document.getElementById('trabajadorPass').value;
  const permisoContactos = document.getElementById('permisoContactos').checked;
  const permisoCatalogos = document.getElementById('permisoCatalogos').checked;
  const permisoUsuarios = document.getElementById('permisoUsuarios').checked;
  const permisoReportes = document.getElementById('permisoReportes').checked;
  
  // Validaciones
  if (!nombre) {
    mostrarNotificacion('Debes escribir un nombre');
    return;
  }
  
  if (!email) {
    mostrarNotificacion('Debes escribir un gmail');
    return;
  }
  
  if (!pass) {
    mostrarNotificacion('Debes escribir una contraseña');
    return;
  }
  
  // Verificar si ya existe
  if (usuarios.find(u => u.email === email)) {
    mostrarNotificacion('Este gmail ya está registrado');
    return;
  }
  
  // Crear trabajador con permisos
  const nuevoTrabajador = { 
    nombre, 
    email, 
    pass, 
    rol: 'trabajador',
    permisos: {
      contactos: permisoContactos,
      catalogos: permisoCatalogos,
      usuarios: permisoUsuarios,
      reportes: permisoReportes
    }
  };
  
  usuarios.push(nuevoTrabajador);
  trabajadores.push(nuevoTrabajador);
  // Persistencia deshabilitada: sin localStorage
  
  cerrarModalTrabajador();
  cargarTrabajadores();
  mostrarNotificacion(`Trabajador "${nombre}" creado exitosamente`);
}

function editarTrabajador(email) {
  console.log('🔧 FUNCIÓN editarTrabajador EJECUTADA');
  console.log('📧 Email recibido:', email);
  console.log('📋 Trabajadores disponibles:', trabajadores);
  console.log('👥 Usuarios disponibles:', usuarios);
  
  // Buscar en trabajadores primero, luego en usuarios
  let trabajador = trabajadores.find(t => t.email === email);
  if (!trabajador) {
    trabajador = usuarios.find(u => u.email === email && u.rol === 'trabajador');
  }
  
  if (!trabajador) {
    console.log('❌ Trabajador no encontrado');
    mostrarNotificacion('Trabajador no encontrado');
    return;
  }
  
  console.log('✅ Trabajador encontrado:', trabajador);
  
  // Cerrar modal si ya existe
  const modalExistente = document.getElementById('modalEditarTrabajador');
  if (modalExistente) {
    modalExistente.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'modalEditarTrabajador';
  modal.className = 'modal-trabajador';
  modal.style.display = 'flex';
  
  modal.innerHTML = `
    <div class="modal-trabajador-content">
      <div class="modal-trabajador-header">
        <h3><i class="fas fa-user-edit"></i> Editar Trabajador</h3>
        <button class="close-modal" onclick="cerrarModalEditarTrabajador()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-trabajador-body">
        <form id="formEditarTrabajador">
          <div class="form-group">
            <label for="editTrabajadorNombre"><i class="fas fa-user"></i> Nombre del Trabajador</label>
            <input type="text" id="editTrabajadorNombre" value="${trabajador.nombre}" required>
          </div>
          
          <div class="form-group">
            <label for="editTrabajadorEmail"><i class="fas fa-envelope"></i> Gmail del Trabajador</label>
            <input type="email" id="editTrabajadorEmail" value="${trabajador.email}" required>
          </div>
          
          <div class="form-group">
            <label for="editTrabajadorPass"><i class="fas fa-lock"></i> Nueva Contraseña</label>
            <input type="password" id="editTrabajadorPass" placeholder="Deja vacío para mantener la actual">
          </div>
          
          <div class="permisos-section">
            <h4><i class="fas fa-shield-alt"></i> Permisos</h4>
            <div class="permiso-item">
              <label for="editPermisoContactos">Responder contactos y consultas</label>
              <input type="checkbox" id="editPermisoContactos" ${trabajador.permisos?.contactos ? 'checked' : ''}>
            </div>
            <div class="permiso-item">
              <label for="editPermisoCatalogos">Editar, borrar o agregar catálogos</label>
              <input type="checkbox" id="editPermisoCatalogos" ${trabajador.permisos?.catalogos ? 'checked' : ''}>
            </div>
            <div class="permiso-item">
              <label for="editPermisoUsuarios">Gestionar otros trabajadores</label>
              <input type="checkbox" id="editPermisoUsuarios" ${trabajador.permisos?.usuarios ? 'checked' : ''}>
            </div>
            <div class="permiso-item">
              <label for="editPermisoReportes">Ver reportes y estadísticas</label>
              <input type="checkbox" id="editPermisoReportes" ${trabajador.permisos?.reportes ? 'checked' : ''}>
            </div>
          </div>
        </form>
      </div>
      
      <div class="modal-trabajador-footer">
        <button type="button" class="btn-cancelar" onclick="cerrarModalEditarTrabajador()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="button" class="btn-guardar" onclick="actualizarTrabajador('${email}')">
          <i class="fas fa-save"></i> Guardar Cambios
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  console.log('✅ Modal de editar trabajador creado y agregado al DOM');
  
  // Forzar el display del modal
  modal.style.display = 'flex';
  modal.style.zIndex = '10001';
  
  // Marcar que el modal está abierto para control de cambios
  modal.dataset.hasChanges = 'false';
  
  // Agregar event listeners para detectar cambios
  const inputs = modal.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      modal.dataset.hasChanges = 'true';
    });
  });
}

function cerrarModalEditarTrabajador() {
  const modal = document.getElementById('modalEditarTrabajador');
  if (modal) {
    // Verificar si hay cambios sin guardar
    if (modal.dataset.hasChanges === 'true') {
      if (confirm('¿Estás seguro de que quieres salir sin guardar los cambios?')) {
        modal.remove();
      }
    } else {
      modal.remove();
    }
  }
}

function togglePermisosEditar() {
  const permisosSection = document.getElementById('permisosEditarSection');
  if (permisosSection) {
    if (permisosSection.style.display === 'none') {
      permisosSection.style.display = 'block';
    } else {
      permisosSection.style.display = 'none';
    }
  }
}

function actualizarTrabajador(emailOriginal) {
  const nuevoNombre = document.getElementById('editTrabajadorNombre').value.trim();
  const nuevoEmail = document.getElementById('editTrabajadorEmail').value.trim();
  const nuevoPass = document.getElementById('editTrabajadorPass').value;
  
  // Obtener permisos (pueden no existir si no se abrió la sección)
  const permisoContactos = document.getElementById('editPermisoContactos')?.checked || false;
  const permisoCatalogos = document.getElementById('editPermisoCatalogos')?.checked || false;
  const permisoUsuarios = document.getElementById('editPermisoUsuarios')?.checked || false;
  const permisoReportes = document.getElementById('editPermisoReportes')?.checked || false;
  
  // Validaciones
  if (!nuevoNombre) {
    mostrarNotificacion('Debes escribir un nombre');
    return;
  }
  
  if (!nuevoEmail) {
    mostrarNotificacion('Debes escribir un gmail');
    return;
  }
  
  // Verificar si el nuevo email ya existe (excepto para el mismo trabajador)
  const emailExistente = usuarios.find(u => u.email === nuevoEmail && u.email !== emailOriginal);
  if (emailExistente) {
    mostrarNotificacion('Este gmail ya está registrado por otro usuario');
    return;
  }
  
  // Obtener permisos actuales si no se modificaron
  const trabajadorActual = trabajadores.find(t => t.email === emailOriginal);
  const permisosActuales = trabajadorActual?.permisos || {
    contactos: false,
    catalogos: false,
    usuarios: false,
    reportes: false
  };
  
  // Actualizar en usuarios
  const usuarioIndex = usuarios.findIndex(u => u.email === emailOriginal);
  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex] = { 
      ...usuarios[usuarioIndex],
      nombre: nuevoNombre, 
      email: nuevoEmail, 
      pass: nuevoPass || usuarios[usuarioIndex].pass,
      permisos: {
        contactos: permisoContactos,
        catalogos: permisoCatalogos,
        usuarios: permisoUsuarios,
        reportes: permisoReportes
      }
    };
  }
  
  // Actualizar en trabajadores
  const trabajadorIndex = trabajadores.findIndex(t => t.email === emailOriginal);
  if (trabajadorIndex !== -1) {
    trabajadores[trabajadorIndex] = { 
      ...trabajadores[trabajadorIndex],
      nombre: nuevoNombre, 
      email: nuevoEmail, 
      pass: nuevoPass || trabajadores[trabajadorIndex].pass,
      permisos: {
        contactos: permisoContactos,
        catalogos: permisoCatalogos,
        usuarios: permisoUsuarios,
        reportes: permisoReportes
      }
    };
  }
  
  // Persistencia deshabilitada: sin localStorage
  
  // Cerrar modal sin confirmación ya que se guardó
  const modal = document.getElementById('modalEditarTrabajador');
  if (modal) {
    modal.remove();
  }
  
  cargarTrabajadores();
  mostrarNotificacion('Trabajador actualizado exitosamente');
}

function eliminarTrabajador(email) {
  if (confirm('¿Estás seguro de que quieres eliminar este trabajador? Esta acción no se puede deshacer.')) {
    // Eliminar de usuarios
    usuarios = usuarios.filter(u => u.email !== email);
    // Eliminar de trabajadores
    trabajadores = trabajadores.filter(t => t.email !== email);
    
    // Persistencia deshabilitada: sin localStorage
    
    cargarTrabajadores();
    mostrarNotificacion('Trabajador eliminado exitosamente');
  }
}

// Función de prueba para verificar que los botones funcionan
window.testEditarTrabajador = function(email) {
  console.log('🧪 PRUEBA: Intentando editar trabajador con email:', email);
  editarTrabajador(email);
};

// ===== PANEL DE TRABAJADOR =====
function abrirPanelTrabajador() {
  const modal = document.getElementById('trabajadorPanel');
  if (!modal) {
    crearPanelTrabajador();
  }
  document.getElementById('trabajadorPanel').style.display = 'block';
}

function crearPanelTrabajador() {
  // Obtener permisos del trabajador actual
  const trabajadorActual = usuarios.find(u => u.email === usuarioLogueado.email);
  const permisos = trabajadorActual?.permisos || { contactos: true, catalogos: true };
  
  const modal = document.createElement('div');
  modal.id = 'trabajadorPanel';
  modal.className = 'modal';
  
  // Construir tabs dinámicamente según permisos
  let tabsHTML = '';
  let contentHTML = '';
  
  if (permisos.catalogos) {
    tabsHTML += `
      <button class="tab-btn active" onclick="cambiarTabTrabajador('catalogos')">
        <i class="fas fa-box"></i> Catálogos
      </button>
    `;
    contentHTML += `
      <div id="tab-trabajador-catalogos" class="tab-content active">
        <div class="section-header">
          <h3>Gestión de Catálogos</h3>
          <button class="btn-primary" onclick="abrirModalAgregarProducto()">
            <i class="fas fa-plus"></i> Agregar Producto
          </button>
        </div>
        <div id="listaProductosTrabajador" class="lista-productos">
          <!-- Lista de productos -->
        </div>
      </div>
    `;
  }
  
  if (permisos.contactos) {
    tabsHTML += `
      <button class="tab-btn ${!permisos.catalogos ? 'active' : ''}" onclick="cambiarTabTrabajador('consultas')">
        <i class="fas fa-comments"></i> Consultas
      </button>
    `;
    contentHTML += `
      <div id="tab-trabajador-consultas" class="tab-content ${!permisos.catalogos ? 'active' : ''}">
        <div class="section-header">
          <h3>Consultas de Clientes</h3>
        </div>
        <div id="listaConsultasTrabajador" class="lista-consultas">
          <!-- Lista de consultas -->
        </div>
      </div>
    `;
  }
  
  modal.innerHTML = `
    <div class="modal-content trabajador-panel-content">
      <div class="modal-header">
        <i class="fas fa-user-tie"></i>
        <h2>Panel de Trabajador</h2>
        <button class="close-modal" onclick="cerrarModal('trabajadorPanel')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="trabajador-tabs">
        ${tabsHTML}
      </div>
      
      <div class="trabajador-content">
        ${contentHTML}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  cargarDatosTrabajador();
}

function cambiarTabTrabajador(tab) {
  // Obtener permisos del trabajador actual
  const trabajadorActual = usuarios.find(u => u.email === usuarioLogueado.email);
  const permisos = trabajadorActual?.permisos || { contactos: true, catalogos: true };
  
  // Remover active de todos los tabs
  document.querySelectorAll('.trabajador-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.trabajador-content .tab-content').forEach(content => content.classList.remove('active'));
  
  // Activar tab seleccionado
  const tabBtn = document.querySelector(`.trabajador-tabs .tab-btn[onclick*="${tab}"]`);
  const tabContent = document.getElementById(`tab-trabajador-${tab}`);
  
  if (tabBtn) tabBtn.classList.add('active');
  if (tabContent) tabContent.classList.add('active');
  
  // Cargar datos según el tab y permisos
  if (tab === 'catalogos' && permisos.catalogos) {
    cargarProductosTrabajador();
  } else if (tab === 'consultas' && permisos.contactos) {
    cargarConsultasTrabajador();
  }
}

function cargarDatosTrabajador() {
  // Obtener permisos del trabajador actual
  const trabajadorActual = usuarios.find(u => u.email === usuarioLogueado.email);
  const permisos = trabajadorActual?.permisos || { contactos: true, catalogos: true };
  
  // Solo cargar las secciones según los permisos
  if (permisos.catalogos) {
    cargarProductosTrabajador();
  }
  if (permisos.contactos) {
    cargarConsultasTrabajador();
  }
}

function cargarProductosTrabajador() {
  const lista = document.getElementById('listaProductosTrabajador');
  if (!lista) return;
  
  if (productos.length === 0) {
    lista.innerHTML = '<p class="empty-state">No hay productos registrados</p>';
    return;
  }
  
  lista.innerHTML = productos.map(producto => `
    <div class="producto-item">
      <div class="producto-imagen-mini">
        ${producto.imagen.includes('.png') || producto.imagen.includes('.jpg') || producto.imagen.startsWith('data:image/') ? 
          `<img src="${producto.imagen}" alt="${producto.nombre}">` : 
          `<div class="emoji-mini">${producto.imagen}</div>`}
      </div>
      <div class="producto-info">
        <h4>${producto.nombre}</h4>
        <p>ARS $${producto.precio} - ${producto.categoria} - ${producto.deporte}</p>
      </div>
      <div class="producto-acciones">
        <button class="btn-edit" onclick="editarProducto(${producto.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-delete" onclick="eliminarProducto(${producto.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function cargarConsultasTrabajador() {
  const lista = document.getElementById('listaConsultasTrabajador');
  if (!lista) return;
  
  if (consultas.length === 0) {
    lista.innerHTML = '<p class="empty-state">No hay consultas pendientes</p>';
    return;
  }
  
  lista.innerHTML = consultas.map((consulta, index) => `
    <div class="consulta-item ${consulta.respuesta ? 'respondida' : 'pendiente'}">
      <div class="consulta-header">
        <h4>${consulta.nombre}</h4>
        <span class="consulta-fecha">${new Date(consulta.fecha).toLocaleDateString()}</span>
        <span class="consulta-estado">${consulta.respuesta ? 'Respondida' : 'Pendiente'}</span>
      </div>
      <div class="consulta-content">
        <p><strong>Email:</strong> ${consulta.email}</p>
        <p><strong>Mensaje:</strong> ${consulta.mensaje}</p>
        ${consulta.respuesta ? `
          <div class="respuesta">
            <strong>Respuesta:</strong> ${consulta.respuesta}
          </div>
        ` : `
          <div class="responder-form">
            <textarea placeholder="Escribe tu respuesta..." id="respuesta-trabajador-${index}"></textarea>
            <button class="btn-primary" onclick="responderConsulta(${index})">
              <i class="fas fa-reply"></i> Responder
            </button>
          </div>
        `}
      </div>
    </div>
  `).join('');
}

// ===== FUNCIONES DE GESTIÓN =====

// Gestión de Trabajadores
function abrirModalCrearTrabajador() {
  abrirModalAgregarTrabajador();
}

function abrirModalAgregarTrabajador() {
  // Cerrar modal si ya existe
  const modalExistente = document.getElementById('modalAgregarTrabajador');
  if (modalExistente) {
    modalExistente.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'modalAgregarTrabajador';
  modal.className = 'modal';
  modal.style.display = 'block';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <i class="fas fa-user-plus"></i>
        <h2>Agregar Trabajador</h2>
        <button class="close-modal" onclick="cerrarModal('modalAgregarTrabajador')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form id="formAgregarTrabajador">
        <div class="form-group">
          <label for="trabajadorNombre">Nombre:</label>
          <input type="text" id="trabajadorNombre" placeholder="Escribe el nombre" required>
        </div>
        
        <div class="form-group">
          <label for="trabajadorEmail">Gmail:</label>
          <input type="email" id="trabajadorEmail" placeholder="Escribe el gmail" required>
        </div>
        
        <div class="form-group">
          <label for="trabajadorPass">Contraseña:</label>
          <input type="password" id="trabajadorPass" placeholder="Escribe la contraseña" required>
        </div>
        
        <div class="form-group">
          <button type="button" class="btn-permisos" onclick="mostrarPermisos()">
            <i class="fas fa-cog"></i> Permisos
          </button>
        </div>
        
        <div id="permisosSection" class="permisos-section" style="display: none;">
          <h4>Permisos del Trabajador:</h4>
          <div class="permisos-checkboxes">
            <label class="permiso-item">
              <input type="checkbox" id="permisoContactos" checked>
              <span class="checkmark"></span>
              Responder contactos
            </label>
            <label class="permiso-item">
              <input type="checkbox" id="permisoCatalogos" checked>
              <span class="checkmark"></span>
              Editar, borrar o agregar catálogos
            </label>
          </div>
        </div>
        
        <button type="submit" class="btn-primary">
          <i class="fas fa-user-plus"></i> Crear Trabajador
        </button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event listener para el formulario
  const form = document.getElementById('formAgregarTrabajador');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nombre = document.getElementById('trabajadorNombre').value.trim();
      const email = document.getElementById('trabajadorEmail').value.trim();
      const pass = document.getElementById('trabajadorPass').value;
      const permisoContactos = document.getElementById('permisoContactos').checked;
      const permisoCatalogos = document.getElementById('permisoCatalogos').checked;
      
      // Validaciones básicas
      if (!nombre) {
        mostrarNotificacion('Debes escribir un nombre');
        return;
      }
      
      if (!email) {
        mostrarNotificacion('Debes escribir un gmail');
        return;
      }
      
      if (!pass) {
        mostrarNotificacion('Debes escribir una contraseña');
        return;
      }
      
      // Verificar si ya existe
      if (usuarios.find(u => u.email === email)) {
        mostrarNotificacion('Este gmail ya está registrado');
        return;
      }
      
      // Crear trabajador con permisos
      const nuevoTrabajador = { 
        nombre, 
        email, 
        pass, 
        rol: 'trabajador',
        permisos: {
          contactos: permisoContactos,
          catalogos: permisoCatalogos
        }
      };
      
      usuarios.push(nuevoTrabajador);
      trabajadores.push(nuevoTrabajador);
      // Persistencia deshabilitada: sin localStorage
      
      cerrarModal('modalAgregarTrabajador');
      cargarTrabajadores();
      mostrarNotificacion(`Trabajador "${nombre}" creado exitosamente`);
    });
  }
}

// Función para mostrar/ocultar permisos
function mostrarPermisos() {
  const permisosSection = document.getElementById('permisosSection');
  if (permisosSection) {
    if (permisosSection.style.display === 'none') {
      permisosSection.style.display = 'block';
    } else {
      permisosSection.style.display = 'none';
    }
  }
}

function editarTrabajador(email) {
  const trabajador = trabajadores.find(t => t.email === email);
  if (!trabajador) return;
  
  // Si ya existe un modal abierto, cerrarlo para evitar duplicados
  const modalPrevioTrab = document.getElementById('modalEditarTrabajador');
  if (modalPrevioTrab) modalPrevioTrab.remove();

  const modal = document.createElement('div');
  modal.id = 'modalEditarTrabajador';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <i class="fas fa-user-edit"></i>
        <h2>Editar Trabajador</h2>
        <button class="close-modal" onclick="cerrarModal('modalEditarTrabajador')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form id="formEditarTrabajador">
        <div class="form-group">
          <label for="editTrabajadorNombre">Nombre</label>
          <input type="text" id="editTrabajadorNombre" value="${trabajador.nombre}" required>
        </div>
        
        <div class="form-group">
          <label for="editTrabajadorEmail">Email</label>
          <input type="email" id="editTrabajadorEmail" value="${trabajador.email}" required>
        </div>
        
        <div class="form-group">
          <label for="editTrabajadorPass">Contraseña</label>
          <input type="password" id="editTrabajadorPass" placeholder="Nueva contraseña" required>
        </div>

        <div class="form-group">
          <label>Permisos</label>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" id="editPermisoContactos" ${trabajador.permisos?.contactos ? 'checked' : ''}>
              Gestionar consultas/contactos
            </label>
            <label>
              <input type="checkbox" id="editPermisoCatalogos" ${trabajador.permisos?.catalogos ? 'checked' : ''}>
              Gestionar catálogos/productos
            </label>
          </div>
        </div>
        
        <button type="submit" class="btn-primary">
          <i class="fas fa-save"></i> Guardar Cambios
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  // Mostrar modal
  modal.style.display = 'block';
  
  document.getElementById('formEditarTrabajador').addEventListener('submit', function(e) {
    e.preventDefault();
    const nuevoNombre = document.getElementById('editTrabajadorNombre').value.trim();
    const nuevoEmail = document.getElementById('editTrabajadorEmail').value.trim();
    const nuevoPass = document.getElementById('editTrabajadorPass').value.trim();
    const permisoContactos = document.getElementById('editPermisoContactos').checked;
    const permisoCatalogos = document.getElementById('editPermisoCatalogos').checked;

    if (!nuevoNombre) { mostrarNotificacion('El nombre es obligatorio'); return; }
    if (!nuevoEmail) { mostrarNotificacion('El email es obligatorio'); return; }
    if (!nuevoPass) { mostrarNotificacion('La contraseña es obligatoria'); return; }

    if (nuevoEmail !== email && usuarios.find(u => u.email === nuevoEmail)) {
      mostrarNotificacion('Ese email ya está en uso');
      return;
    }
    
    // Actualizar en usuarios
    const nuevosPermisos = { contactos: permisoContactos, catalogos: permisoCatalogos };
    const usuarioIndex = usuarios.findIndex(u => u.email === email);
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], nombre: nuevoNombre, email: nuevoEmail, pass: nuevoPass, rol: 'trabajador', permisos: nuevosPermisos };
    }
    
    // Actualizar en trabajadores
    const trabajadorIndex = trabajadores.findIndex(t => t.email === email);
    if (trabajadorIndex !== -1) {
      trabajadores[trabajadorIndex] = { ...trabajadores[trabajadorIndex], nombre: nuevoNombre, email: nuevoEmail, pass: nuevoPass, rol: 'trabajador', permisos: nuevosPermisos };
    }
    
    // Persistencia deshabilitada: sin localStorage
    
    cerrarModal('modalEditarTrabajador');
    cargarTrabajadores();
    mostrarNotificacion('Trabajador actualizado exitosamente');
  });
}

function eliminarTrabajador(email) {
  if (confirm('¿Estás seguro de que quieres eliminar este trabajador?')) {
    // Eliminar de usuarios
    usuarios = usuarios.filter(u => u.email !== email);
    // Eliminar de trabajadores
    trabajadores = trabajadores.filter(t => t.email !== email);
    
    // Persistencia deshabilitada: sin localStorage
    
    cargarTrabajadores();
    mostrarNotificacion('Trabajador eliminado exitosamente');
  }
}

// Gestión de Productos
function abrirModalAgregarProducto() {
  // Cerrar modal si ya existe
  const modalExistente = document.getElementById('modalAgregarProducto');
  if (modalExistente) {
    modalExistente.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'modalAgregarProducto';
  modal.className = 'modal';
  modal.style.display = 'block';
  
  modal.innerHTML = `
    <div class="modal-content producto-crear-modal-nuevo">
      <div class="modal-header-nuevo">
        <div class="header-left">
          <i class="fas fa-plus-circle"></i>
          <h2>Crear Nuevo Producto</h2>
        </div>
        <button class="close-modal-nuevo" onclick="cerrarModal('modalAgregarProducto')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="producto-crear-body-nuevo">
        <!-- Vista Previa del Producto -->
        <div class="producto-preview-nuevo">
          <h3><i class="fas fa-eye"></i> Vista Previa</h3>
          <div class="producto-card-preview-nuevo">
            <div class="producto-imagen-preview-nuevo">
              <div class="imagen-placeholder-nuevo" id="imagenPreview">
                <i class="fas fa-image"></i>
                <span>Imagen del producto</span>
              </div>
            </div>
            <div class="producto-info-preview-nuevo">
              <h4 class="producto-nombre-preview-nuevo" id="nombrePreview">Nombre del producto</h4>
              <p class="producto-descripcion-preview-nuevo" id="descripcionPreview">Descripción del producto</p>
              <div class="producto-precio-preview-nuevo" id="precioPreview">$0.00</div>
              <div class="producto-categoria-preview-nuevo" id="categoriaPreview">CATEGORÍA • DEPORTE</div>
            </div>
          </div>
        </div>
        
        <!-- Formulario de Creación -->
        <div class="producto-formulario-nuevo">
          <h3><i class="fas fa-edit"></i> Datos del Producto</h3>
          <form id="formAgregarProducto">
            <div class="form-group-nuevo">
              <label for="productoImagen"><i class="fas fa-camera"></i> Foto del Producto</label>
              <div class="file-input-wrapper">
                <input type="file" id="productoImagen" accept="image/*" required>
                <div class="file-input-display">
                  <i class="fas fa-upload"></i>
                  <span>Seleccionar imagen desde tu PC</span>
                </div>
              </div>
            </div>
            
            <div class="form-group-nuevo">
              <label for="productoNombre"><i class="fas fa-tag"></i> Título del Producto</label>
              <input type="text" id="productoNombre" placeholder="Ej: Camiseta Nike Dri-FIT" required>
            </div>
            
            <div class="form-group-nuevo">
              <label for="productoDescripcion"><i class="fas fa-align-left"></i> Descripción</label>
              <textarea id="productoDescripcion" placeholder="Describe las características, material, tallas disponibles..." required rows="4"></textarea>
            </div>
            
            <div class="form-group-nuevo">
              <label for="productoPrecio"><i class="fas fa-dollar-sign"></i> Precio (ARS $)</label>
              <input type="number" id="productoPrecio" placeholder="0" step="1" min="0" required>
            </div>
            
            <div class="form-row-nuevo">
              <div class="form-group-nuevo">
                <label for="productoCategoria"><i class="fas fa-list"></i> Categoría</label>
                <select id="productoCategoria" required>
                  <option value="">Seleccionar categoría...</option>
                  <option value="remeras">👕 Remeras</option>
                  <option value="pantalones">👖 Pantalones</option>
                  <option value="zapatillas">👟 Zapatillas</option>
                  <option value="shorts">🩳 Shorts</option>
                  <option value="buzos">🧥 Buzos</option>
                  <option value="medias">🧦 Medias</option>
                  <option value="equipamiento">⚽ Equipamiento</option>
                  <option value="accesorios">🎯 Accesorios</option>
                </select>
              </div>
              
              <div class="form-group-nuevo">
                <label for="productoDeporte"><i class="fas fa-running"></i> Deporte</label>
                <select id="productoDeporte" required>
                  <option value="">Seleccionar deporte...</option>
                  <option value="futbol">⚽ Fútbol</option>
                  <option value="basquet">🏀 Básquet</option>
                  <option value="tenis">🎾 Tenis</option>
                  <option value="natacion">🏊 Natación</option>
                  <option value="voley">🏐 Voley</option>
                  <option value="boxeo">🥊 Boxeo</option>
                  <option value="gimnasio">💪 Gimnasio</option>
                  <option value="running">🏃 Running</option>
                  <option value="general">🏃 General</option>
                </select>
              </div>
            </div>
            
            <div class="form-group-nuevo">
              <label for="productoMedidas"><i class="fas fa-ruler"></i> Especificaciones (opcional)</label>
              <input type="text" id="productoMedidas" placeholder="Ej: Tallas 36-46, Material: Algodón 100%">
            </div>
            
            <button type="submit" class="btn-crear-producto">
              <i class="fas fa-plus"></i> 
              <span>Crear Producto</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event listeners para actualizar la vista previa en tiempo real
  const imagenInput = document.getElementById('productoImagen');
  const nombreInput = document.getElementById('productoNombre');
  const descripcionInput = document.getElementById('productoDescripcion');
  const precioInput = document.getElementById('productoPrecio');
  const categoriaSelect = document.getElementById('productoCategoria');
  const deporteSelect = document.getElementById('productoDeporte');
  
  imagenInput.addEventListener('change', actualizarVistaPrevia);
  nombreInput.addEventListener('input', actualizarVistaPrevia);
  descripcionInput.addEventListener('input', actualizarVistaPrevia);
  precioInput.addEventListener('input', actualizarVistaPrevia);
  categoriaSelect.addEventListener('change', actualizarVistaPrevia);
  deporteSelect.addEventListener('change', actualizarVistaPrevia);
  
  // Event listener para el formulario
  document.getElementById('formAgregarProducto').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = nombreInput.value.trim();
    const precio = parseFloat(precioInput.value);
    const categoria = categoriaSelect.value;
    const deporte = deporteSelect.value;
    const descripcion = descripcionInput.value.trim();
    const archivoImagen = imagenInput.files[0];
    const medidas = document.getElementById('productoMedidas').value.trim();
    
    // Validaciones
    if (nombre.length < 3) {
      mostrarNotificacion('El nombre debe tener al menos 3 caracteres');
      return;
    }
    
    if (precio <= 0) {
      mostrarNotificacion('El precio debe ser mayor a 0');
      return;
    }
    
    if (descripcion.length < 10) {
      mostrarNotificacion('La descripción debe tener al menos 10 caracteres');
      return;
    }
    
    if (!archivoImagen) {
      mostrarNotificacion('Debes seleccionar una imagen');
      return;
    }
    
    // Verificar si ya existe un producto con el mismo nombre
    if (productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
      mostrarNotificacion('Ya existe un producto con ese nombre');
      return;
    }
    
    // Convertir imagen a base64
    const reader = new FileReader();
    reader.onload = function(e) {
      const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1;
      const producto = {
        id: nuevoId,
        nombre,
        precio,
        categoria,
        deporte,
        descripcion,
        imagen: e.target.result, // Guardar como base64
        medidas: medidas || ''
      };
      
      // Agregar el nuevo producto de forma segura
      productos.push(producto);
      
      // Guardar en localStorage de forma segura
      try {
        // Persistencia deshabilitada: sin localStorage
        console.log('✅ Producto guardado correctamente en localStorage');
      } catch (error) {
        console.error('❌ Error al guardar en localStorage:', error);
        mostrarNotificacion('Error al guardar el producto. Intenta nuevamente.');
        return;
      }
      
      cerrarModal('modalAgregarProducto');
      cargarProductosAdmin();
      cargarProductosTrabajador();
      
      // Solo actualizar la tienda principal si estamos en la página principal
      const productosGrid = document.getElementById('productosGrid');
      if (productosGrid) {
        mostrarProductos(productos);
      }
      
      mostrarNotificacion(`Producto "${nombre}" creado exitosamente`);
    };
    reader.readAsDataURL(archivoImagen);
  });
  
  function actualizarVistaPrevia() {
    const archivoImagen = imagenInput.files[0];
    const nombre = nombreInput.value.trim() || 'Nombre del producto';
    const descripcion = descripcionInput.value.trim() || 'Descripción del producto';
    const precio = precioInput.value || '0';
    const categoria = categoriaSelect.value || 'Categoría';
    const deporte = deporteSelect.value || 'Deporte';
    
    // Actualizar imagen
    const imagenPreview = document.getElementById('imagenPreview');
    if (archivoImagen) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagenPreview.innerHTML = `<img src="${e.target.result}" alt="${nombre}">`;
      };
      reader.readAsDataURL(archivoImagen);
    } else {
      imagenPreview.innerHTML = '<i class="fas fa-image"></i><span>Imagen del producto</span>';
    }
    
    // Actualizar otros campos
    const nombrePreview = document.getElementById('nombrePreview');
    const descripcionPreview = document.getElementById('descripcionPreview');
    const precioPreview = document.getElementById('precioPreview');
    const categoriaPreview = document.getElementById('categoriaPreview');
    
    if (nombrePreview) nombrePreview.textContent = nombre;
    if (descripcionPreview) descripcionPreview.textContent = descripcion;
    if (precioPreview) precioPreview.textContent = `$${precio}`;
    if (categoriaPreview) categoriaPreview.textContent = `${categoria.toUpperCase()} • ${deporte.toUpperCase()}`;
  }
}

function editarProducto(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  
  // Si ya existe un modal abierto, cerrarlo para evitar duplicados
  const modalPrevioProd = document.getElementById('modalEditarProducto');
  if (modalPrevioProd) modalPrevioProd.remove();

  const modal = document.createElement('div');
  modal.id = 'modalEditarProducto';
  modal.className = 'modal producto-editar-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <i class="fas fa-edit"></i>
        <h2>Editar Producto</h2>
        <button class="close-modal" onclick="cerrarModal('modalEditarProducto')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form id="formEditarProducto">
        <div class="form-group">
          <label for="editProductoNombre"><i class="fas fa-tag"></i> Nombre del Producto</label>
          <input type="text" id="editProductoNombre" value="${producto.nombre}" required>
        </div>
        
        <div class="form-group">
          <label for="editProductoPrecio"><i class="fas fa-dollar-sign"></i> Precio (ARS $)</label>
          <input type="number" id="editProductoPrecio" value="${producto.precio}" step="0.01" min="0" required>
        </div>
        
        <div class="form-group">
          <label for="editProductoCategoria"><i class="fas fa-list"></i> Categoría</label>
          <select id="editProductoCategoria" required>
            <option value="remeras" ${producto.categoria === 'remeras' ? 'selected' : ''}>👕 Remeras</option>
            <option value="pantalones" ${producto.categoria === 'pantalones' ? 'selected' : ''}>👖 Pantalones</option>
            <option value="zapatillas" ${producto.categoria === 'zapatillas' ? 'selected' : ''}>👟 Zapatillas</option>
            <option value="shorts" ${producto.categoria === 'shorts' ? 'selected' : ''}>🩳 Shorts</option>
            <option value="buzos" ${producto.categoria === 'buzos' ? 'selected' : ''}>🧥 Buzos</option>
            <option value="medias" ${producto.categoria === 'medias' ? 'selected' : ''}>🧦 Medias</option>
            <option value="equipamiento" ${producto.categoria === 'equipamiento' ? 'selected' : ''}>⚽ Equipamiento</option>
            <option value="accesorios" ${producto.categoria === 'accesorios' ? 'selected' : ''}>🎯 Accesorios</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="editProductoDeporte"><i class="fas fa-running"></i> Deporte</label>
          <select id="editProductoDeporte" required>
            <option value="futbol" ${producto.deporte === 'futbol' ? 'selected' : ''}>⚽ Fútbol</option>
            <option value="basquet" ${producto.deporte === 'basquet' ? 'selected' : ''}>🏀 Básquet</option>
            <option value="tenis" ${producto.deporte === 'tenis' ? 'selected' : ''}>🎾 Tenis</option>
            <option value="natacion" ${producto.deporte === 'natacion' ? 'selected' : ''}>🏊 Natación</option>
            <option value="voley" ${producto.deporte === 'voley' ? 'selected' : ''}>🏐 Voley</option>
            <option value="boxeo" ${producto.deporte === 'boxeo' ? 'selected' : ''}>🥊 Boxeo</option>
            <option value="gimnasio" ${producto.deporte === 'gimnasio' ? 'selected' : ''}>💪 Gimnasio</option>
            <option value="running" ${producto.deporte === 'running' ? 'selected' : ''}>🏃 Running</option>
            <option value="general" ${producto.deporte === 'general' ? 'selected' : ''}>🏃 General</option>
          </select>
        </div>
        
        <div class="form-group full-width">
          <label for="editProductoDescripcion"><i class="fas fa-align-left"></i> Descripción</label>
          <textarea id="editProductoDescripcion" rows="4" required placeholder="Describe las características, material, tallas disponibles...">${producto.descripcion}</textarea>
        </div>
        
        <div class="form-group full-width">
          <label for="editProductoImagen"><i class="fas fa-camera"></i> Imagen del Producto</label>
          <input type="text" id="editProductoImagen" value="${producto.imagen}" placeholder="Pega una URL de imagen o usa el archivo" style="margin-bottom:8px;">
          <input type="file" id="editProductoImagenArchivo" accept="image/*">
          <small>Si subes un archivo, se guardará en base64.</small>
          <div id="editImagenPreview" style="margin-top:8px;">${(producto.imagen||'').startsWith('data:image/') || /\.(png|jpg|jpeg|gif|WEBP)$/i.test(producto.imagen) ? `<img src="${producto.imagen}" alt="${producto.nombre}" style="max-width:200px;border-radius:8px;">` : ''}</div>
        </div>
        
        <div class="form-group">
          <label for="editProductoMedidas"><i class="fas fa-ruler"></i> Especificaciones (opcional)</label>
          <input type="text" id="editProductoMedidas" value="${producto.medidas || ''}" placeholder="Ej: Tallas 36-46, Material: Algodón 100%">
        </div>
        
        <button type="submit" class="btn-primary">
          <i class="fas fa-save"></i> Guardar Cambios
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  // Mostrar modal
  modal.style.display = 'block';
  
  const archivoInput = document.getElementById('editProductoImagenArchivo');
  const urlInput = document.getElementById('editProductoImagen');
  const previewDiv = document.getElementById('editImagenPreview');

  archivoInput.addEventListener('change', function() {
    const archivo = archivoInput.files[0];
    if (!archivo) { previewDiv.innerHTML = ''; return; }
    const reader = new FileReader();
    reader.onload = function(evt) {
      previewDiv.innerHTML = `<img src="${evt.target.result}" style="max-width:200px;border-radius:8px;">`;
    };
    reader.readAsDataURL(archivo);
  });

  urlInput.addEventListener('input', function() {
    const url = urlInput.value.trim();
    if (!url) { previewDiv.innerHTML = ''; return; }
    previewDiv.innerHTML = `<img src="${url}" style="max-width:200px;border-radius:8px;" onerror="this.remove()">`;
  });

  document.getElementById('formEditarProducto').addEventListener('submit', function(e) {
    e.preventDefault();
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
      const actualizarYGuardar = (nuevaImagen) => {
        const imagenFinal = nuevaImagen && nuevaImagen.trim() !== '' ? nuevaImagen : productos[index].imagen;
        productos[index] = {
          ...productos[index],
          nombre: document.getElementById('editProductoNombre').value.trim(),
          precio: parseFloat(document.getElementById('editProductoPrecio').value),
          categoria: document.getElementById('editProductoCategoria').value,
          deporte: document.getElementById('editProductoDeporte').value,
          descripcion: document.getElementById('editProductoDescripcion').value.trim(),
          imagen: imagenFinal,
          medidas: document.getElementById('editProductoMedidas').value || ''
        };
        // Persistencia deshabilitada: sin localStorage
        cerrarModal('modalEditarProducto');
        cargarProductosAdmin && cargarProductosAdmin();
        cargarProductosTrabajador && cargarProductosTrabajador();
        const productosGrid = document.getElementById('productosGrid');
        if (productosGrid) { mostrarProductos(productos); }
        mostrarNotificacion('Producto actualizado exitosamente');
      };

      const archivo = archivoInput.files[0];
      const url = urlInput.value.trim();
      if (archivo) {
        const reader = new FileReader();
        reader.onload = function(evt) { actualizarYGuardar(evt.target.result); };
        reader.readAsDataURL(archivo);
      } else {
        actualizarYGuardar(url);
      }
    }
  });
}

function eliminarProducto(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    productos = productos.filter(p => p.id !== id);
    // Persistencia deshabilitada: sin localStorage
    
    cargarProductosAdmin();
    cargarProductosTrabajador();
    
    // Solo actualizar la tienda principal si estamos en la página principal
    const productosGrid = document.getElementById('productosGrid');
    if (productosGrid) {
      mostrarProductos(productos);
    }
    
    mostrarNotificacion('Producto eliminado exitosamente');
  }
}

// Gestión de Consultas
function responderConsulta(index) {
  const respuesta = document.getElementById(`respuesta-${index}`) || 
                   document.getElementById(`respuesta-trabajador-${index}`);
  
  if (!respuesta || !respuesta.value.trim()) {
    mostrarNotificacion('Por favor escribe una respuesta');
    return;
  }
  
  consultas[index].respuesta = respuesta.value.trim();
  consultas[index].fechaRespuesta = new Date().toISOString();
  consultas[index].respondidoPor = usuarioLogueado.nombre;
  
  // Persistencia deshabilitada: sin localStorage
  
  cargarConsultas();
  cargarConsultasTrabajador();
  mostrarNotificacion('Consulta respondida exitosamente');
}

// ===== ANIMACIONES CSS =====
const style = document.createElement('style');
style.textContent = `
  /* ===== ESTILOS MEJORADOS PARA BOTÓN EDITAR PERFIL ===== */
  .btn-edit-enhanced {
    position: relative;
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 140px;
    justify-content: center;
  }

  .btn-edit-enhanced:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.5);
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  }

  .btn-edit-enhanced:active {
    transform: translateY(-1px) scale(1.02);
  }

  .btn-edit-enhanced i {
    font-size: 16px;
    transition: transform 0.3s ease;
  }

  .btn-edit-enhanced:hover i {
    transform: rotate(15deg) scale(1.1);
  }

  .btn-edit-enhanced span {
    position: relative;
    z-index: 2;
  }

  /* Efecto de brillo animado */
  .btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s ease;
    z-index: 1;
  }

  .btn-edit-enhanced:hover .btn-shine {
    left: 100%;
  }

  /* ===== ESTILOS PARA TRABAJADORES ===== */
  .trabajadores-section {
    background: #f8f9fa;
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 25px;
  }

  .trabajadores-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .trabajadores-header h4 {
    color: #2c3e50;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-agregar-trabajador {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-agregar-trabajador:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  }

  .trabajador-item {
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    border: 1px solid #404040;
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .trabajador-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  }

  .trabajador-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
    border-color: #2196F3;
    background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
  }

  .trabajador-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .trabajador-datos h5 {
    margin: 0 0 5px 0;
    color: white;
    font-size: 16px;
    font-weight: 600;
  }

  .trabajador-datos p {
    margin: 0;
    color: #cccccc;
    font-size: 14px;
  }

  .trabajador-actions {
    display: flex;
    gap: 10px;
  }

  .btn-editar-trabajador {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .btn-editar-trabajador:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  }

  .btn-eliminar-trabajador {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .btn-eliminar-trabajador:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  }

  .permisos-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .permiso-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .permiso-badge.contactos {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
  }

  .permiso-badge.catalogos {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
  }

  .permiso-badge.usuarios {
    background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%);
    color: white;
  }

  .permiso-badge.reportes {
    background: linear-gradient(135deg, #fd7e14 0%, #e55a00 100%);
    color: white;
  }

  /* Modal para editar trabajador */
  .modal-trabajador {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
  }

  .modal-trabajador-content {
    background: #1a1a1a;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 20px;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
    animation: slideInModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: white;
  }

  .modal-trabajador-header {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    padding: 25px;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-trabajador-header h3 {
    margin: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .close-modal {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .close-modal:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  .modal-trabajador-body {
    padding: 30px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: white;
    font-size: 14px;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #404040;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: #333333;
    color: white;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #2196F3;
    background: #2a2a2a;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
  }

  .form-group input::placeholder {
    color: #888888;
  }

  .permisos-section {
    margin-top: 25px;
    padding-top: 25px;
    border-top: 1px solid #e1e8ed;
  }

  .permisos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }

  .permiso-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: #2a2a2a;
    border: 1px solid #404040;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .permiso-item:hover {
    background: #3a3a3a;
    border-color: #2196F3;
  }

  .permiso-item input[type="checkbox"] {
    width: auto;
    margin: 0;
    accent-color: #2196F3;
  }

  .permiso-item label {
    margin: 0;
    font-weight: 500;
    color: white;
    cursor: pointer;
    flex: 1;
  }

  .modal-trabajador-footer {
    padding: 20px 30px;
    border-top: 1px solid #e1e8ed;
    display: flex;
    gap: 15px;
    justify-content: flex-end;
  }

  .btn-guardar {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-guardar:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  }

  .btn-cancelar {
    background: #6c757d;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .btn-cancelar:hover {
    background: #5a6268;
    transform: translateY(-2px);
  }

  .btn-permisos-toggle {
    background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    justify-content: center;
  }

  .btn-permisos-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
    background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  }

  /* ===== MEJORAS PARA EL PANEL DE ADMINISTRACIÓN ===== */
  .admin-section:last-child {
    padding-bottom: 40px;
  }

  .admin-panel .admin-content {
    margin-bottom: 20px;
  }

  /* ===== MODAL EDITAR PRODUCTO (tema azul/oscuro) ===== */
  #modalEditarProducto .modal-content {
    background: #1a1f2b;
    color: #e8f0ff;
    border-radius: 18px;
    max-width: 720px;
    width: 92%;
    margin: 40px auto;
    box-shadow: 0 25px 80px rgba(0,0,0,0.5);
    overflow: hidden;
    animation: slideInModal 0.35s ease;
  }
  #modalEditarProducto .modal-header {
    background: linear-gradient(135deg,#0d47a1 0%,#1565c0 60%,#1976d2 100%);
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
    color: #fff;
  }
  #modalEditarProducto .modal-header h2 { margin: 0; font-size: 18px; letter-spacing: .5px; }
  #modalEditarProducto .close-modal { background: rgba(255,255,255,.15); }
  #modalEditarProducto .close-modal:hover { background: rgba(255,255,255,.25); }
  #modalEditarProducto .form-group label { color: #cfe3ff; }
  #modalEditarProducto .form-group input,
  #modalEditarProducto .form-group select,
  #modalEditarProducto .form-group textarea {
    background: #111623;
    color: #e8f0ff;
    border: 1px solid #243050;
  }
  #modalEditarProducto .form-group input:focus,
  #modalEditarProducto .form-group select:focus,
  #modalEditarProducto .form-group textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,.2);
  }
  #modalEditarProducto .btn-primary {
    background: linear-gradient(135deg,#1976d2 0%,#0d47a1 100%);
    border: none;
  }
  #modalEditarProducto small { color: #9fb7e7; }

  @keyframes slideInModal {
    from {
      transform: scale(0.9) translateY(30px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .modal-trabajador-content {
      width: 95%;
      margin: 20px;
    }
    
    .permisos-grid {
      grid-template-columns: 1fr;
    }
    
    .modal-trabajador-footer {
      flex-direction: column;
    }
  }
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .cart-item-info h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }
  
  .cart-item-info p {
    margin: 0;
    color: var(--accent-primary);
    font-weight: 600;
  }
  
  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .cart-item-controls button {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .cart-item-controls button:hover {
    background: var(--accent-primary);
    color: white;
  }
  
  .remove-btn {
    background: #ef4444 !important;
    color: white !important;
    border-color: #ef4444 !important;
  }
  
  .cart-empty {
    text-align: center;
    color: var(--text-secondary);
    padding: 2rem;
  }
  
  .usuarioLogueado {
    background: var(--gradient-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }
  
  .usuarioLogueado:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  /* ===== ESTILOS DEL MODAL DE PRODUCTO ===== */
  .producto-modal-content {
    max-width: 900px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .producto-modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .producto-imagen-grande {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 15px;
    overflow: hidden;
    min-height: 400px;
    padding: 20px;
    border: 2px solid #e9ecef;
  }

  .producto-imagen-grande img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
    max-width: 100%;
    max-height: 100%;
  }

  .emoji-grande {
    font-size: 8rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .producto-detalles {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .producto-precio-grande {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin-bottom: 0.5rem;
  }

  .producto-descripcion-grande {
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  .producto-estadisticas {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 15px;
    border: 1px solid #e9ecef;
  }

  .producto-estadisticas h3 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1.3rem;
    font-weight: 600;
  }

  .estadistica-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e9ecef;
  }

  .estadistica-item:last-child {
    border-bottom: none;
  }

  .estadistica-label {
    font-weight: 700;
    color: #000000;
    min-width: 100px;
  }

  .estadistica-valor {
    color: #000000;
    font-weight: 600;
    text-align: right;
    flex: 1;
    margin-left: 1rem;
  }

  .producto-acciones-modal {
    display: flex;
    gap: 1rem;
    margin-top: auto;
  }

  .btn-agregar-modal {
    flex: 1;
    background: var(--gradient-primary);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-agregar-modal:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  .btn-favorito-modal {
    background: #f8f9fa;
    color: var(--text-secondary);
    border: 2px solid #e9ecef;
    padding: 1rem;
    border-radius: 12px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;
  }

  .btn-favorito-modal:hover {
    background: #e9ecef;
    color: var(--accent-primary);
  }

  .close-modal {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .close-modal:hover {
    background: #f8f9fa;
    color: var(--text-primary);
  }

  /* Responsive para móviles */
  @media (max-width: 768px) {
    .producto-modal-body {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .producto-imagen-grande {
      min-height: 300px;
    }

    .producto-precio-grande {
      font-size: 2rem;
    }

    .producto-acciones-modal {
      flex-direction: column;
    }

    .btn-agregar-modal,
    .btn-favorito-modal {
      width: 100%;
    }
  }

  /* ===== ESTILOS DEL BUSCADOR DE PRODUCTOS ===== */
  .buscador-productos {
    margin: 2rem 0;
    display: flex;
    justify-content: center;
  }

  .buscador-container {
    position: relative;
    max-width: 600px;
    width: 100%;
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 25px;
    padding: 0.75rem 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .buscador-container:focus-within {
    border-color: var(--accent-primary);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .buscador-container i {
    color: var(--text-secondary);
    margin-right: 0.75rem;
    font-size: 1.1rem;
  }

  .buscador-container input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    color: #000000;
    font-weight: 500;
    background: transparent;
  }

  .buscador-container input::placeholder {
    color: var(--text-secondary);
  }

  .btn-limpiar-busqueda {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
  }

  .btn-limpiar-busqueda:hover {
    background: #f8f9fa;
    color: var(--text-primary);
  }

  /* Responsive del buscador */
  @media (max-width: 768px) {
    .buscador-productos {
      margin: 1.5rem 0;
    }

    .buscador-container {
      margin: 0 1rem;
      padding: 0.5rem 0.75rem;
    }

    .buscador-container input {
      font-size: 0.9rem;
    }
  }

  /* ===== ESTILOS MODERNOS DEL PANEL DE ADMINISTRACIÓN ===== */
  .admin-panel-content-modern {
    max-width: 1400px !important;
    width: 95% !important;
    max-height: 95vh !important;
    background: #1a1a1a;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
    animation: slideInAdmin 0.4s ease-out;
    color: white;
  }

  .admin-header-modern {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .admin-header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .admin-crown {
    font-size: 28px;
    color: #ffd700;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .admin-header-modern h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .close-modal-modern {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 18px;
  }

  .close-modal-modern:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  .admin-tabs-modern {
    display: flex;
    background: #2a2a2a;
    border-bottom: 1px solid #404040;
  }

  .tab-btn-modern {
    flex: 1;
    background: none;
    border: none;
    padding: 20px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #b0b0b0;
    position: relative;
  }

  .tab-btn-modern:hover {
    background: #3a3a3a;
    color: #ffffff;
  }

  .tab-btn-modern.active {
    background: #1a1a1a;
    color: #2196F3;
    font-weight: 600;
  }

  .tab-btn-modern.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  }

  .admin-content-modern {
    padding: 0;
    max-height: calc(95vh - 140px);
    overflow-y: auto;
    flex: 1;
  }

  .tab-content-modern {
    display: none;
    padding: 30px;
    padding-bottom: 50px;
  }

  .tab-content-modern.active {
    display: block;
  }

  .section-header-modern {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f1f3f4;
  }

  .section-title-modern {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .section-title-modern i {
    font-size: 24px;
    color: #2196F3;
  }

  .section-title-modern h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
  }

  .btn-primary-modern {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
  }

  .btn-primary-modern:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
  }

  .lista-trabajadores-modern,
  .lista-productos-modern,
  .lista-consultas-modern {
    display: grid;
    gap: 20px;
  }

  @keyframes slideInAdmin {
    from {
      transform: scale(0.9) translateY(50px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  /* Responsive para el panel de admin */
  @media (max-width: 768px) {
    .admin-panel-content-modern {
      width: 98% !important;
      max-height: 98vh !important;
      border-radius: 15px;
    }

    .admin-header-modern {
      padding: 20px;
    }

    .admin-header-modern h2 {
      font-size: 20px;
    }

    .admin-tabs-modern {
      flex-direction: column;
    }

    .tab-btn-modern {
      padding: 15px;
    }

    .tab-content-modern {
      padding: 20px;
    }

    .section-header-modern {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    .producto-crear-body-nuevo {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
      padding: 20px !important;
      padding-bottom: 40px !important;
    }
  }

  /* ===== ESTILOS PARA EL MODAL AGREGAR PRODUCTO NUEVO ===== */
  .producto-crear-modal-nuevo {
    max-width: 1200px !important;
    width: 95% !important;
    max-height: 95vh !important;
    background: #1a1a1a;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideInAdmin 0.4s ease-out;
  }

  .modal-header-nuevo {
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    padding: 20px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-left i {
    font-size: 24px;
    color: #ffd700;
  }

  .header-left h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
  }

  .close-modal-nuevo {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 16px;
  }

  .close-modal-nuevo:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }

  .producto-crear-body-nuevo {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 30px;
    padding: 30px;
    padding-bottom: 50px;
    max-height: calc(95vh - 80px);
    overflow-y: auto;
    background: #1a1a1a;
  }

  .producto-preview-nuevo {
    background: #2a2a2a;
    border-radius: 12px;
    padding: 25px;
    border: 1px solid #404040;
  }

  .producto-preview-nuevo h3 {
    margin: 0 0 20px 0;
    color: #2196F3;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .producto-card-preview-nuevo {
    background: #333333;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #555555;
  }

  .producto-imagen-preview-nuevo {
    height: 150px;
    background: #404040;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #555555;
    overflow: hidden;
  }

  .producto-imagen-preview-nuevo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
  }

  .imagen-placeholder-nuevo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #888888;
    text-align: center;
  }

  .imagen-placeholder-nuevo i {
    font-size: 40px;
  }

  .imagen-placeholder-nuevo span {
    font-size: 14px;
  }

  .producto-info-preview-nuevo {
    padding: 20px;
  }

  .producto-nombre-preview-nuevo {
    margin: 0 0 10px 0;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
  }

  .producto-descripcion-preview-nuevo {
    margin: 0 0 15px 0;
    color: #cccccc;
    font-size: 14px;
    line-height: 1.4;
  }

  .producto-precio-preview-nuevo {
    font-size: 24px;
    font-weight: bold;
    color: #2196F3;
    margin-bottom: 10px;
  }

  .producto-categoria-preview-nuevo {
    font-size: 12px;
    color: #888888;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .producto-formulario-nuevo {
    background: #2a2a2a;
    border-radius: 12px;
    padding: 25px;
    border: 1px solid #404040;
  }

  .producto-formulario-nuevo h3 {
    margin: 0 0 25px 0;
    color: #2196F3;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .form-group-nuevo {
    margin-bottom: 20px;
  }

  .form-group-nuevo label {
    display: block;
    margin-bottom: 8px;
    color: #ffffff;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-group-nuevo label i {
    color: #2196F3;
    width: 16px;
  }

  .form-group-nuevo input,
  .form-group-nuevo textarea,
  .form-group-nuevo select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #404040;
    border-radius: 8px;
    background: #333333;
    color: #ffffff;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .form-group-nuevo input:focus,
  .form-group-nuevo textarea:focus,
  .form-group-nuevo select:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }

  .form-group-nuevo textarea {
    resize: vertical;
    min-height: 80px;
  }

  .file-input-wrapper {
    position: relative;
  }

  .file-input-wrapper input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .file-input-display {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    border: 2px dashed #404040;
    border-radius: 8px;
    background: #333333;
    color: #cccccc;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .file-input-display:hover {
    border-color: #2196F3;
    background: #3a3a3a;
  }

  .file-input-display i {
    color: #2196F3;
    font-size: 18px;
  }

  .form-row-nuevo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .btn-crear-producto {
    width: 100%;
    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
  }

  .btn-crear-producto:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
  }

  /* Responsive para el modal agregar producto */
  @media (max-width: 768px) {
    .producto-crear-modal-nuevo {
      width: 98% !important;
      max-height: 98vh !important;
    }

    .producto-crear-body-nuevo {
      grid-template-columns: 1fr;
      padding: 20px;
      gap: 20px;
    }

    .form-row-nuevo {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);

window.addEventListener('load', function() {
  if (location.hash) {
    const targetId = location.hash.substring(1);
    setTimeout(() => {
      if (document.getElementById(targetId)) scrollToSection(targetId);
    }, 60);
  }
});
