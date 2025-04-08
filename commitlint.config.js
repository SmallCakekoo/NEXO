export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // Nueva funcionalidad
        "fix", // Corrección de errores o bugs
        "refactor", // Mejora de código sin cambiar funcionalidad
        "style", // Cambios en el estilo, formato, espacios
        "docs", // Creación de documentación
        "test", // Eliminar, modificar o añadir tests
        "chore", // Mantenimiento (configuraciones, scripts, dependencias)
        "perf", // Optimización del código o mejoras de rendimiento
        "build", // Cambios en la compilación o dependencias externas
        "revert", // Revertir un commit previo
        "hotfix", // Corrección urgente de un error en producción
        "merge", // Fusión de ramas
        "wip", // Trabajo en progreso, aún no terminado
        "deploy", // Preparar código para despliegue en producción
      ],
    ],
    "scope-empty": [2, "never"],
    "subject-case": [2, "always", "lower-case"],
    "subject-full-stop": [2, "never", "."],
  },
};
