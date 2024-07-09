import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager();

router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    if (isNaN(cartId)) {
        return res.status(400).send("Invalid cart ID");
    }
    try {
        const productCart = await manager.showProductCart(cartId);
        if (!productCart) {
            return res.status(404).send("Product Cart not found");
        }
        res.send(productCart);
    } catch (error) {
        res.status(500).send("Error retrieving product cart");
    }
});

router.post('/', async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || typeof quantity !== 'number') {
        return res.status(400).send("Product and quantity are required to add to cart");
    }
    try {
        const newCart = await manager.addProductCart({ productId, quantity });
        if (newCart) {
            res.status(201).send("Product Cart added correctly");
        } else {
            res.status(400).send("Product not found");
        }
    } catch (error) {
        res.status(500).send("Product Cart not added");
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cartId = parseInt(cid);
    const productId = parseInt(pid);
    if (isNaN(cartId) || isNaN(productId) || !quantity || typeof quantity !== "number") {
        return res.status(400).send("Invalid input data");
    }
    try {
        const updated = await manager.updateCart(cartId, productId, quantity);
        if (updated) {
            res.status(200).send("Product Cart updated");
        } else {
            res.status(400).send("Product not found in cart");
        }
    } catch (error) {
        res.status(500).send("Product Cart not updated");
    }
});

export default router;


