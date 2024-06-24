import express from "express";
import { engine } from "express-handlebars";
import { ProductManager } from "./productManager.js";
import { CartManager } from "./cartManager.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";

const PORT = 8080;

const app = express();

app.engine('handlebars', engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('Home');
});

app.get('/users', (req, res) => {
    res.render('Users');
});



app.get('/users/:uid', (req, res) => {
    const uid = req.params.uid;
    const userId = parseInt(uid);
    const user = users.find(u => u.id === userId); 

    if (!user) {
        return res.render('404', {
            entity: 'Usuario'
        });
    }

    res.render('UserDetails', { user });
});

export const productManager = new ProductManager();
export const cartManager = new CartManager();

app.use(express.json());
app.use(express.static('./src'));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
