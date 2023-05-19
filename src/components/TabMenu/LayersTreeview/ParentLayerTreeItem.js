console.dev("ParentLayerTreeItem");

import PropTypes from "prop-types";

// MUI Components
import { IconButton, Tooltip, CircularProgress } from "@material-ui/core";

// MUI Icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import AddIcon from "@material-ui/icons/Add";

// MUI Styles
import { useStyles } from "src/styles/MaterialUiComponentsStyles/TabMenuStyle";

import objectTypes from "src/utils/constants/objectTypes";

import { layerLabel } from "src/utils/GenericFunctions";

import ColorIcon from "src/styles/MaterialUiComponentsStyles/ColorIcon";

import { useTranslation } from "react-i18next";

// Generic TabMenu Treeview item
// Only for parent layers : cable, site, ptt, support & domaine
const ParentLayerTreeItem = ({
  // Tab
  setDrawParams,
  // Main Layers
  layerName,
  layers,
  loaders,
  isVisible,
  toggleVisibility,
  notVisible,
  // Style
  iconColor,
  theme,
  setColorPicker,
  // Filter layers
  setFilterMenu,
  setFilterOpen,
  openedFilters,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  // Formatted layerNames (lowercase)
  const layerLabelLow =
    layerName === "pt_tech"
      ? t("technicalPoint", { count: 1 })
      : t(objectTypes[layerName], { count: 1 });

  const loneParent = Array.isEmpty(layers[layerName].filters);

  /**
   * Gradient bg color for loaders progress bar (from red to green)
   * @param {number} p percentage
   * @returns {string} calculated 'rgb()' style depending on passed percentage
   */
  const setColor = (p) => {
    var red = p < 50 ? 255 : Math.round(256 - (p - 50) * 5.12);
    var green = p > 50 ? 255 : Math.round(p * 5.12);
    return "rgb(" + red + "," + green + ",0)";
  };

  return (
    // container
    <div
      className={classes.tabListItemContainer}
      style={{
        cursor: loneParent ? "default" : "pointer",
        padding: "8px 0",
      }}
    >
      {/* .............left side............. */}

      <div className={classes.tabListItemLeftContainer}>
        {/* visibility */}
        {/* Disable visibility action depending on zoom & layer type */}
        {notVisible ? (
          <IconButton
            size="small"
            disabled
            style={{
              color:
                theme.palette.grey[
                  localStorage.darkMode === "true" ? 900 : 300
                ],
            }}
          >
            <VisibilityOffIcon
              style={{
                fontSize: theme.typography.fontSizeLarge + 2,
              }}
            />
          </IconButton>
        ) : (
          <>
            {/* Layer loader */}
            {loaders[layerName] > 0 && (
              <CircularProgress
                variant="determinate"
                color="secondary"
                value={loaders[layerName]}
                style={{
                  position: "absolute",
                  width: theme.typography.fontSize * 2 - 2,
                  height: theme.typography.fontSize * 2 - 2,
                  color: setColor(loaders[layerName]),
                }}
              />
            )}

            <IconButton
              size="small"
              onClick={toggleVisibility}
              style={{
                color: isVisible
                  ? loaders[layerName] === 0
                    ? theme.palette.custom.green.main
                    : iconColor
                  : theme.palette.grey[
                      localStorage.darkMode === "true" ? 800 : 400
                    ],
                transition: theme.transition,
              }}
            >
              <VisibilityIcon
                style={{
                  fontSize: theme.typography.fontSizeLarge + 2,
                }}
              />
            </IconButton>
          </>
        )}

        {/* color icon */}
        {loneParent && (
          <IconButton
            size="small"
            style={{
              display: loneParent ? "flex" : "none",
              marginLeft: 3,
            }}
            // if current filter is one of the firsts (basic filter on map load),
            // color cannot be modified
            onClick={() =>
              setColorPicker({
                layerName,
                filterName: layerName,
                style: layers[layerName].style,
              })
            }
          >
            <ColorIcon
              style={{
                width: theme.typography.fontSizeLarge + 2,
                height: theme.typography.fontSizeLarge + 2,
              }}
              // style={{ width: "0.8em" }}
              stroke={layers[layerName].style.stroke.color}
              fill={layers[layerName].style.fill.color}
              shapeType={layerName}
            />
          </IconButton>
        )}

        {/* filter name (text) */}
        <p
          onClick={() => setFilterOpen(layerName)}
          className={classes.tabListItemText}
          style={{
            paddingLeft: loneParent ? theme.spacing(0.5) : theme.spacing(1.5),
            fontSize: theme.typography.fontSizeLarge + 2,
            color: isVisible ? "" : theme.palette.text.disabled,
            fontWeight:
              !loneParent && openedFilters.includes(layerName) && "bold",
          }}
          onContextMenu={(event) => {
            event.preventDefault();

            // Right click on a main layer
            // Props are send to FilterContextMenu
            setFilterMenu({
              mouseX: event.clientX - 2, // used to set
              mouseY: event.clientY - 4, // menu position
              topParentName: layerName,
              name: layerName,
              isParent: true,
              ...layers[layerName],
            });
          }}
        >
          {t(layerLabel(layerName), { count: 2 })}
        </p>
      </div>

      {/* .............right action icon............. */}
      <div className={classes.tabListItemRightContainer}>
        {/* Create a new object */}
        <Tooltip
          placement="right"
          title={t("layers.createType", { type: layerLabelLow })}
        >
          <IconButton
            size="small"
            onClick={(event) => {
              event.preventDefault();
              // show layer if not visible yet
              // to prevent errors when the
              // new feature'll be added to the map
              !layers[layerName].isVisible && toggleVisibility();
              // opens CreateByModel dialog in Ilion/index.js
              setDrawParams(layerName, `new-${layerName}`, "");
            }}
          >
            <AddIcon
              style={{
                color: theme.palette.custom.green.main,
                fontSize: theme.typography.fontSizeLarge + 2,
              }}
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

ParentLayerTreeItem.propTypes = {
  // Tab
  setDrawParams: PropTypes.func.isRequired,
  // Main Layers
  layerName: PropTypes.string.isRequired,
  loaders: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
  layers: PropTypes.object.isRequired,
  isVisible: PropTypes.bool,
  toggleVisibility: PropTypes.func.isRequired,
  notVisible: PropTypes.bool,
  // Style
  iconColor: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  setColorPicker: PropTypes.func.isRequired,
  // Filter layers
  setFilterMenu: PropTypes.func.isRequired,
  setFilterOpen: PropTypes.func.isRequired,
  openedFilters: PropTypes.array.isRequired,
};

export default ParentLayerTreeItem;
