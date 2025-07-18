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
    <div id="accionesDetalle" style="display: flex; flex-direction: column; gap: 10px; margin: 18px 0 8px 0;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div>
          <label for="talla" style="font-weight:bold;">Talla:</label>
          <select id="talla" style="margin-left:8px; padding:4px;">
            <option value="35">35</option>
            <option value="36">36</option>
            <option value="37">37</option>
            <option value="38">38</option>
            <option value="39">39</option>
          </select>
        </div>
        <button id="agregarDetalle" class="btn eliminar">Agregar al carrito</button>
      </div>
      <button id="comprarAhora" style="width:100%; padding:8px 0; background:#28a745; color:#fff; font-size:1em; border:none; border-radius:6px;">
        Comprar ahora
      </button>
    </div>
  </div>
`;
// ...existing code...

  document.getElementById("agregarDetalle").onclick = function() {
    const talla = document.getElementById("talla").value;
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let item = carrito.find(i => i.id === producto.id && i.talla === talla);
    if (item) {
      item.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1, talla });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
  };

  document.getElementById("comprarAhora").onclick = function() {
    const talla = document.getElementById("talla").value;
    localStorage.setItem("compraDirecta", JSON.stringify({
      ...producto,
      cantidad: 1,
      talla
    }));
    window.location.href = "pago.html";
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

  const carritoIcono = document.getElementById("carritoIcono");
  if (carritoIcono) {
    carritoIcono.addEventListener("click", () => {
      window.location.href = "carrito.html";
    });
  }
});