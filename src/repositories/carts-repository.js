import { CartModel } from "../models/cart-model.js";

class CartRepository {
  constructor(model) {
    this.model = model;
  }

  getById = async (id, page = 1, limit = 10) => {
    try {
      return await this.model.paginate(
        { _id: id },
        {
          page,
          limit,
          populate: {
            path: "products.productId",
            select: "title price thumbnails stock",
          },
          lean: true,
        },
      );
      //return await this.model.findById(id).populate('products', {_id: 0,})
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  };

  addProductToCart = async (cartId, productId, quantity = 1) => {
    try {
      const cart = await this.model.findOne({
        _id: cartId,
        "products.productId": productId,
      });

      if (cart) {
        return await this.model.findOneAndUpdate(
          { _id: cartId, "products.productId": productId },
          { $inc: { "products.$.quantity": quantity } },
          { new: true },
        );
      } else {
        return await this.model.findByIdAndUpdate(
          cartId,
          { $push: { products: { productId, quantity } } },
          { new: true },
        );
      }
    } catch (error) {
      throw new Error(`Error al agregar el producto: ${error.message}`);
    }
  };

  // Actualizar la cantidad de un producto (reemplazo total sin incremento)
  updateProductQuantity = async (cartId, productId, newQuantity) => {
    try {
      return this.model.findOneAndUpdate(
        { _id: cartId, "products.productId": productId },
        { $set: { "products.$.quantity": newQuantity } },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  };

  removeProduct = async (cartId, productId) => {
    try {
      return await this.model.findByIdAndUpdate(
        cartId,
        { $pull: { products: { productId: productId } } },
        { new: true },
      );
    } catch (error) {
      throw new Error(
        `Error al eliminar producto del carrito: ${error.message}`,
      );
    }
  };

  create = async (body) => {
    try {
      return await this.model.create(body);
    } catch (error) {
      throw new Error(error);
    }
  };

  clearCart = async (cartId) => {
    try {
      return await this.model.findByIdAndUpdate(
        cartId,
        { $set: { products: [] } },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Error al vaciar el carrito: ${error.message}`);
    }
  };

  update = async (id, body) => {
    try {
      return await this.model.findByIdAndUpdate(id, body, { new: "true" });
    } catch (error) {
      throw new Error(error);
    }
  };

  delete = async (id) => {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error);
    }
  };
}

export const cartRepository = new CartRepository(CartModel);
