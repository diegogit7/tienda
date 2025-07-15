const listaCarrito = document.getElementById("listaCarrito");
const carritoTotal = document.getElementById("carritoTotal");
const contador = document.getElementById("contador");

function renderCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  listaCarrito.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p style='text-align:center;'>No hay productos en el carrito.</p>";
    carritoTotal.textContent = "";
    if (contador) {
      contador.textContent = 0;
      contador.setAttribute('data-cantidad', 0);
      contador.style.display = 'none';
      const numeroCarrito = contador.querySelector('.numero-carrito');
      if (numeroCarrito) numeroCarrito.textContent = 0;
    }
    return;
  }

  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "24px";
    div.style.marginBottom = "24px";
    div.style.borderBottom = "1px solid #eee";
    div.style.paddingBottom = "16px";
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" style="width:120px; height:auto;" />
      <div style="flex:1;">
        <h3 style="margin:0 0 8px 0;">${item.nombre}</h3>
        <p style="margin:0 0 8px 0;">Talla: <strong>${item.talla || '-'}</strong></p>
        <p style="margin:0 0 8px 0;">Cantidad: <strong>${item.cantidad}</strong></p>
        <p style="margin:0 0 8px 0;">Precio unitario: $${item.precio}</p>
        <p style="margin:0 0 8px 0;">Subtotal: $${item.precio * item.cantidad}</p>
        <button class="eliminar" data-id="${item.id}" data-talla="${item.talla}">Eliminar</button>
      </div>
    `;
    listaCarrito.appendChild(div);
  });

  
  carritoTotal.textContent = total;

  
  const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  if (contador) {
    contador.textContent = cantidad;
    contador.setAttribute('data-cantidad', cantidad);
    contador.style.display = cantidad === 0 ? 'none' : 'inline-block';
    const numeroCarrito = contador.querySelector('.numero-carrito');
    if (numeroCarrito) numeroCarrito.textContent = cantidad;
  }

  
  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.onclick = function() {
      const id = Number(btn.getAttribute("data-id"));
      const talla = btn.getAttribute("data-talla");
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito = carrito.filter(item => !(item.id === id && item.talla === talla));
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito(); 
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();

  const comprarBtn = document.getElementById("comprarCarrito");
  if (comprarBtn) {
    comprarBtn.onclick = async function() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const items = carrito.map(item => ({
        title: item.nombre + " Talla " + (item.talla || "-"),
        quantity: item.cantidad,
        unit_price: item.precio
      }));

          const res = await fetch('http://192.168.0.16:3001/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      const data = await res.json();
      if (data.id) {
        window.location.href = `https://www.mercadopago.cl/checkout/v1/redirect?pref_id=${data.id}`;
      } else {
        alert("Error al iniciar pago");
      }
    };
  }

  const vaciarBtn = document.getElementById("vaciarCarrito");
  if (vaciarBtn) {
    vaciarBtn.onclick = function() {
      localStorage.removeItem("carrito");
      location.reload();
    };
  }
});