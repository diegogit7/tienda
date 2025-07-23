const productos = [
  { id: 1, nombre: "Zapatilla Tachas", precio: 64900, imagen: "zapatillas/Tachas.jpg" },
  { id: 2, nombre: "Zapatilla Zebra", precio: 64900, imagen: "zapatillas/Zebra.jpg" },
  { id: 3, nombre: "Zapatilla negra tachas", precio: 64900, imagen: "zapatillas/Negratachas.jpg" },
  { id: 4, nombre: "Zapatilla multicolor", precio: 64900, imagen: "zapatillas/Multicolor.jpg" },
  { id: 5, nombre: "Zapatilla naranja", precio: 64900, imagen: "zapatillas/Naranja.jpg" },
  { id: 6, nombre: "Zapatilla animal print fluor", precio: 64900, imagen: "zapatillas/Animalprintfluor.jpg" },
  { id: 7, nombre: "Zapatilla dorada", precio: 64900, imagen: "zapatillas/Dorada.jpg" },
  { id: 8, nombre: "Zapatilla animal print zebra", precio: 64900, imagen: "zapatillas/Animalprintzebra.jpg" },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productosContainer = document.getElementById("productos");
const listaCarrito = document.getElementById("listaCarrito");
const total = document.getElementById("total");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");


function renderProductos() {
  productosContainer.innerHTML = "";
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" />
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button class="btn eliminar boton-carrito ver-detalles-btn">Ver detalles</button>
    `;
    
    card.querySelector(".ver-detalles-btn").addEventListener("click", (e) => {
      e.stopPropagation(); 
      window.location.href = `detalle.html?id=${p.id}`;
    });
    productosContainer.appendChild(card);
  });
}


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


function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
  actualizarCarrito();
  mostrarMensaje("Producto eliminado del carrito");
}


function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  mostrarMensaje("Carrito vaciado");
}


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


document.getElementById("carritoIcono").addEventListener("click", () => {
  window.location.href = "carrito.html";
});

document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);


renderProductos();
actualizarCarrito();

document.getElementById("comprarCarrito").addEventListener("click", async () => {
  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío");
    return;
  }
  try {
    const response = await fetch("/crear-preferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: carrito.map(item => ({
          title: item.nombre,
          quantity: item.cantidad,
          unit_price: item.precio
        }))
      })
    });
    const data = await response.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      mostrarMensaje("Error al crear preferencia de pago");
    }
  } catch (error) {
    mostrarMensaje("Error al conectar con Mercado Pago");
  }
});