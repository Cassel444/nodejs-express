import { getAllStudents, getStudentById } from "../services/students.js";
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
