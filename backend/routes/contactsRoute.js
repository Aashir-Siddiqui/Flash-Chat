import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { searchContacts } from "../controllers/contactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);

export default contactsRoutes;
