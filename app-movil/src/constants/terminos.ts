export type Choice = "si" | "no" | null;
export type DeclarationId = 1 | 2 | 3;

// Resúmenes para la maqueta. Sustituir por la política oficial aprobada.
export const DECLARACIONES: {
  id: DeclarationId;
  title: string;
  description: string;
}[] = [
  {
    id: 1,
    title: "Conocimiento de las condiciones de uso",
    description:
      "Declaro conocer y aceptar las disposiciones aplicables al uso del estacionamiento para estudiantes o colaboradores.",
  },
  {
    id: 2,
    title: "Edad y documentación vigente",
    description:
      "Declaro ser mayor de edad y contar con documento de identidad y licencia de conducir válidos y vigentes.",
  },
  {
    id: 3,
    title: "Titularidad y condiciones del vehículo",
    description:
      "Declaro ser titular o poseedor autorizado del vehículo, contar con documentación, SOAT y revisión técnica vigentes cuando correspondan, y que no existe impedimento legal para su circulación.",
  },
];

export const CONDICIONES = [
  "El uso requiere autorización y está dirigido a estudiantes con matrícula activa y colaboradores activos, de acuerdo con las reglas aplicables.",
  "La autorización no garantiza una plaza exclusiva ni equivale a una reserva: el ingreso y la ubicación dependen de la disponibilidad.",
  "El procedimiento contempla revisiones de seguridad al ingresar o salir, conforme a la política aplicable y en presencia del usuario.",
  "El usuario debe asegurar puertas, ventanas y maletera y cuidar sus objetos. Para motos y bicicletas deben adoptarse medidas de seguridad propias.",
];

export const TIPOS = ["Automóvil", "Motocicleta", "Bicicleta", "Otro"];
export const CATEGORIAS = ["Estudiante", "Docente", "Administrativo"];