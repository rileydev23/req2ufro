import mongoose from 'mongoose';
import EventSchema from './event.schema.js';

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  grades: [Number], // cuantas notas tiene la asignatura
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Ref a los eventos (pruebas y tareas)
});

// metodo para promediar las notas de la asignatura
SubjectSchema.methods.calculateAverage = function () {
  const evaluatedEvents = this.events.filter(event => event.type === 'evaluado' && event.grade !== undefined);
  const totalWeight = evaluatedEvents.reduce((sum, event) => sum + event.weight, 0);
  if (totalWeight === 0) return 0; // Evita división por cero

  const weightedAverage = evaluatedEvents.reduce((sum, event) => {
    return sum + (event.grade * event.weight / 100);
  }, 0);

  this.average = weightedAverage;
  return this.average;
};

const Subject = mongoose.model('Subject', SubjectSchema);
export default Subject;
