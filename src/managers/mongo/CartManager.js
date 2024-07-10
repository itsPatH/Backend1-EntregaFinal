import cartModel from './models/cartModel.js';
import productModel from './models/productModel.js';

class CartManager {
  async createCart() {
    try {
      const newCart = await cartModel.create({});
      return newCart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      return cart;
    } catch (error) {
      console.error('Error fetching cart by ID:', error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const existingProductIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.products = cart.products.filter(
        (p) => p.product.toString() !== productId
      );

      await cart.save();
      return cart;
    } catch (error) {
      console.error('Error removing product from cart:', error);
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

export default new CartManager();
