import mapTypes from "src/actions/map/actionTypes";

const mapActions = {
  toggleLayerVisibility(name) {
    return { type: mapTypes.TOGGLE_LAYER_VISIBILITY, name };
  },

  getProjectionFromEPSGIO() {
    return { type: mapTypes.GET_PROJECTION_FROM_EPSG_IO };
  },

  updateMapPosition(zoom, lng, lat, projection) {
    return { type: mapTypes.UPDATE_MAP_POSITION, zoom, lng, lat, projection };
  },

  setInitalInteractions(interactions) {
    return { type: mapTypes.SET_INITAL_INTERACTIONS, interactions };
  },

  // Main layers.............................
  createLayer(name, isVisible) {
    return { type: mapTypes.CREATE_LAYER, name, isVisible };
  },

  updateLayer(name, prop, newValue) {
    return { type: mapTypes.UPDATE_LAYER, name, prop, newValue };
  },

  updateLayers(layers) {
    return { type: mapTypes.UPDATE_LAYERS, layers };
  },

  // Filter layers.............................

  createFirstFilters(topParentName, filtersArr) {
    return {
      type: mapTypes.CREATE_FIRST_FILTERS,
      topParentName,
      filtersArr,
    };
  },

  createFilterLayer(topParentName, directParentName, filterProps) {
    return {
      type: mapTypes.CREATE_FILTER_LAYER,
      topParentName,
      directParentName,
      filterProps,
    };
  },

  updateFilterLayer(topParentName, filterName, attribute, newValue) {
    return {
      type: mapTypes.UPDATE_FILTER_LAYER,
      topParentName,
      filterName,
      attribute,
      newValue,
    };
  },

  deleteFilterLayer(topParentName, filterName) {
    return {
      type: mapTypes.DELETE_FILTER_LAYER,
      topParentName,
      filterName,
    };
  },

  setFilterOpen(filterName) {
    return { type: mapTypes.SET_FILTER_OPEN, filterName };
  },

  // Import layers.............................
  createImportLayer(
    fileName,
    style,
    nbFeatures,
    proj,
    featureType,
    coords,
    zIndex
  ) {
    return {
      type: mapTypes.CREATE_IMPORT_LAYER,
      fileName,
      style,
      nbFeatures,
      proj,
      featureType,
      coords,
      zIndex,
    };
  },

  updateImportLayer(fileName, prop, newValue) {
    return { type: mapTypes.UPDATE_IMPORT_LAYER, fileName, prop, newValue };
  },

  deleteImportLayer(fileName) {
    return { type: mapTypes.DELETE_IMPORT_LAYER, fileName };
  },
};

export default mapActions;
