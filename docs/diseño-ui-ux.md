# Especificación de Diseño: UI/UX Premium (Sistema de Gestión de Stock)

Este documento define la identidad visual y las reglas de experiencia de usuario para el sistema de inventario, basado en una estética minimalista, moderna y de alta precisión.

## 1. Dirección Visual
Inspiración: **Linear, Stripe Dashboard, Notion**.

### Atributos de Marca
- **Claridad Operativa:** La información crítica debe resaltar sin esfuerzo.
- **Sofisticación Visual:** Uso de superficies limpias, bordes suaves y tipografía refinada.
- **Profundidad Sutil:** Sombras suaves y degradados imperceptibles para jerarquizar elementos.

## 2. Sistema de Color (Semántica Operativa)

| Estado | Color | Propósito |
| :--- | :--- | :--- |
| **Saludable** | `#22c55e` | Stock disponible y estable. |
| **Bajo** | `#f59e0b` | Alerta preventiva para reposición. |
| **Crítico** | `#ef4444` | Acción inmediata requerida. |
| **Sin Stock** | `#94a3b8` | Producto agotado o deshabilitado. |
| **Acentos** | `#3b82f6` | Elementos destacados y tecnología. |

## 3. Reglas de UX (Experiencia de Usuario)
- **Detección en 2 Segundos:** Un usuario debe identificar problemas de stock (crítico/bajo) en menos de 2 segundos mediante el uso de color + iconografía.
- **Jerarquía Editorial:** La tipografía debe guiar el escaneo visual. Títulos grandes para métricas, subtítulos pequeños para contexto.
- **Feedback Inmediato:** Cada acción del usuario (filtros, búsquedas) debe tener una respuesta visual sutil pero clara.

## 4. Componentes Clave

### Tablas (Data Grids)
- Filas amplias con suficiente espacio en blanco (aire visual).
- Hover suave para indicar interactividad.
- Headers minimalistas y fijos (sticky).
- Badges semánticos para estados de stock.

### Cards KPI (Indicadores de Rendimiento)
- Métricas prominentes.
- Micro-sombras (`shadow-soft`) para separar del fondo.
- Animaciones discretas en las transiciones de carga.

### Badges de Estado
- Bordes muy redondeados.
- Tipografía de peso medio (medium).
- Colores de fondo con opacidad baja (soft background) para no saturar.

## 5. Tipografía
Se priorizan fuentes modernas sin serifa:
- **Geist** (por su excelente legibilidad en pantallas de datos).
- Tracking (espaciado entre letras) ligeramente abierto.

## 7. Implementación Técnica (Sass/SCSS)
- **Arquitectura de Tokens:** Uso de `_tokens.scss` para variables globales (colores, espaciados).
- **Primitivas:** Estilos base en `_primitives.scss`.
- **Escalabilidad:** Mixins y funciones para garantizar un diseño responsivo y consistente.
