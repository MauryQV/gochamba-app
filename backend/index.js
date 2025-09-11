import express from 'express';
import morgan from 'morgan';

const app = express();
const port = 3000;

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('<title>Gochamba</title><h1>Bienvenido al backend de Gochamba</h1>');
});

app.listen(port, () => {
  console.log(`Servidor de Gochamba escuchando en http://localhost:${port}`);
});