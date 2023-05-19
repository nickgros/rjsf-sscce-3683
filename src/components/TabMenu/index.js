import { Fragment, useEffect, useState, useContext } from "react";

console.dev("TabMenu");

import PropTypes from "prop-types";

// Material UI styles
import { useStyles } from "src/styles/MaterialUiComponentsStyles/TabMenuStyle";
import { useTheme, alpha } from "@material-ui/core/styles";

// Main menu items files
import TabGroupedActions from "src/components/TabMenu/TabGroupedActions";

// Context & LS Handler
import SettingsContext from "src/components/Settings/context/SettingsContext";
import { Badge, Divider, Tooltip, Typography } from "@material-ui/core";
import Icon from "@mdi/react";

// Layers Filter files
import FilterDialog from "src/components/TabMenu/LayersTreeview/FilterDialog";
import FilterContextMenu from "src/components/TabMenu/ContextMenus/FilterContextMenu";
import ColorPicker from "src/components/TabMenu/ContextMenus/ColorPicker";

import { tabMenus as tabMenusData } from "src/components/TabMenu/tabMenus";
import { useTranslation } from "react-i18next";

const TabMenu = ({
  // TabMenu structure
  setSnackbar,
  tabContainerOpen,
  setTabContainerOpen,
  tabMenuTarget,
  setTabMenuTarget,
  open,
  setOpen,
  // import layers
  importLayers,
  updateImportLayer,
  deleteImportLayer,
  // Main layers
  toggleLayerVisibility,
  layers,
  loaders,
  setDrawParams,
  updateLayer,
  // Filter layers
  updateFilterLayer,
  openedFilters,
  setFilterOpen,
  // Map
  zoom,
  getFeature,
  //Plugins
  getMaterialReference,
  postProcessPlugins,
  getProcessPlugins,
  identifier,
  referenceCable,
  referenceBpe,
  setDisabled,
  disabled,
  responseStatus,
  process,
  // External layers
  getLayerModel,
  sendExternalLayer,
  // Task manager
  getDatesList,
  getTasksFromDate,
  taskStatusCheck,
  taskResultSync,
}) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const context = useContext(SettingsContext);

  // Filters
  const [filterMenu, setFilterMenu] = useState(false);
  const [colorPicker, setColorPicker] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  // Layer models
  const [layerDialog, setLayerDialog] = useState(false);

  // tabMenus
  const [tabMenus, setTabMenus] = useState([]);

  useEffect(() => {
    setTabMenus(
      tabMenusData(
        i18n,
        context,
        layers,
        updateLayer,
        setLayerDialog,
        taskResultSync,
        getDatesList,
        toggleLayerVisibility,
        importLayers,
        updateImportLayer,
        openedFilters,
        setFilterOpen,
        setFilterMenu,
        setSnackbar,
        (i18nKey) => confirm(t(i18nKey))
      )
    );
  }, [context, layers, openedFilters, importLayers]);

  /**
   * Display badge if context according to tabKey is not empty
   * @param {string} tabKey 'windows' | 'bookmarks' | 'importLayers'
   */
  const badgeVisibility = (tabKey) => {
    if (
      tabKey === "bookmarks" ||
      tabKey === "windows" ||
      tabKey === "taskManager"
    ) {
      if (context[tabKey] && !Array.isEmpty(context[tabKey])) return false;
      return;
    }

    if (tabKey === "importLayers" && !Object.isEmpty(importLayers)) {
      return false;
    }
    return true;
  };

  // Slide animation condition
  // See Home/index.js for details
  const noSlideAllowed = tabContainerOpen || tabMenuTarget === null;

  const [tabPaperWidth, setTabPaperWidth] = useState(430);

  /**
   * Change cursor style and add event listener to change TabMenu size
   */
  function initResize() {
    document.getElementById("ilion").style.cursor = "col-resize";
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", Resize, false);
    window.addEventListener("mouseup", stopResize, false);
  }

  /**
   * Update TabMenu size
   * @param {MouseEvent} e Mousemove
   */
  function Resize(e) {
    e.clientX > 430 &&
      e.clientX < window.innerWidth / 4 &&
      tabPaperWidth !== e.clientX &&
      setTabPaperWidth(e.clientX);
  }

  /**
   * Stop update TabMenu size and change cursor style
   */
  function stopResize() {
    document.getElementById("ilion").style.cursor = "crosshair";
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", Resize, false);
    window.removeEventListener("mouseup", stopResize, false);
  }

  return (
    <>
      <div
        id="tabContainer"
        style={{ left: tabPaperWidth }}
        // Reset tabMenuTarget when the user isn't focused anymore
        onMouseLeave={() => tabMenuTarget !== null && setTabMenuTarget(null)}
        className={`${classes.tabContainer} ${
          // Disable slide animation by className toggle
          noSlideAllowed ? "" : classes.slideAnim
        }`}
      >
        {tabMenus.length &&
          tabMenus.map((tab) => (
            <Tooltip
              key={tab.key}
              arrow
              title={t(tab.i18nKey)}
              placement="right"
            >
              <div
                className={
                  localStorage.tabMenuOpen === tab.key
                    ? classes.tabItemActive
                    : classes.tabItem
                }
                onClick={(event) => {
                  // Set current target to enable slide animation
                  tabMenuTarget !== event.target &&
                    setTabMenuTarget(event.target);

                  // Set tabContainerOpen to enable slide animation
                  // if true, animaton is off
                  setTabContainerOpen(
                    localStorage.tabMenuOpen !== "" &&
                      localStorage.tabMenuOpen !== tab.key
                  );

                  context.onSetTabMenuOpen(
                    localStorage.tabMenuOpen === tab.key ? "" : tab.key
                  );
                }}
              >
                <Badge
                  invisible={badgeVisibility(tab.key)}
                  showZero={false}
                  classes={{
                    badge:
                      tab.key === "windows" || tab.key === "taskManager"
                        ? classes.windowBadge
                        : classes.importBadge,
                  }}
                  badgeContent={
                    tab.key === "windows"
                      ? context.windowOpen
                        ? context.windowOpen.length >= 10
                          ? "!"
                          : context.windowOpen.length
                        : "0"
                      : tab.key === "bookmarks"
                      ? context.bookmarks !== null && context.bookmarks.length
                      : Object.keys(importLayers).length
                  }
                >
                  <Icon path={tab.icon} size={theme.typography.fontSize / 16} />
                </Badge>
              </div>
            </Tooltip>
          ))}
      </div>

      <div
        style={{ width: tabPaperWidth }}
        id="tabPaperContainer"
        onMouseLeave={() => tabMenuTarget !== null && setTabMenuTarget(null)}
        className={`${classes.tabPaperContainer} ${
          noSlideAllowed ? "" : classes.slideAnim
        }`}
      >
        <div className={classes.tabPaper}>
          {tabMenus.length &&
            tabMenus.map(
              ({ key, Component, i18nKey, icon, actions }) =>
                localStorage.tabMenuOpen === key && (
                  <Fragment key={key}>
                    {/* Title */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <Icon
                          path={icon}
                          title={t(i18nKey)}
                          size={theme.typography.fontSize / 16}
                          style={{
                            marginRight: theme.spacing(1),
                            color: theme.palette.menuColor,
                          }}
                        />
                        <Typography
                          style={{
                            fontSize: theme.typography.fontSizeLarge + 2,
                          }}
                        >
                          {t(i18nKey)}
                        </Typography>
                      </div>

                      <TabGroupedActions
                        tabMenuActions={actions}
                        setAlreadyRequested={setAlreadyRequested}
                        alreadyRequested={alreadyRequested}
                      />
                    </div>

                    <Divider
                      style={{
                        margin: `${theme.spacing(1)}px 0 ${
                          key === "layers" ? theme.spacing(1) : theme.spacing(2)
                        }px 0`,
                        backgroundColor: alpha(theme.palette.menuColor, 0.1),
                      }}
                    />

                    <Component
                      // TabMenu structure
                      setSnackbar={setSnackbar}
                      tabPaperWidth={tabPaperWidth}
                      open={open}
                      setOpen={setOpen}
                      // import layers
                      importLayers={importLayers}
                      updateImportLayer={updateImportLayer}
                      deleteImportLayer={deleteImportLayer}
                      // Main layers
                      toggleLayerVisibility={toggleLayerVisibility}
                      layers={layers}
                      loaders={loaders}
                      setDrawParams={setDrawParams}
                      updateLayer={updateLayer}
                      // Filter layers
                      updateFilterLayer={updateFilterLayer}
                      openedFilters={openedFilters}
                      setFilterOpen={setFilterOpen}
                      // Map
                      zoom={zoom}
                      getFeature={getFeature}
                      filterMenu={filterMenu}
                      setFilterMenu={setFilterMenu}
                      colorPicker={colorPicker}
                      setColorPicker={setColorPicker}
                      filterDialog={filterDialog}
                      setFilterDialog={setFilterDialog}
                      //Plugins
                      getMaterialReference={getMaterialReference}
                      referenceCable={referenceCable}
                      referenceBpe={referenceBpe}
                      postProcessPlugins={postProcessPlugins}
                      getProcessPlugins={getProcessPlugins}
                      identifier={identifier}
                      setDisabled={setDisabled}
                      disabled={disabled}
                      responseStatus={responseStatus}
                      process={process}
                      layerDialog={layerDialog}
                      setLayerDialog={setLayerDialog}
                      getLayerModel={getLayerModel}
                      sendExternalLayer={sendExternalLayer}
                      getTasksFromDate={getTasksFromDate}
                      taskStatusCheck={taskStatusCheck}
                    />
                  </Fragment>
                )
            )}
        </div>
        <div
          onMouseDown={() => initResize()}
          className={classes.tabResizeBar}
        />
      </div>

      {/* .................Layers Filters files ................. */}

      {/* 
        // ? Context menu (from right click) 
        // ? on a existing filter
        filterMenu structure example :
          {
            mouseX: 542, (event.clientX)
            mouseY: 663, (event.clientY)
            topParentName: "pt_tech",
            name: "etude",
            sql: "etat = 'EN ETUDE'",
            color: "#FF0000",
          }
        filterMenu props are set 
        in MainFilters or FilterTreeItem
      */}
      {filterMenu !== false && (
        <FilterContextMenu
          layers={layers}
          updateLayer={updateLayer}
          updateFilterLayer={updateFilterLayer}
          filterMenu={filterMenu}
          setFilterMenu={setFilterMenu}
          setFilterDialog={setFilterDialog}
          toggleVisibility={() => {
            // show / hide layers
            toggleLayerVisibility(filterMenu.name); // state change
            window.postMessage(["toggleLayerVisibility", filterMenu.name]); // map change
          }}
          zoom={zoom}
        />
      )}

      {/* 
        // ? Filter instantiation
        filterDialog structure example:
        {
          action: "add",
          ...filterMenu,
        }
        filterDialog props are set 
        in FilterContextMenu.js
      */}
      {filterDialog !== false && (
        <FilterDialog
          filterDialog={filterDialog}
          setFilterDialog={setFilterDialog}
          layers={layers}
        />
      )}

      {/* 
        Sketch color picker from react-color
        triggered from FilterTreeItem.js
      */}
      {colorPicker !== false && (
        <div
          className={classes.containerColorPicker}
          style={{ width: tabPaperWidth }}
        >
          <ColorPicker
            colorPicker={colorPicker}
            setColorPicker={setColorPicker}
            updateLayer={updateLayer}
            updateFilterLayer={updateFilterLayer}
            folder="tabMenu"
          />
        </div>
      )}
    </>
  );
};

TabMenu.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  setSnackbar: PropTypes.func.isRequired,
  tabContainerOpen: PropTypes.bool.isRequired,
  setTabContainerOpen: PropTypes.func.isRequired,
  tabMenuTarget: PropTypes.any,
  setTabMenuTarget: PropTypes.func.isRequired,
  // Import layers
  importLayers: PropTypes.object.isRequired,
  updateImportLayer: PropTypes.func.isRequired,
  deleteImportLayer: PropTypes.func.isRequired,
  // Main layers
  toggleLayerVisibility: PropTypes.func.isRequired,
  loaders: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
  setDrawParams: PropTypes.func.isRequired,
  // Filter layers
  updateFilterLayer: PropTypes.func.isRequired,
  deleteFilterLayer: PropTypes.func.isRequired,
  openedFilters: PropTypes.array.isRequired,
  setFilterOpen: PropTypes.func.isRequired,
  // Map
  zoom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  getFeature: PropTypes.func.isRequired,
  //Plugins
  getMaterialReference: PropTypes.func.isRequired,
  referenceBpe: PropTypes.object,
  referenceCable: PropTypes.object,
  identifier: PropTypes.object,
  getProcessPlugins: PropTypes.func,
  postProcessPlugins: PropTypes.func,
  disabled: PropTypes.bool,
  responseStatus: PropTypes.number,
  process: PropTypes.string,
  setDisabled: PropTypes.func,
  getLayerModel: PropTypes.func.isRequired,
  sendExternalLayer: PropTypes.func.isRequired,
  getDatesList: PropTypes.func.isRequired,
  getTasksFromDate: PropTypes.func.isRequired,
  taskStatusCheck: PropTypes.func.isRequired,
  taskResultSync: PropTypes.func.isRequired,
};

export default TabMenu;
