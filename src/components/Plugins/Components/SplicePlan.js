import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

console.dev("SplicePlan");

// MUI Components Styles, Component
import {
  Typography,
  Box,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Divider,
} from "@material-ui/core";
import { useStyles } from "../../../styles/MaterialUiComponentsStyles/PluginsStyle.js";
import ButtonClear from "src/components/Plugins/Components/ButtonClear.js";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import SettingsContext from "src/components/Settings/context/SettingsContext";

// ReactJSON Schema Components,validator
import { useSplicePlanSchema } from "src/components/Plugins/SchemaJson/splicePlanSchema.js";
import validator from "@rjsf/validator-ajv8";
import formDataSplicePlan from "../FormData/formDataSplicePlan.json";
import Form from "@rjsf/material-ui";
import ConfirmBox from "./ConfirmBox";

// Templates
import {
  ObjectFieldTemplate,
  CustomRangeFix,
} from "src/components/Plugins/Templates/splicePlanTemplate.js";

// Constants
import { useErrors } from "src/components/Plugins/utils/errors.js";
import { useTranslation } from "react-i18next";
import { useSchemaSplice } from "../UiSchema/uiSchemaSplice";

// ************* Start of the component ************** //
function SplicePlan({
  referenceBpe,
  referenceCable,
  setSnackbar,
  handleClickOpen,
  postProcessPlugins,
  getProcessPlugins,
  identifier,
  handleClose,
  open,
  setDisabled,
  disabled,
  responseStatus,
  process,
  id,
}) {
  //UseState
  const [expand, setExpand] = useState(false);
  const [formSplicing, setFormSplicing] = useState(formDataSplicePlan);

  //Context
  const context = useContext(SettingsContext);

  //hooks, custom Hooks
  const classes = useStyles();
  const { t } = useTranslation();
  const { splicePlanSchema } = useSplicePlanSchema(
    referenceBpe,
    referenceCable
  );
  const { uiSchemaSplice } = useSchemaSplice();
  const { errorsSplicePlan } = useErrors();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpand(isExpanded ? panel : false);
  };

  //Widget for Slider
  const widgets = {
    range: CustomRangeFix,
  };

  //Confirm Box
  function confirmSplicePlan({ formData }) {
    console.log(formData);
    postProcessPlugins("splicing-plan", formSplicing);
    setDisabled(true);
    setFormSplicing(formSplicing);
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
        {t("spliceBox").toUpperCase()}
        <ButtonClear
          onClick={() => (
            setFormSplicing(null),
            setDisabled(false),
            setSnackbar("success", "top", "dropdownlist.success_delete", true)
          )}
        />
      </Typography>
      <Box className={classes.boxSplicing}>
        <Accordion
          className={classes.accordion}
          style={{ padding: "0" }}
          expanded={expand === "spliceBox"}
          onChange={handleChange("spliceBox")}
        >
          <AccordionSummary
            className={classes.accordion_summary}
            expandIcon={<ExpandMoreIcon fontSize="large" />}
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              {expand === "spliceBox"
                ? `${t("quit")} ${t("configuration")} ${t("spliceBox")}`
                : `${t("start")} ${t("configuration")} ${t("spliceBox")}`}
            </Typography>
          </AccordionSummary>
          <Divider className={classes.dividerStyle} />
          <AccordionDetails className={classes.accordionDetails}>
            <Form
              schema={splicePlanSchema}
              autoComplete="off"
              uiSchema={uiSchemaSplice}
              formData={formSplicing}
              templates={{ ObjectFieldTemplate }}
              onChange={(e) => setFormSplicing(e.formData)}
              validator={validator}
              onSubmit={handleClickOpen}
              transformErrors={errorsSplicePlan}
              showErrorList={"bottom"}
              widgets={widgets}
            >
              {formSplicing === "" ? null : (
                <button className="submitButton" id="submitSplicePlan">
                  {t("send")}
                </button>
              )}
            </Form>
          </AccordionDetails>
        </Accordion>
      </Box>
      <div>
        {open && (
          <ConfirmBox
            open={handleClickOpen}
            onClose={handleClose}
            onConfirm={confirmSplicePlan}
            buttonDisabled={disabled}
          />
        )}
      </div>
    </>
  );
}
SplicePlan.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  errorSnackbar: PropTypes.func.isRequired,
  referenceBpe: PropTypes.object,
  referenceCable: PropTypes.object,
  handleClickOpen: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  identifier: PropTypes.object,
  getProcessPlugins: PropTypes.func,
  postProcessPlugins: PropTypes.func,
  disabled: PropTypes.bool,
  setDisabled: PropTypes.func,
  responseStatus: PropTypes.number,
  process: PropTypes.string,
  handleChange: PropTypes.func,
  setSnackbar: PropTypes.func,
  id: PropTypes.string,
};
export default SplicePlan;
