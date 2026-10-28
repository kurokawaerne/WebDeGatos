const mongoose = require('mongoose');

module.exports = async () => {
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL en las variables de entorno');
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('MongoDB conectado');
};
