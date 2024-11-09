import express from "express";
import auth from "./auth";
import users from "./users";
import admin from "./admin";
const router = express.Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/admin", admin);

export default router;
