import { Router } from "express";
import cartsRouter from "./carts.router.js";
import productsRouter from "./products.router.js";


const router = Router();

router.use("/products", productsRouter);
router.use("/carts", cartsRouter);

export default router;