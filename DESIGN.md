---
name: IDP Esperanza Baja — Admin Panel
description: Panel de administración para la Iglesia de Dios de la Profecía, Esperanza Baja.
colors:
  primary: "#002d37"
  primary-container: "#1a434e"
  on-primary-container: "#88afbc"
  primary-fixed-dim: "#a5cdda"
  secondary: "#735c00"
  secondary-container: "#fed65b"
  on-secondary-container: "#745c00"
  tertiary: "#002f1e"
  tertiary-container: "#1a4633"
  on-tertiary-container: "#86b39b"
  error: "#ba1a1a"
  error-container: "#ffdad6"
  surface: "#f8f9fa"
  surface-container-low: "#f3f4f5"
  surface-container: "#edeeef"
  surface-container-high: "#e7e8e9"
  on-surface: "#191c1d"
  on-surface-variant: "#41484a"
  outline: "#71787b"
  outline-variant: "#c1c8ca"
  background: "#f8f9fa"
typography:
  display:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: "56px"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: "32px"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.01em"
rounded:
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  base: "8px"
  gutter: "24px"
  margin-mobile: "16px"
  margin-desktop: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-container}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "7px 16px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  nav-item-active:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
---

# Design System: IDP Esperanza Baja

## 1. Overview

**Creative North Star: "El Registro Bien Cuidado"**

Como el libro de actas de una congregación que lleva décadas: cada entrada en su lugar, el orden sin ostentación, la legibilidad como acto de respeto hacia quien consulta. Este panel no compite por atención — la dirige. La interfaz desaparece; lo que queda es la información y la acción. Cuando un líder abre el panel en pleno culto para registrar asistencia, la pantalla debe responder con la misma fluidez que abrir un cuaderno bien organizado, no como navegar un sistema de gestión empresarial.

El sistema es ligero de colores, pesado de tipografía. La paleta teal oscuro / ámbar dorado no proviene de estética religiosa — proviene de la dignidad de una institución que lleva décadas sirviendo a su comunidad. El ámbar aparece solo donde hay acción o estado activo: es escaso por diseño. El teal profundo es la voz; el ámbar es el acento que confirma.

Anti-referencias explícitas del brief: sin estética religiosa obvia (cruces, vitrales, tonos "bíblicos"), sin dashboards tipo ERP con veinte métricas simultáneas, sin dark mode o paletas rígidas que se sientan corporativas.

**Key Characteristics:**
- Plano por defecto: la profundidad es tonal, no sombreada
- Tipografía mixta deliberada: Literata serif para títulos con peso, Inter sans para datos y etiquetas
- Móvil primero: cada flujo crítico diseñado para una mano, 375px como viewport canónico
- Color usado para distinguir estado, no para decorar superficie
- Espaciado generoso para mínimo esfuerzo cognitivo

---

### Gaps actuales por abordar

Las siguientes áreas están identificadas como pendientes. No implementar hasta que se documenten en un brief de `/craft` o `/shape`. Registradas aquí para que ningún futuro agente las genere reproduciendo el estado actual.

**1. Flujo de asistencia móvil** — la página de asistencia actual es densa y no está optimizada para registro rápido desde celular. El caso de uso primario (líder registra 30 personas durante el culto, con una mano) exige: lista con tap para marcar presente/ausente, botón flotante de confirmación, cero modales. Todo lo demás es secundario. Ver `$impeccable craft asistencia-móvil` cuando sea el momento.

**2. Dashboard — métricas hero** — el dashboard usa el patrón número-grande + etiqueta-pequeña para tres métricas (total miembros, ministerios activos, eventos), que es el "hero-metric template" detectado como cliché SaaS. Reemplazar por una vista de estado más narrativa: ¿qué pasó esta semana? ¿qué falta por hacer? En lugar de contadores estáticos. Ver `$impeccable shape dashboard-status` para rediseñar.

**3. Cards de ministerio con border-b-4** — las tarjetas de ministerio usan un borde inferior de 4px en color primario/secundario/terciario como diferenciador. Es el patrón de franja decorativa (`side-stripe` en espíritu). Reemplazar con fondo tonal leve (`bg-primary-container`, `bg-secondary-container`) o badge de color en el nombre, no el borde. Ver `$impeccable polish /dashboard` cuando sea el momento.

**4. Etiquetas mayúsculas con tracking** — las tarjetas de métricas usan `uppercase tracking-wider` en las etiquetas de sección. Es el patrón de "kicker" que aparece en el 55-95% de generaciones de IA. Sustituir por `font-label-sm` normal sin mayúsculas, o eliminar la etiqueta si el número es suficientemente explicativo.

**5. Animaciones pendientes** — `anime-runner.ts` existe pero no hay animaciones implementadas. El sistema tiene potencial para: transiciones de entrada de lista (stagger suave), feedback de registro de asistencia (confirmación visual), y navegación de sección. Ver `$impeccable animate` cuando la UI base esté estabilizada.

---

## 2. Colors: La Paleta del Registro

Tres accentos funcionales (teal, ámbar, verde) sobre una base de grises casi blancos. Los acentos no son decorativos — cada uno tiene un rol de dominio: teal para identidad/primary actions, ámbar para estado activo/navegación, verde para confirmación/terciary context.

### Primary
- **Teal Profundo** (#002d37): Color de identidad de la institución. Usado en logo, acciones primarias, headings de sección, y como primera impresión. No fondo — foreground.
- **Teal Contenedor** (#1a434e): Fondo de chips de avatar, iconos de contexto primario. Versión accesible del teal para fondos con texto claro.
- **Celeste Hielo** (#a5cdda): Token `primary-fixed-dim`. El acento más claro del espectro primario. Usado en enlaces inversos y badges de información.

### Secondary
- **Ámbar Oscuro** (#735c00): El texto del estado activo en chips y etiquetas sobre fondo ámbar. Alto contraste.
- **Ámbar Brillante** (#fed65b): El fondo del estado activo en navegación y badges de estado. El color más visible del sistema — escaso por diseño.

**La Regla del Ámbar Escaso.** El secondary-container (`#fed65b`) aparece únicamente en el elemento activo de la navegación y en badges de estado accionables. Si aparece en más de un elemento por pantalla simultáneamente, hay demasiado. Su escasez es su fuerza.

### Tertiary
- **Verde Noche** (#002f1e): Contexto de confirmación, presencia, estados "completado". Paralelo al teal pero reservado para módulo de asistencia y estados positivos.
- **Verde Contenedor** (#1a4633): Fondo de indicadores de presencia.
- **Verde Sage** (#86b39b): Texto sobre fondos verdes. Acento de confirmación en modo "silencioso".

### Neutral
- **Casi Negro** (#191c1d): `on-surface` — todo el texto de cuerpo, headings sin color asignado.
- **Slate Medio** (#41484a): `on-surface-variant` — etiquetas secundarias, texto descriptivo, placeholder.
- **Gris Divisor Claro** (#c1c8ca): `outline-variant` — bordes de cards, separadores, inputs en reposo.
- **Superficie Base** (#f8f9fa): `surface` — fondo de cards y paneles de contenido.
- **Superficie Contenedor** (#edeeef): `surface-container` — fondo del sidebar y áreas de navegación.
- **Superficie Baja** (#f3f4f5): `surface-container-low` — fondo de páginas de contenido principal.

**La Regla del Fondo Tonal.** La profundidad se comunica con escalones de superficie, no con sombras. `background` (#f8f9fa) es el fondo base; `surface-container` (#edeeef) es el sidebar; `surface` (#f8f9fa) son las cards. Las sombras se usan solo como feedback de estado (hover `shadow-md`), nunca como decoración estructural.

---

## 3. Typography

**Display Font:** Literata (con Georgia, serif como fallback)
**Body / UI Font:** Inter (con system-ui, sans-serif como fallback)
**Icons:** Material Symbols Outlined (icon font, `FILL` variable axis)

**Carácter:** La combinación es un contraste deliberado entre autoridad y funcionalidad. Literata trae el peso de la letra impresa — apropiado para títulos que cargan datos importantes (conteos, nombres de secciones). Inter trae la claridad neutral de una herramienta bien hecha. No son similares: una es serif clásica con transiciones de trazo marcadas; la otra es geométrico-humanista sin adornos.

### Hierarchy

- **Display** (Literata, 600, 48px/56px, -0.02em letter-spacing): Solo para números-dato de alto impacto — contadores, cifras de resumen. Máximo una instancia por pantalla.
- **Headline Large** (Literata, 600, 32px/40px): Títulos de página en desktop. Raramente visible en mobile.
- **Headline Medium** (Literata, 500, 24px/32px): Títulos de sección, nombres de módulo dentro de una página.
- **Body Large** (Inter, 400, 18px/28px): Texto de lectura larga. No usado actualmente en el panel (sin páginas de contenido extenso), reservado para eventual módulo de notas/comunicados.
- **Body Medium** (Inter, 400, 16px/24px): Texto principal de contenido: nombres de miembros, descripciones de eventos.
- **Body Small** (Inter, 400, 14px/20px): Texto secundario, fechas, detalles, metadata de registros.
- **Label Medium** (Inter, 600, 14px/16px, +0.01em): Etiquetas de botones, ítems de navegación, encabezados de columna en tablas. Nunca en mayúsculas decorativas.
- **Label Small** (Inter, 500, 12px/16px): Timestamps, etiquetas de estado, contadores secundarios.

**La Regla Sin Mayúsculas Decorativas.** `uppercase` + `tracking-wider` está prohibido en etiquetas de métricas y encabezados de tarjetas. Es el patrón "kicker" saturado. Si se necesita diferenciar una etiqueta de su valor, usar `font-label-sm text-on-surface-variant` sin mayúsculas.

---

## 4. Elevation

El sistema es **plano por defecto**. La jerarquía espacial se comunica exclusivamente a través de la escala tonal de superficies (`surface-container-low` → `surface` → `surface-container` → `surface-container-high`), no con sombras.

Las sombras son reservadas para **respuesta a estado**: un card que recibe hover gana `shadow-md` momentáneamente. Un modal o un dropdown flotante usa `shadow-lg`. Nada tiene sombra como estado de reposo permanente excepto la barra de navegación inferior en mobile (una sombra direccional ascendente, funcional para separar del contenido).

### Shadow Vocabulary

- **Hover lift** (`box-shadow: 0 4px 12px rgba(0,0,0,0.08)`): Respuesta a hover en cards interactivos. Feedback táctil, no estructura.
- **Floating nav** (`box-shadow: 0 -4px 20px rgba(0,0,0,0.04)`): Solo en MobileBottomNav. Separa la barra del scroll de contenido.
- **Modal overlay** (`box-shadow: 0 8px 32px rgba(0,0,0,0.16)`): Paneles que flotan sobre el contenido (drawers, modales de detalle de miembro).

**La Regla del Reposo Plano.** En reposo, todo card es plano. Si necesitas diferenciarlo de su fondo, usa un escalón de superficie (`surface` sobre `surface-container-low`), nunca una sombra permanente. `shadow-sm` en reposo está prohibido — es el patrón "ghost card" que combina borde + sombra difusa y hace que todo se vea igual.

---

## 5. Components

### Buttons

El botón es la acción. Sin ambigüedad sobre qué es presionable.

- **Shape:** Full pill (`border-radius: 9999px`). No `rounded-lg` para buttons — el pill distingue acciones de cards.
- **Primary** (`bg-primary text-on-primary`): `#002d37` fondo, blanco texto, `padding: 8px 16px`, `font-label-md`. Para acciones principales de una pantalla: "Registrar Asistencia", "Guardar", "Añadir".
- **Hover / Focus:** `opacity: 0.9`, sin cambio de forma. Focus visible: `ring-2 ring-primary ring-offset-2`.
- **Outlined** (`border border-primary text-primary`): Fondo transparente, borde 1px `#002d37`, mismo radio y padding. Para acciones secundarias ("Ver Calendario", "Cancelar"). Hover: `bg-surface-container`.
- **Ghost (solo ícono):** `p-2 rounded-full text-on-surface-variant hover:bg-surface-container`. Para iconos de acción en el TopBar (notificaciones, settings).

**La Regla del Pill Exclusivo.** Los botones de acción son siempre `rounded-full`. Los nav items y las chips son `rounded-lg` (8px). Las cards son `rounded-xl` (12px). Nunca mezclar: el radio define el rol del elemento.

### Cards / Containers

- **Corner Style:** 12px (`rounded-xl`). No sobrepasar 16px.
- **Background:** `surface` (#f8f9fa) sobre fondo de página `surface-container-low` (#f3f4f5). El contraste entre ambos crea la separación sin sombra.
- **Shadow Strategy:** Ninguna en reposo. `shadow-md` en hover para cards interactivos.
- **Border:** `border border-outline-variant` (#c1c8ca, 1px). Solo uno o el otro — nunca border + shadow simultaneamente en reposo.
- **Internal Padding:** `p-6` (24px) en desktop, `p-4` (16px) en mobile.
- **Acento de categoría:** Usar fondo tonal del contenedor (`bg-primary-container`, `bg-secondary-container`) en lugar de `border-b-4` con color. El borde inferior de color es el patrón de franja prohibido.

### Inputs / Fields

- **Style:** `bg-surface-container-low border border-outline-variant rounded-full` para campos de búsqueda. `bg-surface-container-low border border-outline-variant rounded-lg` para campos de formulario.
- **Focus:** `ring-2 ring-primary border-transparent`. No outline nativo del browser.
- **Placeholder:** `text-on-surface-variant` — verificar contraste 4.5:1 antes de usar un gris más claro.
- **Error:** `border-error` + mensaje debajo en `text-error font-body-sm`.
- **Disabled:** `opacity-50 cursor-not-allowed`.

### Navigation

**Sidebar (desktop, ≥768px):**
- Fondo `surface-container` (#edeeef), ancho fijo 256px, borde derecho `outline-variant`.
- Items en reposo: `text-on-surface-variant`, sin fondo. Hover: `bg-surface-container-high`.
- Item activo: `bg-secondary-container text-on-secondary-container font-bold rounded-lg`. Sin `scale-95` — el ítem activo no debe ser más pequeño que los inactivos.
- Ícono activo: `FILL: 1` via `fontVariationSettings`.

**MobileBottomNav (mobile, <768px):**
- Fondo `surface`, borde superior `outline-variant`, sombra ascendente.
- Pill ámbar (`bg-secondary-container`) sobre el ícono activo; texto activo `text-primary`.
- Áreas táctiles mínimo 44×44px.

### Chips / Status Badges

- **Tipo de miembro** (Bautizado / Congregante / Visitante): `bg-surface-container text-on-surface rounded-full px-2 py-0.5 font-label-sm`. Sin colores de acento — son datos neutros.
- **Estado de miembro** (Activo / Inactivo / Congregando): Color semántico:
  - Activo: `bg-tertiary-container text-on-tertiary-container`
  - Inactivo: `bg-surface-container-high text-on-surface-variant`
  - Congregando: `bg-primary-container text-on-primary-container`
- **Shape:** `rounded-full`, `px-3 py-1`, `font-label-sm`.

### Timeline (Agenda / Actividad Reciente)

Componente específico del dashboard y calendario.
- Línea vertical: `border-l-2 border-surface-variant` (no `border-primary` — el color en la línea compite con los dots).
- Dot activo/presente: `bg-primary border-4 border-surface` (el borde blanco crea el efecto de "perforado").
- Dot pasado/secundario: `bg-tertiary-container`.
- Texto de hora: `font-label-sm text-primary` para hora activa, `text-on-surface-variant` para pasadas.

---

## 6. Do's and Don'ts

### Do:

- **Do** usar `border border-outline-variant` O `shadow-sm` en cards — nunca ambos en reposo. Uno o el otro.
- **Do** usar `bg-secondary-container` (ámbar) exclusivamente para el elemento de navegación activo. Si aparece más de una vez por pantalla, hay demasiado.
- **Do** usar escalones de superficie para crear jerarquía: `surface-container-low` (fondo de página) → `surface` (card) → `surface-container` (sidebar / sección elevada).
- **Do** verificar contraste antes de usar `text-on-surface-variant` (#41484a) sobre cualquier superficie: 4.5:1 es el mínimo para texto pequeño.
- **Do** diseñar cada flujo de asistencia y registro para touch: mínimo 44×44px de área táctil, sin hover-only states, máximo dos taps para completar la acción principal.
- **Do** usar `@media (prefers-reduced-motion: reduce)` como alternativa para toda animación — mínimo un crossfade o transición instantánea.
- **Do** mantener `border-radius: 12px` (`rounded-xl`) como máximo para cards. El pill (`rounded-full`) es exclusivo de botones y badges.
- **Do** usar Literata exclusivamente para títulos que tienen peso narrativo (nombres de sección, headings de módulo, números-dato). Inter para todo lo operacional.

### Don't:

- **Don't** usar `border-b-4` con color de acento como diferenciador de categoría en cards. Es el patrón de franja lateral en variante inferior — igualmente prohibido. Usar fondo tonal (`bg-primary-container`) en su lugar.
- **Don't** usar `uppercase tracking-wider` en etiquetas de métricas o encabezados de tarjetas. Es el "kicker" sobre-utilizado que delata generación automática. Etiquetar en `font-label-sm` normal.
- **Don't** construir dashboards con el patrón número-grande + etiqueta-pequeña + ícono-badge repetido tres veces. Es el "hero-metric template" que sacraliza el conteo sobre el estado real. La pregunta del usuario es "¿qué necesito saber ahora?", no "¿cuántos somos?".
- **Don't** usar estética religiosa: sin iconos de cruz o paloma, sin tipografías decorativas "bíblicas", sin degradados dorados con simbolismo litúrgico. La identidad espiritual está en la comunidad, no en la UI.
- **Don't** combinar tres o más colores de acento (primary, secondary, tertiary) en la misma card o sección. Uno por contexto, máximo.
- **Don't** animar propiedades de layout (`width`, `height`, `top`, `left`, `margin`). Solo `transform` y `opacity` con Anime.js via `anime-runner.ts`.
- **Don't** usar `scale-95` en el elemento de navegación activo. El ítem seleccionado no debe ser más pequeño que los inactivos — viola la expectativa de retroalimentación positiva.
- **Don't** construir el flujo de asistencia como una tabla de datos densa. El caso de uso es registro rápido en móvil; cada fila debe ser un target táctil completo con estado visible (presente/ausente) sin abrir un modal.
- **Don't** usar `transition-all` — especificar solo las propiedades que cambian (`transition-[background-color]`, `transition-[transform]`).
- **Don't** mezclar `border-radius` semánticamente: `rounded-xl` (12px) = card, `rounded-lg` (8px) = nav item/input, `rounded-full` = botón/badge. Mantener la asignación consistente en todos los módulos.
