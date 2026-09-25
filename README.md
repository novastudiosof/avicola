# Avícola R&R — Demo de control de producción

Demo funcional en HTML/CSS/JS puro (sin build ni backend). Los datos se guardan en `localStorage` del navegador, con ~20 registros de ejemplo precargados.

## Cómo probarla

Abre `index.html` directamente en el navegador (doble clic, o clic derecho → "Abrir con").

**Credenciales de acceso (demo):**
- Usuario: `adminjuan`
- Contraseña: `avicolar&r2026`

## Módulos

- **Registros**: solo el botón "Nuevo registro" para capturar producción por tipo de huevo (AA, A, B, C, Extra, Doble Yema), en flanes + unidades sueltas, junto con las bajas (huevos rotos/dañados). El sistema calcula el neto automáticamente (1 flan = 30 unidades).
- **Reportes**: filtro por rango de fechas y tipo de huevo, resumen de indicadores (incluye bajas en unidades y %), gráfico de producción neta por tipo, detalle agrupado por día (con "Ver más" para el desglose completo, editar/eliminar), exportación a Excel y envío de reporte por WhatsApp.
- **Ajustes**: número de WhatsApp al que se envían los reportes, y botón de soporte técnico (WhatsApp fijo de Nova Studio).

## Estructura

```
Avicola/
├── index.html          # Login + landing animada
├── dashboard.html       # Panel (Registros + Reportes + Ajustes)
├── css/style.css
├── js/
│   ├── data.js          # Config, tipos de huevo, datos de ejemplo, acceso a localStorage
│   ├── whatsapp.js       # Helpers de configuración y enlaces de WhatsApp
│   ├── registros.js      # Lógica del módulo Registros
│   ├── reportes.js       # Lógica del módulo Reportes + export a Excel + envío WhatsApp
│   ├── ajustes.js        # Lógica del módulo Ajustes
│   └── app.js            # Sesión y navegación
├── assets/logo.jpg
└── logo/                 # Logo original entregado
```

## Importante: caché del navegador en cada despliegue

Como es un sitio estático sin build, los navegadores cachean agresivamente `style.css` y los archivos `.js`. Para que los cambios se vean sin que el cliente tenga que borrar caché, **todas las referencias a CSS/JS llevan un parámetro de versión** (`?v=3`). Cada vez que se despliegue una actualización, hay que **incrementar ese número** en `index.html` y `dashboard.html` (todas las líneas `<link>`/`<script>` que apunten a archivos locales). Esto obliga al navegador a descargar el archivo nuevo en vez de usar el cacheado.

## Siguiente paso (versión real)

Esta es la base visual y funcional para migrar a:
- **Supabase**: tablas `registros_produccion`, `usuarios`, autenticación real, RLS por rol.
- Reemplazar `localStorage` por llamadas a la API de Supabase en `data.js`.
- Mantener el mismo modelo de datos (fecha, tipo, flanes/unidades totales y de baja, neto calculado, observaciones).
