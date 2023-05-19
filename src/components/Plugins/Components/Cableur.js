import { useState, useContext, useEffect } from "react";

import PropTypes from "prop-types";

console.dev("Cableur");

// constants
import SettingsContext from "src/components/Settings/context/SettingsContext";
import { useTranslation } from "react-i18next";
import { useErrors } from "../utils/errors";

// ReactJSON Schema Components
import Form from "@rjsf/material-ui";
import validator from "@rjsf/validator-ajv8";

//UiSchema
import { useUiSchemaCableur } from "../UiSchema/uiSchemaCableur";

//Schema
import { useCableurSchema } from "../SchemaJson/cableurSchema";

//FormData
import formDataCableur from "src/components/Plugins/FormData/formDataCableur.json";

//Templates
import { ObjectFieldTemplate } from "src/components/Plugins/Templates/cableurTemplate.js";

// MUI Components, Components, Icons, Styles
import {
  Box,
  Typography,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Divider,
} from "@material-ui/core";
import { useStyles } from "../../../styles/MaterialUiComponentsStyles/PluginsStyle.js";
import ButtonClear from "src/components/Plugins/Components/ButtonClear.js";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import ConfirmBox from "./ConfirmBox";

// ************* Start of the component ************** //
const Cableur = ({
  handleClickOpen,
  handleClose,
  open,
  postProcessPlugins,
  getProcessPlugins,
  identifier,
  setDisabled,
  process,
  disabled,
  responseStatus,
  setSnackbar,
  id,
}) => {
  //UseState
  const [formCableur, setFormCableur] = useState(formDataCableur);
  const [expand, setExpand] = useState(false);

  //Context
  const context = useContext(SettingsContext);

  //Traduction
  const { t } = useTranslation();

  //Styles
  const classes = useStyles();

  //Custom Hook
  const { uiSchemaCableur } = useUiSchemaCableur();
  const { errorsPattern } = useErrors();
  const { cableurSchema } = useCableurSchema();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpand(isExpanded ? panel : false);
  };

  //Confirm Box
  async function confirmCableur({ formData }) {
    console.log(formData);
    postProcessPlugins("cabling", formCableur);
    setDisabled(true);
    setFormCableur(formCableur);
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
    <div>
      <Typography className={classes.typoCableur}>
        {t("cableman").toUpperCase()}
        <ButtonClear
          onClick={() => (
            setFormCableur(null),
            setSnackbar("success", "top", "dropdownlist.success_delete", true)
          )}
        />
      </Typography>
      <Box className={classes.boxCableur}>
        <Accordion
          className={classes.accordion}
          style={{ padding: "0" }}
          expanded={expand === "cableman"}
          onChange={handleChange("cableman")}
        >
          <AccordionSummary
            className={classes.accordion_summary}
            expandIcon={<ExpandMoreIcon fontSize="large" />}
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              {expand === "cableman"
                ? `${t("quit")} ${t("configuration")} ${t("cableman")}`
                : `${t("start")} ${t("configuration")} ${t("cableman")}`}
            </Typography>
          </AccordionSummary>
          <Divider className={classes.dividerStyle} />
          <AccordionDetails className={classes.accordionDetails}>
            <Form
              schema={cableurSchema}
              uiSchema={uiSchemaCableur}
              formData={formCableur}
              autoComplete="off"
              templates={{ ObjectFieldTemplate }}
              onChange={(e) => setFormCableur(e.formData)}
              validator={validator}
              onSubmit={handleClickOpen}
              transformErrors={errorsPattern}
              showErrorList={"bottom"}
            >
              <button id="submitCableur" className="submitButtonCableur">
                {t("send")}
              </button>
            </Form>
          </AccordionDetails>
        </Accordion>
      </Box>
      {open && (
        <ConfirmBox
          open={handleClickOpen}
          onClose={handleClose}
          onConfirm={confirmCableur}
          buttonDisabled={disabled}
        />
      )}
    </div>
  );
};

Cableur.propTypes = {
  formCableur: PropTypes.object,
  setFormCableur: PropTypes.func,
  handleClickOpen: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  disabled: PropTypes.bool,
  setDisabled: PropTypes.func,
  identifier: PropTypes.object,
  getProcessPlugins: PropTypes.func,
  responseStatus: PropTypes.number,
  process: PropTypes.string,
  id: PropTypes.string,
  handleChange: PropTypes.func,
  postProcessPlugins: PropTypes.func,
  setSnackbar: PropTypes.func,
};

export default Cableur;
