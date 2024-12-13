import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Título del evento
  type: {
    type: String,
    enum: ["evaluado", "no_evaluado"],
    required: true,
  },
  date: { type: Date, required: true }, // Fecha del evento
  weight: {
    type: Number,
    required: function () {
      return this.type === "evaluado";
    },
    min: 0,
    max: 100,
  },
  grades: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }, // Usuario asociado
      grade: { type: Number, required: true }, // Nota del usuario
    },
  ],
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
