const { Router } = require("express");
const MealsController = require("../controllers/MealsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const mealsRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const mealsController = new MealsController();

mealsRoutes.use(ensureAuthenticated);
mealsRoutes.post("/", upload.single("image"), mealsController.create);
mealsRoutes.get("/:id", mealsController.show);
mealsRoutes.get("/", mealsController.index);
mealsRoutes.put("/:id", upload.single("image"), mealsController.update);
mealsRoutes.delete("/:id", mealsController.delete);

module.exports = mealsRoutes;
