import express from "express";
import {
  authenticateUser,
  changePassword,
  login,
  logout,
  refreshToken,
  register,
  requestPasswordReset,
  resetPassword,
  revokeSession,
  revokeAllSessions,
  listSessions,
  verifyEmail,
  getSessionInfo,
} from "../../controllers/auth";
import authenticationMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/login", login); //* Tested - Working
router.post("/register", register); //* Tested - Working
router.post("/refresh-token", refreshToken); //* Tested - Working
router.post("/request-reset", requestPasswordReset); //* Tested - Working
router.post("/reset-password", resetPassword); //* Tested - Working
router.post("/verify-email", verifyEmail); //* Tested - Working
router.post("/logout", logout); //* Tested - Working
router.post("/change-password", authenticationMiddleware, changePassword); //* Tested - Working
router.get("/sessions", authenticationMiddleware, listSessions); //* Tested - Working
router.delete("/sessions/:sessionId", authenticationMiddleware, revokeSession); //* Tested - Working
router.delete("/sessions", authenticationMiddleware, revokeAllSessions); //* Tested - Working

router.get("/me", authenticationMiddleware, authenticateUser);

router.get("/session-info", authenticationMiddleware, getSessionInfo);

export default router;
