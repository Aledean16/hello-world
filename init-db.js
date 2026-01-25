// Script para inicializar la base de datos SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla de usuarios
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol TEXT DEFAULT 'usuario',
    estado TEXT DEFAULT 'activo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error al crear tabla usuarios:', err.message);
    } else {
      console.log('Tabla de usuarios creada o ya existe.');
    }
  });

  // Crear tabla de proyectos
  db.run(`CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    usuario_id INTEGER NOT NULL,
    estado TEXT DEFAULT 'activo',
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    prioridad TEXT DEFAULT 'media',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )`, (err) => {
    if (err) {
      console.error('Error al crear tabla proyectos:', err.message);
    } else {
      console.log('Tabla de proyectos creada o ya existe.');
    }
  });

  // Crear tabla de tareas
  db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT DEFAULT 'pendiente',
    prioridad TEXT DEFAULT 'media',
    fecha_vencimiento DATETIME,
    fecha_inicio DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )`, (err) => {
    if (err) {
      console.error('Error al crear tabla tareas:', err.message);
    } else {
      console.log('Tabla de tareas creada o ya existe.');
    }
  });

  // Crear tabla de productos
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    notas TEXT,
    abv TEXT,
    descripcion TEXT,
    precio REAL NOT NULL,
    imagen TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error al crear tabla:', err.message);
    } else {
      console.log('Tabla de productos creada o ya existe.');
    }
  });

  // Insertar productos iniciales
  const productos = [
    {
      id: 'plata',
      titulo: 'Tequila Plata',
      notas: 'Cítrico, agave fresco, ligero toque herbal.',
      abv: '40%',
      descripcion: 'Ideal para coctelería y tragos largos; perfil limpio y vibrante.',
      precio: 450,
      imagen: '🥃'
    },
    {
      id: 'anejo',
      titulo: 'Tequila Añejo',
      notas: 'Vainilla, caramelo, especias; final redondo.',
      abv: '40%',
      descripcion: 'Madurado en barrica para una complejidad suave y elegante.',
      precio: 650,
      imagen: '🍾'
    },
    {
      id: 'platinum',
      titulo: 'Tequila Platinum',
      notas: 'Pureza excepcional, textura sedosa, complejidad aromática.',
      abv: '40%',
      descripcion: 'Selección premium con estándares de calidad superiores.',
      precio: 1200,
      imagen: '💎'
    },
    {
      id: 'salmiana',
      titulo: 'Mezcal Salmiana',
      notas: 'Herbal, mineral, ligeramente ahumado; final largo.',
      abv: '42%',
      descripcion: 'Elaborado con agave salmiana, respetando procesos artesanales.',
      precio: 550,
      imagen: '🔥'
    }
  ];

  // Verificar si ya hay productos
  db.get('SELECT COUNT(*) as count FROM productos', (err, row) => {
    if (err) {
      console.error('Error al verificar productos:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Insertando productos iniciales...');
      const stmt = db.prepare(`INSERT INTO productos (id, titulo, notas, abv, descripcion, precio, imagen) 
                               VALUES (?, ?, ?, ?, ?, ?, ?)`);
      
      productos.forEach(producto => {
        stmt.run([
          producto.id,
          producto.titulo,
          producto.notas,
          producto.abv,
          producto.descripcion,
          producto.precio,
          producto.imagen
        ], (err) => {
          if (err) {
            console.error(`Error al insertar ${producto.titulo}:`, err.message);
          } else {
            console.log(`✓ ${producto.titulo} insertado`);
          }
        });
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error al finalizar inserción:', err.message);
        } else {
          console.log('\n✓ Base de datos inicializada correctamente!');
          db.close();
        }
      });
    } else {
      console.log(`Ya existen ${row.count} productos en la base de datos.`);
      db.close();
    }
  });
});
