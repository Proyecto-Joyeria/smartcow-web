# 🌐 SmartCow Web

Frontend web de **SmartCow Tracker** — Interfaz de usuario para rastreo GPS en tiempo real, monitoreo de signos vitales y gestión del ganado bovino.

---

## 🧱 Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework UI | React | 19.x |
| Bundler | Vite | 6.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 3.x |
| Componentes UI | shadcn/ui | latest |
| Mapas | Leaflet.js + React-Leaflet | 1.9 / 5.x |
| Estado global (realtime) | Redux Toolkit | 2.x |
| Cache de servidor | TanStack Query | 5.x |
| WebSockets | Socket.IO Client | 4.x |
| Formularios | React Hook Form + Zod | 7.x / 3.x |
| Gráficos | Recharts | 2.x |
| Routing | React Router DOM | 6.x |
| HTTP Client | Axios | 1.x |
| Tests | Vitest + Testing Library | 2.x |

---

## 📁 Estructura del Proyecto

```
smartcow-web/
├── src/
│   ├── features/               # Módulos por funcionalidad
│   │   ├── dashboard/          # Métricas, mapa mini, feed de alertas
│   │   ├── map/                # Mapa GPS en tiempo real + geocercas
│   │   ├── cattle/             # Listado y ficha individual del ganado
│   │   ├── alerts/             # Centro de alertas y ciclo de vida
│   │   ├── analytics/          # Dashboard analítico y reportes
│   │   └── admin/              # Usuarios, dispositivos IoT, configuración
│   ├── components/
│   │   ├── ui/                 # Componentes base (Button, Card, Badge...)
│   │   ├── layout/             # Shell, Sidebar, Header, BottomNav
│   │   ├── map/                # AnimalMarker, GeofenceLayer, MapControls
│   │   └── charts/             # VitalCard, Sparkline, LineChart
│   ├── store/
│   │   └── slices/             # Redux slices (gps, alerts, ui)
│   ├── hooks/                  # useWebSocket, useAnimalVitals, useGeofence...
│   ├── services/               # Axios API clients por módulo
│   ├── utils/                  # Helpers, formatters, validators
│   ├── types/                  # TypeScript interfaces y tipos globales
│   └── assets/                 # Imágenes, iconos, fuentes
├── tests/
│   ├── unit/
│   └── integration/
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── Dockerfile
└── .env.example
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 20
- `smartcow-api` corriendo en `http://localhost:4000`

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/smartcow-web.git
cd smartcow-web
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
# Editar .env con la URL de la API
```

### 3. Levantar en desarrollo

```bash
npm run dev
```

La aplicación corre en `http://localhost:5173`.

### 4. Build de producción

```bash
npm run build
npm run preview  # Previsualizar el build
```

---

## 🔑 Variables de Entorno

```env
# API Backend
VITE_API_URL=http://localhost:4000/api/v1
VITE_WS_URL=http://localhost:4000

# Mapas (opcional — para tiles Mapbox satelital)
VITE_MAPBOX_TOKEN=pk.xxxxx

# App
VITE_APP_NAME=SmartCow Tracker
VITE_APP_ENV=development
```

---

## 🗺️ Pantallas Principales

| Ruta | Pantalla | Acceso mínimo |
|------|----------|---------------|
| `/login` | Inicio de sesión | Público |
| `/dashboard` | Dashboard principal | OPERATOR |
| `/map` | Mapa GPS en tiempo real | OPERATOR |
| `/cattle` | Listado de ganado | OPERATOR |
| `/cattle/:id` | Ficha del animal | OPERATOR |
| `/alerts` | Centro de alertas | OPERATOR |
| `/analytics` | Dashboard analítico | VET / ADMIN |
| `/admin/users` | Gestión de usuarios | ADMIN |
| `/admin/geofences` | Gestión de geocercas | ADMIN |
| `/admin/devices` | Dispositivos IoT | ADMIN |
| `/settings` | Configuración de finca | ADMIN |

---

## ⚡ Tiempo Real

El frontend mantiene una conexión WebSocket permanente con el backend a través de Socket.IO. La gestión del estado en tiempo real se divide en dos capas:

| Librería | Dato | Justificación |
|----------|------|---------------|
| **Redux Toolkit** | Posiciones GPS actuales, alertas activas, estado de conexión WS | Cambia en tiempo real cada ~10s vía WebSocket |
| **TanStack Query** | Fichas de animales, historial, geocercas, usuarios | Se obtiene vía HTTP GET y puede cachearse |

> **Regla:** Si el dato llega por WebSocket → Redux. Si llega por API REST → React Query. Nunca duplicar.

---

## 🧪 Tests

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

---

## 🐳 Docker

```bash
# Build
docker build -t smartcow-web .

# Ejecutar
docker run -p 5173:80 --env-file .env smartcow-web
```

---

## 📋 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build optimizado de producción |
| `npm run preview` | Previsualizar el build de producción |
| `npm test` | Ejecutar tests con Vitest |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | Lint del código fuente |
| `npm run format` | Formatear con Prettier |
| `npm run type-check` | Verificar tipos TypeScript |

---

## 🎨 Sistema de Diseño

La interfaz usa un **modo oscuro como predeterminado** con paleta de colores agropecuaria:

| Token | Color | Uso |
|-------|-------|-----|
| `--color-primary` | `#1a7a4a` | Botones primarios, acentos, logo |
| `--color-status-ok` | `#4caf50` | Animal sano, sensor online |
| `--color-status-warn` | `#ffb300` | Alertas de advertencia |
| `--color-status-critical` | `#f44336` | Alertas críticas, animal fuera de zona |
| `--color-status-offline` | `#6e7681` | Sensor sin señal |
| `--bg-surface-primary` | `#0d1117` | Fondo principal |
| `--bg-surface-card` | `#161b22` | Tarjetas y paneles |

Todos los componentes siguen las pautas **WCAG 2.1 Nivel AA** (contraste mínimo 4.5:1, navegación por teclado, etiquetas ARIA).

---

## 🏗️ Arquitectura

La aplicación implementa una organización **feature-based** donde cada módulo de negocio es autónomo y contiene sus propios componentes, hooks y lógica local. Los datos compartidos entre módulos se gestionan a través de Redux (tiempo real) o React Query (servidor).

```
features/
  dashboard/
    components/   ← Componentes exclusivos del dashboard
    hooks/        ← Lógica local del dashboard
  map/
    components/   ← AnimalMarker, GeofenceLayer, etc.
    hooks/        ← useMapAnimals, useGeofenceEditor, etc.
  ...
components/       ← Componentes reutilizables entre features
store/            ← Estado global compartido (Redux)
services/         ← Clientes HTTP compartidos
```

---

## 📄 Documentación Técnica

La documentación completa del proyecto se encuentra en el repositorio [`smartcow-infra`](https://github.com/tu-usuario/smartcow-infra):

- `SRS v1.0.0` — Especificación de Requisitos de Software
- `SAD v1.0.0` — Documento de Arquitectura de Software
- `SDD v1.0.0` — Documento de Diseño de Software
- `IDD v1.0.0` — Documento de Diseño de Interfaces (sistema de diseño completo)

---

## 🤝 Contribución

1. Crea una rama desde `develop`: `git checkout -b feature/nombre-feature`
2. Haz tus cambios y escribe los tests correspondientes
3. Asegúrate de pasar lint y tests: `npm run lint && npm test`
4. Abre un Pull Request hacia `develop`

---

## 📝 Licencia

Proyecto personal — SmartCow Tracker © 2026
