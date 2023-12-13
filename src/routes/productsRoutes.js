import { Router } from "express";
import ProductManager from "../utils/productManager.js";

const productsRouter = Router();
const productManager = new ProductManager("./products.json");

productsRouter.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getProducts();
        if (!limit) {
            return res.send(products);
        }
        const limitProducts = products.slice(0, +limit);
        res.send(limitProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching products" });
    }
});

productsRouter.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(parseInt(pid));
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: `Product with ID ${pid} not found` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching product" });
    }
});

productsRouter.post("/", async (req, res) => {
    try {
        const newProduct = req.body;

        // Validación de datos
        if (!isValidProduct(newProduct)) {
            return res.status(400).send({ message: "Invalid product data" });
        }

        await productManager.addProduct(newProduct);
        res.status(201).send({ message: "Product added" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error adding product" });
    }
});

productsRouter.put("/:pId", async (req, res) => {
    try {
        const { pId } = req.params;
        const updateProduct = req.body;
        await productManager.updateProduct(updateProduct, pId);
        res.send({ message: "Product updated" });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Product not found" });
    }
});

productsRouter.delete("/:pId", async (req, res) => {
    const { pId } = req.params;
    await productManager.deleteProduct(pId);
    res.send({ message: "Product deleted" });
});

// Función de validación de productos
function isValidProduct(product) {
    return (
        product &&
        product.title &&
        product.description &&
        product.price &&
        product.thumbnail &&
        product.code &&
        product.stock
    );
}

export default productsRouter;
