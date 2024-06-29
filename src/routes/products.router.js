/* 
import { Router } from "express";
import { productManager } from "../app.js";
import { productsService } from '../managers/index.js'

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
    const newProduct = {
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      thumbnails: [],
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
*/
import { Router } from 'express';
import { productsService } from '../managers/index.js';
import uploader from '../service/uploader.js';

const router = Router();

// Get products
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productsService.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      return res.json(limitedProducts);
    }

    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send({ status: 'error', message: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsService.getProductById(parseInt(pid));

    if (!product) {
      return res.status(404).send({ status: 'error', message: `Product with ID ${pid} not found` });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).send({ status: 'error', message: `Error fetching product with ID ${pid}` });
  }
});

// Create product
router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
  const product = req.body;
  try {
    const newProduct = {
      title: product.title,
      description: product.description,
      code: product.code,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
      category: product.category,
      thumbnails: [],
    };

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        newProduct.thumbnails.push({
          mimetype: req.files[i].mimetype,
          path: `/files/products/${req.files[i].filename}`,
          main: i === 0,
        });
      }
    }

    const result = await productsService.createProduct(newProduct);
    req.io.emit('newProduct', result);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'error', error: error.message });
  }
});

// Update product by ID
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status = true,
      category,
    } = req.body;
    
    const updatedProduct = {
      title,
      description,
      price: parseFloat(price),
      thumbnails,
      code,
      stock: parseInt(stock),
      status,
      category,
    };

    const response = await productsService.updateProduct(parseInt(pid), updatedProduct);
    res.json(response);
  } catch (error) {
    res.status(500).send({ status: 'error', message: `Error updating product with ID ${pid}` });
  }
});

// Delete product by ID
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productsService.getProductById(parseInt(pid));
    if (!product) {
      return res.status(404).send({ status: 'error', message: 'Product not found' });
    }

    await productsService.deleteProduct(parseInt(pid));
    req.io.emit('deleteProduct', pid);
    res.send({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).send({ status: 'error', message: 'Error deleting product' });
  }
});

export default router;
