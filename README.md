# Avícola R&R — Demo de control de producción

Demo funcional en HTML/CSS/JS puro (sin build ni backend). Los datos se guardan en `localStorage` del navegador, con ~20 registros de ejemplo precargados.

## Cómo probarla

Abre `index.html` directamente en el navegador (doble clic, o clic derecho → "Abrir con").

**Credenciales de acceso (demo):**
- Usuario: `adminjuan`
- Contraseña: `avicolar&r2026`

## Módulos

- **Registros**: botón "Nuevo registro" para capturar producción por tipo de huevo (AA, A, B, C, Extra, Doble Yema), en flanes + unidades sueltas, junto con las bajas (huevos rotos/dañados). El sistema calcula el neto automáticamente (1 flan = 30 unidades).
- **Reportes**: filtro por rango de fechas y tipo de huevo, resumen de indicadores, gráfico de producción neta por tipo, y exportación a Excel (`.xlsx`) generada en el navegador con SheetJS.

## Estructura

```
Avicola/
├── index.html          # Login + landing animada
├── dashboard.html       # Panel (Registros + Reportes)
├── css/style.css
├── js/
│   ├── data.js          # Config, tipos de huevo, datos de ejemplo, acceso a localStorage
│   ├── registros.js      # Lógica del módulo Registros
│   ├── reportes.js       # Lógica del módulo Reportes + export a Excel
│   └── app.js            # Sesión y navegación
├── assets/logo.jpg
└── logo/                 # Logo original entregado
```

## Siguiente paso (versión real)

Esta es la base visual y funcional para migrar a:
- **Supabase**: tablas `registros_produccion`, `usuarios`, autenticación real, RLS por rol.
- Reemplazar `localStorage` por llamadas a la API de Supabase en `data.js`.
- Mantener el mismo modelo de datos (fecha, tipo, flanes/unidades totales y de baja, neto calculado, observaciones).
