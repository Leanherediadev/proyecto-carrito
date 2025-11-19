
// Productos disponibles

const productos = [
    { id: 1, nombre: "Coca-Cola 1.5L", precio: 1200 },
    { id: 2, nombre: "Yerba Playadito 1Kg", precio: 3500 },
    { id: 3, nombre: "Arroz Gallo Oro 1Kg", precio: 1800 }
];


// Carrito (si existe en localStorage lo traemos)

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// Mostrar productos en pantalla

function mostrarProductos() {
    const cont = document.getElementById("productos");
    cont.innerHTML = "";

    productos.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card p-3";
        card.style.width = "180px";

        card.innerHTML = `
            <h5>${prod.nombre}</h5>
            <p>$${prod.precio}</p>
            <button class="btn btn-primary btn-sm">Agregar</button>
        `;

        card.querySelector("button").onclick = () => agregarAlCarrito(prod.id);
        cont.appendChild(card);
    });
}


// Agregar producto al carrito

function agregarAlCarrito(id) {
    const item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad++;
    } else {
        const prod = productos.find(p => p.id === id);
        carrito.push({ ...prod, cantidad: 1 });
    }

    guardar();
    mostrarCarrito();
}


// Mostrar carrito en la lista <ul>

function mostrarCarrito() {
    const lista = document.getElementById("carrito");
    lista.innerHTML = "";

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
            ${item.nombre} - $${item.precio} c/u
            <div>
                <input type="number" min="1" value="${item.cantidad}" style="width:60px" class="form-control d-inline">
                <button class="btn btn-danger btn-sm">X</button>
            </div>
        `;

        li.querySelector("input").onchange = (e) => modificarCantidad(item.id, e.target.value);
        li.querySelector("button").onclick = () => eliminarDelCarrito(item.id);

        lista.appendChild(li);
    });

    actualizarTotal();
}


// Modificar cantidad de un producto

function modificarCantidad(id, cant) {
    const item = carrito.find(p => p.id === id);
    item.cantidad = parseInt(cant);

    if (item.cantidad <= 0) eliminarDelCarrito(id);

    guardar();
    mostrarCarrito();
}


// Eliminar producto del carrito

function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardar();
    mostrarCarrito();
}


// Vaciar el carrito

function vaciarCarrito() {
    carrito = [];
    guardar();
    mostrarCarrito();
}


// Guardar carrito en localStorage

function guardar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


// Actualizar total

function actualizarTotal() {
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById("total").textContent = "$" + total;
}


// Inicialización

mostrarProductos();
mostrarCarrito();
