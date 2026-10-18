export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (m = "Solicitud inválida") => new AppError(400, m);
export const unauthorized = (m = "No autenticado") => new AppError(401, m);
export const forbidden = (m = "No tienes permiso") => new AppError(403, m);
export const notFound = (m = "No encontrado") => new AppError(404, m);
export const conflict = (m = "El registro ya existe") => new AppError(409, m);