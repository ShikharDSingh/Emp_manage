import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/authorize";
import { validateBody, validateQuery } from "../middlewares/validate-request";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  selfProfileSchema,
  employeeListSchema,
} from "../validators/employee.validator";
const r = Router(),
  c = new EmployeeController();
r.use(authenticate);
r.get("/me/export", c.exportMe);
r.get("/me", c.me);
r.patch("/me", validateBody(selfProfileSchema), c.updateMe);
r.get("/", validateQuery(employeeListSchema), c.list);
r.post(
  "/",
  requireRole("admin", "hr"),
  validateBody(createEmployeeSchema),
  c.create,
);
r.get("/:id", c.get);
r.patch(
  "/:id",
  requireRole("admin", "hr", "manager"),
  validateBody(updateEmployeeSchema),
  c.update,
);
r.delete("/:id", requireRole("admin", "hr"), c.deactivate);
export default r;
