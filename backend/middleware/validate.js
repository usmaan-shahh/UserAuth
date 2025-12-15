import { ZodError } from "zod";

 const validate =
    (schema) =>
        (req, res, next) => {

            try {

                schema.parse({
                    body: req.body
                });
                
                next();

            } catch (err) {

                
                if (err instanceof ZodError) {
                    const errorMessages = err.issues
                        .map(issue => issue.message)
                        .filter(Boolean);
                    
                    return res.status(400).json({
                        errors: errorMessages
                    });
                }

                
                next(err);

            }

        };


        export default validate