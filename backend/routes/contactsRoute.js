import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getContactsForDmLists,
  searchContacts,
} from "../controllers/contactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDmLists);

export default contactsRoutes;
