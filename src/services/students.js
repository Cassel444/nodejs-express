import createHttpError from "http-errors";
import { StudentsCollection } from "../db/models/student.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";



export const getAllStudents = async ({ page,
    perPage,
    sortOrder,
    sortBy,
    filter,
}) => {
    const limit = perPage;
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const studentsQuery = StudentsCollection.find();

    if (typeof filter.gender !== "undefined") {
        studentsQuery.where("gender").equals(filter.gender);
    }
    if (typeof filter.maxAge !== "undefined") {
        studentsQuery.where("age").lte(filter.maxAge);
    }
    if (typeof filter.minAge !== "undefined") {
        studentsQuery.where("age").gte(filter.minAge);
    }
    if (typeof filter.maxAvgMark !== "undefined") {
        studentsQuery.where("avgMark").lte(filter.maxAvgMark);
    }
    if (typeof
        filter.minAvgMark !== "undefined") {
        studentsQuery.where("avgMark").gte(filter.minAvgMark);
    }


    const [studentsCount, students] = await Promise.all([
        StudentsCollection.countDocuments(studentsQuery),

        studentsQuery
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .exec(),
    ]);

    const paginationData = calculatePaginationData(studentsCount, perPage, page);

    return {
        data: students,
        ...paginationData,
    };
};

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
