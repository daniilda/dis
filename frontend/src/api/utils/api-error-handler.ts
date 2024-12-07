import { z } from "zod";
import { ErrorDto } from "../models/error.model";
import { HandleableError } from "@/utils/errors/handleable-error";
import {
  AbortError,
  ApiError,
  UnexpectedResponseError,
} from "@/utils/errors/api-error";

export interface ErrorSchema<T extends z.ZodRawShape> {
  model: z.ZodObject<T>;
  get: (data: z.infer<z.ZodObject<T>>) => [title: string, description: string];
}

const createErrorSchema = <T extends z.ZodRawShape>(
  model: ErrorSchema<T>["model"],
  get: ErrorSchema<T>["get"],
): ErrorSchema<T> => ({
  model,
  get,
});

const errorSchemas: Record<number, ErrorSchema<any>> = {
  401: createErrorSchema(ErrorDto.AuthError, (data) => [
    "Authentication Error",
    data.status,
  ]),
  400: createErrorSchema(ErrorDto.InvalidRequest, (data) => [
    "Invalid Request",
    data.status,
  ]),
  422: createErrorSchema(ErrorDto.ValidationError, (data) => [
    "Validation Error",
    data.detail.map((e) => `${e.loc.join(".")}: ${e.msg}`).join(", "),
  ]),
  500: createErrorSchema(ErrorDto.InternalServerError, (data) => [
    "Internal Server Error",
    data.description,
  ]),
};

export const handleError = async (e: unknown): Promise<HandleableError> => {
  if (e instanceof HandleableError) e.handle();

  if (e instanceof Response) {
    const errorData = await e.json();

    if (e.status in errorSchemas) {
      const schema = errorSchemas[e.status];
      const data = schema.model.safeParse(errorData);
      if (data.success) {
        const [title, description] = schema.get(data.data);
        return new ApiError(title, description);
      } else {
        return new UnexpectedResponseError(e.url, schema.model, errorData);
      }
    }

    return new ApiError("Unknown error", e.statusText);
  } else if (e instanceof Error) {
    if (e.name === "AbortError") {
      return new AbortError();
    }
    return new ApiError("Error", e.message);
  }

  return new ApiError("Error", "There was an error processing your request");
};
