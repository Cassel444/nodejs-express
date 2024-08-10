import { Router } from "express";
import {
    getStudentsController,
    getStudentsByIdController,
    createStudentController,
    deleteStudentController,
    upsertStudentController,
    patchStudentController,
} from "../controllers/students.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import {
    createStudentSchema,
    updateStudentSchema
} from "../validation/student.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/students", ctrlWrapper(getStudentsController));

router.get("/students/:studentId", isValidId("studentId"), ctrlWrapper(getStudentsByIdController));

router.post("/students", validateBody(createStudentSchema), ctrlWrapper(createStudentController));

router.delete("/students/:studentId", isValidId("studentId"), ctrlWrapper(deleteStudentController));

router.put("/students/:studentId", isValidId("studentId"), validateBody(createStudentSchema), ctrlWrapper(upsertStudentController));

router.patch("/students/:studentId", isValidId("studentId"), validateBody(updateStudentSchema), ctrlWrapper(patchStudentController));


export default router;
