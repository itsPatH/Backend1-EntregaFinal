import express from "express";
import { engine } from "express-handlebars";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import ProductManager from "./managers/productManager.js";
import CartManager from "./managers/CartManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import mongoose from 'mongoose';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = 8080;

const CONNECTION_STRING = "mongodb+srv://herrerapatriciadg:Gu4r1p0l0@clustersaurio.kjwdhw2.mongodb.net/vinyls?retryWrites=true&w=majority&appName=ClusterSaurio";

const connection = mongoose.connect(CONNECTION_STRING);

server.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});

app.engine('handlebars', engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.io = io;
    next();
  });

  app.get('/', (req, res) => {
    res.render('home')
});
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', (socket) => {
    console.log('Usuario conectado');
});