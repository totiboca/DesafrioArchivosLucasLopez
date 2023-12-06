const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(product) {
    try {
      const products = await this.readProductsFromFile();
      product.id = this.generateId(products);
      products.push(product);
      await this.writeProductsToFile(products);
      return product.id;
    } catch (error) {
      throw new Error(`Error adding product: ${error.message}`);
    }
  }

  async getProducts() {
    try {
      return await this.readProductsFromFile();
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.readProductsFromFile();
      return products.find(product => product.id === id);
    } catch (error) {
      throw new Error(`Error getting product by ID: ${error.message}`);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.readProductsFromFile();
      const index = products.findIndex(product => product.id === id);

      if (index !== -1) {
        updatedProduct.id = id;
        products[index] = updatedProduct;
        await this.writeProductsToFile(products);
      } else {
        throw new Error(`Product with ID ${id} not found`);
      }
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.readProductsFromFile();
      const updatedProducts = products.filter(product => product.id !== id);
      await this.writeProductsToFile(updatedProducts);
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  async readProductsFromFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(data) || []);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  async writeProductsToFile(products) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf8', err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  generateId(products) {
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }
}

// Uso de la clase
const productManager = new ProductManager('productos.json');

// Ejemplo de cómo usar los métodos
(async () => {
  try {
    const productId = await productManager.addProduct({
      title: 'Producto 1',
      description: 'Descripción del Producto 1',
      price: 19.99,
      thumbnail: 'path/to/thumbnail1.jpg',
      code: 'ABC123',
      stock: 50,
    });
    console.log(`Product added with ID: ${productId}`);

    const allProducts = await productManager.getProducts();
    console.log('All Products:', allProducts);

    const productIdToGet = 1; // Replace with the desired product ID
    const productById = await productManager.getProductById(productIdToGet);
    console.log('Product by ID:', productById);

    const productIdToUpdate = 1; // Replace with the desired product ID to update
    await productManager.updateProduct(productIdToUpdate, {
      title: 'Producto Actualizado',
      description: 'Descripción Actualizada',
      price: 29.99,
      thumbnail: 'path/to/updated-thumbnail.jpg',
      code: 'XYZ789',
      stock: 30,
    });
    console.log('Product updated successfully');

    const productIdToDelete = 2; // Replace with the desired product ID to delete
    await productManager.deleteProduct(productIdToDelete);
    console.log('Product deleted successfully');
  } catch (error) {
    console.error(error.message);
  }
})();