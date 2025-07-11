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

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function mostrarDetalle() {
  const id = getIdFromUrl();
  const producto = productos.find(p => p.id === id);
  const detalle = document.getElementById("detalleProducto");
  if (!producto) {
    detalle.innerHTML = "";
    return;
  }
  detalle.innerHTML = `
    <div class="card" style="margin: 0 auto;">
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <div style="margin: 18px 0 8px 0;">
        <label for="talla" style="font-weight:bold;">Talla:</label>
        <select id="talla" style="margin-left:8px; padding:4px;">
          <option value="35">35</option>
          <option value="36">36</option>
          <option value="37">37</option>
          <option value="38">38</option>
          <option value="39">39</option>
        </select>
      </div>
      <div style="margin-bottom: 12px;">
        <label for="cantidad" style="font-weight:bold;">Cantidad:</label>
        <input type="number" id="cantidad" value="1" min="1" style="width:50px; margin-left:8px; padding:4px;" />
        <button id="agregarDetalle" style="margin-left:12px; padding:6px 16px;">Agregar al carrito</button>
      </div>
    </div>
  `;

  // Este bloque debe estar dentro de mostrarDetalle
  document.getElementById("agregarDetalle").onclick = function() {
    const talla = document.getElementById("talla").value;
    const cantidad = parseInt(document.getElementById("cantidad").value, 10);
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let item = carrito.find(i => i.id === producto.id && i.talla === talla);
    if (item) {
      item.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad, talla });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    // No muestra ningún mensaje ni alert
  };
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const contador = document.getElementById("contador");
  if (contador) {
    if (cantidad === 0) {
      contador.style.display = "none";
    } else {
      contador.style.display = "inline-block";
      contador.querySelector('.numero-carrito').textContent = cantidad;
      contador.setAttribute('data-cantidad', cantidad);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarDetalle();
  actualizarContadorCarrito();
});