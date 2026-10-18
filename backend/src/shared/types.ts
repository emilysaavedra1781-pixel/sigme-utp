export type Rol = "usuario" | "supervisor" | "administrador";
export type Estado = "activo" | "inactivo" | "bloqueado";

export interface UsuarioToken {
  id: number;
  codigo: string;
  rol: Rol;
}

// Permite usar req.user en Express con tipos
declare global {
  namespace Express {
    interface Request {
      user?: UsuarioToken;
    }
  }
}