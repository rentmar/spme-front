-- Crear tabla spme_monitoreo_solicitudreembolso
CREATE TABLE IF NOT EXISTS spme_monitoreo_solicitudreembolso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numeroFormulario VARCHAR(255) NOT NULL UNIQUE,
    detalleDestinoFondos JSON,
    lugarSolicitud VARCHAR(255),
    fechaSolicitud DATE,
    montoSolicitado DECIMAL(10, 2),
    descripcion_actividad TEXT,
    validacionContador BOOLEAN DEFAULT FALSE,
    validacionCoordinador BOOLEAN DEFAULT FALSE,
    actividad_id INT,
    coordinador_id INT,
    formaPago_id INT,
    contador_id INT,
    tarea_id INT,
    usuario_id INT,
    datos_forma_pago JSON,
    objetivo_actividad TEXT,
    fechaRealizacionActividad DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_actividad (actividad_id),
    INDEX idx_coordinador (coordinador_id),
    INDEX idx_formaPago (formaPago_id),
    INDEX idx_contador (contador_id),
    INDEX idx_tarea (tarea_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_numeroFormulario (numeroFormulario)
);
