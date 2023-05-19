import { useTranslation } from "react-i18next";
import "src/components/Plugins/UiSchema/styleCss/uiSchemaDocu.css";

export const useUiSchemaDocu = () => {
  const { t } = useTranslation();
  const uiSchemaDocu = {
    "ui:rootFieldId": "docu",
    label: {
      "ui:style": {
        marginTop: "1rem",
        textAlign: "center",
        width: "90%",
        display: "block",
        padding: "0 5px",
        margin: "0 auto",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 5px",
        marginBottom: "20px",
      },
      "ui:description": t("plugin.enterLabel"),
    },
    company: {
      "ui:style": {
        textAlign: "center",
        width: "90%",
        display: "block",
        margin: "0 auto",
        borderRadius: "5px",
        cursor: "pointer",
        padding: "0 5px",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 5px",
        marginBottom: "20px",
      },
      "ui:description": t("plugin.companyName"),
    },
    document_language: {
      "ui:description": t("plugin.language"),
      "ui:style": {
        textAlign: "center",
        width: "90%",
        display: "block",
        margin: "0 auto",
        borderRadius: "5px",
        cursor: "pointer",
        padding: "0 5px",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 5px",
        marginBottom: "20px",
      },
    },
    project_name: {
      "ui:description": t("plugin.requestedDoc"),
      "ui:autocomplete": "off",
      "ui:widget": "hidden",
      "ui:style": {
        textAlign: "center",
        width: "90%",
        display: "block",
        margin: "0 auto",
        borderRadius: "5px",
        cursor: "pointer",
        padding: "0 5px",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 5px",
        marginBottom: "20px",
      },
    },
    value: {
      "ui:description": t("plugin.enterValue"),
      "ui:autocomplete": "off",
      "ui:style": {
        textAlign: "center",
        width: "90%",
        display: "block",
        margin: "0 auto",
        borderRadius: "5px",
        cursor: "pointer",
        padding: "0 5px",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 5px",
        marginBottom: "20px",
      },
    },
    attribute: {
      "ui:description": t("sqlRequest.selectAttribute"),
      "ui:autocomplete": "off",
      "ui:style": {
        marginTop: "1rem",
        textAlign: "center",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 5px",
        width: "90%",
        display: "block",
        margin: "0 auto",
        borderRadius: "5px",
        padding: "0 5px",
        cursor: "pointer",
        marginBottom: "20px",
      },
    },
    project_type: {
      "ui:description": t("plugin.project_type"),
      "ui:style": {
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 5px",
        borderRadius: "5px",
        width: "90%",
        display: "block",
        margin: "0 auto",
        padding: "0 5px",
        marginBottom: "20px",
      },
    },
  };
  return { uiSchemaDocu };
};
