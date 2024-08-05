import createHttpError from "http-errors";
import { StudentsCollection } from "../db/models/student.js";

export const getAllStudents = () => StudentsCollection.find();

export const getStudentById = (studentId) => StudentsCollection.findById(studentId);

export const createStudent = (payload) => {
    return StudentsCollection.create(payload);
};

export const deleteStudent = async (studentId) => {
    return StudentsCollection.findOneAndDelete({
        _id: studentId,
    });
};

export const updateStudent = async (studentId, payload, options = {}) => {
    const rawResult = await StudentsCollection.findOneAndUpdate(
        { _id: studentId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    if (!rawResult || !rawResult.value) {
        throw (createHttpError(404, "Student not found"));
    }
    return {
        student: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.updatedExisting)
    };
};
