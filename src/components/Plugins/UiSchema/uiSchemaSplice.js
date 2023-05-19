import { useTranslation } from "react-i18next";
import "src/components/Plugins/UiSchema/styleCss/uiSchemaSplice.css";

export const useSchemaSplice = () => {
  const { t } = useTranslation();
  const uiSchemaSplice = {
    "ui:rootFieldId": "splice",
    "ui:submitButtonOptions": {
      submitText: t("send"),
      norender: true,
    },
    label: {
      "ui:description": t("plugin.enterLabel"),
      "ui:style": {
        textAlign: "center",
        width: "95%",
        display: "block",
        margin: "0 auto",
        padding: "0px 5px",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
        marginBottom: "10px",
      },
    },
    attribute: {
      "ui:description": t("sqlRequest.selectAttribute"),
      "ui:style": {
        textAlign: "center",
        width: "95%",
        display: "block",
        margin: "0 auto",
        padding: "0px 5px",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
        marginBottom: "10px",
      },
    },
    value: {
      "ui:description": t("plugin.enterValue"),
      "ui:style": {
        textAlign: "center",
        width: "95%",
        display: "block",
        margin: "0 auto",
        padding: "0px 5px",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
        marginBottom: "10px",
        marginTop: "10px",
      },
      "ui:emptyValue": "",
      "ui:autocomplete": "off",
    },
    user: {
      "ui:description": t("user"),
      "ui:widget": "hidden",
      "ui:style": {
        textAlign: "center",
        width: "95%",
        display: "block",
        margin: "0 auto",
        padding: "0px 5px",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
        marginTop: "5px",
      },
    },
    cables: {
      "ui:title": t("cable_one").toUpperCase(),
      constraints: {
        "ui:style": {
          margin: 0,
          textAlign: "center",
          padding: "0 7px",
          border: "none",
        },
        tr: {
          "ui:title": t("plugin.transport"),
          "ui:style": {
            textAlign: "center",
            width: "100%",
            display: "block",
            margin: "0 auto",
            paddingTop: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            borderBottom: "15px",
            boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
          },
          reserve_percentage: {
            "ui:description": t("plugin.reserve_percentage"),
            "ui:widget": "range",
            "ui:emptyValue": "",
            "ui:style": {
              width: "88%",
              margin: "0 auto",
            },
          },
          max_length: {
            "ui:description": t("plugin.max_length"),
            "ui:widget": "range",
            "ui:style": {
              width: "88%",
              margin: "0 auto",
            },
          },
          length_tolerance_percentage: {
            "ui:description": t("plugin.length_tolerance_percentage"),
            "ui:widget": "range",
            "ui:style": {
              width: "88%",
              margin: "0 auto",
            },
          },
          authorized_ref: {
            "ui:widget": "checkboxes",
            required: true,
            "ui:style": {
              display: "block",
              height: "100%",
              letterSpacing: "1px",
            },
          },
        },
        di: {
          "ui:title": t("plugin.distribution"),
          "ui:style": {
            textAlign: "center",
            width: "100%",
            display: "block",
            margin: "0 auto",
            paddingTop: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            borderBottom: "15px",
            boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
          },
          reserve_percentage: {
            "ui:description": t("plugin.reserve_percentage"),
            "ui:widget": "range",
            "ui:style": {
              width: "88%",
              margin: "0 auto",
            },
          },
          max_length: {
            "ui:description": t("plugin.max_length"),
            "ui:widget": "range",
            "ui:style": {
              width: "88%",
              margin: "0 auto",
            },
          },
          length_tolerance_percentage: {
            "ui:description": t("plugin.length_tolerance_percentage"),
            "ui:widget": "range",
            "ui:style": {
              width: "88%",
              margin: "0 auto",
            },
          },
          authorized_ref: {
            "ui:widget": "checkboxes",
            "ui:style": {
              height: "100%",
              letterSpacing: "1px",
            },
          },
        },
        ad: {
          "ui:title": t("adduction").toLowerCase(),
          "ui:style": {
            textAlign: "center",
            width: "100%",
            display: "block",
            margin: "0 auto",
            marginTop: "15px",
            paddingTop: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            borderBottom: "15px",
            boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
          },
          reserve_percentage: {
            "ui:widget": "hidden",
          },
          max_length: {
            "ui:widget": "hidden",
          },
          length_tolerance_percentage: {
            "ui:widget": "hidden",
          },
          authorized_ref: {
            "ui:widget": "checkboxes",
            "ui:style": {
              height: "100%",
              letterSpacing: "1px",
            },
          },
        },
        ab: {
          "ui:title": t("plugin.subscriber"),
          "ui:style": {
            textAlign: "center",
            width: "100%",
            display: "block",
            margin: "0 auto",
            marginTop: "15px",
            paddingTop: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            borderBottom: "15px",
            boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
          },
          reserve_percentage: {
            "ui:widget": "hidden",
          },
          max_length: {
            "ui:widget": "hidden",
          },
          length_tolerance_percentage: {
            "ui:widget": "hidden",
          },
          authorized_ref: {
            "ui:widget": "checkboxes",
            "ui:style": {
              height: "100%",
              letterSpacing: "1px",
            },
          },
        },
      },
    },
    nodes: {
      "ui:title": t("spliceBox").toUpperCase(),
      constraints: {
        "ui:style": {
          textAlign: "center",
          borderRadius: "10px",
        },
        tr: {
          "ui:title": t("plugin.transport"),
          "ui:style": {
            textAlign: "center",
            width: "95%",
            display: "block",
            margin: "0 auto",
            marginTop: "15px",
            paddingTop: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            borderBottom: "15px",
            boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
          },
          authorized_ref: {
            "ui:widget": "checkboxes",
            "ui:style": {
              height: "100%",
              letterSpacing: "1px",
            },
          },
        },
        di: {
          "ui:title": t("plugin.distribution"),
          "ui:style": {
            textAlign: "center",
            width: "95%",
            display: "block",
            margin: "0 auto",
            paddingTop: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            borderBottom: "15px",
            boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
          },
          authorized_ref: {
            "ui:widget": "checkboxes",
            "ui:style": {
              height: "100%",
              letterSpacing: "1px",
            },
          },
        },
        ad: {
          "ui:title": t("adduction").toLowerCase(),
          "ui:style": {
            textAlign: "center",
            width: "95%",
            display: "block",
            margin: "0 auto",
            marginTop: "15px",
            paddingTop: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            borderBottom: "15px",
            boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
          },
          authorized_ref: {
            "ui:widget": "checkboxes",
            "ui:style": {
              height: "100%",
              letterSpacing: "1px",
            },
          },
        },
        ab: {
          "ui:title": t("plugin.subscriber"),
          "ui:style": {
            textAlign: "center",
            width: "95%",
            display: "block",
            margin: "0 auto",
            marginTop: "15px",
            paddingTop: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            borderBottom: "15px",
            boxShadow: "0px 1px 6px 2px rgba(0,0,0,0.1)",
          },
          authorized_ref: {
            "ui:widget": "checkboxes",
            "ui:style": {
              height: "100%",
              letterSpacing: "1px",
            },
          },
        },
      },
    },
  };
  return { uiSchemaSplice };
};
