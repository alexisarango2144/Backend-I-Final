import { productRepository } from "../repositories/products-repository.js";
import { CustomError } from "../utils/custom-error.js";

const allowedFields = ['price', 'title', 'stock'];

class ProductsController {
  constructor(repository){
    this.repository = repository
  }

  getAllProducts = async (req, res, next)=>{
    try {
      let {page = 1, limit = 10, sort, query} = req.query;

      let filter = {};

      if(query){
        filter = {
          $or: [
            {category: query},
            {stock: query === 'available' ? { $gt: 0 } : 0}
          ]
        }
      }

      let sortOptions = {}
      if(sort) {
        //Formato esperado: ?sort=price_asc || ?sort=title_desc
        const [field, direction] = sort.split('_');

        if (field && !allowedFields.includes(field)) {
          throw new CustomError(`No se puede ordenar por el campo ${field}`, 400);
        }

        sortOptions[field] = direction === 'asc' ? 1 : -1;
      }

      const result = await this.repository.getAll(page, limit, sortOptions, filter);


      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const response = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}&sort=${sort || ''}&query=${query || ''}` : null,
        nextLink: result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}&sort=${sort || ''}&query=${query || ''}` : null,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  getProductById = async (req, res, next)=>{
    try {
      const { pid } = req.params;
      const response = await this.repository.getById(id);
      if(!response) throw new CustomError("Product not found", 404);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  createProduct = async (req, res, next)=>{
    try {
      const {title, price, stock} = req.body;

      if(!title || !price){
        throw new CustomError("Faltan campos obligatorios", 400);
      }
      const response = await this.repository.create(req.body);
      res.status(201);
      res.json({status: "success", payload: response});
    } catch (error) {
      next(error);
    }
  }

  update = async (req, res, next)=>{
    try {
      const { pid } = req.params;
      const response = await this.repository.update(pid, req.body);
      if(!response) throw new CustomError("Product not found", 404)
      res.status(200);
      res.json({status: "success", payload: response});
    } catch (error) {
      next(error);
    }
  }

  delete = async (req, res, next)=>{
    try {
      const { id } = req.params;
      const response = await this.repository.delete(id);
      if(!response) throw new CustomError("Product not found", 404);
      res.status(200);
      res.json({status: "success", payload: response});
    } catch (error) {
      next(error)
    }
  }
}

export const productsController = new ProductsController(productRepository);