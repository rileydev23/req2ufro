import mongoose from 'mongoose';
import Subject from './subject.schema.js';

const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  startDate: { type: Date, required: true }, // inicio del semestre
  endDate: { type: Date, required: true }, // termino del semestre
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // usuarios que estan en el semestre
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // dueño del semestre
  average: { type: Number, default: 0 }, // promedio de las asignaturas del semestre
  weeksDuration: { type: Number }, // duración en semanas del semestre
});

// Hook para calcular la duración en semanas antes de guardar
SemesterSchema.pre('save', function (next) {
  const oneWeek = 1000 * 60 * 60 * 24 * 7; // Milisegundos en una semana
  const durationInMillis = this.endDate - this.startDate;
  this.weeksDuration = Math.ceil(durationInMillis / oneWeek);
  next();
});

// Hook para calcular el promedio general antes de guardar
SemesterSchema.pre('save', async function (next) {
  if (this.subjects.length === 0) {
    this.average = 0;
    return next();
  }

  // Cargar las asignaturas referenciadas para calcular su promedio
  const subjects = await Subject.find({ _id: { $in: this.subjects } });

  const totalAverage = subjects.reduce((sum, subject) => {
    return sum + subject.calculateAverage(); // Usar el método de cada asignatura
  }, 0);

  this.average = totalAverage / subjects.length; // Calcular el promedio general
  next();
});

// Método para calcular el promedio general de todas las asignaturas (se puede usar manualmente)
SemesterSchema.methods.calculateGeneralAverage = async function () {
  if (this.subjects.length === 0) return 0;

  const subjects = await Subject.find({ _id: { $in: this.subjects } });

  const totalAverage = subjects.reduce((sum, subject) => {
    return sum + subject.calculateAverage();
  }, 0);

  this.average = totalAverage / subjects.length;
  return this.average;
};

const Semester = mongoose.model('Semester', SemesterSchema);

export default Semester;
