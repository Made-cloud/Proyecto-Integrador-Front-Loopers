-- USUARIOS
INSERT INTO usuarios (nombre, email, password, fecha_registro) VALUES
('Juan Pérez', 'juan@exportify.cl', '1234', '2026-01-10'),
('María López', 'maria@exportify.cl', '1234', '2026-01-12'),
('Carlos Soto', 'carlos@exportify.cl', '1234', '2026-01-13'),
('Ana Díaz', 'ana@exportify.cl', '1234', '2026-01-08'),
('Pedro Rojas', 'pedro@exportify.cl', '1234', '2026-01-03');

-- CATEGORIAS
INSERT INTO categorias (nombre) VALUES
('Marketing Digital'),
('Finanzas para Emprendedores'),
('Comercio Internacional'),
('Ventas'),
('Innovación y Startups');

-- CURSOS
INSERT INTO cursos (titulo, descripcion, precio, id_categoria) VALUES
('Marketing para Emprendedores', 'Estrategias digitales para hacer crecer tu negocio.', 29990, 1),
('Finanzas Básicas para Startups', 'Aprende a manejar ingresos, costos y utilidades.', 24990, 2),
('Exportación Paso a Paso', 'Cómo llevar tu negocio al mercado internacional.', 34990, 3),
('Técnicas de Ventas Efectivas', 'Mejora tus cierres y fideliza clientes.', 19990, 4),
('Innovación para Emprender', 'Crea modelos de negocio innovadores.', 27990, 5);

-- LECCIONES
INSERT INTO lecciones (titulo, contenido, id_curso) VALUES
('Introducción al Marketing', 'Conceptos básicos de marketing digital.', 1),
('Costos y Presupuestos', 'Cómo calcular costos y márgenes.', 2),
('Requisitos para Exportar', 'Documentación y procesos clave.', 3),
('Proceso de Venta', 'Desde el contacto al cierre.', 4),
('Design Thinking', 'Metodología para innovar.', 5);

-- INSCRIPCIONES
INSERT INTO inscripciones (fecha_inscripcion, id_usuario, id_curso) VALUES
('2026-02-01', 1, 1),
('2026-02-02', 2, 2),
('2026-02-03', 3, 3),
('2026-02-04', 4, 4),
('2026-02-05', 5, 5);