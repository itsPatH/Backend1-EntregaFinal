import productModel from './models/productModel.js';

class ProductManager {
  async createProduct(productData) {
    try {
      const newProduct = await productModel.create(productData);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel.findById(productId);
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  async getAllProducts(page = 1, limit = 10) {
    try {
      const options = {
        page,
        limit,
      };
      const products = await productModel.paginate({}, options);
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  async updateProduct(productId, updateData) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      await productModel.findByIdAndDelete(productId);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export default new ProductManager();
