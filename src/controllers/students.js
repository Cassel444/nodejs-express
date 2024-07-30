import { getAllStudents, getStudentById, createStudent, deleteStudent, updateStudent } from "../services/students.js";
import createHttpError from "http-errors";


export const getStudentsController = async (req, res, next) => {

    const students = await getAllStudents();

    res.status(200).json({
        message: 'Successfully found students!',
        data: students,
    });

};

export const getStudentsByIdController = async (req, res, next) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    if (!student) {
        throw createHttpError(404, "Student not found");

    }
    res.status(200).json({
        message: `Successfully found student with id ${studentId}!`,
        data: student,
    });
};

export const createStudentController = async (req, res) => {
    const student = await createStudent(req.body);

    res.status(200).json({
        status: 200,
        message: "Successfully created a student!",
        data: student,
    });
};

export const deleteStudentController = async (req, res, next) => {
    const { studentId } = req.params;
    const student = await deleteStudent(studentId);

    if (!student) {
        next(createHttpError(404, "Student not found"));
        return;
    }
    res.json({
        status: 204,
        message: "Successfully deleted a student!",
    });
    // res.status(204).send("Student deleted");
};

export const upsertStudentController = async (req, res, next) => {
    const { studentId } = req.params;

    const result = await updateStudent(studentId, req.body,
        { upsert: true, }
    );

    if (!result) {
        next(createHttpError(404, "Student not found"));
        return;
    }
    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: "Successfully upsert student!",
        data: result.student,
    });
};

export const patchStudentController = async (req, res, next) => {
    const { studentId } = req.params;

    const result = await updateStudent(studentId, req.body);

    if (!result) {
        next(createHttpError(404, "Student not found!"));
        return;
    }
    res.json({
        status: 200,
        message: "Successfully patched a student!",
        data: result.student,
    });
};
