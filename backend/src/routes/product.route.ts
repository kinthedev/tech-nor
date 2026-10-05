import { Router } from "express"
import { productController } from "../controller/product.controller"

const productRouter = Router()

// Route tĩnh và đặc thù phải đặt TRƯỚC route có tham số :id
productRouter.get("/categories", productController.getCategories)
productRouter.get("/category/:category", productController.getByCategory)
productRouter.get("/search", productController.search)

// Route CRUD cơ bản
productRouter.get("/", productController.getAll)
productRouter.get("/:id", productController.getById)
productRouter.post("/", productController.create)
productRouter.put("/:id", productController.update)
productRouter.delete("/:id", productController.delete)

export default productRouter
