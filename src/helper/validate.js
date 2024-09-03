import InvariantError from "../exception/InvariantError.js";

export default function validate(schema, data) {
    const {error, value} = schema.validate(data);

    if (error) {
        throw new InvariantError(error.message);
    }
    return value;
}