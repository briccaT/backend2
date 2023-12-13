import fs from 'fs/promises';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error("Todos los campos son obligatorios.");
        }

        const { title, description, category, price, thumbnail, code, stock } = product;
        const products = await this.getProducts();
        const newProduct = {
            id: products.length + 1,
            status: true,
            title,
            description,
            category,
            price,
            thumbnail,
            code,
            stock
        };

        products.push(newProduct);
        await this.writeProducts(products);
        return newProduct;
    }

    async getProducts() {
        try {
            const products = await fs.readFile(this.path, "utf-8");
            return JSON.parse(products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === +id) || null;
    }

    async updateProduct(product, id) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === +id);

        if (index !== -1) {
            products[index] = { ...products[index], ...product };
            await this.writeProducts(products);
            console.log(`Producto con ID ${id} actualizado exitosamente.`);
        } else {
            console.log(`No se encontró un producto con el ID ${id}.`);
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === +id);

        if (index !== -1) {
            products.splice(index, 1);
            await this.writeProducts(products);
            console.log(`El producto con el ID ${id} fue eliminado.`);
        } else {
            console.error(`No se encontró un producto con el ID ${id}.`);
        }
    }

    async writeProducts(products) {
        await fs.writeFile(this.path, JSON.stringify(products), "utf-8");
    }
}

export default ProductManager;
