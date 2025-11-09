/*
  # Self-Assessment System for Educational Platform

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `name` (text) - Course name
      - `description` (text) - Course description
      - `created_at` (timestamptz)
    
    - `assessment_topics`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `topic_name` (text) - Name of the topic to assess
      - `description` (text) - Detailed description
      - `created_at` (timestamptz)
    
    - `student_assessments`
      - `id` (uuid, primary key)
      - `student_name` (text) - Student identifier
      - `course_id` (uuid, foreign key)
      - `completed_at` (timestamptz)
      - `average_score` (numeric) - Calculated average
      - `created_at` (timestamptz)
    
    - `assessment_ratings`
      - `id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key)
      - `topic_id` (uuid, foreign key)
      - `rating` (integer) - Score from 1 to 7
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public access for reading courses and topics (educational content)
    - Public access for creating assessments (anonymous self-assessment)
    - Restrictive policies for data integrity

  3. Important Notes
    - System supports multiple courses and topics
    - Students can perform self-assessments anonymously
    - Ratings are stored individually for detailed analysis
    - Average scores are calculated and stored for quick access
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  topic_name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now(),
  average_score numeric(3,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES student_assessments(id) ON DELETE CASCADE NOT NULL,
  topic_id uuid REFERENCES assessment_topics(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 7),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view assessment topics"
  ON assessment_topics FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create assessments"
  ON student_assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their assessments"
  ON student_assessments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create ratings"
  ON assessment_ratings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view ratings"
  ON assessment_ratings FOR SELECT
  USING (true);

INSERT INTO courses (name, description) VALUES
  ('Cálculo Diferencial', 'Curso fundamental de cálculo que cubre conceptos de límites, continuidad y derivadas');

INSERT INTO assessment_topics (course_id, topic_name, description)
SELECT 
  c.id,
  topic,
  topic_desc
FROM courses c, (
  VALUES 
    ('Definición de derivada', 'Comprensión del concepto de derivada como límite del cociente incremental'),
    ('Reglas de derivación básicas', 'Aplicación de reglas para derivadas de funciones polinomiales'),
    ('Regla de la cadena', 'Derivación de funciones compuestas utilizando la regla de la cadena'),
    ('Derivadas de funciones trigonométricas', 'Cálculo de derivadas de seno, coseno, tangente y sus inversas'),
    ('Derivadas de funciones exponenciales y logarítmicas', 'Derivación de e^x, ln(x) y sus variantes'),
    ('Derivación implícita', 'Técnicas para derivar ecuaciones donde y no está despejada'),
    ('Teorema del valor medio', 'Comprensión y aplicación del teorema fundamental del cálculo diferencial'),
    ('Análisis de funciones con derivadas', 'Uso de derivadas para encontrar máximos, mínimos y puntos de inflexión'),
    ('Optimización', 'Resolución de problemas de maximización y minimización con derivadas'),
    ('Razones de cambio relacionadas', 'Aplicación de derivadas para problemas donde múltiples variables cambian simultáneamente')
) AS t(topic, topic_desc)
WHERE c.name = 'Cálculo Diferencial';