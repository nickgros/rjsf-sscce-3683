import { useTranslation } from "react-i18next";

export const useCableurSchema = () => {
  const { t } = useTranslation();

  const cableurSchema = {
    title: "",
    type: "object",
    properties: {
      user: {
        title: "",
        type: "string",
        default: "Odyssee",
      },
      label: {
        title: "",
        type: "string",
        default: "",
      },
      attribute: {
        title: "",
        description: "",
        type: "string",
        default: "tag",
        enum: ["tag", "emprise"],
      },
      value: {
        title: "",
        description: "",
        type: "string",
        default: "",
        pattern: "^[a-zA-Z0-9-_]+$",
      },
      general: {
        title: "General",
        description: "general",
        type: "object",
        properties: {
          working_buffer_distance: {
            description: "",
            title: "",
            type: "integer",
            minimum: 100,
            maximum: 10000,
            multipleOf: 100,
            default: 2000,
          },
          multi_start: {
            title: t("plugin.multiStart"),
            type: "boolean",
            default: false,
          },
        },
      },
      cables_nodes: {
        title: "cables / nodes",
        type: "object",
        properties: {
          node_start_attribute: {
            title: "",
            type: "string",
            pattern: "^[a-zA-Z0-9-_]+$",
          },
          node_start_value: {
            title: "",
            type: "string",
            pattern: "^[a-zA-Z0-9-_]+$",
          },
        },
        required: ["node_start_attribute", "node_start_value"],

        anyOf: [
          {
            title: t("plugin.selectChoice"),
            description: "selectionner",
            connect_authorized: {
              title: "",
              type: "object",
            },
          },
          {
            title: t("plugin.transport"),
            description: "transport",
            properties: {
              tr: {
                title: "",
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions/transport_connect",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: t("plugin.distribution"),
            description: "distribution",
            properties: {
              di: {
                title: "",
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions/distribution_connect",
                    default: ["di"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: t("adduction").toLowerCase(),
            description: "adduction",
            properties: {
              ad: {
                title: "",
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions/adduction_connect",
                    default: ["ad"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: t("plugin.subscriber"),
            description: "subscriber",
            properties: {
              ab: {
                title: "",
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions/subscriber_connect",
                    default: ["ab"],
                  },
                  max_cable_outgoing: {
                    title: t("plugin.max_cable_outgoing"),
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.transport")} / ${t("plugin.distribution")} `,
            description: "transport_distribution",
            properties: {
              tr: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              di: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b",
                    default: t("plugin.distribution"),
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.transport")} / ${t(
              "adduction"
            ).toLowerCase()} `,
            description: "transport_adduction",
            properties: {
              tr: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_c",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ad: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_c",
                    default: ["ad"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.transport")} / ${t("plugin.subscriber")} `,
            description: "transport_subscriber",
            type: "object",
            properties: {
              tr: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_d",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ab: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_d",
                    default: ["ab"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.distribution")} / ${t(
              "adduction"
            ).toLowerCase()} `,
            description: "distribution_adduction",
            type: "object",
            properties: {
              di: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_b_c",
                    default: ["di"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ad: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_b_c",
                    default: ["ad"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.distribution")} / ${t("plugin.subscriber")} `,
            description: "distribution_subscriber",
            type: "object",
            properties: {
              di: {
                properties: {
                  connect_authorized: {
                    title: "",
                    $ref: "#/definitions_connect/connect_b_d",
                    default: ["di"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ab: {
                properties: {
                  connect_authorized: {
                    title: "",
                    $ref: "#/definitions_connect/connect_b_d",
                    default: ["ab"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("adduction").toLowerCase()} / ${t(
              "plugin.subscriber"
            )} `,
            description: "adduction_subscriber",
            properties: {
              ad: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_c_d",
                    default: t("adduction").toLowerCase(),
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ab: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_c_d",
                    default: ["ab"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.transport")} / ${t(
              "plugin.distribution"
            )} / ${t("adduction").toLowerCase()}`,
            description: "transport_distribution_adduction",
            properties: {
              tr: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_c",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              di: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_c",
                    default: ["di"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ad: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_c",
                    default: ["ad"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.transport")} / ${t(
              "plugin.distribution"
            )} / ${t("plugin.subscriber")}`,
            description: "transport_distribution_subscriber",
            properties: {
              tr: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_d",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              di: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_d",
                    default: ["di"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ab: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_d",
                    default: ["ab"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.transport")} / ${t(
              "adduction"
            ).toLowerCase()} / ${t("plugin.subscriber")}`,
            description: "transport_adduction_subscriber",
            properties: {
              tr: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_c_d",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ad: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_c_d",
                    default: ["ad"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ab: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_c_d",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.distribution")} / ${t(
              "adduction"
            ).toLowerCase()} / ${t("plugin.subscriber")}`,
            description: "distribution_adduction_subscriber",
            properties: {
              di: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_b_c_d",
                    default: ["di"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ad: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_b_c_d",
                    default: ["ad"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ab: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_b_c_d",
                    default: ["ab"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
          {
            title: `${t("plugin.transport")} / ${t(
              "plugin.distribution"
            )} / ${t("adduction").toLowerCase()} / ${t("plugin.subscriber")}`,
            description: "transport_distribution_adduction_subscriber",
            type: "object",
            properties: {
              tr: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_c_d",
                    default: ["tr"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              di: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_c_d",
                    default: ["di"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ad: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_c_d",
                    default: ["ad"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
              ab: {
                properties: {
                  connect_authorized: {
                    $ref: "#/definitions_connect/connect_a_b_c_d",
                    default: ["ab"],
                  },
                  max_cable_outgoing: {
                    $ref: "#/def_max_cable_outgoing",
                  },
                  length: {
                    $ref: "#/def_length",
                  },
                },
              },
            },
          },
        ],
      },
      infrastructure: {
        title: "",
        type: "object",
        properties: {
          snapping_permission: {
            title: "",
            type: "integer",
            default: 1,
          },
          snapping_distance: {
            title: "",
            type: "integer",
            minimum: 5,
            maximum: 100,
            multipleOf: 5,
            default: 50,
          },
          distance_between_intersection_points: {
            title: "",
            type: "integer",
            minimum: 10,
            maximum: 200,
            multipleOf: 10,
            default: 100,
          },
          nb_split_to_be_considered_intersection: {
            title: "",
            type: "integer",
            minimum: 2,
            maximum: 10,
            default: 3,
          },
        },
      },
    },
    definitions: {
      transport_connect: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          title: "transport",
          enum: ["tr"],
          enumNames: [t("plugin.transport")],
        },
      },
      distribution_connect: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["di"],
          enumNames: [t("plugin.distribution")],
        },
      },
      adduction_connect: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["ad"],
          enumNames: [t("adduction").toLowerCase()],
        },
      },
      subscriber_connect: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["ab"],
          enumNames: [t("plugin.subscriber")],
        },
      },
    },
    def_max_cable_outgoing: {
      title: t("plugin.max_cable_outgoing"),
      type: "integer",
      minimum: 1,
      maximum: 10,
      default: 5,
    },
    def_length: {
      title: t("length"),
      type: "integer",
      minimum: 50,
      maximum: 2500,
      multipleOf: 50,
      default: 200,
    },
    definitions_connect: {
      connect_a_b: {
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["tr", "di"],
          enumNames: [t("plugin.transport"), t("plugin.distribution")],
        },
      },
      connect_a_c: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["tr", "ad"],
          enumNames: [t("plugin.transport"), t("adduction").toLowerCase()],
        },
      },
      connect_a_d: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["tr", "ab"],
          enumNames: [t("plugin.transport"), t("plugin.subscriber")],
        },
      },
      connect_b_c: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["di", "ad"],
          enumNames: [t("plugin.distribution"), t("adduction").toLowerCase()],
        },
      },
      connect_b_d: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["di", "ab"],
          enumNames: [t("plugin.distribution"), t("plugin.subscriber")],
        },
      },
      connect_c_d: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["ad", "ab"],
          enumNames: [t("adduction").toLowerCase(), t("plugin.subscriber")],
        },
      },
      connect_a_b_c: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["tr", "di", "ad"],
          enumNames: [
            t("plugin.transport"),
            t("plugin.distribution"),
            t("adduction").toLowerCase(),
          ],
        },
      },
      connect_a_b_d: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["tr", "di", "ab"],
          enumNames: [
            t("plugin.transport"),
            t("plugin.distribution"),
            t("plugin.subscriber"),
          ],
        },
      },
      connect_a_c_d: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["tr", "ad", "ab"],
          enumNames: [
            t("plugin.transport"),
            t("adduction").toLowerCase(),
            t("plugin.subscriber"),
          ],
        },
      },
      connect_b_c_d: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["di", "ad", "ab"],
          enumNames: [
            t("plugin.distribution"),
            t("adduction").toLowerCase(),
            t("plugin.subscriber"),
          ],
        },
      },
      connect_a_b_c_d: {
        title: t("connect_authorized"),
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["tr", "di", "ad", "ab"],
          enumNames: [
            t("plugin.transport"),
            t("plugin.distribution"),
            t("adduction").toLowerCase(),
            t("plugin.subscriber"),
          ],
        },
      },
    },
    required: ["attribute", "label", "value"],
  };

  return { cableurSchema };
};
