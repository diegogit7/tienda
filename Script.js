const productos = [
  { id: 1, nombre: "Zapatilla negra tachas", precio: 64900, imagen: "zapatillas/Negratachas.jpg" , stock: { "36": 1, "37": 2, "39": 1 } }, 
  { id: 2, nombre: "Zapatilla multicolor", precio: 64900, imagen: "zapatillas/Multicolor.jpg" ,  stock: { "35": 4, "36": 5, "37": 4, "38": 7, "39": 2 } }, 
  { id: 3, nombre: "Zapatilla naranja", precio: 64900, imagen: "zapatillas/Naranja.jpg", stock: { "35": 2, "36": 2, "37": 3, "38": 3, "39": 2 } }, 
  { id: 4, nombre: "Zapatilla animal print fluor", precio: 64900, imagen: "zapatillas/Animalprintfluor.jpg",  stock: { "35": 3, "36": 1, "37": 5, "38": 2, "39": 1 } },
  { id: 5, nombre: "Zapatilla dorada", precio: 64900, imagen: "zapatillas/Dorada.jpg",  stock: { "35": 2, "36": 1, } },
  { id: 6, nombre: "Zapatilla animal print tacha", precio: 64900, imagen: "zapatillas/Animalprintzebra.jpg" ,  stock: { "35": 5, "36": 7, "37": 8, "38": 9, "39": 2 } }
    
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
      <h3 style="margin-bottom:4px;">${p.nombre}</h3>
      <p style="margin:0 0 6px 0; font-weight:400; color:#555;">$${p.precio}</p>
      <button class="btn eliminar boton-carrito ver-detalles-btn">Ver detalles</button>
    `;
    
    card.onclick = () => {
      window.location.href = `detalle.html?id=${p.id}`;
    };
    
    const btnDetalles = card.querySelector(".ver-detalles-btn");
    if (btnDetalles) {
      btnDetalles.onclick = (e) => {
        e.stopPropagation();
        window.location.href = `detalle.html?id=${p.id}`;
      };
    }
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



renderProductos();
actualizarCarrito();

const comprarBtn = document.getElementById("comprarCarrito");
if (comprarBtn) {
  comprarBtn.addEventListener("click", async () => {
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
}

