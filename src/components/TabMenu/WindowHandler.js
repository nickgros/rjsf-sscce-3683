import { useContext } from "react";

console.dev("WindowHandler");

import PropTypes from "prop-types";

// OL Formatter
import GeoJSON from "ol/format/GeoJSON";

// MUI Components
import {
  Link,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Grow,
} from "@material-ui/core";
// MUI Icons
import { Clear, FilterCenterFocus, Info } from "@material-ui/icons";
// MUI styles
import { useTheme, alpha } from "@material-ui/core/styles";

// Internal & LocalStorage handler
import SettingsContext from "src/components/Settings/context/SettingsContext";

// Generic f()
import { oneOfLayers, compareByAttribute } from "src/utils/GenericFunctions";
import objectTypes from "src/utils/constants/objectTypes";
import { useTranslation } from "react-i18next";

// Window handler is a <ListItem /> of TabMenu
// Display the list of all opened windows,
// Based on context.windowOpen prop

const WindowHandler = ({ getFeature }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const context = useContext(SettingsContext);

  /**
   * Zoom to the feature coords
   * when user clicks on <FilterCenterFocus /> icon
   * @param {string} type feature type
   * @param {string} uuid feature uuid
   */
  const fitFeatureExtent = (type, uuid) => {
    // GET API call, returns a JSON feature
    getFeature(type, "uuid", uuid).then((currentFeature) => {
      // refresh feature
      const featGeoJSON = new GeoJSON().writeFeature(currentFeature);
      // send message to main map (Ilion)
      window.postMessage(["fitFeatureExtent", featGeoJSON]);
    });
  };

  return context.windowOpen instanceof Array &&
    context.windowOpen.length > 0 ? (
    // If array isn't empty and exists
    <>
      <Grow in={context.windowOpen.length > 5} mountOnEnter unmountOnExit>
        <div style={{ display: "flex", marginBottom: theme.spacing(1) }}>
          <Info
            color="disabled"
            style={{
              marginRight: theme.spacing(0.5),
              fontSize: "1rem",
            }}
          />
          <Typography component="p" color="textSecondary" variant="caption">
            {t("windows.countWarning")}
          </Typography>
        </div>
      </Grow>

      <List style={{ padding: 0 }}>
        {/* {context.windowOpen */}
        {context.windowOpen
          .sort((a, b) => compareByAttribute(a, b, "winName"))
          .map((winProps) => {
            // winProps = { winName: opened window TYPE + CODE, winUuid: current opened window's uuid }
            // example : { winName: "PT_TECH | PCH_PLA69_008_171005", winUuid: "e6bfc996..." }

            // Here we extract the 'type' of current window name
            const type = winProps.winName
              .match(/[^|]*/i)[0] // By catching every character before '|' symbol
              .replace(/\s/g, "") // removing whitespaces
              .toLowerCase(); // and transforming the case to lower

            // Here we extract the 'code' of current window name
            // By catching every character after '|' symbol
            const code = winProps.winName.substr(
              winProps.winName.indexOf("|") + 1
            );

            return (
              <ListItem
                style={{ padding: 0 }}
                disableGutters
                key={winProps.uuid}
              >
                {/* .................LINK................. */}
                <Link
                  color={
                    localStorage.darkMode === "true" ? "textPrimary" : "primary"
                  }
                  variant="overline"
                  style={{
                    cursor: "pointer",
                    maxHeight: 24,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 250,
                    color: !oneOfLayers(type)
                      ? theme.palette.custom.blue.main
                      : "",
                  }}
                  onClick={() => window.open("", winProps.uuid)} // brings concerned window to front
                >
                  {t(objectTypes[type], { count: 1 })} | {code}
                </Link>

                {/* ............ACTION BUTTONS............ */}
                <ListItemSecondaryAction style={{ right: theme.spacing(1) }}>
                  {/* Center current window's feature on map */}
                  {oneOfLayers(type) && (
                    <Tooltip
                      placement="top"
                      title={t("geometryActions.center")}
                    >
                      <IconButton
                        size="small"
                        style={{
                          color: theme.palette.custom.blue.main,
                        }}
                        onClick={() => fitFeatureExtent(type, winProps.uuid)}
                      >
                        <FilterCenterFocus
                          style={{
                            cursor: "pointer",
                            fontSize: theme.typography.fontSizeSmall,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Close current window */}
                  <Tooltip placement="top" title={t("windows.close")}>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => {
                        let win = window.open("", winProps.uuid);

                        if (win && win.location.href === "about:blank") {
                          context.onSetWindowOpen("remove", {
                            winName: winProps.winName,
                            uuid: winProps.uuid,
                          });
                        } else {
                          win.self.close();
                        }
                      }}
                    >
                      <Clear
                        style={{
                          cursor: "pointer",
                          fontSize: theme.typography.fontSizeSmall,
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </>
  ) : (
    // Empty conditionnal display
    <Typography
      variant="body2"
      style={{
        textAlign: "center",
        color: alpha(theme.palette.grey[500], 0.6),
        fontSize: theme.typography.fontSizeSmall,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {t("windows.noneOpen")}
    </Typography>
  );
};

WindowHandler.propTypes = {
  getFeature: PropTypes.func.isRequired,
};

export default WindowHandler;
