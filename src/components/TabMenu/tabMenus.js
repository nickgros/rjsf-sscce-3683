// Main menu items files
import WindowHandler from "src/components/TabMenu/WindowHandler";
import TileLayers from "src/components/TabMenu/TileLayers";
import LayersLegend from "src/components/TabMenu/LayersLegend";
import ImportLayers from "src/components/TabMenu/ImportLayers";
import Bookmark from "src/components/TabMenu/Bookmark";
import Plugins from "src/components/Plugins/index.js";
import TaskManager from "src/components/TabMenu/TaskManager";

import { capitalize, formatDate } from "src/utils/GenericFunctions";

import {
  mdiLayers,
  mdiEarth,
  mdiLayersTriple,
  mdiWindowRestore,
  mdiBookmark,
  mdiFormSelect,
  mdiClipboardTextClockOutline,
} from "@mdi/js";

import initTileLayers from "src/utils/initTileLayers";
import initLayers from "src/utils/initLayers";

/**
 * Menu table corresponding to the left menu tabs in Ilion
 * @param {object} context State image of the `localStorage`
 * @param {object} layers  List of all main & filter layers `mapReducer.layers`
 * @param {function} updateLayer Udpates a main layer prop
 * @param {function} toggleLayerVisibility Shows / hides a main layer
 * @param {object} importLayers List of all imported layers `mapReducer.importLayers`
 * @param {function} updateImportLayer Updates an imported layer prop
 * @param {string[]} openedFilters List of opened treeview items's code
 * @param {function} setFilterOpen Treeview item opener control
 * @param {function} setFilterMenu Store current filter infos for `FilterContextMenu`
 * @param {function} setSnackbar Launch UX user alert
 * @returns {object[]} Array of tab items (one object = one tab)
 */
export const tabMenus = (
  i18n,
  context,
  layers,
  updateLayer,
  setLayerModels,
  taskResultSync,
  getDatesList,
  toggleLayerVisibility,
  importLayers,
  updateImportLayer,
  openedFilters,
  setFilterOpen,
  setFilterMenu,
  setSnackbar,
  localizedConfirmFn
) => [
  // .........................WINDOWS.........................
  {
    key: "windows",
    icon: mdiWindowRestore,
    i18nKey: "window",
    Component: WindowHandler,
    actions: [
      {
        key: "visibility",
        condition:
          context.windowOpen instanceof Array && context.windowOpen.length > 0,
        i18nKey: "windows.all",
        /**
         * toggle windows visibility if editMode is off
         */
        action: () => {
          if (localStorage.editMode === "false") {
            context.windowOpen.map((winProps) =>
              window.open("", winProps.uuid)
            );
          } else {
            setSnackbar("info", "top", "windows.closeAllWarning", true);
          }
        },
      },
      {
        key: "clear",
        condition:
          context.windowOpen instanceof Array && context.windowOpen.length > 0,
        i18nKey: "windows.all",
        /**
         * Close windows if editMode is off
         */
        action: () => {
          // close windows if editMode is off
          if (localStorage.editMode === "false") {
            let wins = [];
            // Fill wins with uuid of each winprops
            context.windowOpen.map((winProps) =>
              wins.push(window.open("", winProps.uuid))
            );
            // self close each window
            wins.map((win) => {
              context.onSetWindowOpen("remove", {
                winName: win.winName,
                uuid: win.uuid,
              });
              win.self.close();
            });
          } else {
            setSnackbar("info", "top", "windows.closeAllWarning", true);
          }
        },
      },
    ],
  },
  // .........................TILE LAYERS.........................
  {
    key: "tiles",
    icon: mdiEarth,
    i18nKey: "tiles.name",
    Component: TileLayers,
    actions: [
      {
        key: "visibility",
        condition:
          context.tileLayers instanceof Array && context.tileLayers.length > 0,
        i18nKey: "tiles.all",
        /**
         * toggle layer visibility
         */
        action: () => {
          if (context.tileLayers.some((layer) => layer.visible)) {
            window.postMessage([
              "tileLayersHandler",
              context.tileLayers.map((layer) => ({
                ...layer,
                visible: false,
                visibleBefore: layer.visible,
              })),
            ]);
          } else {
            window.postMessage([
              "tileLayersHandler",
              context.tileLayers
                .filter((layer) => layer.visibleBefore)
                .map((layer) => ({
                  ...layer,
                  visible: true,
                  visibleBefore: false,
                })),
            ]);
          }
        },
      },
      {
        key: "restore",
        condition:
          context.tileLayers instanceof Array && context.tileLayers.length > 0,
        i18nKey: "tiles.all",
        /**
         * Restore all layers
         */
        action: () =>
          localizedConfirmFn("tiles.confirmResetAll") &&
          window.postMessage(["tileLayersHandler", initTileLayers]),
      },
    ],
  },
  // .........................LAYERS TREEVIEW.........................
  {
    key: "layers",
    icon: mdiLayers,
    i18nKey: "layers.name",
    Component: LayersLegend,
    /**
     * Four functions in array
     * @function1 expand all layers
     * @function2 toggle layer visibility of all layers
     * @function3 restore all custom layer
     * @function4 delete all layer style
     */
    actions: [
      {
        key: "expand",
        condition: !Array.isEmpty(
          Object.keys(layers)
            .map((l) => layers[l].filters)
            .filter((i) => i.length)
        ),
        i18nKey: "layers.filters.all",
        action: () =>
          setFilterOpen(openedFilters.length ? "closeAll" : "openAll"),
      },
      {
        key: "visibility",
        condition: true,
        i18nKey: "object.all",
        action: () => {
          const newVisibility = !layers.cable.isVisible;
          Object.keys(layers).map((layerName) => {
            if (newVisibility !== layers[layerName].isVisible) {
              toggleLayerVisibility(layerName);
              window.postMessage(["toggleLayerVisibility", layerName]); // map change
            }
          });
        },
      },

      {
        key: "restore",
        condition: JSON.stringify(layers) !== JSON.stringify(initLayers),
        i18nKey: "settings.all",
        action: () => {
          if (localizedConfirmFn("settings.confirmResetAll")) {
            updateLayer("allFilters", "reset", "");

            // Auto reload window function
            const quit = () => {
              window.location.reload();
            };

            setTimeout(quit, 500);

            // reset filterMenu local prop > closes the menu
            setFilterMenu(false);
          }
        },
      },
      {
        key: "clear",
        condition: !Array.isEmpty(
          Object.keys(layers)
            .map((l) => layers[l].filters)
            .filter((i) => i.length)
        ),
        i18nKey: "layers.filters.all",
        action: () => {
          if (localizedConfirmFn("layers.filters.confirmResetAll")) {
            window.postMessage(["deleteAllFilters", Object.keys(layers)]);

            // reset filterMenu local prop > closes the menu
            setFilterMenu(false);
          }
        },
      },
    ],
  },
  // .........................IMPORT LAYERS.........................
  {
    key: "importLayers",
    icon: mdiLayersTriple,
    i18nKey: "importedLayers.name",
    Component: ImportLayers,
    actions: [
      {
        key: "import",
        condition: context.tabMenuOpen === "importLayers",
        /**
         * Upload external layer
         */
        action: () => setLayerModels(true),
      },
      {
        key: "visibility",
        condition: !Object.isEmpty(importLayers),
        i18nKey: "importedLayers.all",
        /**
         * toggle imported layers visibility
         */
        action: () => {
          const newVisibility =
            !importLayers[Object.keys(importLayers)[0]].isVisible;
          Object.keys(importLayers).map((fileName) => {
            updateImportLayer(fileName, "isVisible", newVisibility);
            window.postMessage([
              "toggleImportLayerVisibility",
              fileName,
              newVisibility,
            ]);
          });
        },
      },
      {
        key: "clear",
        condition: !Object.isEmpty(importLayers),
        i18nKey: "importedLayers.all",
        /**
         * Remove all layers visibility
         */
        action: () =>
          localizedConfirmFn("importedLayers.confirmResetAll") &&
          window.postMessage(["deleteImportLayer", "removeAll"]),
      },
    ],
  },
  // .........................BOOKMARK.........................
  {
    key: "bookmarks",
    icon: mdiBookmark,
    i18nKey: "bookmarks.name",
    Component: Bookmark,
    /**
     * Remove all bookmarks
     */
    actions: [
      {
        key: "clear",
        condition: context.bookmarks !== null && context.bookmarks.length > 0,
        i18nKey: "bookmarks.all",
        action: () =>
          localizedConfirmFn("bookmarks.confirmResetAll") &&
          context.onSetBookmark("removeAll"),
      },
    ],
  },
  // .........................JSON.........................
  {
    key: "plugins",
    icon: mdiFormSelect,
    i18nKey: "Plugins",
    Component: Plugins,
    actions: [],
  },
  {
    key: "taskManager",
    icon: mdiClipboardTextClockOutline,
    i18nKey: capitalize(
      formatDate(new Date(context.selectedDate), "PPPP", i18n.language)
    ),
    Component: TaskManager,
    actions: [
      {
        key: "sync",
        condition: context.tabMenuOpen === "taskManager",
        action: () => {
          const pendingTasks = context.taskList.filter((task) => !task.status);
          if (Array.isEmpty(pendingTasks)) {
            setSnackbar("info", "top", "taskManager.alreadySync", true);
          } else {
            taskResultSync(pendingTasks);
            setSnackbar("success", "top", "taskManager.syncSuccess", true);
          }
        },
      },
      {
        key: "calendar",
        condition: context.tabMenuOpen === "taskManager",
        action: () => {
          Array.isEmpty(context.taskDates) &&
            getDatesList("Odyssee", "crea_date").then((dates) => {
              context.onSetTaskList("setTaskDates", [
                ...new Set(
                  dates.map((date) => new Date(date.crea_date).toDateString())
                ),
              ]);
            });
          context.onSetTaskList("openPicker");
        },
      },
    ],
  },
];
