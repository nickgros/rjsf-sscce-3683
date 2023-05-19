import PropTypes from "prop-types";

console.dev("ButtonClear");

// MUI Components Styles, Component
import { HighlightOff as HighlightOffIcon } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import { useStyles } from "src/styles/MaterialUiComponentsStyles/PluginsStyle.js";

// Constants
import { useTranslation } from "react-i18next";

const ButtonClear = (props) => {
  const { onClick } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={`${t("erase")} ${t("settings.all")}`}>
        <IconButton className={classes.iconButtonClear} onClick={onClick}>
          <HighlightOffIcon color="error" fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};

ButtonClear.propTypes = {
  onClick: PropTypes.func,
};

export default ButtonClear;
