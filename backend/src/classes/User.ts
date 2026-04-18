/**
 * Abstraction: base user identity for bank customers.
 */
export abstract class User {
  constructor(
    protected readonly id: string,
    protected readonly name: string,
    protected readonly email: string
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  abstract getRoleLabel(): string;
}
