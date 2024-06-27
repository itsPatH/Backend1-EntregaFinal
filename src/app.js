import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { ProductManager } from "./managers/productManager.js";
import { CartManager } from "./managers/cartManager.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

const PORT = 8080;
const app = express();

const server = app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
const socketServer = new Server(server);

socketServer.on('connection', (socketClient) => {
    console.log("Socket conectado");
});

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
