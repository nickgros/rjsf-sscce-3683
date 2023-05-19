const mapTypes = {
  TOGGLE_LAYER_VISIBILITY: "TOGGLE_LAYER_VISIBILITY",

  GET_PROJECTION_FROM_EPSG_IO: "GET_PROJECTION_FROM_EPSG_IO",
  STORE_PROJECTION_FROM_EPSG_IO: "STORE_PROJECTION_FROM_EPSG_IO",

  UPDATE_MAP_POSITION: "UPDATE_MAP_POSITION",

  CREATE_LAYER: "CREATE_LAYER",
  UPDATE_LAYER: "UPDATE_LAYER",
  UPDATE_LAYERS: "UPDATE_LAYERS",
  DELETE_LAYER_GROUP: "DELETE_LAYER_GROUP",

  CREATE_FIRST_FILTERS: "CREATE_FIRST_FILTERS",
  UPDATE_FIRST_FILTERS: "UPDATE_FIRST_FILTERS",
  RESTORE_FIRST_FILTERS: "RESTORE_FIRST_FILTERS",

  CREATE_FILTER_LAYER: "CREATE_FILTER_LAYER",
  UPDATE_FILTER_LAYER: "UPDATE_FILTER_LAYER",
  DELETE_FILTER_LAYER: "DELETE_FILTER_LAYER",

  SET_INITAL_INTERACTIONS: "SET_INITAL_INTERACTIONS",

  CREATE_IMPORT_LAYER: "CREATE_IMPORT_LAYER",
  UPDATE_IMPORT_LAYER: "UPDATE_IMPORT_LAYER",
  DELETE_IMPORT_LAYER: "DELETE_IMPORT_LAYER",

  SET_FILTER_OPEN: "SET_FILTER_OPEN",
};

export default mapTypes;
