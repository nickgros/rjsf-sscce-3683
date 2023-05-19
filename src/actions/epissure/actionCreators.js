import epissureTypes from "src/actions/epissure/actionTypes";

const epissureActions = {
  // STEPPER.............................
  setEmplacement(emplacement) {
    return { type: epissureTypes.SET_EMPLACEMENT, emplacement };
  },

  resetEmplacement() {
    return { type: epissureTypes.RESET_EMPLACEMENT };
  },

  setEpissureCable(value) {
    return { type: epissureTypes.SET_EPISSURE_CABLE, value };
  },

  // GET DATA.............................
  getCAffectInfos(objType, objId) {
    return { type: epissureTypes.GET_C_AFFECT_INFOS, objType, objId };
  },

  getCAffectData(objType, objId) {
    return { type: epissureTypes.GET_C_AFFECT_DATA, objType, objId };
  },

  getCAffectCablesData(objType, objId) {
    return { type: epissureTypes.GET_C_AFFECT_CABLES_DATA, objType, objId };
  },

  // STORE DATA.............................
  storeCAffectInfos(cAffectInfos) {
    return { type: epissureTypes.STORE_C_AFFECT_INFOS, cAffectInfos };
  },

  storeCAffectData(cAffectData) {
    return { type: epissureTypes.STORE_C_AFFECT_DATA, cAffectData };
  },

  storeCAffectCablesData(cAffectCablesData) {
    return {
      type: epissureTypes.STORE_C_AFFECT_CABLES_DATA,
      cAffectCablesData,
    };
  },

  storeAttributionsByCable(cableCode, attributionsByCable) {
    return {
      type: epissureTypes.STORE_ATTRIBUTIONS_BY_CABLE,
      cableCode,
      attributionsByCable,
    };
  },

  // SET DATA.............................
  setCheck(fibre) {
    return {
      type: epissureTypes.SET_CHECK,
      fibre,
    };
  },

  setUncheck(no_tube) {
    return { type: epissureTypes.SET_UNCHECK, no_tube };
  },

  setTubeCheck(tubeId) {
    return { type: epissureTypes.SET_TUBE_CHECK, tubeId };
  },

  setNewCAffectData(rowsIds) {
    return { type: epissureTypes.SET_POSITION_FIBRES, rowsIds };
  },

  setSnackbar(alertType, positionY, message, isOpen) {
    return {
      type: epissureTypes.SET_EPISSURE_SNACKBAR,
      alertType,
      positionY,
      message,
      isOpen,
    };
  },

  // SAVE DATA.............................
  saveCAffect(objType, objId) {
    return { type: epissureTypes.SAVE_C_AFFECT, objType, objId };
  },

  setEpissureActionComplete(bool) {
    return { type: epissureTypes.SAVE_EPISSURE_ACTION_COMPLETE, bool };
  },

  // ................Edit MultiLevel menu actions................
  freeLineFull(rowsIds) {
    return { type: epissureTypes.FREE_LINE_FULL, rowsIds };
  },

  freeLineLeft(rowsIds) {
    return { type: epissureTypes.FREE_LINE_LEFT, rowsIds };
  },

  freeLineRight(rowsIds) {
    return { type: epissureTypes.FREE_LINE_RIGHT, rowsIds };
  },

  etatEpissuree(rowsIds) {
    return { type: epissureTypes.ETAT_EPISSUREE, rowsIds };
  },

  etatPassage(rowsIds) {
    return { type: epissureTypes.ETAT_PASSAGE, rowsIds };
  },
};

export default epissureActions;
