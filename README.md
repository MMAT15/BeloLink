BeloLink

BeloLink es una plataforma que ofrece soluciones avanzadas de domótica para mejorar la seguridad, la comodidad y la eficiencia en hogares y negocios.

Características
	•	Diseño moderno y adaptativo, compatible con dispositivos móviles, tablets y computadoras.
	•	Gestión de usuarios con funcionalidades de registro e inicio de sesión.
	•	Integración de soluciones domóticas que automatizan tareas del hogar.
	•	Enlaces dinámicos a redes sociales y funcionalidades interactivas.

   Requisitos

Antes de comenzar, asegúrate de tener instalados Node.js (mínimo versión 18) y Git para gestionar el repositorio.

Instalación
	1.	Clona este repositorio desde GitHub utilizando el comando:
git clone https://github.com/MMAT15/BeloLink.git
	2.	Accede al directorio del proyecto:
cd BeloLink
	3.	Instala las dependencias necesarias:
npm install

Estructura del Proyecto

El proyecto está organizado de la siguiente manera:
	1.	Carpeta api/: Contiene los archivos del backend, como login.js, register.js y utils.js.
	2.	Carpeta public/: Contiene los archivos del frontend, como index.html, iniciar.html, y registrar.html, además de estilos CSS y scripts JavaScript.
	3.	Archivo users.json: Es la base de datos local para almacenar usuarios.
	4.	Archivo vercel.json: Configuración para desplegar el proyecto en Vercel.

   Uso

Para iniciar el proyecto localmente:
	1.	Ejecuta el servidor local con el comando:
npm start
Esto iniciará el servidor en la dirección http://localhost:4000.
	2.	Abre tu navegador y accede a las siguientes páginas principales:
	•	Página de inicio: /index.html
	•	Página de registro: /registrar.html
	•	Página de inicio de sesión: /iniciar.html

   Despliegue en Vercel

Para desplegar en Vercel:
	1.	Conecta el repositorio a tu cuenta de Vercel.
	2.	Asegúrate de que la estructura del proyecto sea correcta.
	3.	Configura los endpoints para que apunten al dominio de Vercel asignado.

   Endpoints de la API

Registro de Usuario
	•	URL: /api/register
	•	Método: POST
	•	Parámetros: Nombre de usuario, correo electrónico y contraseña.
	•	Respuesta exitosa: Mensaje confirmando el registro.

Inicio de Sesión
	•	URL: /api/login
	•	Método: POST
	•	Parámetros: Correo electrónico y contraseña.
	•	Respuesta exitosa: Mensaje confirmando el inicio de sesión con el nombre del usuario.

   Contribuciones

Si deseas contribuir al proyecto:
	1.	Haz un fork del repositorio.
	2.	Crea una nueva rama para tu funcionalidad o corrección.
	3.	Realiza un pull request detallando tus cambios.

¡Tus aportes serán bienvenidos!