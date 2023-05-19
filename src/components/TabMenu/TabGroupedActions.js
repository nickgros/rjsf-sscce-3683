console.dev("TabGroupedActions");

import PropTypes from "prop-types";

import { IconButton, Tooltip } from "@material-ui/core";

import {
  Clear,
  Visibility,
  MenuOpen,
  SettingsBackupRestore,
  List,
  Event,
  Sync,
} from "@material-ui/icons";

import { useTheme } from "@material-ui/core/styles";
import { deepPurple } from "@material-ui/core/colors";
import { useTranslation } from "react-i18next";

const TabGroupedActions = ({
  tabMenuActions,
  setAlreadyRequested,
  alreadyRequested,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const dynamicIcons = {
    visibility: {
      icon: (
        <Visibility
          fontSize="small"
          style={{
            fontSize: theme.typography.fontSizeLarge,
            color: theme.palette.custom.green.main,
          }}
        />
      ),
      text: t("displayOrHide"),
    },
    clear: {
      icon: (
        <Clear
          fontSize="small"
          color="error"
          style={{
            fontSize: theme.typography.fontSizeLarge,
            color: theme.palette.custom.red,
          }}
        />
      ),
      text: t("delete"),
    },
    expand: {
      icon: (
        <MenuOpen
          fontSize="small"
          color="disabled"
          style={{
            fontSize: theme.typography.fontSizeLarge,
            color: theme.palette.text.disabled,
            transform: "rotate(180deg)",
          }}
        />
      ),
      text: t("openOrClose"),
    },
    restore: {
      icon: (
        <SettingsBackupRestore
          fontSize="small"
          color="primary"
          style={{
            fontSize: theme.typography.fontSizeLarge,
            color: deepPurple[500],
          }}
        />
      ),
      text: t("restore"),
    },
    import: {
      icon: (
        <List
          fontSize="small"
          color="primary"
          style={{
            fontSize: theme.typography.fontSizeLarge,
            color: theme.palette.custom.green.main,
          }}
        />
      ),
      text: t("importedLayers.import"),
    },
    calendar: {
      icon: (
        <Event
          fontSize="small"
          color="primary"
          style={{
            fontSize: theme.typography.fontSizeLarge,
            color: theme.palette.custom.green.main,
          }}
        />
      ),
      text: t("taskManager.selectDate"),
    },
    sync: {
      icon: (
        <Sync
          fontSize="small"
          color="primary"
          style={{
            fontSize: theme.typography.fontSizeLarge,
            color: alreadyRequested
              ? theme.palette.custom.green.disabled
              : theme.palette.custom.green.main,
          }}
        />
      ),
      text: alreadyRequested
        ? t("taskManager.waiting")
        : t("taskManager.synchronize"),
    },
  };

  return (
    <div>
      {tabMenuActions.length ? (
        tabMenuActions
          .filter((t) => t.condition)
          .map((tabActionObj) => (
            <Tooltip
              title={
                dynamicIcons[tabActionObj.key].text +
                " " +
                t(tabActionObj.i18nKey)
              }
              key={tabActionObj.key}
            >
              <span>
                <IconButton
                  size="small"
                  onClick={() => {
                    tabActionObj.action();
                    if (tabActionObj.key === "sync") {
                      setAlreadyRequested(true);
                      setTimeout(() => {
                        setAlreadyRequested(false);
                      }, 10000);
                    }
                  }}
                  disabled={alreadyRequested ? true : false}
                  style={{ margin: "0 6px" }}
                >
                  {dynamicIcons[tabActionObj.key].icon}
                </IconButton>
              </span>
            </Tooltip>
          ))
      ) : (
        <></>
      )}
    </div>
  );
};

TabGroupedActions.propTypes = {
  tabMenuActions: PropTypes.array.isRequired,
  setAlreadyRequested: PropTypes.func.isRequired,
  alreadyRequested: PropTypes.array.isRequired,
};

export default TabGroupedActions;
