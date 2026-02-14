# Documentación del Proyecto: Experiencia Interactiva San Valentín 2026

## Visión General del Proyecto
Este proyecto es una experiencia web interactiva premium diseñada para conmemorar 3 años de relación. El objetivo principal es contar una historia emotiva y genuina a través de slides dinámicas con animaciones mágicas e interacciones significativas, todo optimizado para funcionar en un servidor doméstico (homelab) y ser completamente responsivo en cualquier dispositivo.

## Stack Técnico
-   **Framework:** Next.js 14+ (App Router, TypeScript)
-   **Animaciones:** Framer Motion (AnimatePresence, `useMotionValue`, `drag`, `layout`, `variants`, `useCycle`)
-   **Estilos:** Tailwind CSS v4 (con paleta de colores personalizada: `valentine-pink`, `valentine-red`, `valentine-cream`, `zinc-950`)
-   **Iconografía:** Lucide React y SVGs inline para ligereza
-   **Datos:** JSON para la configuración dinámica de slides
-   **Reproductor de Música:** Spotify Embed Widget

## Arquitectura: Motor de Presentación Basado en Datos
La presentación se construye dinámicamente a partir del archivo [`src/data/presentationData.json`](src/data/presentationData.json), permitiendo una fácil personalización y extensión.

### Esquema del JSON (`presentationData.json`):
Cada objeto en el array `slides` representa una pantalla o interacción:
-   `id`: Identificador único del slide.
-   `type`: Tipo de slide (`cover`, `text-only`, `image-collage`, `interaction`, `final`).
-   `title`: Título principal del slide.
-   `subtitle`: Subtítulo o descripción del slide.
-   `images`: Array de URLs de imágenes (para `image-collage`).
-   `interactionType`: Tipo de interacción (para `interaction` slides: `HeartRepair`, `HandsSnap`).
-   `requiresInteraction`: `boolean` que indica si el usuario debe completar una interacción para avanzar.
-   `background`: Clase de Tailwind CSS para el fondo (`bg-zinc-950` por defecto).

## Componentes Clave e Implementación

### 1. [`SlideManager.tsx`](src/components/SlideManager.tsx)
-   **Función:** Es el cerebro de la aplicación. Carga los datos de `presentationData.json` y controla el `currentStep` (slide actual).
-   **Navegación:** Permite avanzar/retroceder con botones y **gestos de swiping** (arrastrar horizontalmente en pantallas táctiles).
-   **Bloqueo de Interacción:** El avance está bloqueado hasta que `isInteractionComplete` sea `true` en slides que lo requieren.
-   **Animaciones:** Utiliza `AnimatePresence` y `motion.div` con `variants` para transiciones de entrada/salida fluidas (`fade-in-up`).
-   **Responsividad:** Los tamaños de texto y elementos se ajustan con clases responsivas de Tailwind.
-   **Música:** Renderiza el `MusicPlayer` de forma persistente en la esquina inferior derecha.

### 2. [`HeartRepair.tsx`](src/components/HeartRepair.tsx)
-   **Función:** Interacción donde el usuario "repara" un corazón roto arrastrando una curita.
-   **SVG:** Corazón y curita implementados con SVGs para escalabilidad perfecta.
-   **Interacción:** La curita es `draggable`. Al finalizar el arrastre (`onDragEnd`), se calcula la distancia al centro para detectar la colisión.
-   **Animación Mágica:** Al repararse, el corazón late, cambia de color a rojo vibrante y se dispara una explosión de partículas doradas/rosas. El texto de ayuda cambia dinámicamente.
-   **Responsividad:** Los tamaños del corazón y la curita se adaptan usando `vw/vh` y el umbral de detección de colisión se ajusta dinámicamente.

### 3. [`HandsSnap.tsx`](src/components/HandsSnap.tsx)
-   **Función:** Interacción donde dos brazos separados se "unen" mágicamente.
-   **SVG:** Brazos estilizados con SVGs detallados. Son `draggable` y tienen `dragConstraints` para limitar el movimiento.
-   **Interacción:** Al acercar los brazos lo suficiente (`SNAP_THRESHOLD`), se "snappean" con un efecto de resorte (`spring`) de Framer Motion.
-   **Animación Mágica:** Al unirse, aparece un corazón central pulsante con una explosión de partículas de corazones (💖).
-   **Responsividad:** Los tamaños y las posiciones iniciales de los brazos usan `vw/vh` para adaptarse a diferentes pantallas. El `SNAP_THRESHOLD` se ajusta según el `window.innerWidth`.

### 4. [`Collage.tsx`](src/components/Collage.tsx)
-   **Función:** Muestra un collage dinámico de imágenes con efectos visuales.
-   **Grid Responsivo:** Utiliza `grid-cols-1`, `sm:grid-cols-2`, `lg:grid-cols-3` de Tailwind para adaptar el número de columnas a la pantalla.
-   **Animaciones:** Las imágenes tienen una animación de entrada escalonada (`staggerChildren`) y reaccionan al `hover` con escala, rotación y desaturación/coloración.
-   **Mensajes Mágicos:** Pequeñas notas de amor flotan en el fondo y se revelan en el hover de cada imagen.

### 5. [`MusicPlayer.tsx`](src/components/MusicPlayer.tsx)
-   **Función:** Reproductor de música integrado (Spotify Embed Widget) discreto.
-   **Diseño:** Botones de música/cerrar y mute con animaciones de hover/tap. El reproductor se despliega en un contenedor "glassmorphism" estilizado.
-   **Compatibilidad:** Utiliza el embed de Spotify, con una nota de usuario sobre posibles bloqueos de CSP en entornos locales si no se ha iniciado sesión en el navegador.

## Configuración de Responsividad Global
-   **Mobile-First:** Todos los estilos y componentes han sido diseñados pensando primero en dispositivos móviles y luego escalando a tablets y desktops.
-   **Viewport Units:** Uso extensivo de `vw`, `vh`, `rem` y porcentajes para tamaños flexibles.
-   **Tailwind Breakpoints:** Aprovechamiento de `sm:`, `md:`, `lg:` para adaptar layouts y estilos en puntos de quiebre específicos.
-   **Gestos Táctiles:** Implementación de `drag` y `swipe` de Framer Motion para una UX natural en dispositivos táctiles.

## Instrucciones de Despliegue (Homelab)
1.  Asegúrate de que `next.config.ts` tenga `output: 'export'` y `images.unoptimized: true`.
2.  Ejecuta el comando `npm run build` en tu terminal.
3.  Esto generará una carpeta `out/` en la raíz de tu proyecto.
4.  Copia el contenido completo de la carpeta `out/` a tu servidor doméstico (Dell Mini PC).
5.  Puedes servir estos archivos estáticos con cualquier servidor web básico (Nginx, Apache, o incluso un simple servidor HTTP de Python).

## Futuras Consideraciones
-   **Personalización Avanzada:** Permitir la edición de `presentationData.json` directamente desde una interfaz de usuario simple (requeriría un servidor backend).
-   **Más Interacciones:** Añadir nuevos tipos de interacciones (`interactionType`) a los slides.
-   **Control de Audio Global:** Implementar controles más finos sobre la reproducción de Spotify (shuffle real, control de volumen programático, etc.), lo cual podría requerir integración con la API de Spotify (OAuth).
-   **Pre-carga de Imágenes:** Implementar una estrategia de pre-carga más agresiva para las imágenes del collage si la presentación se hace muy larga.

Este documento proporciona una visión completa del proyecto y te servirá como base sólida para cualquier trabajo futuro. ¡Que disfrutes de la experiencia mágica! ✨