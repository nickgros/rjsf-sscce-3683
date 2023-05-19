export const useSplicePlanSchema = (referenceBpe, referenceCable) => {
  const enumDataBpe = Object.keys(referenceBpe);
  const enumDataCable = Object.keys(referenceCable);

  const splicePlanSchema = {
    title: "",
    type: "object",
    properties: {
      label: {
        title: "",
        description: "",
        type: "string",
      },
      attribute: {
        title: "",
        description: "",
        type: "string",
        default: "tag",
        enum: ["tag", "emprise"],
      },
      user: {
        title: "",
        type: "string",
        description: "",
        default: "odyssee",
        hidden: true,
        readOnly: true,
      },
      value: {
        title: "",
        description: "",
        type: "string",
        default: "",
      },
      cables: {
        type: "object",
        properties: {
          constraints: {
            title: "",
            type: "object",
            properties: {
              tr: {
                required: ["authorized_ref"],
                type: "object",
                properties: {
                  reserve_percentage: {
                    type: "integer",
                    minimum: 0,
                    maximum: 50,
                    multipleOf: 5,
                    default: 0,
                  },
                  max_length: {
                    type: "integer",
                    minimum: 0,
                    maximum: 5000,
                    multipleOf: 100,
                    default: 0,
                  },
                  length_tolerance_percentage: {
                    type: "integer",
                    minimum: 0,
                    maximum: 100,
                    multipleOf: 5,
                    default: 10,
                  },
                  authorized_ref: {
                    type: "array",
                    title: "",
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      type: "string",
                      enum: enumDataCable,
                    },
                  },
                },
              },
              di: {
                type: "object",
                required: ["authorized_ref"],
                properties: {
                  reserve_percentage: {
                    type: "integer",
                    minimum: 0,
                    maximum: 50,
                    multipleOf: 5,
                    default: 50,
                  },
                  max_length: {
                    type: "integer",
                    minimum: 0,
                    maximum: 5000,
                    multipleOf: 100,
                    default: 1000,
                  },
                  length_tolerance_percentage: {
                    type: "integer",
                    minimum: 0,
                    maximum: 100,
                    multipleOf: 5,
                    default: 10,
                  },
                  authorized_ref: {
                    type: "array",
                    title: "",
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      type: "string",
                      enum: enumDataCable,
                    },
                  },
                },
              },
              ad: {
                type: "object",
                required: ["authorized_ref"],
                properties: {
                  reserve_percentage: {
                    title: "",
                    type: "integer",
                    default: 0,
                  },
                  max_length: {
                    title: "",
                    type: "integer",
                    default: 0,
                  },
                  length_tolerance_percentage: {
                    title: "",
                    type: "integer",
                    default: 0,
                  },
                  authorized_ref: {
                    title: "",
                    minItems: 1,
                    type: "array",
                    uniqueItems: true,
                    items: {
                      type: "string",
                      enum: enumDataCable,
                    },
                  },
                },
              },
              ab: {
                type: "object",
                properties: {
                  reserve_percentage: {
                    title: "",
                    type: "integer",
                    default: 0,
                  },
                  max_length: {
                    title: "",
                    type: "integer",
                    default: 0,
                  },
                  length_tolerance_percentage: {
                    title: "",
                    type: "integer",
                    default: 0,
                  },
                  authorized_ref: {
                    title: "",
                    type: "array",
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      type: "string",
                      enum: enumDataCable,
                    },
                  },
                },
              },
            },
          },
        },
      },
      nodes: {
        type: "object",
        properties: {
          constraints: {
            title: "",
            type: "object",
            properties: {
              tr: {
                type: "object",
                required: ["authorized_ref"],
                properties: {
                  authorized_ref: {
                    title: "",
                    type: "array",
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      type: "string",
                      enum: enumDataBpe,
                    },
                  },
                },
              },
              di: {
                type: "object",
                required: ["authorized_ref"],
                properties: {
                  authorized_ref: {
                    title: "",
                    type: "array",
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      type: "string",
                      enum: enumDataBpe,
                    },
                  },
                },
              },
              ad: {
                type: "object",
                required: ["authorized_ref"],
                properties: {
                  authorized_ref: {
                    title: "",
                    type: "array",
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      type: "string",
                      enum: enumDataBpe,
                    },
                  },
                },
              },
              ab: {
                type: "object",
                required: ["authorized_ref"],
                properties: {
                  authorized_ref: {
                    title: "",
                    type: "array",
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      enum: enumDataBpe,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    required: ["value", "attribute"],
  };
  return { splicePlanSchema };
};
