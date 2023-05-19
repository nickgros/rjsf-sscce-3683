import geometrieTypes from "src/actions/geometrie/actionTypes";

const geometrieActions = {
  storeSelectedFeatures(features) {
    return { type: geometrieTypes.STORE_SELECTED_FEATURES, features };
  },

  setDrawParams(objType, objCat, createMode) {
    return {
      type: geometrieTypes.SET_DRAW_PARAMS,
      objType,
      objCat,
      createMode,
    };
  },

  resetDrawParams() {
    return { type: geometrieTypes.RESET_DRAW_PARAMS };
  },

  storeEditGeom(editAction, feature) {
    return { type: geometrieTypes.STORE_EDIT_GEOM, editAction, feature };
  },

  storeRelationsFeatures(features) {
    return { type: geometrieTypes.STORE_RELATIONS_FEATURES, features };
  },

  saveNewGeometry(feature) {
    return { type: geometrieTypes.SAVE_NEW_GEOMETRY, feature };
  },

  setSuiviGeomCoords(newCoords) {
    return { type: geometrieTypes.SET_SUIVI_GEOM_COORDS, newCoords };
  },
};

export default geometrieActions;
