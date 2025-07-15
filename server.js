console.log("Iniciando backend Mercado Pago...");

const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');

const mp = new mercadopago.MercadoPagoConfig({
  accessToken: "APP_USR-1906770288972469-071503-51ebf8bb7f35f705c806873a7e03b3c1-275926486"
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/crear-preferencia', async (req, res) => {
  try {
    const items = req.body.items; // [{title, quantity, unit_price}]
    const preference = {
      items: items,
      back_urls: {
        success: "https://tusitio.com/success",
        failure: "https://tusitio.com/failure",
        pending: "https://tusitio.com/pending"
      },
      auto_return: "approved"
    };
    const response = await mp.preference.create(preference);
    res.json({ id: response.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Servidor Mercado Pago en puerto 3001'));