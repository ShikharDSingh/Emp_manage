import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate";
import { authRateLimit } from "../middlewares/rate-limit";
import { validateBody } from "../middlewares/validate-request";
import {
  loginSchema,
  refreshSchema,
  changePasswordSchema,
} from "../validators/auth.validator";
const r = Router(),
  c = new AuthController();
r.post("/login", authRateLimit, validateBody(loginSchema), c.login);
r.post("/refresh", authRateLimit, validateBody(refreshSchema), c.refresh);
r.post("/logout", authenticate, validateBody(refreshSchema), c.logout);
r.post("/logout-all", authenticate, c.logoutAll);
r.get("/sessions", authenticate, c.sessions);
r.delete("/sessions/:id", authenticate, c.revokeSession);
r.post(
  "/change-password",
  authenticate,
  authRateLimit,
  validateBody(changePasswordSchema),
  c.changePassword,
);
export default r;
