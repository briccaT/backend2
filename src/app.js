import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const server = app.listen(PORT, () => {
    const address = server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Server listening on http://localhost:${port}`);
});

// Manejo de errores al iniciar el servidor
server.on("error", (error) => {
    console.error("Error starting server:", error);
});

// Cierre del servidor
process.on("SIGINT", () => {
    console.log("Server shutting down...");
    server.close(() => {
        console.log("Server shut down successfully.");
        process.exit(0);
    });
});
