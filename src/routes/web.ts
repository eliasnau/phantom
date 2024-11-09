import express from "express";
import v1 from "./v1";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, this is a simple Express.js server!");
});

router.use("/v1", [v1]);

router.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

export default router;
