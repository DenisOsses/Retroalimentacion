UPDATE courses
SET name = 'Cálculo Integral',
    description = 'Curso fundamental de cálculo que cubre conceptos de integrales, técnicas de integración y aplicaciones'
WHERE name = 'Cálculo Diferencial';

DELETE FROM assessment_topics
WHERE course_id = (SELECT id FROM courses WHERE name = 'Cálculo Integral');

INSERT INTO assessment_topics (course_id, topic_name, description)
SELECT
  c.id,
  topic,
  topic_desc
FROM courses c, (
  VALUES
    ('Integración por fracciones parciales', 'Aplicación de la descomposición según cada uno de los casos'),
    ('Integración por métodos trigonométricos', 'Reconocimiento de identidades trigonométricas, sustitución según cada caso'),
    ('Área entre curvas', 'Cálculo del área de una región en coordenadas cartesianas'),
    ('Volumen de un sólido', 'Cálculo del volumen mediante secciones transversales'),
    ('Volumen de un sólido', 'Cálculo del volumen mediante rotaciones horizontales'),
    ('Volumen de un sólido', 'Cálculo del volumen mediante rotaciones verticales'),
    ('Centroide de una región plana', 'Obtención de las coordenadas del centroide'),
    ('Volumen de un sólido', 'Cálculo del volumen mediante el Teorema de Pappus'),
    ('Longitud de una curva', 'Cálculo de la longitud de una curva en coordenadas cartesianas'),
    ('Área de una superficie', 'Cálculo del área superficial de un sólido de revolución'),
    ('Longitud de una curva paramétrica', 'Cálculo de la longitud de una curva en coordenadas paramétricas'),
    ('Área en paramétricas', 'Cálculo del área de una región en coordenadas paramétricas'),
    ('Longitud de una curva polar', 'Cálculo de la longitud de una curva en coordenadas paramétricas'),
    ('Área en polares', 'Cálculo del área de una región en coordenadas polares')
) AS t(topic, topic_desc)
WHERE c.name = 'Cálculo Integral';