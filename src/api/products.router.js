import { Router } from "express";
import { productsController } from "../controllers/products-controller.js";

const router = Router();

router.get("/", productsController.getAllProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", productsController.createProduct);
router.put("/:pid", productsController.update);
router.delete("/:pid", productsController.delete);

export default router;