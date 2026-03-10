import "dotenv/config";
import { initMongoDB } from "./config/db.connection.js";
import express from "express";
import apiRouter from "./api/index.js";
import viewsRouter from "./routes/views.router.js";
import handlebars from "express-handlebars";
import { __dirname } from "./utils/utils.js";
import path from "path";
import { errorHandler } from "./middlewares/error-handler.js";


const app = express();
const port = process.env.PORT;

// Middlewares express
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Rutas API
app.use("/api", apiRouter);

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname,"..", "/views"));
app.use(express.static(path.join(__dirname, "..", "public")));

// Rutas de Vistas
app.use("/", viewsRouter);

// Otros Middlewares
app.use(errorHandler);

// Inicializar DB
initMongoDB()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`))