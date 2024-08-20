import express from "express";
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
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();
const jsonParser = express.json();

router.use(authenticate);

router.get("/", ctrlWrapper(getStudentsController));

router.get("/:studentId", isValidId("studentId"), ctrlWrapper(getStudentsByIdController));

router.post("/", jsonParser, validateBody(createStudentSchema), ctrlWrapper(createStudentController));

router.delete("/:studentId", isValidId("studentId"), ctrlWrapper(deleteStudentController));

router.put("/:studentId", isValidId("studentId"), jsonParser, validateBody(createStudentSchema), ctrlWrapper(upsertStudentController));

router.patch("/:studentId", isValidId("studentId"), jsonParser, validateBody(updateStudentSchema), ctrlWrapper(patchStudentController));


export default router;
