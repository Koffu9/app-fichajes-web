
-- SISTEMA DE FICHAJES - Base de Datos
-- pruebas.coimne.com
-- ============================================================

CREATE DATABASE IF NOT EXISTS fichajes;
USE fichajes;


-- TABLA: usuarios

CREATE TABLE usuarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)                    NOT NULL,
    apellidos   VARCHAR(150)                    NOT NULL,
    email       VARCHAR(150)                    NOT NULL UNIQUE,
    password    VARCHAR(255)                    NOT NULL,
    rol         ENUM('admin','trabajador')      NOT NULL DEFAULT 'trabajador',
    activo      TINYINT(1)                      NOT NULL DEFAULT 1,
    created_at  DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- TABLA: motivos_pausa

CREATE TABLE motivos_pausa (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)    NOT NULL UNIQUE,
    descripcion VARCHAR(255)    NULL,
    activo      TINYINT(1)      NOT NULL DEFAULT 1
);

INSERT INTO motivos_pausa (nombre) VALUES
    ('Comida'),
    ('Asuntos propios'),
    ('Permiso médico');


-- TABLA: fichajes

CREATE TABLE fichajes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT             NOT NULL,
    tipo            ENUM('entrada','salida','pausa_inicio','pausa_fin') NOT NULL,
    fecha_hora      DATETIME        NOT NULL,
    motivo_id       INT             NULL,
    modificado_por  INT             NULL,
    observaciones   VARCHAR(255)    NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id)     REFERENCES usuarios(id),
    FOREIGN KEY (motivo_id)      REFERENCES motivos_pausa(id),
    FOREIGN KEY (modificado_por) REFERENCES usuarios(id)
);

--Indice para realizar las consultas usuario/fecha más rapido en la tabla fichajes
CREATE INDEX idx_fichajes_usuario_fecha ON fichajes (usuario_id, fecha_hora);


-- TABLA: alertas_jornada

CREATE TABLE alertas_jornada (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id  INT             NOT NULL,
    fecha       DATE            NOT NULL,
    horas       DECIMAL(5,2)    NOT NULL,
    resuelta    TINYINT(1)      NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    UNIQUE KEY uq_alerta_usuario_fecha (usuario_id, fecha)
);

-- TABLA: historial_jornadas

CREATE TABLE historial_jornadas (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id          INT             NOT NULL,
    fecha               DATE            NOT NULL,
    hora_entrada        DATETIME        NOT NULL,
    hora_salida         DATETIME        NOT NULL,
    horas_trabajadas    DECIMAL(5,2)    NOT NULL,
    horas_pausa         DECIMAL(5,2)    NOT NULL DEFAULT 0,
    jornada_completa    TINYINT(1)      NOT NULL DEFAULT 0,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    UNIQUE KEY uq_historial_usuario_fecha (usuario_id, fecha)
);
-- Indice para realizar las consultas usuario/fecha más rápido en historial_jornadas
CREATE INDEX idx_historial_usuario_fecha ON historial_jornadas (usuario_id, fecha);


-- TABLA: motivos_ausencia

CREATE TABLE motivos_ausencia (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)    NOT NULL UNIQUE,
    descripcion VARCHAR(255)    NULL,
    activo      TINYINT(1)      NOT NULL DEFAULT 1
);

INSERT INTO motivos_ausencia (nombre) VALUES
    ('Vacaciones'),
    ('Baja médica'),
    ('Asuntos propios'),
    ('Permiso de maternidad/paternidad'),
    ('Formación');


-- TABLA: ausencias

CREATE TABLE ausencias (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT             NOT NULL,
    motivo_id       INT             NOT NULL,
    fecha_inicio    DATE            NOT NULL,
    fecha_fin       DATE            NOT NULL,
    observaciones   VARCHAR(255)    NULL,
    creado_por      INT             NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id)  REFERENCES usuarios(id),
    FOREIGN KEY (motivo_id)   REFERENCES motivos_ausencia(id),
    FOREIGN KEY (creado_por)  REFERENCES usuarios(id)
);

--Indice para realizar las consultas usuario/fecha más rapido en la tabla ausencias
CREATE INDEX idx_ausencias_usuario_anio ON ausencias (usuario_id, fecha_inicio);


-- Usuario administrador por defecto
-- -----------------------------------------------------------
INSERT INTO usuarios (nombre, apellidos, email, password, rol) VALUES
    ('Admin', 'Sistema', 'admin@coimne.com', '$2b$10$IHBlWgj2GAKVdImGhgG1Ju31Tiq6rrWq7NQtJNRbx4N9CHHCOAYUq', 'admin');