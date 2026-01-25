// Servidor Express para la API de productos, usuarios, proyectos y tareas
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'database.sqlite');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir archivos estáticos

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('✓ Conectado a la base de datos SQLite');
  }
});

// ==================== ENDPOINTS DE PRODUCTOS ====================

// GET: Obtener todos los productos
app.get('/api/productos', (req, res) => {
  db.all('SELECT * FROM productos ORDER BY titulo', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET: Obtener un producto por ID
app.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM productos WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(row);
  });
});

// POST: Crear un nuevo producto
app.post('/api/productos', (req, res) => {
  const { id, titulo, notas, abv, descripcion, precio, imagen } = req.body;
  
  if (!id || !titulo || !precio) {
    res.status(400).json({ error: 'Faltan campos requeridos: id, titulo, precio' });
    return;
  }

  db.run(
    'INSERT INTO productos (id, titulo, notas, abv, descripcion, precio, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, titulo, notas || null, abv || null, descripcion || null, precio, imagen || '🍾'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, message: 'Producto creado exitosamente' });
    }
  );
});

// PUT: Actualizar un producto
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, notas, abv, descripcion, precio, imagen } = req.body;

  db.run(
    'UPDATE productos SET titulo = ?, notas = ?, abv = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?',
    [titulo, notas, abv, descripcion, precio, imagen, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      res.json({ message: 'Producto actualizado exitosamente' });
    }
  );
});

// DELETE: Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM productos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  });
});

// ==================== ENDPOINTS DE USUARIOS ====================

// GET: Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  db.all('SELECT id, nombre, email, rol, estado, created_at FROM usuarios ORDER BY nombre', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET: Obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT id, nombre, email, rol, estado, created_at FROM usuarios WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(row);
  });
});

// POST: Crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;

  if (!nombre || !email || !contraseña) {
    res.status(400).json({ error: 'Faltan campos requeridos: nombre, email, contraseña' });
    return;
  }

  db.run(
    'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, contraseña, rol || 'usuario'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'El email ya está registrado' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      res.status(201).json({ id: this.lastID, message: 'Usuario creado exitosamente' });
    }
  );
});

// PUT: Actualizar un usuario
app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, estado } = req.body;

  db.run(
    'UPDATE usuarios SET nombre = ?, email = ?, rol = ?, estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [nombre, email, rol, estado, id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'El email ya está en uso' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json({ message: 'Usuario actualizado exitosamente' });
    }
  );
});

// DELETE: Eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM usuarios WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  });
});

// ==================== ENDPOINTS DE PROYECTOS ====================

// GET: Obtener todos los proyectos
app.get('/api/proyectos', (req, res) => {
  db.all(`SELECT p.id, p.nombre, p.descripcion, p.usuario_id, u.nombre as usuario_nombre, 
           p.estado, p.fecha_inicio, p.fecha_fin, p.prioridad, p.created_at 
           FROM proyectos p 
           LEFT JOIN usuarios u ON p.usuario_id = u.id 
           ORDER BY p.created_at DESC`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET: Obtener proyectos de un usuario
app.get('/api/usuarios/:usuario_id/proyectos', (req, res) => {
  const { usuario_id } = req.params;
  db.all('SELECT * FROM proyectos WHERE usuario_id = ? ORDER BY created_at DESC', [usuario_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET: Obtener un proyecto por ID
app.get('/api/proyectos/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT p.id, p.nombre, p.descripcion, p.usuario_id, u.nombre as usuario_nombre, 
           p.estado, p.fecha_inicio, p.fecha_fin, p.prioridad, p.created_at 
           FROM proyectos p 
           LEFT JOIN usuarios u ON p.usuario_id = u.id 
           WHERE p.id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Proyecto no encontrado' });
      return;
    }
    res.json(row);
  });
});

// POST: Crear un nuevo proyecto
app.post('/api/proyectos', (req, res) => {
  const { nombre, descripcion, usuario_id, estado, fecha_inicio, fecha_fin, prioridad } = req.body;

  if (!nombre || !usuario_id) {
    res.status(400).json({ error: 'Faltan campos requeridos: nombre, usuario_id' });
    return;
  }

  db.run(
    'INSERT INTO proyectos (nombre, descripcion, usuario_id, estado, fecha_inicio, fecha_fin, prioridad) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nombre, descripcion || null, usuario_id, estado || 'activo', fecha_inicio || null, fecha_fin || null, prioridad || 'media'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, message: 'Proyecto creado exitosamente' });
    }
  );
});

// PUT: Actualizar un proyecto
app.put('/api/proyectos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado, fecha_inicio, fecha_fin, prioridad } = req.body;

  db.run(
    'UPDATE proyectos SET nombre = ?, descripcion = ?, estado = ?, fecha_inicio = ?, fecha_fin = ?, prioridad = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [nombre, descripcion, estado, fecha_inicio, fecha_fin, prioridad, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Proyecto no encontrado' });
        return;
      }
      res.json({ message: 'Proyecto actualizado exitosamente' });
    }
  );
});

// DELETE: Eliminar un proyecto
app.delete('/api/proyectos/:id', (req, res) => {
  const { id } = req.params;
  
  // Primero eliminar todas las tareas del proyecto
  db.run('DELETE FROM tareas WHERE proyecto_id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Luego eliminar el proyecto
    db.run('DELETE FROM proyectos WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Proyecto no encontrado' });
        return;
      }
      res.json({ message: 'Proyecto y sus tareas eliminados exitosamente' });
    });
  });
});

// ==================== ENDPOINTS DE TAREAS ====================

// GET: Obtener todas las tareas
app.get('/api/tareas', (req, res) => {
  db.all(`SELECT t.id, t.proyecto_id, t.usuario_id, t.titulo, t.descripcion, t.estado, 
           t.prioridad, t.fecha_vencimiento, t.fecha_inicio, t.created_at,
           p.nombre as proyecto_nombre, u.nombre as usuario_nombre 
           FROM tareas t 
           LEFT JOIN proyectos p ON t.proyecto_id = p.id 
           LEFT JOIN usuarios u ON t.usuario_id = u.id 
           ORDER BY t.fecha_vencimiento ASC`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET: Obtener tareas de un proyecto
app.get('/api/proyectos/:proyecto_id/tareas', (req, res) => {
  const { proyecto_id } = req.params;
  db.all(`SELECT t.id, t.proyecto_id, t.usuario_id, t.titulo, t.descripcion, t.estado, 
           t.prioridad, t.fecha_vencimiento, t.fecha_inicio, t.created_at,
           u.nombre as usuario_nombre 
           FROM tareas t 
           LEFT JOIN usuarios u ON t.usuario_id = u.id 
           WHERE t.proyecto_id = ? 
           ORDER BY t.fecha_vencimiento ASC`, [proyecto_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET: Obtener tareas de un usuario
app.get('/api/usuarios/:usuario_id/tareas', (req, res) => {
  const { usuario_id } = req.params;
  db.all(`SELECT t.id, t.proyecto_id, t.usuario_id, t.titulo, t.descripcion, t.estado, 
           t.prioridad, t.fecha_vencimiento, t.fecha_inicio, t.created_at,
           p.nombre as proyecto_nombre 
           FROM tareas t 
           LEFT JOIN proyectos p ON t.proyecto_id = p.id 
           WHERE t.usuario_id = ? 
           ORDER BY t.fecha_vencimiento ASC`, [usuario_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET: Obtener una tarea por ID
app.get('/api/tareas/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT t.id, t.proyecto_id, t.usuario_id, t.titulo, t.descripcion, t.estado, 
           t.prioridad, t.fecha_vencimiento, t.fecha_inicio, t.created_at,
           p.nombre as proyecto_nombre, u.nombre as usuario_nombre 
           FROM tareas t 
           LEFT JOIN proyectos p ON t.proyecto_id = p.id 
           LEFT JOIN usuarios u ON t.usuario_id = u.id 
           WHERE t.id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    res.json(row);
  });
});

// POST: Crear una nueva tarea
app.post('/api/tareas', (req, res) => {
  const { proyecto_id, usuario_id, titulo, descripcion, estado, prioridad, fecha_vencimiento, fecha_inicio } = req.body;

  if (!proyecto_id || !usuario_id || !titulo) {
    res.status(400).json({ error: 'Faltan campos requeridos: proyecto_id, usuario_id, titulo' });
    return;
  }

  db.run(
    'INSERT INTO tareas (proyecto_id, usuario_id, titulo, descripcion, estado, prioridad, fecha_vencimiento, fecha_inicio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [proyecto_id, usuario_id, titulo, descripcion || null, estado || 'pendiente', prioridad || 'media', fecha_vencimiento || null, fecha_inicio || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, message: 'Tarea creada exitosamente' });
    }
  );
});

// PUT: Actualizar una tarea
app.put('/api/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estado, prioridad, fecha_vencimiento, fecha_inicio } = req.body;

  db.run(
    'UPDATE tareas SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, fecha_vencimiento = ?, fecha_inicio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [titulo, descripcion, estado, prioridad, fecha_vencimiento, fecha_inicio, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      res.json({ message: 'Tarea actualizada exitosamente' });
    }
  );
});

// DELETE: Eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tareas WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    res.json({ message: 'Tarea eliminada exitosamente' });
  });
});

// ==================== INICIO DEL SERVIDOR ====================

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`\n📦 APIs disponibles:`);
  console.log(`   - Productos: http://localhost:${PORT}/api/productos`);
  console.log(`   - Usuarios: http://localhost:${PORT}/api/usuarios`);
  console.log(`   - Proyectos: http://localhost:${PORT}/api/proyectos`);
  console.log(`   - Tareas: http://localhost:${PORT}/api/tareas`);
  console.log(`\n🌐 Aplicación disponible en http://localhost:${PORT}/index.html\n`);
});

// Cerrar base de datos al terminar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('\nBase de datos cerrada.');
    process.exit(0);
  });
});
