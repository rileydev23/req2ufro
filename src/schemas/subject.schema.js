import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Referencia a los eventos
  code: { type: String, required: true }, // Código de la asignatura
  average: { type: Number, default: 0 }, // Promedio calculado de la asignatura
});

// Método para calcular el promedio ponderado de los eventos evaluados
SubjectSchema.methods.calculateAverage = function () {
  const evaluatedEvents = this.events.filter(
    (event) => event.type === "evaluado" && event.grade !== undefined
  );
  const totalWeight = evaluatedEvents.reduce(
    (sum, event) => sum + event.weight,
    0
  );
  if (totalWeight === 0) return 0; // Evita división por cero

  const weightedAverage = evaluatedEvents.reduce((sum, event) => {
    return sum + (event.grade * event.weight) / 100;
  }, 0);

  return weightedAverage;
};

// Hook para calcular el promedio antes de guardar o actualizar
SubjectSchema.pre("save", async function (next) {
  this.average = this.calculateAverage(); // Asignar el promedio calculado al campo `average`
  next();
});

const Subject = mongoose.model("Subject", SubjectSchema);
export default Subject;
