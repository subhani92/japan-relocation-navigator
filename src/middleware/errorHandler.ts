import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Express Error Handler caught:", err);

  // If validation failed via Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Handle other types of errors
  const status = err.status || err.statusCode || 500;
  const message = err.message || "An unexpected error occurred on the server.";

  res.status(status).json({
    error: message,
    status,
  });
}
