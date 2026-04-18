import { IUserDocument } from "../models/User.model";
import { User } from "./User";
import { Customer } from "./Customer";

export class UserMapper {
  static toDomain(doc: IUserDocument): User {
    const id = doc._id.toString();
    return new Customer(id, doc.name, doc.email);
  }
}
