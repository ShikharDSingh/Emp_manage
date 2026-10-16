import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
export class UserRepository {
  private repo = AppDataSource.getRepository(User);
  findByEmail(email: string) {
    return this.repo
      .createQueryBuilder("u")
      .addSelect("u.passwordHash")
      .leftJoinAndSelect("u.role", "role")
      .leftJoinAndSelect("role.permissions", "permission")
      .where("LOWER(u.email)=LOWER(:email)", { email })
      .getOne();
  }
  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: { role: { permissions: true } },
    });
  }
  save(user: User) {
    return this.repo.save(user);
  }
}
