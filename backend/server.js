// server.js - VERSIÓN SIN BASE DE DATOS Y CON RUTA CORREGIDA
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
// const { Client } = require('pg'); // COMENTADO - No uso base de datos
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // ← SERVIR ARCHIVOS DESDE LA RAÍZ

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_TOKEN
});

// Configurar PostgreSQL - COMENTADO
/*
const db = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }
});
db.connect();
*/

// RUTAS
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Index.html')); // ← BUSCA EN LA RAÍZ
});

// Obtener productos - COMENTADO (no uso DB)
/*
app.get('/api/productos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

// Crear preferencia de pago - ESTA SÍ FUNCIONA
app.post('/crear-preferencia', async (req, res) => {
  try {
    const items = req.body.items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: "CLP"
    }));
    
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items,
        back_urls: {
          success: "https://tienda-3-n16v.onrender.com/exito.html",
          failure: "https://tienda-3-n16v.onrender.com/error.html",
          pending: "https://tienda-3-n16v.onrender.com/pendiente.html"
        },
        auto_return: "approved"
      }
    });
    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Descontar stock - COMENTADO (no uso DB)
/*
app.post('/api/descontar-stock', async (req, res) => {
  const { id, talla, cantidad } = req.body;
  try {
    const result = await db.query('SELECT stock FROM productos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let stock = result.rows[0].stock;
    if (!stock[talla] || stock[talla] < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }
    stock[talla] -= cantidad;

    await db.query('UPDATE productos SET stock = $1 WHERE id = $2', [stock, id]);
    res.json({ success: true, stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📦 Base de datos: Sin DB (modo solo pagos)`);
  console.log(`💳 Mercado Pago: ${process.env.MERCADOPAGO_TOKEN ? 'Configurado' : 'FALTA TOKEN'}`);
});
