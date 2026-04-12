export class UserError extends Error {
  data?: Record<string, unknown>;
  constructor(message: string, data?: Record<string, unknown>) {
    super(message);
    this.name = 'UserError';
    this.data = data;
  }
}
