type JSONSchema =
  | {
      type: 'array';
      items: JSONSchema;
    }
  | {
      type: 'object';
      properties?: { [key: string]: JSONSchema };
      additionalProperties?: boolean;
    }
  | { type: 'number' }
  | {};

interface FastifyRequestSchema {
  body?: JSONSchema;
  query?: JSONSchema;
}

const processJSONSchema = (schema: JSONSchema) => {
  if (!('type' in schema)) return schema;
  switch (schema.type) {
    case 'array':
      processJSONSchema(schema.items);
      break;
    case 'object':
      schema.additionalProperties = false;
      if (schema.properties !== undefined) {
        for (const propertyName in schema.properties) {
          if (schema.properties.hasOwnProperty(propertyName)) {
            processJSONSchema(schema.properties[propertyName]);
          }
        }
      }
      break;
    default:
      // type number etc
      break;
  }
};

const processSchema = (schema: FastifyRequestSchema) => {
  if (schema.body !== undefined) {
    processJSONSchema(schema.body);
  }
  if (schema.query !== undefined) {
    processJSONSchema(schema.query);
  }
};

export default processSchema;
