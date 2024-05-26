import { Router } from "express";
import { productManager } from "../index.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      return res.json(limitedProducts);
    }

    return res.json(products);
  } catch (error) {
    console.log(error);
    res.send("Hubo un error al recibir los productos");
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await productManager.getProductById(pid);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.send(`Hubo un error al recibir el producto con ID ${pid}`);
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status = true,
      category,
    } = req.body;

    const response = await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.send("Hubo un error al intentar añadir producto");
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status = true,
      category,
    } = req.body;
    const response = await productManager.updateProduct(pid, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });
    res.json(response);
  } catch (error) {
    res.send(`Hubo un error al intentar editar el producto con ID ${pid}`);
  }
});

productsRouter.delete("/pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(pid);
    res.send("El producto ha sido eliminado con éxito");
  } catch (error) {
    console.log(error);
    res.send(`No se ha podido eliminar el producto con ID ${pid}`);
  }
});

export { productsRouter };
