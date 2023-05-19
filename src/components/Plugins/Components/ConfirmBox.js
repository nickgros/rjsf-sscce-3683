import React from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import { useStyles } from "../../../styles/MaterialUiComponentsStyles/PluginsStyle.js";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmBox({ onConfirm, onClose, buttonDisabled }) {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        id="dialogContainer"
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            padding: "30px",
            fontSize: "50px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText className={classes.dialogContentText}>
            {t("plugin.confirmAdd")}
          </DialogContentText>
        </DialogContent>
        {buttonDisabled ? (
          <Button
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              cursor: "none",
            }}
          >
            <CircularProgress style={{ marginRight: "20px" }} />
            <Typography>Loading…</Typography>
          </Button>
        ) : (
          <DialogActions className={classes.dialogActions}>
            <Button
              className={classes.buttonYes}
              onClick={onConfirm}
              disabled={buttonDisabled}
            >
              {t("yes")}
            </Button>
            <Button
              className={classes.buttonNo}
              onClick={onClose}
              disabled={buttonDisabled}
            >
              {t("no")}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
ConfirmBox.propTypes = {
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  buttonDisabled: PropTypes.bool,
  Transition: PropTypes.func,
};
