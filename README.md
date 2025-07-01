Corevida - Aplicación de Rutinas de Gimnasio Personalizadas
Descripción:
Corevida es una aplicación web full-stack diseñada para usuarios de gimnasio que buscan una experiencia de entrenamiento personalizada. La plataforma permite a los usuarios registrarse, iniciar sesión y configurar sus preferencias de entrenamiento (días por semana y duración de la sesión). En base a estos datos, la aplicación genera automáticamente una rutina de ejercicios única y aleatoria, la cual se guarda en el perfil del usuario para futuras consultas.

La aplicación cuenta con un sistema de autenticación seguro, una interfaz de usuario interactiva construida con React, y un backend robusto que maneja toda la lógica de negocio y la comunicación con la base de datos. Además, se integra un chatbot de asistencia en la pantalla de la rutina para mejorar la experiencia del usuario.

Características Principales:
Autenticación de Usuarios: Sistema completo de registro e inicio de sesión con tokens de seguridad (JWT).

Contraseñas Seguras: Almacenamiento de contraseñas utilizando hashing con bcrypt.

Flujo de Configuración Inicial: Proceso guiado para que los nuevos usuarios establezcan sus datos y preferencias de entrenamiento.

Navegación Condicional: La aplicación redirige inteligentemente a los usuarios a la pantalla de configuración o a su rutina guardada, dependiendo de si ya han completado el proceso inicial.

Generación de Rutinas Dinámicas: Un algoritmo en el backend crea rutinas de 3, 4 o 6 días, seleccionando ejercicios de forma aleatoria desde la base de datos según las reglas establecidas.

Persistencia de Datos: Las rutinas generadas se guardan en la base de datos PostgreSQL, asegurando que el usuario siempre vea la misma rutina hasta que decida reconfigurarla.

Visor de Rutinas Interactivo: Interfaz para navegar por los días de la semana y los grupos musculares de cada día con un carrusel.

Sistema de Alertas Personalizado: Notificaciones no intrusivas y estilizadas que mejoran la experiencia de usuario.

Chatbot Integrado: Asistente virtual de Voiceflow disponible exclusivamente en la pantalla de la rutina.

Stack Tecnológico:
Frontend (Cliente):
React: Biblioteca principal para construir la interfaz de usuario.

Vite: Herramienta de construcción y entorno de desarrollo.

React Router DOM: Para la gestión de rutas en la aplicación.

Axios: Para realizar peticiones HTTP al backend.

React-iMask: Para la máscara de entrada en el campo de fecha.

CSS Personalizado: Para el diseño y la maquetación de la aplicación.

Backend (Servidor):
Node.js: Entorno de ejecución para JavaScript en el servidor.

Express.js: Framework para construir la API REST.

PostgreSQL: Sistema de gestión de base de datos relacional.

jsonwebtoken (JWT): Para la creación y verificación de tokens de sesión.

bcrypt: Para el hasheo seguro de contraseñas.

pg (node-postgres): Driver para la conexión entre Node.js y PostgreSQL.

cors: Middleware para habilitar el intercambio de recursos de origen cruzado.

dotenv: Para la gestión de variables de entorno.

Base de Datos y Servicios
Railway: Plataforma en la nube para el alojamiento de la base de datos PostgreSQL.

Voiceflow: Servicio para la creación e integración del chatbot.

Instalación y ejecución:
Sigue estos pasos para correr el proyecto en tu máquina local.

Prerrequisitos
-Tener instalado Node.js (versión 16 o superior).

-Tener instalado npm (se instala automáticamente con Node.js).

-Tener acceso a una base de datos PostgreSQL (puedes usar una local o la de Railway).

Pasos:
1- Clonar el repositorio:
git clone https://github.com/MuffinCalentito/Corevida-App-web-de-Gimnasio.git
cd Corevida-App-web-de-Gimnasio

2- Configurar el backend:
Navega a la carpeta del backend: cd corevida-backend

Instala las dependencias: npm install

Crea una copia del archivo de ejemplo para las variables de entorno: cp .env.example .env

Abre el nuevo archivo .env y rellena las variables con tus propios datos (la URL de tu base de datos de Railway y una clave secreta para JWT).
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/BASEDEDATOS"
JWT_SECRET="UNA_CLAVE_SECRETA_MUY_FUERTE_Y_ALEATORIA"

3- Configura el frontend:
Vuelve a la carpeta raíz y navega a la del frontend: cd ../corevida-frontend

Instala las dependencias: npm install

4- Prepara la Base de Datos:

Asegúrate de que tu base de datos esté activa.

Ejecuta estos scripts para crear las tablas:
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    dias_entreno INT CHECK (dias_entreno IN (3, 4, 6)) DEFAULT NULL,
    duracion INT CHECK (duracion IN (30, 60, 90)) DEFAULT NULL
);

CREATE TABLE musculos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE ejercicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    musculo_id INT NOT NULL REFERENCES musculos(id) ON DELETE CASCADE,
    imagen TEXT
);

CREATE TABLE rutinas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    dia_numero INT NOT NULL CHECK (dia_numero BETWEEN 1 AND 6)
);

CREATE TABLE rutina_ejercicios (
    id SERIAL PRIMARY KEY,
    rutina_id INT NOT NULL REFERENCES rutinas(id) ON DELETE CASCADE,
    ejercicio_id INT NOT NULL REFERENCES ejercicios(id) ON DELETE CASCADE,
    series INT NOT NULL CHECK (series > 0),
    repeticiones INT NOT NULL CHECK (repeticiones > 0)
);

Ejecuta estos scripts llenar los datos de músculos y ejercicios:
INSERT INTO musculos (nombre) VALUES
('Tríceps'),
('Bíceps'),
('Pierna'),
('Abdomen'),
('Pecho'),
('Hombro'),
('Espalda');

INSERT INTO ejercicios (nombre, musculo_id, imagen) VALUES
('Prensa de pierna', 3, 'https://static.strengthlevel.com/images/exercises/sled-leg-press/sled-leg-press-800.avif'),
('Extensión de cuádriceps', 3, 'https://eresfitness.com/wp-content/uploads/2019/09/Extensi%C3%B3n-de-piernas-en-m%C3%A1quina.jpg.webp'),
('Curl femoral sentado', 3, 'https://fitgeneration.es/wp-content/uploads/2023/10/Curl-de-isquios-5.png'),
('Sentadilla en máquina Smith', 3, 'https://static.strengthlevel.com/images/exercises/smith-machine-squat/smith-machine-squat-800.avif'),
('Elevación de talones en máquina para gemelos', 3, 'https://eresfitness.com/wp-content/uploads/2019/09/Elevaci%C3%B3n-de-talones-de-pie-en-m%C3%A1quina.jpg.webp'),
('Abductores en máquina', 3, 'https://static.wixstatic.com/media/2edbed_2880b4332cc94d3aae7fec20b4312b31~mv2.webp');
INSERT INTO ejercicios (nombre, musculo_id, imagen) VALUES
('Crunch abdominal en máquina', 4, 'https://st2.depositphotos.com/8546304/11394/i/600/depositphotos_113940900-stock-illustration-abdominal-crunch-in-ab-machine.jpg'),
('Crunch con cable en polea alta', 4, 'https://liftmanual.com/wp-content/uploads/2023/04/cable-kneeling-crunch.jpg'),
('Elevaciones de rodillas en silla romana', 4, 'https://fitcron.com/wp-content/uploads/2024/05/28021301-Twisted-Leg-Raise_Waist_720.gif'),
('Rotación de torso en máquina', 4, 'https://www.shutterstock.com/image-illustration/lever-trunk-rotation-waist-exercise-260nw-2329920969.jpg');
INSERT INTO ejercicios (nombre, musculo_id, imagen) VALUES
('Jalón al pecho en polea', 7, 'https://cdn.shopify.com/s/files/1/0269/5551/3900/files/Reverse-Grip-Pulldown_10c5341f-30fd-4126-8fd7-2fa05c079889_600x600.png'),
('Remo sentado en polea baja', 7, 'https://eresfitness.com/wp-content/uploads/2020/02/02391105-Cable-Straight-Back-Seated-Row_Back_max.png'),
('Remo en máquina Hammer Strength', 7, 'https://tumejorfisico.com/wp-content/uploads/2021/06/remo-en-maquina-horizontal.png'),
('Pull-over en máquina', 7, 'https://i.pinimg.com/736x/35/e2/38/35e238fceb140b6e676bd8c8ba24e342.jpg'),
('Remo inferior en polea', 7, 'https://cdn.shopify.com/s/files/1/0269/5551/3900/files/Barbell-Row_4beb1d94-bac9-4538-9578-2d9cf93ef008_600x600.png');
INSERT INTO ejercicios (nombre, musculo_id, imagen) VALUES
('Curl de bíceps', 2, 'https://eresfitness.com/wp-content/uploads/2019/05/Curl-de-biceps.gif'),
('Curl en polea baja con barra recta', 2, 'https://fitcron.com/wp-content/uploads/2021/04/18611301-Cable-Curl-with-Multipurpose-V-bar_Forearms_720.gif'),
('Curl en polea baja con cuerda', 2, 'https://s3assets.skimble.com/assets/1819011/image_full.jpg'),
('Curl en banco predicador asistido', 2, 'https://boxlifemagazine.com/wp-content/uploads//2023/08/curl-au-pupitre-barre-ez-larry-scott-min.gif');
INSERT INTO ejercicios (nombre, musculo_id, imagen) VALUES
('Extensión de tríceps en polea', 1, 'https://cdn.shopify.com/s/files/1/0269/5551/3900/files/Cable-Rope-Pushdown_600x600.png'),
('Fondos asistidos en máquina', 1, 'https://www.feda.net/wp-content/uploads/2019/02/dip.jpg'),
('Extensión de tríceps con mancuerna', 1, 'https://cdn.shopify.com/s/files/1/0269/5551/3900/files/Lying-Dumbbell-Triceps-Extension_600x600.png');
INSERT INTO ejercicios (nombre, musculo_id, imagen) VALUES
('Elevaciones laterales en máquina', 6, 'https://static.vecteezy.com/system/resources/previews/021/781/023/non_2x/woman-doing-seated-lateral-raise-machine-power-partials-exercise-vector.jpg'),
('Press de hombros en máquina', 6, 'https://static.strengthlevel.com/images/exercises/machine-shoulder-press/machine-shoulder-press-800.jpg'),
('Elevaciones posteriores en máquina', 6, 'https://www.trainologym.com/wp-content/uploads/2022/10/reverse-peck-deck.png'),
('Elevación frontal con mancuerna', 6, 'https://fitcron.com/wp-content/uploads/2021/04/03101301-Dumbbell-Front-Raise_Shoulders_720.gif');
INSERT INTO ejercicios (nombre, musculo_id, imagen) VALUES
('Press de pecho en máquina', 5, 'https://static.strengthlevel.com/images/exercises/chest-press/chest-press-800.jpg'),
('Press militar inclinado en máquina', 5, 'https://fitcron.com/wp-content/uploads/2021/04/11951301-Lever-Incline-Hammer-Chest-Press_Chest_720.gif'),
('Aperturas en máquina', 5, 'https://eresfitness.com/wp-content/uploads/2019/11/Aperturas-peck-deck-de-pecho.jpg.webp'),
('Crossover en polea', 5, 'https://eresfitness.com/wp-content/uploads/2019/06/Cruces-en-polea-alta-o-crossover-para-pectorales.jpg.webp');

5- Ejecuta la aplicación:
Abre dos terminales separadas.

En la primera terminal, inicia el servidor del backend (desde la carpeta corevida-backend):
node index.js
En la segunda terminal, inicia el frontend:
npm run dev

6- Ir a la dirección que se indica en la terminal del frontend