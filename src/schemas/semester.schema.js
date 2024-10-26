import mongoose from 'mongoose';
import SubjectSchema from './subject.schema.js';

const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  startDate: { type: Date, required: true }, // inicio del semestre
  endDate: { type: Date, required: true }, // termino del semestre
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // usuarios que estan en el semestre
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // dueño del semestre
  average: { type: Number, default: 0 }, // promedio de las asignaturas del semestre
});

// Método para calcular el promedio general de todas las asignaturas del semestre
SemesterSchema.methods.calculateGeneralAverage = function () {
  if (this.subjects.length === 0) return 0;

  const totalAverage = this.subjects.reduce((sum, subject) => {
    return sum + subject.calculateAverage(); // Calcula el promedio de cada asignatura
  }, 0);

  this.average = totalAverage / this.subjects.length;
  return this.average;
};

// Método para calcular el número de semanas del semestre
SemesterSchema.methods.getWeeksDuration = function () {
  const oneWeek = 1000 * 60 * 60 * 24 * 7; // Milisegundos en una semana
  const durationInMillis = this.endDate - this.startDate;
  return Math.ceil(durationInMillis / oneWeek);
};

const Semester = mongoose.model('Semester', SemesterSchema);

export default Semester;