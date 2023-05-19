import React from "react";

console.dev("LayersLegend");

import PropTypes from "prop-types";

import { useTheme, lighten } from "@material-ui/core/styles";

// Complete SortableJS (with all plugins)
import Sortable from "sortablejs/modular/sortable.complete.esm.js";

// Layers Filter files
import LayersTreeview from "src/components/TabMenu/LayersTreeview/index";

import { compareByAttribute } from "src/utils/GenericFunctions";

const LayersLegend = ({
  toggleLayerVisibility,
  layers,
  loaders,
  setDrawParams,
  updateLayer,
  updateFilterLayer,
  openedFilters,
  setFilterOpen,
  zoom,
  setFilterMenu,
  setColorPicker,
  colorPicker,
  tabPaperWidth,
}) => {
  const theme = useTheme();

  // DnD parentLayer to change order
  const sortableMenu = document.getElementById("parentLayers");

  sortableMenu &&
    Sortable.create(sortableMenu, {
      animation: 150,
      handle: ".layerToDnd",
      filter: ".ignore-element",
      // Called when dragging element changes position
      onEnd: function (evt) {
        window.postMessage([
          "changeLayerIndex",
          evt.newIndex,
          evt.oldIndex,
          "layers",
        ]);
      },
    });

  // darkMode icon's color conditionnal display
  const iconColor =
    localStorage.darkMode === "true"
      ? lighten(theme.palette.primary.light, 0.4)
      : theme.palette.primary.main;

  return (
    <div id="parentLayers">
      {/*
              Create an array from mapReducer.layers to sort layers by zIndex
            */}
      {[...new Set(Object.keys(layers).map((layerName) => layers[layerName]))]
        .sort((a, b) => compareByAttribute(a, b, "zIndex"))
        .map((layer) => (
          <LayersTreeview
            key={layer.name}
            // Create new object handler
            setDrawParams={setDrawParams}
            // Main Layers
            layerName={layer.name}
            updateLayer={updateLayer}
            layers={layers}
            loaders={loaders}
            isVisible={layers[layer.name].isVisible}
            toggleVisibility={() => {
              // show / hide layers
              toggleLayerVisibility(layer.name); // state change
              window.postMessage(["toggleLayerVisibility", layer.name]); // map change
            }}
            zoom={zoom}
            // Style
            iconColor={iconColor}
            theme={theme}
            tabPaperWidth={tabPaperWidth}
            // Filter layers
            updateFilterLayer={updateFilterLayer}
            setFilterMenu={setFilterMenu}
            setColorPicker={setColorPicker}
            colorPicker={colorPicker}
            setFilterOpen={setFilterOpen}
            openedFilters={openedFilters}
          />
        ))}
    </div>
  );
};

LayersLegend.propTypes = {
  // Import layers
  setColorPicker: PropTypes.func.isRequired,
  colorPicker: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
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
  openedFilters: PropTypes.array.isRequired,
  setFilterOpen: PropTypes.func.isRequired,
  tabPaperWidth: PropTypes.number.isRequired,
  // Map
  zoom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  getFeature: PropTypes.func.isRequired,
  setFilterMenu: PropTypes.func.isRequired,
};

export default LayersLegend;
