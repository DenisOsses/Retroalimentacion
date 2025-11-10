import { useState, useEffect } from 'react';
import { supabase, AssessmentTopic } from './lib/supabase';
import { AssessmentForm } from './components/AssessmentForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { QRCodeShare } from './components/QRCodeShare';
import { GraduationCap, QrCode } from 'lucide-react';

function App() {
  const [topics, setTopics] = useState<AssessmentTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ average: number; studentName: string } | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    try {
      const { data, error } = await supabase
        .from('assessment_topics')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error loading topics:', error);
      alert('Error al cargar los temas. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    ratings: { topicId: string; rating: number }[],
    studentName: string
  ) {
    try {
      setLoading(true);

      const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

      const { data: assessmentData, error: assessmentError } = await supabase
        .from('student_assessments')
        .insert({
          student_name: studentName,
          course_id: topics[0].course_id,
          average_score: average,
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      const ratingsToInsert = ratings.map((r) => ({
        assessment_id: assessmentData.id,
        topic_id: r.topicId,
        rating: r.rating,
      }));

      const { error: ratingsError } = await supabase
        .from('assessment_ratings')
        .insert(ratingsToInsert);

      if (ratingsError) throw ratingsError;

      setResults({ average, studentName });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Error al enviar la autoevaluación. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleNewAssessment() {
    setSubmitted(false);
    setResults(null);
  }

  if (loading && topics.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando autoevaluación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowQRModal(true)}
            className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <QrCode className="w-5 h-5" />
            Compartir
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Autoevaluación de Cálculo Integral
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Evalúa tu nivel de dominio en los conceptos fundamentales de la integral.
            Recibe retroalimentación personalizada basada en tus resultados.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {!submitted ? (
            <AssessmentForm topics={topics} onSubmit={handleSubmit} />
          ) : (
            results && (
              <ResultsDisplay
                average={results.average}
                studentName={results.studentName}
                onNewAssessment={handleNewAssessment}
              />
            )
          )}
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            Esta herramienta está diseñada para ayudarte a identificar áreas de mejora en tu aprendizaje.
          </p>
        </footer>
      </div>

      <QRCodeShare isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
    </div>
  );
}

export default App;
