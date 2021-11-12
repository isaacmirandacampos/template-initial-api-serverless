import processSchema from './processSchema';

describe('processSchema', () => {
  it('should add additionalProperties to top-level object schema', () => {
    const schema = {
      body: { type: 'object' },
    };
    processSchema(schema);
    expect(schema).toEqual({
      body: {
        type: 'object',
        additionalProperties: false,
      },
    });
  });

  it('should add additionalProperties to object schema inside array', () => {
    const schema = {
      body: {
        type: 'array',
        items: { type: 'object' },
      },
    };
    processSchema(schema);
    expect(schema).toEqual({
      body: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
        },
      },
    });
  });

  it('should not add additionalProperties to number schema inside array', () => {
    const schema = {
      body: {
        type: 'array',
        items: { type: 'number' },
      },
    };
    processSchema(schema);
    expect(schema).toEqual({
      body: {
        type: 'array',
        items: { type: 'number' },
      },
    });
  });

  it('should add additionalProperties to nested object schema', () => {
    const schema = {
      body: {
        type: 'object',
        properties: {
          nested: {
            type: 'object',
          },
        },
      },
    };
    processSchema(schema);
    expect(schema).toEqual({
      body: {
        type: 'object',
        additionalProperties: false,
        properties: {
          nested: {
            type: 'object',
            additionalProperties: false,
          },
        },
      },
    });
  });

  it('should add additionalProperties to nested object schema inside array', () => {
    const schema = {
      body: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            nested: {
              type: 'object',
            },
          },
        },
      },
    };
    processSchema(schema);
    expect(schema).toEqual({
      body: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            nested: {
              type: 'object',
              additionalProperties: false,
            },
          },
        },
      },
    });
  });

  it('should also support query', () => {
    const schema = {
      query: { type: 'object' },
    };
    processSchema(schema);
    expect(schema).toEqual({
      query: {
        type: 'object',
        additionalProperties: false,
      },
    });
  });
});
