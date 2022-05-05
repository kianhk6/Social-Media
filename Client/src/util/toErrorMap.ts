import { FieldError } from "../generated/graphql";
//our input has fieledError type since its from graphQL
export const toErrorMap = (errors: FieldError[]) => {
    //for each cell in record set the index of the field to its meesage then return it
    const errorMap: Record<string, string> = {};
    errors.forEach(({field, message}) => {
        errorMap[field] = message;
    })
    return errorMap;
} 