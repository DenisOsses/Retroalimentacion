import { AlertCircle, CheckCircle, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react';

interface ResultsDisplayProps {
  average: number;
  studentName: string;
  onNewAssessment: () => void;
}

export function ResultsDisplay({ average, studentName, onNewAssessment }: ResultsDisplayProps) {
  const getAlertConfig = (avg: number) => {
    if (avg < 3) {
      return {
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-400',
        textColor: 'text-red-700',
        icon: AlertCircle,
        status: 'Nivel Crítico',
        message: 'Tu nivel de dominio requiere atención inmediata',
      };
    }
    if (avg < 4) {
      return {
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-400',
        textColor: 'text-orange-700',
        icon: AlertTriangle,
        status: 'Nivel Insuficiente',
        message: 'Necesitas reforzar tus conocimientos',
      };
    }
    if (avg < 5) {
      return {
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-400',
        textColor: 'text-yellow-700',
        icon: AlertTriangle,
        status: 'Nivel Regular',
        message: 'Tu desempeño es aceptable, pero tienes espacio para mejorar',
      };
    }
    if (avg < 6) {
      return {
        color: 'lime',
        bgColor: 'bg-lime-50',
        borderColor: 'border-lime-400',
        textColor: 'text-lime-700',
        icon: CheckCircle,
        status: 'Nivel Bueno',
        message: 'Demuestras un buen dominio de los contenidos',
      };
    }
    return {
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      icon: CheckCircle,
      status: 'Nivel Excelente',
      message: 'Has demostrado un excelente dominio de los contenidos',
    };
  };

  const getFeedback = (avg: number): string[] => {
    if (avg < 3) {
      return [
        'Dedica tiempo diario al estudio de estos contenidos (al menos 2 horas).',
        'Busca apoyo de tutores o profesores para aclarar conceptos fundamentales.',
        'Comienza desde los conceptos básicos y avanza gradualmente.',
        'Practica con ejercicios simples antes de abordar problemas complejos.',
        'Forma un grupo de estudio para compartir conocimientos.',
        'Utiliza recursos multimedia (videos, tutoriales interactivos) para reforzar.',
      ];
    }
    if (avg < 4) {
      return [
        'Incrementa tu práctica con ejercicios variados de cada tema.',
        'Revisa los conceptos donde obtuviste las calificaciones más bajas.',
        'Consulta bibliografía adicional para profundizar tu comprensión.',
        'Asiste a sesiones de ayudantía o talleres prácticos.',
        'Resuelve problemas aplicados para consolidar tu aprendizaje.',
      ];
    }
    if (avg < 5) {
      return [
        'Dedica más tiempo a los temas donde obtuviste calificaciones bajas.',
        'Práctica adicional con ejercicios de dificultad progresiva.',
        'Revisa ejemplos prácticos de aplicación de los conceptos.',
        'Participa activamente en clases y haz preguntas sobre dudas.',
        'Forma grupos de estudio con compañeros para reforzar.',
      ];
    }
    if (avg < 6) {
      return [
        'Mantén tu ritmo de estudio constante.',
        'Desafíate con problemas de mayor dificultad.',
        'Identifica los temas con menor calificación y refuérzalos.',
        'Explica los conceptos a otros compañeros para afianzar tu conocimiento.',
        'Continúa practicando para seguir mejorando.',
      ];
    }
    return [
      'Excelente trabajo, tu dominio es muy bueno.',
      'Continúa practicando para mantener tu nivel.',
      'Considera ayudar a otros estudiantes con dificultades.',
      'Explora aplicaciones avanzadas de estos conceptos.',
      'Desafíate con problemas de competencias o proyectos de investigación.',
    ];
  };

  const config = getAlertConfig(average);
  const Icon = config.icon;
  const feedback = getFeedback(average);

  return (
    <div className="space-y-6">
      <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-6`}>
        <div className="flex items-center gap-4 mb-4">
          <Icon className={`w-12 h-12 ${config.textColor}`} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Resultados de {studentName}
            </h2>
            <p className={`text-lg font-semibold ${config.textColor}`}>
              {config.status}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Promedio General</p>
            <p className="text-5xl font-bold text-gray-900">{average.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-2">
              {average >= 4 ? 'Aprobado (≥ 4.0)' : 'No aprobado (< 4.0)'}
            </p>
          </div>
        </div>

        <p className={`text-center font-medium ${config.textColor}`}>
          {config.message}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Recomendaciones Personalizadas
          </h3>
        </div>

        <ul className="space-y-3">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Próximos pasos</h4>
        <p className="text-blue-800 text-sm mb-3">
          Recuerda que esta autoevaluación es una herramienta de diagnóstico. Utiliza estos resultados
          para guiar tu estudio y mejorar continuamente.
        </p>
        <button
          onClick={onNewAssessment}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Realizar Nueva Autoevaluación
        </button>
      </div>
    </div>
  );
}
