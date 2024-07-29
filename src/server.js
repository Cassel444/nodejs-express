import express from "express";
import pino from "pino-http";
import cors from "cors";

import { env } from "./utils/env.js";
import studentsRouter from "./routers/students.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { ENV_VARS } from "./constants/index.js";

const PORT = Number(env(ENV_VARS.PORT, "3001"));

export const startServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(pino({
        transport: {
            target: "pino-pretty",
        },
    }),
    );

    app.use(studentsRouter);

    app.use("*", notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
