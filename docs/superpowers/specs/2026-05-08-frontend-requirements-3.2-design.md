# Especificación de Diseño: Requerimientos Frontend (Punto 3.2)

Este documento detalla la implementación de los requerimientos de interfaz solicitados para el Sistema de Gestión de Inventario, centrándose en la visibilidad operativa y la toma de decisiones basada en datos.

## 1. Visión General
Se implementará una **Vista de Tabla Priorizada** con un **Panel Lateral de Detalles (Drawer)**. La interfaz seguirá una estética minimalista ("Linear-style") utilizando React + TypeScript + Sass.

## 2. Componentes Principales

### 2.1 Tabla de Productos (Priorizada)
- **Ordenamiento Automático:** Los productos se ordenan por nivel de stock (Sin Stock > Stock Bajo > Saludable).
- **Columnas:**
  - `Producto / SKU`: Nombre destacado y código único debajo.
  - `Categoría`: Badge minimalista.
  - `Stock`: Valor numérico con énfasis visual (Negrita + Color).
  - `Estado`: Badge semántico (Rojo: Sin Stock, Ámbar: Bajo, Verde: Saludable).
  - `Precio`: Valor monetario formateado.
- **Filtros:**
  - Buscador global por texto (Nombre/SKU).
  - Selector de categorías dinámico.
  - Toggle para mostrar solo alertas críticas.

### 2.2 Panel Lateral de Detalles (Drawer)
Se activa al hacer clic en una fila de la tabla.
- **Header:** Nombre del producto y acciones rápidas (Editar/Historial).
- **Sección de Alerta:** Banner prominente si el stock está por debajo del umbral.
- **Gráfico de Stock:** Gráfico de barras comparativo:
  - `Barra 1 (Actual)`: Color dinámico según estado.
  - `Barra 2 (Umbral)`: Nivel mínimo configurado (Ámbar).
  - `Barra 3 (Máximo)`: Capacidad teórica (Gris suave).
- **Acciones:** Accesos directos para registrar movimientos específicos.

### 2.3 Formulario de Movimientos (Modal)
- Campos: Producto (readonly), Tipo (Entrada/Salida), Cantidad, Motivo.
- Validaciones: Prevención de stock negativo en el frontend antes del envío.

## 3. Lógica de Negocio en Frontend
- **Umbral de Stock:** Se manejará un valor `min_stock` por producto.
- **Estados Semánticos:**
  - `CRITICAL`: `stock == 0`
  - `LOW`: `0 < stock <= min_stock`
  - `HEALTHY`: `stock > min_stock`

## 4. Tecnologías y Estilos
- **Componentes:** React (Functional Components + Hooks).
- **Estilos:** Sass (SCSS) utilizando los tokens definidos en `_tokens.scss`.
- **Iconografía:** SVG minimalistas (Lucide-react o similar).

## 5. Accesibilidad y UX
- **Contraste:** Colores semánticos con alto contraste sobre fondos claros/oscuros.
- **Feedback:** Estados de carga (Skeletons) y notificaciones de éxito/error tras transacciones.
