console.dev("FilterContextMenu");
import PropTypes from "prop-types";

// MUI Components
import {
  Divider,
  Menu,
  MenuItem,
  Collapse,
  Button,
  ButtonGroup,
} from "@material-ui/core";

// MUI Icons
import {
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Spellcheck as SpellcheckIcon,
  SettingsBackupRestore as SettingsBackupRestoreIcon,
  CheckBox as CheckboxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Pageview,
} from "@material-ui/icons";

// MUI Styles
import { useTheme } from "@material-ui/core/styles";
import { deepPurple } from "@material-ui/core/colors";

// Generic f()
import {
  layerLabel,
  oneOfLayers,
  findFilterItem,
  findFilterDirectParent,
} from "src/utils/GenericFunctions";

import initLayers from "src/utils/initLayers";
import { useTranslation, Trans } from "react-i18next";

// Props set trough filterMenu
// (local useState prop in TabMenu/index)
// setFilterMenu() in MainFilters or FilterTreeItem
// ? filterMenu structure example :
// {
//   mouseX: 542, (event.clientX)
//   mouseY: 663, (event.clientY)
//   topParentName: "pt_tech",
//   name: "etude",
//   isParent: false, (if comes from ParentLayerTreeItem)
//   ...filter (all other filter props : sql, color...)
// }
const FilterContextMenu = ({
  filterMenu,
  setFilterMenu,
  setFilterDialog,
  layers,
  updateLayer,
  updateFilterLayer,
  toggleVisibility,
  zoom,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  let otherFilter = findFilterItem(
    layers[filterMenu.topParentName].filters,
    `other: ${filterMenu.name}`
  );

  const otherFilterVisibility = otherFilter ? otherFilter.isVisible : false;

  return (
    <>
      <Menu
        keepMounted
        open={
          filterMenu !== false &&
          layers[filterMenu.topParentName].isVisible &&
          layers[filterMenu.topParentName].allowedZoom <= zoom
        }
        anchorReference="anchorPosition"
        anchorPosition={
          // set positions where the contextMenu was triggered
          filterMenu.mouseY !== null && filterMenu.mouseX !== null
            ? { top: filterMenu.mouseY, left: filterMenu.mouseX }
            : undefined
        }
        onContextMenu={() => {
          setFilterMenu(false);
        }}
        onClose={() => setFilterMenu(false)}
      >
        {/* Menu title (disabled, just informative) */}
        <MenuItem
          dense
          disabled
          style={{
            fontSize: theme.typography.fontSizeSmall,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {oneOfLayers(filterMenu.name)
            ? t(layerLabel(filterMenu.name), { count: 2 })
            : filterMenu.name}
        </MenuItem>

        <Divider />

        {/* .........Add a new filter.........  */}
        <MenuItem
          dense
          onClick={() => {
            // Send the props to FilterDialog
            // Opens the filter creation dialog
            setFilterDialog({
              action: "add", // will be needed for conditionnal text display
              ...filterMenu,
            });
            // reset addMenu local prop > closes the menu
            setFilterMenu(false);
          }}
        >
          <AddIcon
            style={{
              marginRight: 8,
              fontSize: theme.typography.fontSizeLarge,
              color: theme.palette.custom.green.main,
            }}
          />
          {t("layers.filters.add")}
        </MenuItem>

        {/* .....................TOP PARENT CONTEXT MENU..................... */}
        {filterMenu.isParent && (
          <div>
            {/* ......Delete all filters......  */}
            {!Array.isEmpty(layers[filterMenu.name].filters) && (
              <div>
                <MenuItem
                  dense
                  onClick={() => {
                    if (
                      confirm(
                        t("layers.filters.confirmDeleteAll", {
                          label: t(layerLabel(filterMenu.name), { count: 1 }),
                        })
                      )
                    ) {
                      window.postMessage([
                        "deleteAllFilters",
                        [filterMenu.topParentName],
                      ]);

                      // reset filterMenu local prop > closes the menu
                      setFilterMenu(false);
                    }
                  }}
                >
                  <DeleteIcon
                    style={{
                      marginRight: 8,
                      fontSize: theme.typography.fontSizeLarge,
                      color: theme.palette.custom.red,
                    }}
                  />
                  {t("layers.filters.deleteAll")}
                </MenuItem>
              </div>
            )}

            {/* ......Restore original filters (firstFilters)...... */}

            <Collapse
              mountOnEnter
              unmountOnExit
              in={
                JSON.stringify(layers[filterMenu.topParentName]) !==
                JSON.stringify(initLayers[filterMenu.topParentName])
              }
            >
              <MenuItem
                dense
                onClick={() => {
                  if (
                    confirm(
                      t("layers.filters.confirmReset", {
                        label: t(layerLabel(filterMenu.topParentName), {
                          count: 1,
                        }),
                      })
                    )
                  ) {
                    updateLayer(filterMenu.topParentName, "reset", "");

                    // Auto close window function
                    const quit = () => {
                      window.location.reload();
                    };

                    setTimeout(quit, 500);

                    // reset filterMenu local prop > closes the menu
                    setFilterMenu(false);
                  }
                }}
              >
                <SettingsBackupRestoreIcon
                  style={{
                    marginRight: 8,
                    fontSize: theme.typography.fontSizeLarge,
                    color: deepPurple[500],
                  }}
                />
                {t("layers.filters.reset")}
              </MenuItem>
            </Collapse>

            {/* ...............Zoom adaptator............... */}
            <MenuItem dense button={false}>
              <Pageview
                style={{
                  marginRight: 8,
                  fontSize: theme.typography.fontSizeLarge + 2,
                  color: theme.palette.text.disabled,
                }}
              />
              {t("zoom")}
              {/* Action Buttons */}
              <ButtonGroup
                style={{
                  marginLeft: 12,
                  padding: 0,
                  border: "0.2px solid #BEBEBE",
                }}
                aria-label="contained primary button group"
                size="small"
              >
                {/* Remove */}
                <Button
                  style={{ border: "none", padding: 0 }}
                  // Min zoom = 1
                  onClick={() =>
                    parseInt(layers[filterMenu.name].allowedZoom, 10) >= 1 &&
                    updateLayer(
                      filterMenu.name,
                      "allowedZoom",
                      parseInt(layers[filterMenu.name].allowedZoom, 10) - 1
                    )
                  }
                >
                  <RemoveIcon style={{ fontSize: "1rem" }} />
                </Button>

                {/* Display current tolerence */}
                <Button
                  disabled
                  style={{
                    border: "none",
                    color: theme.palette.text.primary,
                    padding: 0,
                    fontSize: theme.typography.fontSizeSmall,
                    fontFamily: theme.typography.fontFamily,
                  }}
                >
                  {parseInt(layers[filterMenu.name].allowedZoom, 10)}
                </Button>

                {/* Add */}
                <Button
                  style={{ border: "none", padding: 0 }}
                  // Max zoom = 24
                  onClick={() =>
                    parseInt(layers[filterMenu.name].allowedZoom, 10) < 25 &&
                    updateLayer(
                      filterMenu.name,
                      "allowedZoom",
                      parseInt(layers[filterMenu.name].allowedZoom, 10) + 1
                    )
                  }
                >
                  <AddIcon style={{ fontSize: "1rem" }} />
                </Button>
              </ButtonGroup>
            </MenuItem>
          </div>
        )}

        {/* .....................CHILD FILTER CONTEXT MENU..................... */}
        {!filterMenu.isParent && (
          <div>
            {/* .........Edit current filter SQL.........  */}
            {Array.isEmpty(filterMenu.filters) && (
              <MenuItem
                dense
                onClick={() => {
                  // Send the props to FilterDialog
                  // Opens the same filter dialog as for creation
                  // But with extra props, like 'filterName' and 'sql'
                  // filterName will be used as the current title
                  // sql as the current SQL request
                  setFilterDialog({
                    action: "edit", // will be needed for conditionnal TEXT display
                    ...filterMenu,
                  });
                  // reset filterMenu local prop > closes the menu
                  setFilterMenu(false);
                }}
              >
                <EditIcon
                  style={{
                    marginRight: 8,
                    fontSize: theme.typography.fontSizeLarge,
                    color: theme.palette.custom.amber,
                  }}
                />{" "}
                {t("sqlRequest.edit")}
              </MenuItem>
            )}

            {/* .........Rename filter.........  */}
            <MenuItem
              dense
              onClick={() => {
                // Same as Edit current filter SQL comments
                setFilterDialog({
                  action: "rename", // will be needed for conditionnal DIALOG display
                  ...filterMenu,
                });
                // reset filterMenu local prop > closes the menu
                setFilterMenu(false);
              }}
            >
              <SpellcheckIcon
                style={{
                  marginRight: 8,
                  fontSize: theme.typography.fontSizeLarge,
                  color: theme.palette.custom.blue.main,
                }}
              />{" "}
              {t("rename")}
            </MenuItem>

            {/* .........Delete current filter.........  */}
            <MenuItem
              dense
              onClick={() => {
                if (
                  confirm(
                    t("layers.filters.confirmDelete", { name: filterMenu.name })
                  )
                ) {
                  // Recursive functions to delete all filter's children at once

                  // Get current filter in mapReducer
                  const currentFilter = findFilterItem(
                    layers[filterMenu.topParentName].filters,
                    filterMenu.name
                  );

                  const directParent = findFilterDirectParent(
                    layers[filterMenu.topParentName].filters,
                    currentFilter
                  );

                  if (
                    directParent !== null &&
                    directParent.filters.length === 1
                  ) {
                    window.postMessage([
                      "toggleFilterLayer",
                      filterMenu.topParentName,
                      directParent.name,
                      true,
                    ]);
                  }

                  let allFilterChildren = [];

                  // recursive f() instanciation
                  const findAllChildren = (item) => {
                    // add item to ephemeral array
                    !allFilterChildren.includes(item) &&
                      allFilterChildren.push(item);
                    // If current filter has children as well
                    if (!Array.isEmpty(item.filters)) {
                      // repeat process
                      item.filters.map((i) => findAllChildren(i));
                    }
                  };

                  // If current filter has actually children
                  if (!Array.isEmpty(currentFilter.filters)) {
                    findAllChildren(currentFilter);
                  } else {
                    // if current filter is the last child, delete simply
                    window.postMessage([
                      "deleteFilterLayer",
                      filterMenu.topParentName,
                      currentFilter.name,
                    ]);
                  }

                  if (!Array.isEmpty(allFilterChildren)) {
                    // delete all stocked children at once
                    allFilterChildren.map((filter) =>
                      // action sent to map (Ilion)
                      window.postMessage([
                        "deleteFilterLayer",
                        filterMenu.topParentName,
                        filter.name,
                      ])
                    );
                  }

                  // reset filterMenu local prop > closes the menu
                  setFilterMenu(false);
                }
              }}
            >
              <DeleteIcon
                style={{
                  marginRight: 8,
                  fontSize: theme.typography.fontSizeLarge,
                  color: theme.palette.custom.red,
                }}
              />{" "}
              {t("layers.filters.delete")}
            </MenuItem>
          </div>
        )}

        {/* ......Layer 'OTHERS' display handler (checkbox)...... */}
        {!Array.isEmpty(filterMenu.filters) && (
          <MenuItem
            dense
            onClick={() => {
              updateFilterLayer(
                filterMenu.topParentName,
                otherFilter.name,
                "isVisible",
                !otherFilterVisibility
              );

              window.postMessage([
                "toggleFilterLayer",
                filterMenu.topParentName,
                otherFilter.name,
                !otherFilterVisibility,
              ]);
            }}
          >
            {otherFilterVisibility ? (
              <CheckboxIcon
                style={{
                  marginRight: 8,
                  fontSize: theme.typography.fontSizeLarge,
                  color: theme.palette.custom.blue.main,
                }}
              />
            ) : (
              <CheckBoxOutlineBlankIcon
                style={{
                  marginRight: 8,
                  fontSize: theme.typography.fontSizeLarge,
                  color: theme.palette.custom.blue.main,
                }}
              />
            )}
            <Trans
              i18nKey="layers.filters.other"
              name={t(layerLabel(filterMenu.name), { count: 2 }).toLowerCase()}
              context={otherFilterVisibility ? "visible" : ""}
            >
              Autres
              {t(layerLabel(filterMenu.name), { count: 2 }).toLowerCase()}&nbsp;
              <strong>affichés</strong>
            </Trans>
          </MenuItem>
        )}
      </Menu>

      <Menu
        open={
          filterMenu !== false &&
          filterMenu.isParent &&
          (!layers[filterMenu.topParentName].isVisible ||
            layers[filterMenu.topParentName].allowedZoom > zoom)
        }
        anchorReference="anchorPosition"
        anchorPosition={
          // set positions where the contextMenu was triggered
          filterMenu.mouseY !== null && filterMenu.mouseX !== null
            ? { top: filterMenu.mouseY, left: filterMenu.mouseX }
            : undefined
        }
        onContextMenu={() => {
          setFilterMenu(false);
        }}
        onClose={() => setFilterMenu(false)}
      >
        {/* Menu title (disabled, just informative) */}
        <MenuItem
          dense
          disabled
          style={{
            fontSize: theme.typography.fontSizeSmall,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {oneOfLayers(filterMenu.name)
            ? t(layerLabel(filterMenu.name), { count: 1 })
            : filterMenu.name}
        </MenuItem>

        <Divider />

        {layers[filterMenu.topParentName].allowedZoom > zoom ? (
          <MenuItem dense disabled>
            <VisibilityOffIcon
              style={{
                marginRight: 8,
                fontSize: theme.typography.fontSizeLarge,
                color: theme.palette.text.disabled,
              }}
            />
            {t("layers.filters.invalidZoom")}
          </MenuItem>
        ) : (
          <MenuItem dense onClick={toggleVisibility}>
            <VisibilityIcon
              style={{
                marginRight: 8,
                fontSize: theme.typography.fontSizeLarge,
                color: theme.palette.custom.green.main,
              }}
            />
            {t("layers.filters.displayLayer")}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

FilterContextMenu.propTypes = {
  layers: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
  updateFilterLayer: PropTypes.func.isRequired,
  filterMenu: PropTypes.object.isRequired,
  setFilterMenu: PropTypes.func.isRequired,
  setFilterDialog: PropTypes.func.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
  zoom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default FilterContextMenu;
