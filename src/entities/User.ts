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
import { Role } from "./Role";
import { Employee } from "./Employee";
import { RefreshToken } from "./RefreshToken";
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ type: "varchar", length: 254, unique: true }) email!: string;
  @Column({ name: "password_hash", type: "text", select: false })
  passwordHash!: string;
  @Column({ name: "role_id", type: "uuid" }) roleId!: string;
  @ManyToOne(() => Role, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role!: Role;
  @Column({ name: "employee_id", type: "uuid", nullable: true, unique: true })
  employeeId!: string | null;
  @ManyToOne(() => Employee, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "employee_id" })
  employee!: Employee | null;
  @Column({ name: "is_active", default: true }) isActive!: boolean;
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];
}
