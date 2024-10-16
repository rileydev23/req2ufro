import { Schema, model } from "mongoose";

interface ISemester {
  name: string;
  year: number;
  subjects: { name: string; grades: number[] }[];
}

const SemesterSchema = new Schema<ISemester>({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  subjects: [
    {
      name: { type: String, required: true },
      grades: { type: [Number], required: true },
    },
  ],
});

export const Semester = model<ISemester>('Semester', SemesterSchema);
