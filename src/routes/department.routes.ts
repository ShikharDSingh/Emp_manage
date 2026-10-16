import { Router } from "express";
import { DepartmentController } from "../controllers/department.controller";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate-request";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../validators/department.validator";
const r = Router(),
  c = new DepartmentController();
r.use(authenticate);
r.get("/", c.list);
r.post(
  "/",
  requireRole("admin", "hr"),
  validateBody(createDepartmentSchema),
  c.create,
);
r.patch(
  "/:id",
  requireRole("admin", "hr"),
  validateBody(updateDepartmentSchema),
  c.update,
);
export default r;
