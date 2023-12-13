import { Router } from "express";
import CartManager from "../utils/cartsManager.js";

const cartsRouter = Router();
const cartManager = new CartManager("src/utils/carts.json");

cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching carts" });
    }
});

cartsRouter.get("/:cId", async (req, res) => {
    try {
        const { cId } = req.params;
        const cartById = await cartManager.getCartById(cId);
        if (!cartById) {
            return res.status(404).send({ message: "Cart not found" });
        }
        res.send(cartById);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching cart" });
    }
});

cartsRouter.post("/", async (req, res) => {
    try {
        const cartAdded = await cartManager.addCarts();
        res.send({ message: "Cart added" });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Error adding cart" });
    }
});

cartsRouter.post("/:cId/product/:pId", async (req, res) => {
    try {
        const { cId, pId } = req.params;
        
        // Validación de parámetros
        if (!/^\d+$/.test(cId) || !/^\d+$/.test(pId)) {
            return res.status(400).send({ message: "Invalid cart or product ID" });
        }

        const productAddedToCart = await cartManager.addProductsToCart(pId, cId);
        if (!productAddedToCart) {
            return res.status(400).send({ message: "Error adding product to cart" });
        }
        res.send({ message: "Product added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error adding product to cart" });
    }
});

export default cartsRouter;
