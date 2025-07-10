const productos = [
  { id: 1, nombre: "Zapatilla Tachas", precio: 10000, imagen: "zapatillas/Tachas.jpg" },
  { id: 2, nombre: "Zapatilla Zebra", precio: 20000, imagen: "zapatillas/Zebra.jpg" },
  { id: 3, nombre: "Zapatilla negra tachas", precio: 30000, imagen: "zapatillas/Negratachas.jpg" },
  { id: 4, nombre: "Zapatilla multicolor", precio: 25000, imagen: "zapatillas/Multicolor.jpg" },
  { id: 5, nombre: "Zapatilla naranja", precio: 15000, imagen: "zapatillas/naranja.jpg" },
  { id: 6, nombre: "Zapatilla animal print fluor", precio: 12000, imagen: "zapatillas/Animalprintfluor.jpg" },
  { id: 7, nombre: "Zapatilla dorada", precio: 18000, imagen: "zapatillas/Dorada.jpg" },
  { id: 8, nombre: "Zapatilla animal print zebra", precio: 22000, imagen: "zapatillas/Animalprintzebra.jpg" },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productosContainer = document.getElementById("productos");
const listaCarrito = document.getElementById("listaCarrito");
const total = document.getElementById("total");
const contador = document.getElementById("contador");
const carritoUI = document.getElementById("carrito");
const mensaje = document.getElementById("mensaje");

function renderProductos() {
  productosContainer.innerHTML = "";
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" style="cursor:pointer;" />
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
    `;
    card.querySelector("img").addEventListener("click", () => agregarAlCarrito(p.id));
    productosContainer.appendChild(card);
  });
}

// Agrega producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarrito();
  mostrarMensaje("Producto agregado al carrito");
}

// Elimina producto del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
  actualizarCarrito();
  mostrarMensaje("Producto eliminado del carrito");
}

// Vacía el carrito
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  mostrarMensaje("Carrito vaciado");
}

// Actualiza el carrito en la UI
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let totalPrecio = 0;
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
      <button style="margin-left:10px;" data-id="${item.id}">Eliminar</button>
    `;
    li.querySelector("button").addEventListener("click", () => eliminarDelCarrito(item.id));
    listaCarrito.appendChild(li);
    totalPrecio += item.precio * item.cantidad;
  });
  total.textContent = totalPrecio;
  const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = cantidad;
  contador.setAttribute('data-cantidad', cantidad);
  contador.style.display = cantidad === 0 ? 'none' : 'inline-block';
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarMensaje(texto) {
  if (!mensaje) return;
  mensaje.textContent = texto;
  setTimeout(() => mensaje.textContent = "", 1500);
}

// Mostrar y ocultar el carrito
document.getElementById("carritoIcono").addEventListener("click", () => {
  carritoUI.classList.remove("oculto");
});
document.getElementById("cerrarCarrito").addEventListener("click", () => {
  carritoUI.classList.add("oculto");
});
document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);

// Inicializa
renderProductos();
actualizarCarrito();