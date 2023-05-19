import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";

console.dev("Formulaires");

// MUI Components, Icons, Styles
import { Box } from "@material-ui/core";
import { useStyles } from "../../styles/MaterialUiComponentsStyles/PluginsStyle.js";

//Components
import Documentation from "./Components/Documentation";
import SplicePlan from "./Components/SplicePlan";
import Cableur from "./Components/Cableur";
import MobileSteppers from "../GenericComponents/Forms/MobileSteppers";

// ************* Start of the component ************** //
const Plugins = ({
  open,
  referenceCable,
  referenceBpe,
  setOpen,
  setSnackbar,
  getMaterialReference,
  postProcessPlugins,
  process,
  getProcessPlugins,
  responseStatus,
  identifier,
  setDisabled,
  disabled,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    getMaterialReference("bpe", referenceBpe);
    getMaterialReference("cable", referenceCable);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //UseState
  const [activeStep, setActiveStep] = useState(0);
  const [expand, setExpand] = useState(false);

  function errorSnackbar(errors) {
    console.log(expand);
    errors.message = setSnackbar(
      "error",
      "top",
      `${t("form.emptyField")}`,
      true
    );
    setExpand(true);
  }

  const classes = useStyles();

  // ************* Start of the render ************** //
  return (
    <>
      <Box className={classes.boxDocu} id="formJson">
        <div className={classes.mobStepper}>
          <MobileSteppers
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            steps={3}
          />
        </div>
        {activeStep === 0 && (
          <>
            <SplicePlan
              setSnackbar={setSnackbar}
              errorSnackbar={errorSnackbar}
              id="splicePlan"
              handleClickOpen={handleClickOpen}
              handleClose={handleClose}
              open={open}
              referenceCable={referenceCable}
              referenceBpe={referenceBpe}
              identifier={identifier}
              getProcessPlugins={getProcessPlugins}
              postProcessPlugins={postProcessPlugins}
              setDisabled={setDisabled}
              disabled={disabled}
              responseStatus={responseStatus}
              process={process}
            />
          </>
        )}
        {activeStep === 1 && (
          <>
            <Documentation
              setSnackbar={setSnackbar}
              id="documentation"
              handleClickOpen={handleClickOpen}
              handleClose={handleClose}
              open={open}
              identifier={identifier}
              getProcessPlugins={getProcessPlugins}
              postProcessPlugins={postProcessPlugins}
              setDisabled={setDisabled}
              disabled={disabled}
              responseStatus={responseStatus}
              process={process}
            />
          </>
        )}
        {activeStep === 2 && (
          <>
            <Cableur
              setSnackbar={setSnackbar}
              setExpand={setExpand}
              id="cableur"
              open={open}
              postProcessPlugins={postProcessPlugins}
              handleClickOpen={handleClickOpen}
              handleClose={handleClose}
              getProcessPlugins={getProcessPlugins}
              identifier={identifier}
              setDisabled={setDisabled}
              disabled={disabled}
              responseStatus={responseStatus}
              process={process}
            />
          </>
        )}
      </Box>
    </>
  );
};

Plugins.propTypes = {
  setSnackbar: PropTypes.func.isRequired,
  expand: PropTypes.bool,
  open: PropTypes.bool,
  setExpand: PropTypes.func,
  setOpen: PropTypes.func,
  getMaterialReference: PropTypes.func,
  getMaterialReferenceCable: PropTypes.func,
  referenceBpe: PropTypes.object,
  referenceCable: PropTypes.object,
  identifier: PropTypes.object,
  getProcessPlugins: PropTypes.func,
  postProcessPlugins: PropTypes.func,
  disabled: PropTypes.bool,
  setDisabled: PropTypes.func,
  responseStatus: PropTypes.number,
  process: PropTypes.string,
  handleChange: PropTypes.func,
};
export default Plugins;
