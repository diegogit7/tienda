let carrito = [];
let total = 0;

function agregarAlCarrito(producto, precio) {
  carrito.push({ producto, precio });
  total += precio;
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalTexto = document.getElementById("total");
  lista.innerHTML = "";

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.producto} - $${item.precio}`;
    lista.appendChild(li);
  });

  totalTexto.textContent = `Total: $${total}`;
}
