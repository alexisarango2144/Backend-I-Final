import { cartRepository } from "../repositories/carts-repository.js";
import { CustomError } from "../utils/custom-error.js";

class CartsController {
  constructor(repository) {
    this.repository = repository;
  }

  getCartById = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const response = await this.repository.getById(cid);
      if (!response) throw new CustomError("Cart not found", 404);
      res.status(200).json({ status: "success", payload: response });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const response = await this.repository.create(req.body);
      res.status(201).json({ status: "success", payload: response });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const { products } = req.body; // Esperado: {products: [{productId, quantity}, ...]}
      
      if (!Array.isArray(products)) throw new CustomError("Products must be an array", 400);
      
      const response = await this.repository.update(cid, req.body);
      if (!response) throw new CustomError("Cart not found", 404);

      res.status(200).json({ status: "success", payload: response });
    } catch (error) {
      next(error);
    }
  };

  deleteAllProducts = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const response = await this.repository.clearCart(cid);
      if (!response) throw new CustomError("Cart not found", 404);

      res.status(200).json({ status: "success", message: "All products removed", payload: response });
    } catch (error) {
      next(error);
    }
  };

  deleteProductFromCart = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const response = await this.repository.removeProduct(cid, pid);
      if (!response) throw new CustomError("Cart or Product not found", 404);
      
      res.status(200).json({ status: "success", message: "Product removed from cart", payload: response });
    } catch (error) {
      next(error);
    }
  }

  updateProductQuantity = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if(!quantity || isNaN(quantity)) throw new CustomError("Valid quantity is required", 400);
      
      const response = await this.repository.updateProductQuantity(cid, pid, Number(quantity));
      if(!response) throw new CustomError("Cart or Product not found", 404);

      res.status(200).json({status: "success", payload: response });
    } catch (error) {
      next(error);
    }
  }
}

export const cartsController = new CartsController(cartRepository);
