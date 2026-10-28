# WebDeGatos

Aplicación web full-stack para publicar fotos de gatos, con Node.js, Express y MongoDB.

## Capturas de pantalla
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/26201ce9-a632-4f31-8066-46caa77e25ca" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1f31858e-3285-493d-ab6b-7b09ea98bd63" />


## Funcionalidades
- Registro y login con JWT (cookie `httpOnly`) y contraseñas con bcrypt
- CRUD de fotos con roles: `user` gestiona sus fotos, `admin` puede borrar cualquiera
- Subida de imágenes (multer + Cloudinary; almacenamiento local en desarrollo)
- Paginación y búsqueda (`/photos?q=negro&page=2&limit=9`)
- Vistas dinámicas con EJS (layout + partials + mensajes flash)
- Manejo global de errores
- Desplegada en Render.com

## Tecnologías
Node.js · Express 5 · Mongoose · JWT + bcrypt · EJS · Helmet · express-validator · multer · Cloudinary

## Enlace en producción
https://tu-app.onrender.com

## Instalación local
1. `npm install`
2. Copiar `.env.example` a `.env` y completar las variables
3. `npm start` (o `npm run dev` para recargar automáticamente)

## Variables de entorno
| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión de MongoDB Atlas |
| `JWT_SECRET` | Secreto largo y aleatorio para firmar los tokens |
| `ADMIN_EMAIL` | Quien se registre con este correo obtiene el rol admin |
| `CLOUDINARY_URL` | Credenciales de Cloudinary (obligatoria en producción) |
| `NODE_ENV` | `production` en Render |

## Despliegue en Render
Web Service conectado al repo · Build: `npm install` · Start: `npm start` · añadir las variables anteriores.
En Atlas, permitir el acceso desde `0.0.0.0/0` (Network Access).

## Autores
Ernesto Valdés González, IDFC302.
