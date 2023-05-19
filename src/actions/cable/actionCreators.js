import cableTypes from "src/actions/cable/actionTypes";

const cableActions = {
  getCable(gid) {
    return { type: cableTypes.GET_CABLE, gid };
  },

  storeCable(cable) {
    return { type: cableTypes.STORE_CABLE, cable };
  },

  getTubes(gid) {
    return { type: cableTypes.GET_TUBES, gid };
  },

  storeTubes(tubes) {
    return { type: cableTypes.STORE_TUBES, tubes };
  },

  getFibres(tubeId, tubeCheckId) {
    return { type: cableTypes.GET_FIBRES, tubeId, tubeCheckId };
  },

  storeFibres(fibres, tubeId) {
    return { type: cableTypes.STORE_FIBRES, fibres, tubeId };
  },

  setFibreHS(fibre, bool) {
    return { type: cableTypes.SET_FIBRE_HS, fibre, bool };
  },

  setTubeCheck(tubeId) {
    return { type: cableTypes.SET_TUBE_CHECK, tubeId };
  },

  insertCableObject(insertObject, parentObj) {
    return { type: cableTypes.INSERT_CABLE_OBJECT, insertObject, parentObj };
  },

  deleteCableObject(currentFormName, open) {
    return { type: cableTypes.DELETE_CABLE_OBJECT, currentFormName, open };
  },

  handleCableChange(element, name, value) {
    return { type: cableTypes.HANDLE_CABLE_CHANGE, element, name, value };
  },
};

export default cableActions;
