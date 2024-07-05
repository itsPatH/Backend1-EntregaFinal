import express from "express";
import { engine } from "express-handlebars";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import ProductManager from "./managers/productManager.js";
import CartManager from "./managers/cartManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});

// Configura Express para el motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Configura Express para servir archivos estáticos
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Instancia de los managers
export const productManager = new ProductManager();
export const cartManager = new CartManager();

// Configura Socket.IO para escuchar conexiones
io.on('connection', (socket) => {
    console.log('Usuario conectado');
    // Aquí puedes manejar eventos de Socket.IO
});
