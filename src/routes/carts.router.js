/*
import { Router } from "express";
import { cartManager } from "../index.js";

const cartsRouter = Router();

cartsRouter.post ('/', async (req, res) => {
    try {
        const response = await cartManager.newCart ()
        res.json (response)
    } catch (error) {
        res.send ('Hubo un error al crear el carrito')   
    }
})

cartsRouter.get ('/:cid', async (req, res) => {
    const {cid} = req.params;
    try {
        const response = await cartManager.getCartProducts(cid)
        res.json(response)
    } catch (error) {
        res.send ('Ha ocurrido un error al intentar enviar los productos')
        
    }
})

cartsRouter.post ('cid/products/:pid', async (req, res) => {
    const{cid, pid} = req.params;
    try {
        await cartManager.addProductToCart(cid, pid)
        res.send('Se ha agregado el producto')
    } catch (error) {
        res.send('Ha ocurrido un error al intentar guardar los productos')
        
    }
}
})

export default cartsRouter;
*/
import { Router } from "express";
import { cartManager } from "../index.js";

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const response = await cartManager.newCart();
    res.json(response);
  } catch (error) {
    res.send("Hubo un error al crear el carrito");
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartManager.getCartProducts(cid);
    res.json(response);
  } catch (error) {
    res.send("Ha ocurrido un error al intentar enviar los productos");
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartManager.addProductToCart(cid, pid);
    res.send("Se ha agregado el producto");
  } catch (error) {
    res.send("Ha ocurrido un error al intentar guardar los productos");
  }
});

export { cartsRouter };
