import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Título del evento
  type: { 
    type: String, 
    enum: ['evaluado', 'no_evaluado'], 
    required: true 
  }, // Tipo de evento
  date: { type: Date, required: true }, // Fecha del evento
  grade: { 
    type: Number, 
    required: function () { return this.type === 'evaluado'; } 
  }, // Nota solo para eventos evaluados
  weight: { 
    type: Number, 
    required: function () { return this.type === 'evaluado'; },
    min: 0, 
    max: 100 
  }, // Ponderación del evento evaluado
});

const Event = mongoose.model('Event', EventSchema);
export default Event;
