// Get first letter of choosen word, transform as MDI LetterIcon

console.dev("FilterTreeItem");

import PropTypes from "prop-types";

// MUI Components
import { IconButton } from "@material-ui/core";

// MUI Icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import BrushIcon from "@material-ui/icons/Brush";
import ColorIcon from "src/styles/MaterialUiComponentsStyles/ColorIcon";

// MUI Styles
import { useTheme, alpha } from "@material-ui/core/styles";
import { useStyles } from "src/styles/MaterialUiComponentsStyles/TabMenuStyle";

// Generic f()
import { shortCategories, checkEtudeStyle } from "src/utils/GenericFunctions";
import objectTypes from "src/utils/constants/objectTypes";

import { useTranslation, Trans } from "react-i18next";

// Generic TabMenu Treeview item
// used for firstFilters items
const FilterTreeItem = ({
  filter,
  isDisabled,
  setFilterMenu,
  iconColor,
  filterVisibility,
  setColorPicker,
  colorPicker,
  setFilterOpen,
  topParentName,
  tabPaperWidth,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const inUseFilter = filter.name.includes("in_use");
  const inStudyFilter = filter.name.includes("in_study");
  const isOtherFilter = filter.name.includes("other");

  const directParentName = filter.name.substring(0, filter.name.indexOf("-"));

  return (
    <div
      className={classes.tabListItemContainer}
      style={{
        display: isOtherFilter && !filter.isVisible ? "none" : "flex",
        height: theme.typography.fontSize + 10,
        marginTop: -3,
        cursor: isOtherFilter ? "default" : "pointer",
      }}
    >
      {/* .............left side............. */}

      <div className={classes.tabListItemLeftContainer}>
        {/* visibility */}
        <IconButton
          disabled={isDisabled}
          size="small"
          onClick={() => filterVisibility(filter, !filter.isVisible)}
        >
          {/* Disable visibility action depending on zoom & parent layer type */}
          {isDisabled ? (
            <VisibilityOffIcon
              style={{
                fontSize: theme.typography.fontSize,
                color: alpha(
                  theme.palette.grey[
                    localStorage.darkMode === "true" ? 800 : 400
                  ],
                  0.5
                ),
              }}
            />
          ) : (
            <VisibilityIcon
              style={{
                fontSize: theme.typography.fontSize,
                color: alpha(
                  !filter.isVisible
                    ? theme.palette.grey[
                        localStorage.darkMode === "true" ? 800 : 400
                      ]
                    : iconColor,
                  localStorage.darkMode === "true" ? 0.8 : 0.3
                ),
              }}
            />
          )}
        </IconButton>

        {/* color icon */}
        <IconButton
          size="small"
          disabled={!Array.isEmpty(filter.filters)}
          // if current filter is one of the firsts (basic filter on map load),
          // color cannot be modified
          onClick={() =>
            setColorPicker({
              layerName: topParentName,
              filterName: filter.name,
              style: filter.style,
            })
          }
        >
          <ColorIcon
            style={{
              width: theme.typography.fontSizeLarge,
              height: theme.typography.fontSizeLarge,
            }}
            stroke={filter.style.stroke.color}
            fill={filter.style.fill.color}
            shapeType={
              checkEtudeStyle(filter, topParentName)
                ? "etude"
                : filter.name === "building" && topParentName === "pt_tech"
                ? filter.name
                : topParentName
            }
          />
        </IconButton>

        {/* filter name (text) */}
        <p
          onClick={() =>
            !Array.isEmpty(filter.filters) && setFilterOpen(filter.name)
          }
          onContextMenu={(event) => {
            if (!isOtherFilter) {
              // Right click on a filter
              // (so, filterName is filled)
              // Props are send to FilterContextMenu
              setFilterMenu({
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
                topParentName: topParentName,
                isParent: false,
                ...filter,
              });
            }
          }}
          className={classes.tabListItemText}
          style={{
            fontSize: theme.typography.fontSizeSmall + 1,
            color:
              isDisabled || !filter.isVisible
                ? theme.palette.text.disabled
                : "",

            maxWidth: `${tabPaperWidth - 135}px`,
          }}
        >
          {inUseFilter ? (
            <Trans i18nKey="layers.filters.inUseFilter" name={directParentName}>
              {directParentName}
              In use
            </Trans>
          ) : inStudyFilter ? (
            <Trans
              i18nKey="layers.filters.inStudyFilter"
              name={directParentName}
            >
              {directParentName}
              In study
            </Trans>
          ) : isOtherFilter ? (
            <Trans
              i18nKey="layers.filters.otherFilter"
              name={t(objectTypes[topParentName], { count: 2 })}
            >
              Other
              {t(objectTypes[topParentName], { count: 2 })}
            </Trans>
          ) : (
            shortCategories(t(filter.name))
          )}{" "}
          {colorPicker !== false && colorPicker.filterName === filter.name && (
            <BrushIcon
              style={{
                fontSize: theme.typography.fontSize,
                color: theme.palette.custom.amber,
              }}
            />
          )}
        </p>
      </div>
    </div>
  );
};

FilterTreeItem.propTypes = {
  filter: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  setFilterMenu: PropTypes.func.isRequired,
  iconColor: PropTypes.string.isRequired,
  filterVisibility: PropTypes.func.isRequired,
  setColorPicker: PropTypes.func.isRequired,
  colorPicker: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  setFilterOpen: PropTypes.func.isRequired,
  topParentName: PropTypes.string.isRequired,
  tabPaperWidth: PropTypes.number.isRequired,
};

export default FilterTreeItem;
