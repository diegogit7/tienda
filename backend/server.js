// server.js - VERSIÓN CON VALIDACIÓN DE PRECIOS (CORREGIDA)
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
app.use(express.static(path.join(__dirname, '..')));

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_TOKEN
});

// RUTAS
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Crear preferencia de pago - CON VALIDACIÓN DE PRECIOS (CORREGIDA)
app.post('/crear-preferencia', async (req, res) => {
  try {
    // 🔒 LISTA DE PRECIOS REALES (claves en minúscula sin talla)
    const PRECIOS_REALES = {
      'zapatilla negra': 64900,
      'zapatilla multicolor': 64900,
      'zapatilla naranja': 64900,
      'zapatilla animal print fluor': 64900,
      'zapatilla dorada': 64900,
      'zapatilla animal print tacha': 64900,
    };

    // Validar cada item
    const items = req.body.items.map(item => {
      // 🔧 Limpiar el título para buscar en PRECIOS_REALES
      const tituloLimpio = item.title
        .split(' Talla')[0]  // Quitar "Talla X"
        .toLowerCase()       // Convertir a minúsculas
        .trim();             // Quitar espacios extras
      
      const precioReal = PRECIOS_REALES[tituloLimpio];
      
      if (!precioReal) {
        console.log(`Producto no encontrado: "${tituloLimpio}" (título original: "${item.title}")`);
        throw new Error(`Producto no encontrado: ${item.title}`);
      }
      
      if (item.unit_price !== precioReal) {
        console.log(`Precio inválido: ${item.title} - Esperado: ${precioReal}, Recibido: ${item.unit_price}`);
        throw new Error(`Precio inválido para ${item.title}`);
      }
      
      return {
        title: item.title,
        quantity: item.quantity,
        unit_price: precioReal,
        currency_id: "CLP"
      };
    });
    
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
    res.status(400).json({ error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📦 Base de datos: Sin DB (modo solo pagos)`);
  console.log(`💳 Mercado Pago: ${process.env.MERCADOPAGO_TOKEN ? 'Configurado' : 'FALTA TOKEN'}`);
});
