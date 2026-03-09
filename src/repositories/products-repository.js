import { ProductModel } from "../models/products-model.js";

class ProductRepository {
  constructor(model) {
    this.model = model;
  }

  getAll = async (page = 1, limit = 10, sort = {}) => {
    try {
      return await this.model.paginate({}, { page, limit, sort, lean: true });
    } catch (error) {
      throw new Error(error);
    }
  };

  getById = async (id) => {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(error);
    }
  };

  getByName = async (name, page = 1, limit = 10) => {
    try {
      const query = { title: { $regex: name, $options: "i" } };
      return await this.model.paginate(query, { page, limit, lean: true });
    } catch (error) {
      throw new Error(error);
    }
  };

  create = async (body) => {
    try {
      return await this.model.create(body);
    } catch (error) {
      throw new Error(error);
    }
  };

  update = async (id, body) => {
    try {
      return await this.model.findByIdAndUpdate(id, body, {
        returnDocument: "after",
      });
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

export const productRepository = new ProductRepository(ProductModel);
