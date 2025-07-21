console.log("Iniciando backend Mercado Pago...");

const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const path = require('path');

const app = express();
console.log("Express inicializado");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
console.log("Middlewares cargados");


console.log("Valor del token:", process.env.MERCADOPAGO_TOKEN);

let client;
try {
  client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_TOKEN
  });
  console.log("Cliente Mercado Pago creado:", !!client);
} catch (err) {
  console.error("Error creando cliente Mercado Pago:", err);
}

app.post('/crear-preferencia', async (req, res) => {
  try {
    const items = req.body.items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: "CLP"
    }));
    console.log("Recibido en backend:", items);

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items,
        back_urls: {
          success: "https://tusitio.com/success",
          failure: "https://tusitio.com/failure",
          pending: "https://tusitio.com/pending"
        },
        auto_return: "approved"
      }
    });
    res.json({ id: result.id });
  } catch (error) {
    console.error("Error en /crear-preferencia:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor Mercado Pago en puerto ${PORT}`));