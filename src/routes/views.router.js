import { Router } from "express";
import { productRepository } from "../repositories/products-repository.js";
import { cartRepository } from "../repositories/carts-repository.js";

const router = Router();

// Vista principal

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { category: query },
          { stock: query === "available" ? { $gt: 0 } : 0 },
        ],
      };
    }

    let sortOption = {};
    if (sort === "asc") {
      sortOption = { price: 1 };
    } else if (sort === "desc") {
      sortOption = { price: -1 };
    }
    const result = await productRepository.getAll(page, limit, sortOption, filter);

    // Generar un array de números de página para la paginación
    const pages = [];
    for (let i = 1; i <= result.totalPages; i++) {
      pages.push({
        number: i,
        isCurrent: i === result.page,
        link: `/products?page=${i}&limit=${limit}&sort=${sort || ""}&query=${query || ""}`,
      });
    }

    // Renderizamos con el objeto de paginate directamente
    res.render("index", {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      // Generamos los links relativos para la vista
      prevLink: result.hasPrevPage
        ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort || ""}&query=${query || ""}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort || ""}&query=${query || ""}`
        : null,
      pages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al cargar la vista de productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productRepository.getById(pid);

    if (!product) {
      return res.status(404).render("404", {message: "Producto no encontrado"});
    }

    res.render("productDetail", { product });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al cargar la vista del producto");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartRepository.getById(cid);

    if(!result || result.docs.length === 0) {
      return res.status(404).send("Carrito no encontrado");
    }

    const cart = result.docs[0];

    res.render("cartDetail", {
      products: cart.products,
      cartId: cid,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al cargar la vista del carrito");
  }
});

export default router;
