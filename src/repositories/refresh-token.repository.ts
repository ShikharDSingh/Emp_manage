import { AppDataSource } from "../config/database";
import { RefreshToken } from "../entities/RefreshToken";
export class RefreshTokenRepository {
  private repo = AppDataSource.getRepository(RefreshToken);
  findByHash(hash: string) {
    return this.repo.findOne({
      where: { tokenHash: hash },
      relations: { user: { role: { permissions: true } } },
    });
  }
  save(t: RefreshToken) {
    return this.repo.save(t);
  }
  async revokeAll(userId: string) {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ revokedAt: new Date() })
      .where("user_id=:userId AND revoked_at IS NULL", { userId })
      .execute();
  }
  async activeForUser(userId: string) {
    return this.repo.find({
      where: { userId, revokedAt: null },
      order: { createdAt: "DESC" },
    });
  }
  async revokeSession(id: string, userId: string) {
    return this.repo
      .createQueryBuilder()
      .update()
      .set({ revokedAt: new Date() })
      .where("id=:id AND user_id=:userId AND revoked_at IS NULL", {
        id,
        userId,
      })
      .execute();
  }
}
