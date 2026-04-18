export function generateAccountNumber(): string {
  const part = () => Math.floor(100000 + Math.random() * 900000).toString();
  return `${part()}${part()}`;
}
