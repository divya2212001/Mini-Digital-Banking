import { Types } from "mongoose";

export interface IBaseRepository<T> {
  findById(id: string | Types.ObjectId): Promise<T | null>;
}
