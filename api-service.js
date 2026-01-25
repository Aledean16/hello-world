// ==================== CONFIGURACIÓN ====================
const API_BASE_URL = 'http://localhost:3000/api';

// ==================== SERVICIO DE API - USUARIOS ====================
const usuariosAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) throw new Error('Error al obtener usuarios');
      return await response.json();
    } catch (error) {
      console.error('Error en getAll usuarios:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
      if (!response.ok) throw new Error('Usuario no encontrado');
      return await response.json();
    } catch (error) {
      console.error('Error en getById usuario:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear usuario');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en create usuario:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar usuario');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en update usuario:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar usuario');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en delete usuario:', error);
      throw error;
    }
  }
};

// ==================== SERVICIO DE API - PROYECTOS ====================
const proyectosAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos`);
      if (!response.ok) throw new Error('Error al obtener proyectos');
      return await response.json();
    } catch (error) {
      console.error('Error en getAll proyectos:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${id}`);
      if (!response.ok) throw new Error('Proyecto no encontrado');
      return await response.json();
    } catch (error) {
      console.error('Error en getById proyecto:', error);
      throw error;
    }
  },

  async getByUsuario(usuarioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}/proyectos`);
      if (!response.ok) throw new Error('Error al obtener proyectos del usuario');
      return await response.json();
    } catch (error) {
      console.error('Error en getByUsuario proyectos:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear proyecto');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en create proyecto:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar proyecto');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en update proyecto:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar proyecto');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en delete proyecto:', error);
      throw error;
    }
  }
};

// ==================== SERVICIO DE API - TAREAS ====================
const tareasAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`);
      if (!response.ok) throw new Error('Error al obtener tareas');
      return await response.json();
    } catch (error) {
      console.error('Error en getAll tareas:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`);
      if (!response.ok) throw new Error('Tarea no encontrada');
      return await response.json();
    } catch (error) {
      console.error('Error en getById tarea:', error);
      throw error;
    }
  },

  async getByProyecto(proyectoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/proyectos/${proyectoId}/tareas`);
      if (!response.ok) throw new Error('Error al obtener tareas del proyecto');
      return await response.json();
    } catch (error) {
      console.error('Error en getByProyecto tareas:', error);
      throw error;
    }
  },

  async getByUsuario(usuarioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}/tareas`);
      if (!response.ok) throw new Error('Error al obtener tareas del usuario');
      return await response.json();
    } catch (error) {
      console.error('Error en getByUsuario tareas:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear tarea');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en create tarea:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar tarea');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en update tarea:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar tarea');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en delete tarea:', error);
      throw error;
    }
  }
};

// ==================== SERVICIO DE API - PRODUCTOS ====================
const productosAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      if (!response.ok) throw new Error('Error al obtener productos');
      return await response.json();
    } catch (error) {
      console.error('Error en getAll productos:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`);
      if (!response.ok) throw new Error('Producto no encontrado');
      return await response.json();
    } catch (error) {
      console.error('Error en getById producto:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear producto');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en create producto:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar producto');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en update producto:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar producto');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en delete producto:', error);
      throw error;
    }
  }
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Maneja errores de forma centralizada
 */
function handleError(error, defaultMessage = 'Error desconocido') {
  const message = error.message || defaultMessage;
  console.error(message);
  showNotification(message, 'error');
  return { error: message };
}

/**
 * Muestra notificaciones al usuario
 */
function showNotification(message, type = 'success') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.background = type === 'error' ? '#d32f2f' : 'var(--primary)';
  document.body.appendChild(notification);
  
  // Forzar reflow para activar transición
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Auto-remover después de 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * Valida que los datos requeridos estén presentes
 */
function validateRequired(data, requiredFields) {
  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missing.join(', ')}`);
  }
}

/**
 * Obtener fecha formateada
 */
function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-MX');
}

/**
 * Obtener hora formateada
 */
function formatDateTime(dateTime) {
  if (!dateTime) return '';
  return new Date(dateTime).toLocaleString('es-MX');
}

// Exportar para uso en otros archivos si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    usuariosAPI,
    proyectosAPI,
    tareasAPI,
    productosAPI,
    handleError,
    showNotification,
    validateRequired,
    formatDate,
    formatDateTime
  };
}
