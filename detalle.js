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
      <div id="accionesDetalle" style="display: flex; flex-direction: column; gap: 18px; margin: 18px 0 8px 0;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 18px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <div class="selector-talla" style="display: flex; align-items: center; gap: 8px;">
              <label for="talla" style="font-weight:bold; font-size:1em; color:#222;">Talla:</label>
              <button type="button" id="restarTalla" style="font-size:1.1em; padding:2px 10px; border-radius:4px; border:1px solid #bbb; background:#f7f7f7; cursor:pointer;">−</button>
              <select id="talla" style="font-size:1em; width:60px; text-align:center;">
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
              </select>
              <button type="button" id="sumarTalla" style="font-size:1.1em; padding:2px 10px; border-radius:4px; border:1px solid #bbb; background:#f7f7f7; cursor:pointer;">+</button>
            </div>
            <div class="selector-cantidad" style="display:flex; align-items:center; gap:8px; margin-top:10px;">
              <label for="cantidad" style="font-weight:bold; font-size:1em; color:#222;">Cantidad:</label>
              <button type="button" id="restarCantidad" style="font-size:1.1em; padding:2px 10px; border-radius:4px; border:1px solid #bbb; background:#f7f7f7; cursor:pointer;">−</button>
              <input type="number" id="cantidad" value="1" min="1" style="width:40px; text-align:center; font-size:1em; border-radius:4px; border:1.5px solid #bbb; background:#f7f7f7; color:#222;" />
              <button type="button" id="sumarCantidad" style="font-size:1.1em; padding:2px 10px; border-radius:4px; border:1px solid #bbb; background:#f7f7f7; cursor:pointer;">+</button>
            </div>
          </div>
                                     <div style="display: flex; width: 100%; gap: 10px; margin-top: 10px;">
                    <button id="agregarDetalle" class="btn eliminar boton-carrito" style="flex:1;">Agregar al carrito</button>
                    <button id="irATienda" class="btn eliminar boton-carrito" style="flex:1;">Ir a tienda</button>
                  </div>
      </div>
    </div>
  `;

  // Talla + y -
  const selectTalla = document.getElementById("talla");
  document.getElementById("sumarTalla").onclick = () => {
    let idx = selectTalla.selectedIndex;
    if (idx < selectTalla.options.length - 1) selectTalla.selectedIndex = idx + 1;
  };
  document.getElementById("restarTalla").onclick = () => {
    let idx = selectTalla.selectedIndex;
    if (idx > 0) selectTalla.selectedIndex = idx - 1;
  };

  // Cantidad + y -
  const inputCantidad = document.getElementById("cantidad");
  document.getElementById("sumarCantidad").onclick = () => {
    inputCantidad.value = Number(inputCantidad.value) + 1;
  };
  document.getElementById("restarCantidad").onclick = () => {
    if (Number(inputCantidad.value) > 1) {
      inputCantidad.value = Number(inputCantidad.value) - 1;
    }
  };

  // Agregar al carrito
  document.getElementById("agregarDetalle").onclick = function() {
    const talla = selectTalla.value;
    const cantidad = Number(inputCantidad.value) || 1;
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let item = carrito.find(i => i.id === producto.id && i.talla === talla);
    if (item) {
      item.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad, talla });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    window.location.href = "carrito.html";
  };

  // Seguir comprando
  document.getElementById("irATienda").onclick = function() {
    window.location.href = "index.html";
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