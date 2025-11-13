# QueplanFrontend

Aplicación frontend desarrollada con **Angular 20** que muestra cambios en tiempo real en la base de datos de una lista de amigos. Utiliza WebSocket (Socket.IO) para recibir eventos de cambios y Angular Material para la interfaz de usuario.

## Descripción

QueplanFrontend es una aplicación que:
- **Muestra una lista de amigos** obtenida desde el backend
- **Captura cambios en tiempo real** en los campos `name` y `gender` a través de WebSocket
- **Rastrea cambios históricos** en una tabla que muestra valores anteriores y nuevos
- **Actualiza automáticamente** la lista de amigos cuando ocurren cambios en tiempo real

### Características principales
- ✅ Componente standalone con Angular 20
- ✅ Comunicación HTTP para obtener amigos
- ✅ WebSocket (Socket.IO) para cambios en tiempo real
- ✅ Tabla interactiva con Material Design
- ✅ Pruebas unitarias completas (servicios y componentes)
- ✅ Variables de entorno configurables

## Requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Backend corriendo en `http://localhost:3001` (configurable en `environments/environment.ts`)

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd queplan-frontend
```

2. Instala las dependencias:
```bash
npm install
```

## Configuración

### Variables de Entorno

Edita los archivos de configuración según el entorno:

**Desarrollo** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3001'
};
```

**Producción** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.ejemplo.com'
};
```

## Ejecución

### Servidor de desarrollo

```bash
npm start
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando cambies los archivos fuente.

### Build para producción

```bash
npm run build
```

Los artefactos compilados se guardarán en el directorio `dist/`.

### Pruebas unitarias

```bash
npm test
```

Las pruebas se ejecutan en navegador Chrome (o ChromeHeadless en CI). Consulta [Karma](https://karma-runner.github.io) para más detalles.

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── friends.service.ts          # Servicio HTTP para amigos
│   │   │   ├── friends.service.spec.ts
│   │   │   ├── realtime.service.ts         # Servicio WebSocket
│   │   │   └── realtime.service.spec.ts
│   │   └── models/
│   │       ├── friend.model.ts             # Interfaces: Friend, BaseResponseListDto
│   │       └── change-event.model.ts       # Interfaces: DbChangePayload, UiChangeRow
│   ├── features/
│   │   └── friends-live-changes/
│   │       ├── friends-live-changes.component.ts
│   │       ├── friends-live-changes.component.html
│   │       ├── friends-live-changes.component.css
│   │       └── friends-live-changes.component.spec.ts
│   ├── shared/
│   │   └── material/
│   │       └── material.module.ts          # Módulo de Material compartido
│   ├── app-routing.module.ts
│   └── app-routing.module.ts
├── environments/
│   ├── environment.ts                      # Configuración desarrollo
│   └── environment.prod.ts                 # Configuración producción
├── index.html
├── main.ts                                 # Bootstrap de la aplicación
└── styles.css
```

## Servicios

### FriendsService
Servicio HTTP para obtener la lista de amigos del backend.

```typescript
getFriends(): Observable<Friend[]>
getFriendById(id: string): Observable<Friend>
```

**Endpoint esperado del backend:**
```
GET /api/friends
Response: {
  "statusCode": 200,
  "message": "Success",
  "data": [
    { "id": "uuid", "name": "string", "gender": "M|F" },
    ...
  ]
}
```

### RealtimeService
Servicio WebSocket que recibe eventos de cambios en tiempo real.

```typescript
onDbChange(): Observable<UiChangeRow[]>
```

**Evento esperado del backend (Socket.IO):**
```javascript
socket.emit('db-change', {
  table: 'my_friends',
  operation: 'UPDATE',
  primary_key: { id: 'friend-id' },
  changed_at: '2025-11-13T07:00:00Z',
  changes: [
    { column: 'name', old_value: 'John', new_value: 'Johnny' },
    { column: 'gender', old_value: 'M', new_value: 'F' }
  ]
})
```

## Componentes

### FriendsLiveChangesComponent
Componente standalone que:
1. Carga la lista de amigos al inicializar
2. Inicializa una tabla con los valores actuales de amigos
3. Se suscribe a cambios en tiempo real
4. Actualiza la tabla moviendo valores nuevos a antiguos
5. Muestra una tabla con:
   - **Tabla**: Nombre de la tabla
   - **Valor anterior Nombre**: Nombre anterior
   - **Valor anterior Género**: Género anterior
   - **Valor nuevo Nombre**: Nombre nuevo (en negrita)
   - **Valor nuevo Género**: Género nuevo (en negrita)
   - **Fecha/Hora**: Timestamp del cambio

## Pruebas

El proyecto incluye pruebas unitarias exhaustivas:

- **FriendsService**: 8 casos de prueba
- **RealtimeService**: 6 casos de prueba
- **FriendsLiveChangesComponent**: 14+ casos de prueba

Ejecuta todas las pruebas con:
```bash
npm test -- --watch=false
```

## Dependencias principales

- **@angular/core** ^20.0.0
- **@angular/material** ^20.0.0
- **socket.io-client** ^4.7.0
- **rxjs** ^7.8.0

## Desarrollo

### Generar componente
```bash
ng generate component path/to/component
```

### Generar servicio
```bash
ng generate service path/to/service
```

### Generar módulo
```bash
ng generate module path/to/module
```

## Despliegue

### Desarrollo (npm start)
```bash
npm start
```

### Build y serve en producción
```bash
npm run build
ng serve --configuration production
```

## Troubleshooting

### WebSocket no conecta
Verifica que el backend esté corriendo en la URL configurada en `environments/environment.ts`.

### Errores de módulo en imports
Asegúrate de que `MaterialModule` esté importado en los componentes standalone:
```typescript
imports: [CommonModule, MaterialModule]
```

### Puerto 4200 ocupado
Usa otro puerto:
```bash
ng serve --port 4300
```

## Contribución

Para contribuir al proyecto:
1. Crea una rama (`git checkout -b feature/feature-name`)
2. Realiza tus cambios
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/feature-name`)
5. Abre un Pull Request

## Créditos de IA

Este proyecto utilizó IA para:

- Realizar las pruebas unitarias
- Generar documentación
- Realizar maquetado
- Consumir servicio del back
- Establecer conexión con el backend por medio de websocket
- Crear modelos de datos

## Licencia

Este proyecto está bajo licencia MIT.

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Última actualización**: 13 de noviembre de 2025
**Versión Angular**: 20.x
**Versión Node**: 18+
