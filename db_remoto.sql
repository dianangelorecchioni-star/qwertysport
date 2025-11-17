-- Ejecutar después de seleccionar la base de datos en HeidiSQL
-- Base de datos: u157683007_qwerysport

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT(3) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4_unicode_ci;

-- Nota: La estructura coincide exactamente con la imagen:
-- - id: INT(3)
-- - nombre: VARCHAR(100)
-- - email: VARCHAR(150)
-- - password: VARCHAR(255)
-- - Charset: utf8mb4_unicode_ci
