import type { Request, Response } from "express";
import { EmployeeService } from "../services/employee.service";
import { ApiResponse } from "../utils/ApiResponse";
export class EmployeeController {
  private service = new EmployeeService();
  list = async (req: Request, res: Response) =>
    ApiResponse.send(
      res,
      200,
      "Employees fetched",
      await this.service.list(res.locals.validatedQuery, req.auth!),
    );
  get = async (req: Request, res: Response) =>
    ApiResponse.send(
      res,
      200,
      "Employee fetched",
      await this.service.get(req.params.id, req.auth!),
    );
  create = async (req: Request, res: Response) =>
    ApiResponse.send(
      res,
      201,
      "Employee created",
      await this.service.create(req.body, req.auth!.id, res.locals.requestId),
    );
  update = async (req: Request, res: Response) =>
    ApiResponse.send(
      res,
      200,
      "Employee updated",
      await this.service.update(
        req.params.id,
        req.body,
        req.auth!,
        res.locals.requestId,
      ),
    );
  deactivate = async (req: Request, res: Response) =>
    ApiResponse.send(
      res,
      200,
      "Employee deactivated",
      await this.service.deactivate(
        req.params.id,
        req.auth!.id,
        res.locals.requestId,
      ),
    );
  me = async (req: Request, res: Response) =>
    ApiResponse.send(
      res,
      200,
      "Profile fetched",
      await this.service.exportOwnProfile(req.auth!),
    );
  updateMe = async (req: Request, res: Response) =>
    ApiResponse.send(
      res,
      200,
      "Profile updated",
      await this.service.selfProfile(req.body, req.auth!),
    );
  exportMe = async (req: Request, res: Response) =>
    ApiResponse.send(
      res,
      200,
      "Profile export generated",
      await this.service.exportOwnProfile(req.auth!),
    );
}
