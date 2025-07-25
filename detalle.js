const productos = [
  { id: 1, nombre: "Zapatilla negra tachas", precio: 64900, imagen: "zapatillas/Negratachas.jpg" , stock: { "36": 1, "37": 2, "39": 1 } }, 
  { id: 2, nombre: "Zapatilla multicolor", precio: 64900, imagen: "zapatillas/Multicolor.jpg" ,  stock: { "35": 4, "36": 5, "37": 4, "38": 7, "39": 2 } }, 
  { id: 3, nombre: "Zapatilla naranja", precio: 64900, imagen: "zapatillas/Naranja.jpg", stock: { "35": 2, "36": 2, "37": 3, "38": 3, "39": 2 } }, 
  { id: 4, nombre: "Zapatilla animal print fluor", precio: 64900, imagen: "zapatillas/Animalprintfluor.jpg",  stock: { "35": 3, "36": 1, "37": 5, "38": 2, "39": 1 } },
  { id: 5, nombre: "Zapatilla dorada", precio: 64900, imagen: "zapatillas/Dorada.jpg",  stock: { "35": 2, "36": 1, } },
  { id: 6, nombre: "Zapatilla animal print tacha", precio: 64900, imagen: "zapatillas/Animalprintzebra.jpg" ,  stock: { "35": 5, "36": 7, "37": 8, "38": 9, "39": 2 } }
    
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

  const tallasDisponibles = producto.stock
    ? Object.keys(producto.stock).filter(talla => producto.stock[talla] > 0)
    : ["35", "36", "37", "38", "39"];

  detalle.innerHTML = `
    <div class="card" style="margin: 0 auto;">
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <h3 style="margin-bottom:4px;">${producto.nombre}</h3>
      <p style="margin:0 0 6px 0; font-weight:400; color:#555;">$${producto.precio}</p>
      <div id="accionesDetalle" style="display: flex; flex-direction: column; gap: 18px; margin: 18px 0 8px 0;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 18px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <div class="selector-talla" style="display: flex; align-items: center; gap: 8px;">
              <label for="talla" style="font-weight:bold; font-size:1em; color:#222;">Talla:</label>
              <button type="button" id="restarTalla" style="font-size:1.1em; padding:2px 10px;">−</button>
              <select id="talla" style="font-size:1em; width:60px; text-align:center;">
                ${tallasDisponibles.map(talla => `<option value="${talla}">${talla}</option>`).join("")}
              </select>
              <button type="button" id="sumarTalla" style="font-size:1.1em; padding:2px 10px;">+</button>
            </div>
            <div class="selector-cantidad" style="display:flex; align-items:center; gap:8px; margin-top:10px;">
              <label for="cantidad" style="font-weight:bold; font-size:1em; color:#222;">Cantidad:</label>
              <button type="button" id="restarCantidad" style="font-size:1.1em; padding:2px 10px;">−</button>
              <input type="number" id="cantidad" value="1" min="1" style="width:40px; text-align:center; font-size:1em;" />
              <button type="button" id="sumarCantidad" style="font-size:1.1em; padding:2px 10px;">+</button>
            </div>
          </div>
          <div style="display: flex; width: 100%; gap: 10px; margin-top: 10px;">
            <button id="agregarDetalle" class="btn eliminar boton-carrito" style="flex:1;">Agregar al carrito</button>
            <button id="irATienda" class="btn eliminar boton-carrito" style="flex:1;">Ir a tienda</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Referencias a los controles
  const selectTalla = document.getElementById("talla");
  const inputCantidad = document.getElementById("cantidad");

  // Botones de tallas
  document.getElementById("sumarTalla").onclick = () => {
    let idx = selectTalla.selectedIndex;
    if (idx < selectTalla.options.length - 1) selectTalla.selectedIndex = idx + 1;
    actualizarMaxCantidad();
  };
  document.getElementById("restarTalla").onclick = () => {
    let idx = selectTalla.selectedIndex;
    if (idx > 0) selectTalla.selectedIndex = idx - 1;
    actualizarMaxCantidad();
  };

  // Limitar cantidad según stock de la talla
  function actualizarMaxCantidad() {
    const talla = selectTalla.value;
    const max = producto.stock[talla] || 1;
    inputCantidad.max = max;
    if (Number(inputCantidad.value) > max) {
      inputCantidad.value = max;
    }
  }
  selectTalla.addEventListener("change", actualizarMaxCantidad);
  actualizarMaxCantidad();

  // Botones de cantidad
  document.getElementById("sumarCantidad").onclick = () => {
    if (Number(inputCantidad.value) < Number(inputCantidad.max)) {
      inputCantidad.value = Number(inputCantidad.value) + 1;
    }
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

  
  document.getElementById("irATienda").onclick = function() {
    window.location.href = "Index.html";
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