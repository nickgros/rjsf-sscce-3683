import relationsTypes from "src/actions/relations/actionTypes";

const relationsActions = {
  // RELATIONS..........................
  setSource(source) {
    return { type: relationsTypes.SET_SOURCE, source };
  },

  storeMultiLineSelect(code) {
    return { type: relationsTypes.STORE_MULTI_LINE_SELECT, code };
  },

  // CABLE..........................
  getRCables(objectType, objectId) {
    return { type: relationsTypes.GET_R_CABLES, objectType, objectId };
  },

  storeRCables(cables, objType, objId) {
    return { type: relationsTypes.STORE_R_CABLES, cables, objType, objId };
  },

  getRelationsCable(objectId) {
    return { type: relationsTypes.GET_RELATIONS_CABLE, objectId };
  },

  storePassages(passages) {
    return { type: relationsTypes.STORE_PASSAGES, passages };
  },

  // GROUPE..........................
  getRGroupes(objectType, objectId) {
    return { type: relationsTypes.GET_R_GROUPES, objectType, objectId };
  },

  storeRGroupes(groupes, objType, objId) {
    return { type: relationsTypes.STORE_R_GROUPES, groupes, objType, objId };
  },

  // INFRA..........................
  getRInfras(objectType, objectId) {
    return { type: relationsTypes.GET_R_INFRAS, objectType, objectId };
  },

  storeRInfras(infras, objType, objId) {
    return { type: relationsTypes.STORE_R_INFRAS, infras, objType, objId };
  },

  // ORIGINE EXTREMITE..........................
  getOrigineGroupe(openId, objType, objId) {
    return { type: relationsTypes.GET_ORIGINE_GROUPE, openId, objType, objId };
  },

  getExtremiteGroupe(openId, objType, objId) {
    return {
      type: relationsTypes.GET_EXTREMITE_GROUPE,
      openId,
      objType,
      objId,
    };
  },

  storeOrigineCable(objType, objProps) {
    return { type: relationsTypes.STORE_ORIGINE_CABLE, objType, objProps };
  },

  storeExtremiteCable(objType, objProps) {
    return { type: relationsTypes.STORE_EXTREMITE_CABLE, objType, objProps };
  },

  storeOrigineGroupe(idGroupe, objType, objProps) {
    return {
      type: relationsTypes.STORE_ORIGINE_GROUPE,
      idGroupe,
      objType,
      objProps,
    };
  },

  storeExtremiteGroupe(idGroupe, objType, objProps) {
    return {
      type: relationsTypes.STORE_EXTREMITE_GROUPE,
      idGroupe,
      objType,
      objProps,
    };
  },

  storeNdiChoices(ndiChoices) {
    return { type: relationsTypes.STORE_NDI_CHOICES, ndiChoices };
  },

  // CREATE..........................
  createRInfra(cableUuid, infraUuid, infra, windowType) {
    return {
      type: relationsTypes.CREATE_R_INFRA,
      cableUuid,
      infraUuid,
      infra,
      windowType,
    };
  },

  createRNds(cableUuid, ndsType, ndsUuid, category, lovage, ndsObj) {
    return {
      type: relationsTypes.CREATE_R_NDS,
      cableUuid,
      ndsType,
      ndsUuid,
      category,
      lovage,
      ndsObj,
    };
  },

  createRNdi(cableUuid, ndiType, ndiUuid, category, ndiObj) {
    return {
      type: relationsTypes.CREATE_R_NDI,
      cableUuid,
      ndiType,
      ndiUuid,
      category,
      ndiObj,
    };
  },

  updateLovage(openType, openId, openUuid, cableUuid, cableCode, lovage) {
    return {
      type: relationsTypes.UPDATE_LOVAGE,
      openType,
      openId,
      openUuid,
      cableUuid,
      cableCode,
      lovage,
    };
  },

  storeNewLovage(openType, openId, cableCode, lovage) {
    return {
      type: relationsTypes.STORE_NEW_LOVAGE,
      openType,
      openId,
      cableCode,
      lovage,
    };
  },

  // DELETE..........................
  deleteRelation(relationIndex, fileType, openObject) {
    return {
      type: relationsTypes.DELETE_RELATION,
      relationIndex,
      fileType,
      openObject,
    };
  },

  deleteOrigineExtremite(source, objType) {
    return { type: relationsTypes.DELETE_ORIGINE_EXTREMITE, source, objType };
  },

  deleteGroupeOERelations(idGroupe, source, objType) {
    return {
      type: relationsTypes.DELETE_GROUPE_OE_RELATIONS,
      idGroupe,
      source,
      objType,
    };
  },

  deleteLocalOrigineExtremite() {
    return {
      type: relationsTypes.DELETE_LOCAL_ORIGINE_EXTREMITE,
    };
  },

  deletePttOrigineExtremite() {
    return {
      type: relationsTypes.DELETE_PTT_ORIGINE_EXTREMITE,
    };
  },
};

export default relationsActions;
