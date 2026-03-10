import { ProductModel } from "../models/products-model.js";

class ProductRepository {
  constructor(model) {
    this.model = model;
  }

  getAll = async (page = 1, limit = 10, sort = {}, filter = {}) => {
    try {
      return await this.model.paginate(filter, { page, limit, sort, lean: true });
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  };

  getById = async (id) => {
    try {
      // Usamos lean() para que devuelva un objeto plano de JS y no un documento de Mongoose
      return await this.model.findById(id).lean();
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  };

  getByName = async (name, page = 1, limit = 10) => {
    try {
      const query = { title: { $regex: name, $options: "i" } };
      return await this.model.paginate(query, { page, limit, lean: true });
    } catch (error) {
      throw new Error(`Error al buscar productos por nombre: ${error.message}`);
    }
  };

  create = async (body) => {
    try {
      return await this.model.create(body);
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  };

  update = async (id, body) => {
    try {
      return await this.model.findByIdAndUpdate(id, body, {
        returnDocument: "after",
      }).lean();
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  };

  delete = async (id) => {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  };
}

export const productRepository = new ProductRepository(ProductModel);
