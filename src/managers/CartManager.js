/* import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

class CartManager {
  constructor() {
    this.path = "cart.json";
    this.carts = [];
  }

  async getCarts() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const responseJSON = JSON.parse(response);
      return responseJSON;
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      return [];
    }
  }

  async getCartProducts(id) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === id);
    if (cart) {
      return cart.products;
    } else {
      console.log("No se pudo encontrar el carrito");
      return [];
    }
  }

  async newCart() {
    try {
      const id = uuidv4();
      const newCart = { id, products: [] };
      this.carts = await this.getCarts();
      this.carts.push(newCart);
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
      return newCart;
    } catch (error) {
      console.error("Error al crear un nuevo carrito:", error);
      return null;
    }
  }

  async addProductToCart(cart_id, product_id) {
    try {
      let carts = await this.getCarts();
      const index = carts.findIndex((cart) => cart.id === cart_id);
      if (index !== -1) {
        const cartProducts = await this.getCartProducts(cart_id);
        const existingProductIndex = cartProducts.findIndex(
          (product) => product.product_id === product_id
        );

        if (existingProductIndex !== -1) {
          cartProducts[existingProductIndex].quantity++;
        } else {
          cartProducts.push({ product_id, quantity: 1 });
        }

        carts[index].products = cartProducts;
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        console.log("Producto agregado al carrito");
      } else {
        console.log("No se ha encontrado el carrito");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  }
}

export default CartManager; */
import fs from 'fs/promises';
import path from 'path';

const CART_PATH = path.resolve('src/data/carts.json');
const PRODUCTS_PATH = path.resolve('src/data/products.json');

class CartManager {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const exists = await fs.access(CART_PATH).then(() => true).catch(() => false);
      if (!exists) {
        await fs.writeFile(CART_PATH, JSON.stringify([]));
        console.log('Cart file created successfully.');
      }
    } catch (error) {
      console.log('Error initializing cart file:', error);
    }
  }

  async getProductsCart() {
    try {
      const data = await fs.readFile(CART_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('Error reading cart data:', error);
      return [];
    }
  }

  async saveProductsCart(productsCart) {
    try {
      await fs.writeFile(CART_PATH, JSON.stringify(productsCart, null, 2));
      console.log('Cart data saved successfully.');
      return true;
    } catch (error) {
      console.log('Error writing cart data:', error);
      return false;
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(PRODUCTS_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('Error reading products file:', error);
      return [];
    }
  }

  async addProductCart({ productId, quantity }) {
    const dataProductCart = await this.getProductsCart();
    const productData = await this.getProducts();
    const product = productData.find((p) => p.id === productId);

    if (!product) {
      console.error(`Product with ID: ${productId} not found.`);
      return false;
    }

    const newProductCart = {
      id: dataProductCart.length ? dataProductCart[dataProductCart.length - 1].id + 1 : 1,
      products: [{ ...product, quantity }],
    };

    dataProductCart.push(newProductCart);
    await this.saveProductsCart(dataProductCart);
    return newProductCart;
  }

  async showProductCart(id) {
    const productCart = await this.getProductsCart();
    return productCart.find((cart) => cart.id === id) || null;
  }

  async updateCart(idCart, idProduct, quantity) {
    const dataProductCart = await this.getProductsCart();
    const cartIndex = dataProductCart.findIndex((cart) => cart.id === idCart);
    if (cartIndex === -1) {
      console.log(`Cart with ID: ${idCart} not found.`);
      throw new Error('Cart index not found');
    }

    const cart = dataProductCart[cartIndex];
    const productIndex = cart.products.findIndex((p) => p.id === idProduct);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
      console.log(
        `Updated quantity for product ID: ${idProduct} in cart ID: ${idCart}.`
      );
    } else {
      console.log(
        `Product with ID: ${idProduct} not found in cart ID: ${idCart}.`
      );
      return false;
    }

    dataProductCart[cartIndex] = cart;
    await this.saveProductsCart(dataProductCart);
    return true;
  }
}

 export {CartManager};