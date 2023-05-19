import { useState, useEffect, useContext } from "react";

import SettingsContext from "src/components/Settings/context/SettingsContext";

import PropTypes from "prop-types";

console.dev("Documentation");

// constants, custom Hooks
import { useTranslation } from "react-i18next";
import { useErrors } from "../utils/errors";

// ReactJSON Schema Components, FormData
import Form from "@rjsf/material-ui";
import validator from "@rjsf/validator-ajv8";

import formDataDocu from "../FormData/formDataDocu.json";

//Templates, jsonSchema
import { ObjectFieldTemplate } from "src/components/Plugins/Templates/documentationTemplate.js";
import docuSchema from "src/components/Plugins/SchemaJson/docuSchema.json";

// MUI Components, Component, Icons, Styles, UiSchema
import {
  Typography,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Divider,
} from "@material-ui/core";
import { useStyles } from "../../../styles/MaterialUiComponentsStyles/PluginsStyle.js";
import { useUiSchemaDocu } from "../UiSchema/uiSchemaDocu";
import ButtonClear from "src/components/Plugins/Components/ButtonClear.js";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import ConfirmBox from "./ConfirmBox";

// ************* Start of the component ************** //
const Documentation = ({
  handleClickOpen,
  open,
  handleClose,
  identifier,
  setSnackbar,
  getProcessPlugins,
  postProcessPlugins,
  setDisabled,
  disabled,
  responseStatus,
  process,
  id,
}) => {
  //UseState
  const [formDocu, setFormDocu] = useState(formDataDocu);
  const [expand, setExpand] = useState(false);

  //Context
  const context = useContext(SettingsContext);

  //traduction
  const { t } = useTranslation();

  //Styles
  const classes = useStyles();

  //Hooks
  const { uiSchemaDocu } = useUiSchemaDocu();
  const { errorsPattern } = useErrors();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpand(isExpanded ? panel : false);
  };

  //Confirm Box
  async function confirmDocu({ formData }) {
    console.log(formData);
    await postProcessPlugins("documentation", formDocu);
    setDisabled(true);
    setFormDocu(formDocu);
    setExpand(false);
  }
  if (responseStatus === 200) {
    getProcessPlugins(process, identifier);
    context.onSetTabMenuOpen("plugins");
  }
  useEffect(() => {
    responseStatus === null;
    localStorage.setItem("id", id);
  }, [responseStatus]);

  // ************* Start of the render ************** //
  return (
    <>
      <Typography className={classes.typoDocu}>
        {t("documentation").toUpperCase()}
        <ButtonClear
          onClick={() => (
            setFormDocu(null),
            setDisabled(false),
            setSnackbar("success", "top", "dropdownlist.success_delete", true)
          )}
        />
      </Typography>
      <Accordion
        className={classes.accordion}
        style={{ padding: "0" }}
        expanded={expand === "documentation"}
        onChange={handleChange("documentation")}
      >
        <AccordionSummary
          className={classes.accordion_summary}
          expandIcon={<ExpandMoreIcon fontSize="large" />}
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            {expand === "documentation"
              ? `${t("quit")} ${t("configuration")} ${t("documentation")}`
              : `${t("start")} ${t("configuration")} ${t("documentation")}`}
          </Typography>
        </AccordionSummary>
        <Divider className={classes.dividerStyle} />
        <AccordionDetails className={classes.accordionDetails}>
          <Form
            validator={validator}
            schema={docuSchema}
            formData={formDocu}
            autoComplete="off"
            onSubmit={handleClickOpen}
            templates={{ ObjectFieldTemplate }}
            uiSchema={uiSchemaDocu}
            onChange={(e) => setFormDocu(e.formData)}
            transformErrors={errorsPattern}
          >
            <button
              style={{ marginBottom: "10px" }}
              className="submitButtonDocu"
              id="submitDocu"
            >
              {t("send")}
            </button>
          </Form>
        </AccordionDetails>
      </Accordion>
      <div>
        {open && (
          <ConfirmBox
            open={handleClickOpen}
            onClose={handleClose}
            onConfirm={confirmDocu}
            buttonDisabled={disabled}
          />
        )}
      </div>
    </>
  );
};

Documentation.propTypes = {
  setFormDocu: PropTypes.func,
  formDocu: PropTypes.object,
  errorSnackbar: PropTypes.func,
  handleClickOpen: PropTypes.func,
  handleClose: PropTypes.func,
  handleChange: PropTypes.func,
  open: PropTypes.bool,
  id: PropTypes.string,
  identifier: PropTypes.object,
  getProcessPlugins: PropTypes.func,
  postProcessPlugins: PropTypes.func,
  disabled: PropTypes.bool,
  setDisabled: PropTypes.func,
  responseStatus: PropTypes.number,
  process: PropTypes.string,
  setSnackbar: PropTypes.func,
};
export default Documentation;
