const productos = [
  { id: 1, nombre: "Polera Negra", precio: 10000, imagen: "https://via.placeholder.com/200x200?text=Polera+Negra" },
  { id: 2, nombre: "Jeans Azules", precio: 20000, imagen: "https://via.placeholder.com/200x200?text=Jeans+Azules" },
  { id: 3, nombre: "Chaqueta", precio: 30000, imagen: "https://via.placeholder.com/200x200?text=Chaqueta" }
];

let carrito = [];

const productosContainer = document.getElementById("productos");
const listaCarrito = document.getElementById("listaCarrito");
const total = document.getElementById("total");
const contador = document.getElementById("contador");
const carritoUI = document.getElementById("carrito");

function renderProductos() {
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" />
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
    `;
    productosContainer.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let totalPrecio = 0;

  carrito.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    listaCarrito.appendChild(li);
    totalPrecio += item.precio;
  });

  total.textContent = totalPrecio;
  contador.textContent = carrito.length;
}

document.getElementById("verCarrito").addEventListener("click", () => {
  carritoUI.classList.remove("oculto");
});

document.getElementById("cerrarCarrito").addEventListener("click", () => {
  carritoUI.classList.add("oculto");
});

renderProductos();