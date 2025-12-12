import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// logEvents is a function that writes information to a log file.
export const logEvents = async (message, logFileName) => {

    const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");

    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const logsFolder = path.join(__dirname, "..", "logs");

        // Check if logs folder exists
        if (!fs.existsSync(logsFolder)) {
            await fsPromises.mkdir(logsFolder);
        }

        // Append the log entry into the file
        await fsPromises.appendFile(
            path.join(logsFolder, logFileName),
            logItem
        );

    } catch (err) {
        console.error("Logging error:", err);
    }
};

// Logger is the Express middleware that runs on every incoming request.
export const logger = (request, __, next) => {
    // It extracts request information and calls the logEvents function to log it.
    logEvents(
        `${request.method}\t${request.url}\t${request.headers.origin}`,
        "reqLog.log"
    );
    next();
};
