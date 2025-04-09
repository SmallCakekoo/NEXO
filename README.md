# Nexo

**Nexo** es una plataforma de red social para estudiantes de la universidad Icesi, diseñada para facilitar la interacción entre ellos mediante comentarios, likes y la opción de compartir publicaciones. Además, ofrece un apartado donde los usuarios pueden realizar reseñas de docentes y asignaturas.

## 🚀 Características

- Publicaciones con interacciones (likes, comentarios, compartir).
- Sistema de reseñas de docentes y asignaturas.
- Diseño responsive para distintos dispositivos.
- Autenticación y base de datos en Firebase.
- Interfaz moderna.

## 📁 Estructura del Proyecto

```plaintext
NEXO/
├── src/                # Código fuente principal
│   ├── assets/        # Imágenes, fuentes y archivos estáticos
│   ├── components/    # Componentes reutilizables (botones, tarjetas, etc.)
│   ├── data/         # Datos estáticos, JSONs o constantes
│   ├── enums/        # Enumeraciones y tipos de datos
│   ├── layouts/      # Diseños generales y estructuras de página
│   ├── pages/        # Vistas principales de la aplicación
│   ├── services/     # Llamadas a APIs y lógica de negocio
│   ├── styles/       # Estilos CSS/Tailwind
│   ├── utils/        # Funciones auxiliares y helpers
│   ├── index.ts      # Punto de entrada principal
├── public/           # Archivos estáticos
│   ├── assets/       # Logotipos, imágenes y otros recursos
│   ├── styles/       # Estilos globales
│   ├── icon.ico      # Ícono del sitio
│   ├── index.html    # Página base donde se carga la app
├── dist/             # Archivos compilados (generados por Webpack/Vite)
├── .husky/           # Hooks de Git (protección de commits/push)
├── .gitignore        # Archivos y carpetas a ignorar en Git
├── .prettierignore   # Archivos ignorados por Prettier
├── .prettierrc.json  # Configuración de Prettier
├── commitlint.config.js # Configuración de convenciones de commits
├── eslint.config.mjs # Reglas de ESLint
├── LICENSE           # Licencia del proyecto
├── package-lock.json # Archivo de bloqueo de dependencias
├── package.json      # Configuración y dependencias del proyecto
├── README.md         # Documentación del proyecto
├── tsconfig.json     # Configuración de TypeScript
└── webpack.config.js # Configuración de Webpack
```

## 🛠️ Tecnologías y Librerías

### Frontend

- **HTML**
- **CSS**
- **JavaScript & TypeScript**
- **Bootstrap**
- **TailwindCSS**
- **Animate.css / AOS / GSAP**

### Backend

- **Firebase Authentication**
- **Firestore (Firebase Database)**
- **Firebase Storage**

### Desarrollo

- **Webpack**
- **ESLint**
- **Git/GitHub**

### Otras herramientas

- **Husky**

## 📦 Dependencias Clave

### Dependencias Esenciales

| Dependencia | Descripción                                       |
| ----------- | ------------------------------------------------- |
| TypeScript  | Tipado estático para JavaScript                   |
| Webpack     | Optimización y empaquetado del código             |
| Firebase    | Base de datos y autenticación                     |

### Dependencias de Calidad

| Dependencia | Descripción                                       |
| ----------- | ------------------------------------------------- |
| ESLint      | Análisis y corrección de errores en el código     |
| Prettier    | Formateo automático para mantener código uniforme |
| Lint        | Revisión y formateo antes de subir código         |
| Husky       | Corre scripts antes de hacer commits              |

## ⚡ Convenciones de Commits

Para mantener un historial de commits limpio y estructurado, seguimos las siguientes convenciones:

- Mensajes claros y cortos (máx. 50 caracteres).
- Escribir en presente en inglés.
- No usar punto final ni suspensivos.
- Uso de prefijos en los commits.

**Sintaxis:**

```bash
git commit -m "<tipo-de-commit>[scope]: <descripción>"
```

**Ejemplo:**

```bash
git commit -m "style(dashboard): adjust button spacing"
```
