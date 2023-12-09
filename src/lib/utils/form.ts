import lodashGet from 'lodash.get';
import lodashSet from 'lodash.set';
import { z } from 'zod';

export type ObjectRefineType = {
  _function: Function;
  _details: { message: string; path: string[] };
};

export type UseZodPayloadType = {
  state_object?: any;
  schema_object: any;
  object_refine?: ObjectRefineType[];
};

type FieldErrorType = {
  field_errors: string[];
};

function initialize_errors(schema_object: any) {
  type SchemaType = typeof schema_object;
  type ErrorType = SchemaType & FieldErrorType;
  const obj = Object.keys(schema_object).reduce(
    (acc, key) => ({ ...acc, [key]: [] }),
    {} as ErrorType
  );
  obj.field_errors = [];
  return obj;
}
export function validate<T>(payload: UseZodPayloadType): {
  valid: boolean;
  errors: { [key in keyof T]: string[] };
} {
  const { schema_object, object_refine, state_object } = payload;
  let schema = z.object(schema_object);
  type SchemaType = typeof schema_object;
  type ErrorType = SchemaType & FieldErrorType;
  const errors: ErrorType = initialize_errors(schema_object);

  if (object_refine?.length) {
    for (const refine of object_refine) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      schema = schema.refine(refine._function, refine._details);
    }
  }
  const res = schema.safeParse(state_object);
  if (!res.success) {
    for (const issue of res.error.issues) {
      const path: string = issue.path.join('.') || 'field_errors';
      const value = lodashGet(errors, path) ?? [];
      if (!value.length) {
        lodashSet(errors, path, [issue.message]);
      }
    }
  }
  return { valid: res.success, errors };
}
