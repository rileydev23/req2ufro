import mongoose from 'mongoose';

const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  subjects: [
    {
      name: { type: String, required: true },
      grades: [Number],
    },
  ],
});

const Semester = mongoose.model('Semester', SemesterSchema);

export default Semester;
