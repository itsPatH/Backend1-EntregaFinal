// cartManager.js
import { promises as fs } from "fs";
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

export default CartManager;
