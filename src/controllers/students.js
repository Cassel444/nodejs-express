import {
    getAllStudents,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
} from "../services/students.js";
import createHttpError from "http-errors";


export const getStudentsController = async (req, res) => {

    const students = await getAllStudents();

    res.status(200).json({
        status: 200,
        message: 'Successfully found students!',
        data: students,
    });
};

export const getStudentsByIdController = async (req, res) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    if (!student) {
        throw (createHttpError(404, "Student not found"));
    }
    res.status(200).json({
        status: 200,
        message: `Successfully found student with id ${studentId}!`,
        data: student,
    });
};

export const createStudentController = async (req, res) => {
    const student = await createStudent(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a student!",
        data: student,
    });
};

export const deleteStudentController = async (req, res, next) => {
    const { studentId } = req.params;
    const deletedStudent = await deleteStudent(studentId);

    if (!deletedStudent) {
        throw (createHttpError(404, "Student not found"));
    }
    res.status(204).end();
};

export const upsertStudentController = async (req, res, next) => {
    const { studentId } = req.params;

    const { isNew, student } = await updateStudent(studentId, req.body,
        { upsert: true, }
    );

    const status = isNew ? 200 : 201;

    res.status(status).json({
        status,
        message: "Successfully upsert student!",
        data: student,
    });
};

export const patchStudentController = async (req, res, next) => {
    const { studentId } = req.params;

    const { student } = await updateStudent(studentId, req.body);

    res.json({
        status: 200,
        message: "Successfully patched a student!",
        data: student,
    });
};
