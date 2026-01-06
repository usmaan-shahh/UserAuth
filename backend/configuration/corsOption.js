import allowOrigins from "./allowedOrigin.js";

const corsOptions = {
  origin: (incommingRequestOrigin, callback) => {
    if (
      allowOrigins.indexOf(incommingRequestOrigin) !== -1 ||
      !incommingRequestOrigin
    ) {
      callback(null, true); //null = no error happened, true = YES, allow this request
    } else {
      callback(new Error("Not Allowed By CORS"));
    }
  },

  credentials: true,

  optionsSuccessStatus: 200,
};

export default corsOptions;
