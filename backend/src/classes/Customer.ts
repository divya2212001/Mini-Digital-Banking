import { User } from "./User";

export class Customer extends User {
  getRoleLabel(): string {
    return "Customer";
  }
}
