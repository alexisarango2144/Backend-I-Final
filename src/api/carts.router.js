import { Router } from "express";
import { cartsController } from "../controllers/carts-controller.js";

const router = Router();

router.post("/", cartsController.create);
router.post("/:cid/products/:pid", cartsController.addProdToCart);
router.get("/:cid", cartsController.getCartById);
router.delete("/:cid/products/:pid", cartsController.deleteProductFromCart);
// UPDATE carrito con un Array de productos
router.put("/:cid", cartsController.update);
// UPDATE solo la cantidad de un producto
router.put("/:cid/products/:pid", cartsController.updateProductQuantity);
// DELETE para eliminar/vaciar los productos del carrito
router.delete("/:cid", cartsController.deleteAllProducts);

export default router;