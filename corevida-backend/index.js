//IMPORTACIONES DE MÓDULOS
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

//IMPORTACIONES LOCALES
const verifyToken = require('./middleware/verifyToken');

//CONFIGURACIÓN INICIAL DE LA APLICACIÓN
const app = express();
const PORT = 3001;

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// --- MIDDLEWARES GENERALES ---
app.use(cors());       // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Habilita el parseo de cuerpos de petición en formato JSON

// ENDPOINT: Registrar un nuevo usuario
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Formato de correo electrónico no válido.' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'INSERT INTO usuarios (nombre_usuario, correo, contraseña) VALUES ($1, $2, $3) RETURNING id, nombre_usuario;';
    const values = [username, email, hashedPassword];
    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Usuario registrado con éxito!', user: result.rows[0] });
  } catch (error) {
    console.error('Error en el registro:', error);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// ENDPOINT: Iniciar sesión de un usuario
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
  }
  try {
    const query = 'SELECT * FROM usuarios WHERE nombre_usuario = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.contraseña);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const payload = { userId: user.id, username: user.nombre_usuario };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Revisa si el usuario ya ha completado su configuración inicial
    const isSetupComplete = user.dias_entreno !== null;

    res.status(200).json({
      message: 'Inicio de sesión exitoso!',
      token: token,
      isSetupComplete: isSetupComplete
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// ENDPOINT: Configurar entrenamiento y generar/guardar la rutina por primera vez o de nuevo
app.put('/api/user/setup', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Iniciar una transacción

    const userId = req.user.userId;
    const { num_dias_entrenar, tiempo_entreno } = req.body;

    // 1. ACTUALIZAR la configuración del usuario (días y duración)
    const updateUserQuery = 'UPDATE usuarios SET dias_entreno = $1, duracion = $2 WHERE id = $3;';
    await client.query(updateUserQuery, [num_dias_entrenar, tiempo_entreno, userId]);

    // 2. BORRAR la rutina antigua del usuario para crear la nueva
    const deleteOldRoutineQuery = 'DELETE FROM rutinas WHERE usuario_id = $1';
    await client.query(deleteOldRoutineQuery, [userId]);

    // 3. GENERAR la nueva rutina dinámicamente
    const ejerciciosQuery = 'SELECT e.id, e.nombre, e.imagen, m.nombre AS musculo_nombre FROM ejercicios e JOIN musculos m ON e.musculo_id = m.id';
    const todosLosEjercicios = (await client.query(ejerciciosQuery)).rows;

    const ejerciciosPorMusculo = todosLosEjercicios.reduce((acc, ejercicio) => {
      const musculo = ejercicio.musculo_nombre;
      if (!acc[musculo]) { acc[musculo] = []; }
      acc[musculo].push(ejercicio);
      return acc;
    }, {});

    const plantillas = {
      3: [[{ muscle: 'Triceps', count: 2 }, { muscle: 'Hombro', count: 2 }, { muscle: 'Pecho', count: 2 }], [{ muscle: 'Pierna', count: 3 }, { muscle: 'Abdomen', count: 3 }], [{ muscle: 'Espalda', count: 3 }, { muscle: 'Biceps', count: 3 }]],
      4: [[{ muscle: 'Hombro', count: 2 }, { muscle: 'Pecho', count: 2 }], [{ muscle: 'Pierna', count: 3 }], [{ muscle: 'Triceps', count: 2 }, { muscle: 'Biceps', count: 3 }], [{ muscle: 'Abdomen', count: 3 }, { muscle: 'Espalda', count: 3 }]],
      6: [[{ muscle: 'Triceps', count: 2 }, { muscle: 'Hombro', count: 2 }, { muscle: 'Pecho', count: 2 }], [{ muscle: 'Pierna', count: 3 }, { muscle: 'Abdomen', count: 3 }], [{ muscle: 'Espalda', count: 3 }, { muscle: 'Biceps', count: 3 }], [{ muscle: 'Triceps', count: 2 }, { muscle: 'Hombro', count: 2 }, { muscle: 'Pecho', count: 2 }], [{ muscle: 'Pierna', count: 3 }, { muscle: 'Abdomen', count: 3 }], [{ muscle: 'Espalda', count: 3 }, { muscle: 'Biceps', count: 3 }]]
    };

    const elegirEjerciciosAleatorios = (musculo, cantidad) => {
      const listaEjercicios = ejerciciosPorMusculo[musculo] || [];
      return [...listaEjercicios].sort(() => 0.5 - Math.random()).slice(0, cantidad);
    };

    const plantillaSeleccionada = plantillas[num_dias_entrenar];
    const rutinaGenerada = plantillaSeleccionada.map(dia =>
      dia.map(grupo => ({
        muscle: grupo.muscle,
        exercises: elegirEjerciciosAleatorios(grupo.muscle, grupo.count)
      }))
    );

    // 4. GUARDAR la nueva rutina generada en la base de datos
    const seriesYRepsMap = { 30: '3x8', 60: '3x10', 90: '4x8' };
    const repsString = seriesYRepsMap[tiempo_entreno];
    const [series, repeticiones] = repsString.split('x').map(Number);

    for (let i = 0; i < rutinaGenerada.length; i++) {
      const diaNumero = i + 1;
      const rutinaDia = rutinaGenerada[i];
      const insertRutinaQuery = 'INSERT INTO rutinas (usuario_id, dia_numero) VALUES ($1, $2) RETURNING id';
      const rutinaResult = await client.query(insertRutinaQuery, [userId, diaNumero]);
      const nuevaRutinaId = rutinaResult.rows[0].id;

      for (const grupo of rutinaDia) {
        for (const ejercicio of grupo.exercises) {
          const insertEjercicioQuery = 'INSERT INTO rutina_ejercicios (rutina_id, ejercicio_id, series, repeticiones) VALUES ($1, $2, $3, $4)';
          await client.query(insertEjercicioQuery, [nuevaRutinaId, ejercicio.id, series, repeticiones]);
        }
      }
    }

    await client.query('COMMIT'); 
    res.status(200).json({ message: 'Configuración y nueva rutina guardadas con éxito.' });

  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error('Error en el setup y guardado de rutina:', error);
    res.status(500).json({ message: 'Error al procesar la configuración de la rutina.' });
  } finally {
    client.release(); 
  }
});

// ENDPOINT: Obtener la rutina ya guardada del usuario
app.get('/api/user/routine', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = `
      SELECT r.dia_numero, m.nombre AS musculo, e.nombre AS ejercicio_nombre, e.imagen, re.series, re.repeticiones
      FROM rutinas r
      JOIN rutina_ejercicios re ON r.id = re.rutina_id
      JOIN ejercicios e ON re.ejercicio_id = e.id
      JOIN musculos m ON e.musculo_id = m.id
      WHERE r.usuario_id = $1
      ORDER BY r.dia_numero, m.nombre;
    `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró una rutina guardada. Por favor, configúrala.' });
    }

    
    const rutinaAnidada = {};
    result.rows.forEach(row => {
      const diaIndex = row.dia_numero - 1;
      if (!rutinaAnidada[diaIndex]) rutinaAnidada[diaIndex] = {};
      if (!rutinaAnidada[diaIndex][row.musculo]) rutinaAnidada[diaIndex][row.musculo] = [];
      rutinaAnidada[diaIndex][row.musculo].push({
        name: row.ejercicio_nombre,
        reps: `${row.series}x${row.repeticiones}`,
        image: row.imagen
      });
    });

    const finalRoutine = Object.values(rutinaAnidada).map(dia =>
      Object.entries(dia).map(([muscle, exercises]) => ({ muscle, exercises }))
    );

    res.json({ dias: finalRoutine.length, routine: finalRoutine });

  } catch (error) {
    console.error('Error al obtener la rutina guardada:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

//INICIAR EL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor backend de Corevida escuchando en http://localhost:${PORT}`);
});