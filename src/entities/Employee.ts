import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Department } from "./Department";
@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ name: "first_name", length: 80 }) firstName!: string;
  @Column({ name: "last_name", length: 80 }) lastName!: string;
  @Column({ name: "work_email", length: 254, unique: true }) workEmail!: string;
  @Column({ type: "varchar", length: 30, nullable: true }) phone!:
    | string
    | null;
  @Column({ name: "department_id", type: "uuid" }) departmentId!: string;
  @ManyToOne(() => Department, (d) => d.employees, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "department_id" })
  department!: Department;
  @Column({ name: "manager_id", type: "uuid", nullable: true }) managerId!:
    | string
    | null;
  @ManyToOne(() => Employee, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "manager_id" })
  manager!: Employee | null;
  @OneToMany(() => Employee, (e) => e.manager) directReports!: Employee[];
  @Column({ name: "job_title", length: 120 }) jobTitle!: string;
  @Column({ name: "joining_date", type: "date" }) joiningDate!: string;
  @Column({
    name: "employment_status",
    type: "varchar",
    length: 20,
    default: "active",
  })
  employmentStatus!: "active" | "inactive" | "on_leave";
  // Salary is intentionally optional and only returned to privileged roles.
  @Column({
    type: "numeric",
    precision: 12,
    scale: 2,
    nullable: true,
    select: false,
  })
  salary!: string | null;
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
