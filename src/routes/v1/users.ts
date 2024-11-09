import express from "express";
import { getCurrentUser, getUserById } from "../../controllers/users/getUser";
import authenticationMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/me", authenticationMiddleware, getCurrentUser);
router.get("/:id", authenticationMiddleware, getUserById);

export default router;
