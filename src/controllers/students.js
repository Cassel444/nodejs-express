import {
    getAllStudents,
    getStudentById,
    createStudent,
    deleteStudent,
    updateStudent
} from "../services/students.js";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";


import createHttpError from "http-errors";


export const getStudentsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const students = await getAllStudents({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user._id,
    });

    res.status(200).json({
        status: 200,
        message: `Successfully found students for ${req.user.name}!`,
        data: students,
    });
};

export const getStudentsByIdController = async (req, res) => {
    const { studentId } = req.params;
    const userId = req.user._id;

    const student = await getStudentById(studentId, userId);

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
    const student = {
        ...req.body,
        userId: req.user._id,
    };

    const createdStudent = await createStudent(student);

    res.status(201).json({
        status: 201,
        message: "Successfully created a student!",
        data: createdStudent,
    });
};

export const deleteStudentController = async (req, res, next) => {
    const { studentId } = req.params;
    const userId = req.user._id;

    const deletedStudent = await deleteStudent(studentId, userId);

    if (!deletedStudent) {
        throw (createHttpError(404, "Student not found"));
    }
    res.status(204).end();
};

export const upsertStudentController = async (req, res, next) => {
    const { studentId } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const { isNew, student } = await updateStudent(studentId, updateData, userId,
        { upsert: true, }
    );
    if (student === null) {
        throw (createHttpError(404, "Student not found"));
    }
    const status = isNew ? 200 : 201;

    res.status(status).json({
        status,
        message: "Successfully upsert student!",
        data: student,
    });
};

export const patchStudentController = async (req, res, next) => {
    const { studentId } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const student = await updateStudent(studentId, updateData, userId);
    if (student === null) {
        throw (createHttpError(404, "Student not found"));
    }

    res.json({
        status: 200,
        message: "Successfully patched a student!",
        data: student,
    });
};
