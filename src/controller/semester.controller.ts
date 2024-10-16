import { Request, Response, NextFunction } from 'express';
import { Semester } from '../schemas/semester.schema';

// Crear un semestre
export const createSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const semester = new Semester(req.body);
    await semester.save();
    res.status(201).send(semester);
  } catch (error) {
    next(error);
  }
};

// Obtener un semestre
export const getSemester = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) {
      return res.status(404).send();
    }
    res.send(semester);
  } catch (error) {
    next(error);
  }
};

// Editar un semestre
export const editSemester = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const semester = await Semester.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!semester) {
      return res.status(404).send();
    }
    res.send(semester);
  } catch (error) {
    next(error);
  }
};

// Eliminar un semestre
export const deleteSemester = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const semester = await Semester.findByIdAndDelete(req.params.id);
    if (!semester) {
      return res.status(404).send();
    }
    res.send(semester);
  } catch (error) {
    next(error);
  }
};
