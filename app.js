
 // Productos disponibles
const productos = [
    { id:1, nombre:"Coca-Cola 1.5L", precio:1200, categoria:"bebida" },
    { id:2, nombre:"Yerba Playadito 1Kg", precio:3500, categoria:"almacen" },
    { id:3, nombre:"Arroz Gallo Oro 1Kg", precio:1800, categoria:"almacen" },
    { id:4, nombre:"Agua Mineral 2L", precio:700, categoria:"bebida" },
    { id:5, nombre:"Fideos Spaghetti 500g", precio:950, categoria:"almacen" }
];

// Carrito (si existe en el localStorage lo traemos)
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosMostrados = [...productos];

// UTIL: formateo moneda
function formatoARS(num){
    return num.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

// Mostrar productos en pantalla
function mostrarProductos(lista = productosMostrados){
    const cont = document.getElementById('productos');
    cont.innerHTML = '';

    lista.forEach(p => {
    const card = document.createElement('div');
    card.className = "card p-3";
    card.style.width = "180px";

    card.innerHTML = `
        <h5>${p.nombre}</h5>
        <div class="d-flex justify-content-between align-items-center">
        <div class="precio">${formatoARS(p.precio)}</div>
        <small class="text-muted">${p.categoria}</small>
        </div>
        <div class="card-actions">
        <button class="btn btn-outline-light btn-sm">Ver</button>
        <button class="btn btn-primary btn-sm">Agregar</button>
        </div>
    `;

    // Ver - muestra info simple
    card.querySelector('.btn-outline-light').onclick = () => {
        Toastify({ text: `${p.nombre} • ${formatoARS(p.precio)}`, duration: 1400, gravity: "bottom", position: "right" }).showToast();
    };

    // Agregar
    card.querySelector('.btn-primary').onclick = () => {
        agregarAlCarrito(p.id);
        mostrarCarrito();
        actualizarContador();
        Toastify({ text: "Agregado al carrito", duration: 1200, gravity: "bottom", position: "right" }).showToast();
    };

    cont.appendChild(card);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(id){
    const existe = carrito.find(i => i.id === id);
    if(existe){
    existe.cantidad++;
    } else {
    const prod = productos.find(p => p.id === id);
    carrito.push({ ...prod, cantidad: 1 });
    }
    guardarCarrito();
}

//Modificar cantidad de un producto en el carrito
function modificarCantidad(id, nueva){
    const it = carrito.find(i => i.id === id);
    if(!it) return;
    it.cantidad = parseInt(nueva) || 1;
    if(it.cantidad <= 0) eliminarDelCarrito(id);
    guardarCarrito();
}

// Eliminar producto del carrito
function eliminarDelCarrito(id){
    carrito = carrito.filter(i => i.id !== id);
    guardarCarrito();
}

// Vaciar carrito
function vaciarCarrito(){
    carrito = [];
    guardarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/* MOSTRAR CARRITO (modal) */
function mostrarCarrito(){
    const lista = document.getElementById('carrito');
    lista.innerHTML = '';

    if(carrito.length === 0){
    lista.innerHTML = `<li class="list-group-item">Carrito vacío</li>`;
    actualizarTotales();
    return;
    }

    carrito.forEach(it => {
    const li = document.createElement('li');
    li.className = 'list-group-item';

    li.innerHTML = `
        <div>
        <strong>${it.nombre}</strong><br>
        <small class="text-muted">${formatoARS(it.precio)}</small>
        </div>

        <div class="d-flex align-items-center">
        <input type="number" min="1" value="${it.cantidad}" class="form-control form-control-sm me-2">
        <div class="me-2">${formatoARS(it.precio * it.cantidad)}</div>
        <button class="btn btn-sm btn-outline-danger">Eliminar</button>
        </div>
    `;

    li.querySelector('input').onchange = (e) => {
        modificarCantidad(it.id, e.target.value);
        mostrarCarrito();
        actualizarContador();
    };

    li.querySelector('button').onclick = () => {
      // confirmación simple con SweetAlert2
        Swal.fire({
        title: 'Eliminar producto?',
        text: it.nombre,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar'
        }).then(res => {
        if(res.isConfirmed){
            eliminarDelCarrito(it.id);
            mostrarCarrito();
            actualizarContador();
            Toastify({ text: "Producto eliminado", duration: 1200, gravity: "bottom", position: "right" }).showToast();
        }
        });
    };

    lista.appendChild(li);
    });

    actualizarTotales();
}

/* TOTALES / CONTADOR */
function totalCarrito(){
  return carrito.reduce((s, it) => s + it.precio * it.cantidad, 0);
}

function actualizarTotales(){
    const total = totalCarrito();
    document.getElementById('total').textContent = formatoARS(total);
    document.getElementById('totalModal').textContent = formatoARS(total);
}

function actualizarContador(){
    const cant = carrito.reduce((s, it) => s + it.cantidad, 0);
    document.getElementById('contadorBadge').textContent = cant;
}

// FILTROS Y ORDEN
function filtrarBusqueda(){
    const q = document.getElementById('buscarInput').value.trim().toLowerCase();
    productosMostrados = productos.filter(p => p.nombre.toLowerCase().includes(q));
    mostrarProductos();
}

function filtrarPorCategoria(){
    const cat = document.getElementById('categoriaSelect').value;
    productosMostrados = cat === 'todas' ? [...productos] : productos.filter(p => p.categoria === cat);
    mostrarProductos();
}

function ordenarProductos(){
    const val = document.getElementById('ordenSelect').value;
    if(val === 'precioAsc') productosMostrados.sort((a,b) => a.precio - b.precio);
    else if(val === 'precioDesc') productosMostrados.sort((a,b) => b.precio - a.precio);
    else if(val === 'nombreAsc') productosMostrados.sort((a,b) => a.nombre.localeCompare(b.nombre));
    mostrarProductos();
}

/*ACCIONES: vaciar / finalizar */
function confirmarVaciar(){
    if(carrito.length === 0){
    Toastify({ text: "El carrito ya está vacío", duration: 1200, gravity: "bottom", position: "right" }).showToast();
    return;
    }

    Swal.fire({
    title: '¿Vaciar carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar'
    }).then(res => {
    if(res.isConfirmed){
        vaciarCarrito();
        mostrarCarrito();
        actualizarContador();
        Toastify({ text: "Carrito vaciado", duration: 1200, gravity: "bottom", position: "right" }).showToast();
    }
    });
}

function finalizarCompra(){
    if(carrito.length === 0){
    Swal.fire('Carrito vacío', 'Agregá productos antes de finalizar', 'info');
    return;
    }

    Swal.fire({
    title: 'Compra finalizada',
    html: `Total: <b>${formatoARS(totalCarrito())}</b>`,
    icon: 'success'
    }).then(() => {
    vaciarCarrito();
    mostrarCarrito();
    actualizarContador();

    // cerrar modal si está abierto
    const modalEl = document.getElementById('cartModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if(modal) modal.hide();
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();
    mostrarCarrito();
    actualizarContador();
});
