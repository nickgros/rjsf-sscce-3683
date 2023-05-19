import supportTypes from "src/actions/support/actionTypes";

const supportActions = {
  getSupport(gid) {
    return { type: supportTypes.GET_SUPPORT, gid };
  },

  getGroupes(gid) {
    return { type: supportTypes.GET_GROUPES, gid };
  },

  getInfras(idGroupe) {
    return { type: supportTypes.GET_INFRAS, idGroupe };
  },

  storeSupport(support) {
    return { type: supportTypes.STORE_SUPPORT, support };
  },

  storeGroupes(groupes) {
    return { type: supportTypes.STORE_GROUPES, groupes };
  },

  storeInfras(infras, idGroupe) {
    return { type: supportTypes.STORE_INFRAS, infras, idGroupe };
  },

  setGroupeCheck(idGroupe) {
    return { type: supportTypes.SET_GROUPE_CHECK, idGroupe };
  },

  insertSupportObject(insertObject, parentObj) {
    return {
      type: supportTypes.INSERT_SUPPORT_OBJECT,
      insertObject,
      parentObj,
    };
  },

  deleteSupportObject(currentFormName, open) {
    return { type: supportTypes.DELETE_SUPPORT_OBJECT, currentFormName, open };
  },

  handleSupportChange(element, name, value) {
    return { type: supportTypes.HANDLE_SUPPORT_CHANGE, element, name, value };
  },

  deleteGroupeOrigineExtremite(
    windowType,
    openedObjectType,
    openedObjectId,
    fullIdSe
  ) {
    return {
      type: supportTypes.DELETE_GROUPE_ORIGINE_EXTREMITE,
      windowType,
      openedObjectType,
      openedObjectId,
      fullIdSe,
    };
  },
};

export default supportActions;
