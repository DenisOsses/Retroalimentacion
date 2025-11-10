import { useState } from 'react';
import { AssessmentTopic } from '../lib/supabase';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface AssessmentFormProps {
  topics: AssessmentTopic[];
  onSubmit: (ratings: { topicId: string; rating: number }[], studentName: string) => void;
}

export function AssessmentForm({ topics, onSubmit }: AssessmentFormProps) {
  const [studentName, setStudentName] = useState('');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [showPreview, setShowPreview] = useState(false);

  const handleRatingChange = (topicId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [topicId]: rating }));
  };

  const calculateAverage = () => {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const getAlertColor = (average: number) => {
    if (average < 3) return 'red';
    if (average < 4) return 'orange';
    return 'green';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      alert('Por favor, ingresa tu correo UAI');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(uai\.cl|alumnos\.uai\.cl|edu\.uai\.cl)$/;
    if (!emailRegex.test(studentName)) {
      alert('Por favor, ingresa un correo UAI válido (ejemplo: usuario@uai.cl, usuario@alumnos.uai.cl o usuario@edu.uai.cl)');
      return;
    }

    if (Object.keys(ratings).length !== topics.length) {
      alert('Por favor, califica todos los temas');
      return;
    }

    const ratingsArray = topics.map((topic) => ({
      topicId: topic.id,
      rating: ratings[topic.id],
    }));

    onSubmit(ratingsArray, studentName);
  };

  const allRated = Object.keys(ratings).length === topics.length;
  const average = calculateAverage();
  const alertColor = getAlertColor(average);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
          Tu correo UAI
        </label>
        <input
          type="email"
          id="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ejemplo@uai.cl"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Califica tu nivel de dominio en cada tema (1 = Muy bajo, 7 = Excelente)
        </h3>

        {topics.map((topic) => (
          <div key={topic.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="mb-2">
              <h4 className="font-medium text-gray-900">{topic.topic_name}</h4>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </div>

            <div className="flex gap-2 mt-3">
              {[1, 2, 3, 4, 5, 6, 7].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(topic.id, rating)}
                  className={`flex-1 py-2 px-3 rounded-md font-medium transition-all ${
                    ratings[topic.id] === rating
                      ? 'bg-blue-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allRated && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {showPreview ? 'Ocultar' : 'Ver'} vista previa de resultados
          </button>

          {showPreview && (
            <div className={`mt-4 p-6 rounded-lg border-2 ${
              alertColor === 'red'
                ? 'bg-red-50 border-red-400'
                : alertColor === 'orange'
                ? 'bg-orange-50 border-orange-400'
                : 'bg-green-50 border-green-400'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {alertColor === 'red' && <AlertCircle className="w-8 h-8 text-red-600" />}
                {alertColor === 'orange' && <AlertTriangle className="w-8 h-8 text-orange-600" />}
                {alertColor === 'green' && <CheckCircle className="w-8 h-8 text-green-600" />}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Promedio: {average.toFixed(2)}
                  </h3>
                  <p className={`text-sm font-medium ${
                    alertColor === 'red'
                      ? 'text-red-700'
                      : alertColor === 'orange'
                      ? 'text-orange-700'
                      : 'text-green-700'
                  }`}>
                    {average >= 4 ? 'Aprobado' : 'No aprobado'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!allRated || !studentName.trim()}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Enviar Autoevaluación
      </button>
    </form>
  );
}
