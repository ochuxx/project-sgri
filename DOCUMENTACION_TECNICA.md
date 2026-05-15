# DOCUMENTACIÓN TÉCNICA: CAMPUS ACADÉMICO (SGRI)

Este documento detalla la arquitectura, el funcionamiento de los archivos y los métodos técnicos utilizados para la creación y optimización de la plataforma Campus Académico, un sistema diseñado para ser implementado en cualquier institución universitaria.

---

## 1. Arquitectura General
La aplicación está construida como una **Single Page Application (SPA)** utilizando **React.js**. 
Utiliza un sistema de **Estado Global Centralizado** para manejar la información de proyectos, tareas y archivos sin necesidad de recargar la página.

### Flujo de Navegación
- **Dashboard Principal**: Actúa como el contenedor (`Shell`) de toda la app.
- **Historial Dinámico**: Se implementó un sistema de *stack* (pila) que registra cada vista visitada, permitiendo la funcionalidad de "Atrás" propia de un navegador nativo.

---

## 2. Descripción de Archivos Clave

### 📂 Carpeta: `/src/context`
- **`AppContext.jsx`**: Es el "cerebro" de la aplicación. Utiliza `useReducer` para gestionar todos los datos (Proyectos, Tareas, Notificaciones). Aquí se definen las acciones para añadir archivos, mover tareas en el Kanban o actualizar el progreso.

### 📂 Carpeta: `/src/components`
- **`Dashboard.jsx`**: Gestiona la barra superior (Topnav) y el menú lateral (Sidebar). Controla el estado colapsable del menú y la lógica de navegación entre las 9 vistas disponibles.
- **`CommandPalette.jsx`**: Implementa una barra de búsqueda rápida (estilo Spotlight/MacOS) para navegar por la app usando el teclado.
- **`Splash.jsx`**: Pantalla de carga inicial con animaciones de "orbes" líquidos.

### 📂 Carpeta: `/src/components/views`
- **`HomeView.jsx`**: Vista de inicio con widgets de actividad reciente, estadísticas rápidas y acceso directo a módulos.
- **`FilesView.jsx`**: **(Módulo Crítico)** Implementa el gestor de archivos. Utiliza un sistema de **Control de Versiones Local** que guarda copias de seguridad de cada archivo antes de ser editado.
- **`TasksView.jsx`**: Implementa un tablero **Kanban** interactivo con funciones de arrastrar y soltar (Drag & Drop).
- **`ScheduleView.jsx`**: Línea de tiempo interactiva que muestra el progreso del cronograma académico.
- **`SettingsView.jsx`**: Panel de configuración que permite cambiar temas (Oscuro, Claro, Dim, Eye Care) y persistirlos en el navegador.

### 📂 Carpeta: `/src/assets`
- **`style.css`**: Contiene el sistema de diseño **Liquid Glass**. Utiliza variables CSS (tokens) para permitir cambios de tema instantáneos y Media Queries avanzadas para que la app sea 100% funcional en Android/iOS.

---

## 3. Métodos y Tecnologías Utilizadas

### A. Sistema de Diseño (UI/UX)
- **Glassmorphism**: Uso de `backdrop-filter: blur()` y transparencias para crear una interfaz premium y moderna.
- **Liquid Design**: Animaciones suaves basadas en `keyframes` y transiciones de CSS para que la interfaz se sienta "viva".
- **Responsive Adaptativo**: Uso de unidades relativas (`rem`, `em`) y una cuadrícula flexible que se transforma de 4 columnas en PC a 1 columna en teléfonos de forma fluida.

### B. Control de Versiones (Files)
- Se utilizó una estructura de datos tipo objeto (`Map`) donde cada ID de archivo tiene asociado un array de `versiones`. Cada vez que el usuario guarda, el estado actual se empuja al historial, permitiendo la recuperación de datos.

### C. Persistencia de Datos
- Uso de `localStorage` para recordar:
  - El tema visual elegido por el usuario.
  - Si el menú lateral estaba abierto o cerrado.
  - (Opcional) El estado de la sesión.

### D. Optimización para Móviles (Android)
- **Safe Areas**: Ajuste de paddings para evitar que el contenido choque con los bordes de la pantalla.
- **Touch Targets**: Aumento del tamaño de botones a un mínimo de 38px para facilitar la interacción táctil.
- **No-Horizontal Scroll**: Implementación de bloqueos globales de ancho para asegurar que el usuario nunca tenga que desplazarse lateralmente.

---

## 4. Resumen de Herramientas
- **Vite**: Para un desarrollo ultra rápido y compilación optimizada.
- **React Hooks**: (`useState`, `useEffect`, `useContext`, `useReducer`) para la lógica reactiva.
- **Lucide Icons / SVG**: Para iconografía ligera y escalable.

---
*Documento generado automáticamente para el proyecto Campus Académico - 2026.*
