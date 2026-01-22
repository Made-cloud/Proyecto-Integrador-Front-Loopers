-- ========================================
-- BASE DE DATOS EXPORTIFY - POSTGRESQL
------------------------

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL
);

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    id_categoria INT NOT NULL,
    CONSTRAINT fk_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
);

CREATE TABLE lecciones (
    id_leccion SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    id_curso INT NOT NULL,
    CONSTRAINT fk_curso
        FOREIGN KEY (id_curso)
        REFERENCES cursos(id_curso)
);

CREATE TABLE inscripciones (
    id_inscripcion SERIAL PRIMARY KEY,
    fecha_inscripcion DATE NOT NULL,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    CONSTRAINT fk_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_curso_inscripcion
        FOREIGN KEY (id_curso)
        REFERENCES cursos(id_curso),
    CONSTRAINT uk_usuario_curso
        UNIQUE (id_usuario, id_curso)
);
