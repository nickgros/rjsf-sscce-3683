import ptTechTypes from "src/actions/ptTech/actionTypes";

const ptTechActions = {
  getPtTech(gid) {
    return { type: ptTechTypes.GET_PTT_TECH, gid };
  },

  getBpes(gid) {
    return { type: ptTechTypes.GET_PTT_BPES, gid };
  },

  getCassettes(idBpe) {
    return { type: ptTechTypes.GET_PTT_CASSETTES, idBpe };
  },

  storePtTech(ptTech) {
    return { type: ptTechTypes.STORE_PTT_TECH, ptTech };
  },

  storeBpes(bpes) {
    return { type: ptTechTypes.STORE_PTT_BPES, bpes };
  },

  storeCassettes(cassettes, idBpe) {
    return { type: ptTechTypes.STORE_PTT_CASSETTES, cassettes, idBpe };
  },

  setBpeCheck(idBpe) {
    return { type: ptTechTypes.SET_BPE_CHECK, idBpe };
  },

  deletePtTechObject(currentFormName, open) {
    return { type: ptTechTypes.DELETE_PTT_OBJECT, currentFormName, open };
  },

  insertPtTechObject(insertObject, parentObj) {
    return { type: ptTechTypes.INSERT_PTT_OBJECT, insertObject, parentObj };
  },

  handlePttChange(element, name, value) {
    return { type: ptTechTypes.HANDLE_PTT_CHANGE, element, name, value };
  },
};

export default ptTechActions;
