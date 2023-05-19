import siteTypes from "src/actions/site/actionTypes";

const siteActions = {
  // INSERT / DELETE SITE OBJECT.............................
  deleteSiteObject(currentFormName, open) {
    return { type: siteTypes.DELETE_SITE_OBJECT, currentFormName, open };
  },

  insertSiteObject(insertObject, parentObj) {
    return { type: siteTypes.INSERT_SITE_OBJECT, insertObject, parentObj };
  },

  // GET DATA.............................
  getSite(gid) {
    return { type: siteTypes.GET_SITE, gid };
  },

  getLocals(gid) {
    return { type: siteTypes.GET_LOCALS, gid };
  },

  getArmoires(idLocal) {
    return { type: siteTypes.GET_ARMOIRES, idLocal };
  },

  getLocalBpes(idLocal) {
    return { type: siteTypes.GET_BPES, idLocal };
  },

  getEquipements(idArmoire, idLocal) {
    return {
      type: siteTypes.GET_EQUIPEMENTS,
      idArmoire,
      idLocal,
    };
  },

  getCassettes(objType, objId, idLocal, idArmoire) {
    return {
      type: siteTypes.GET_CASSETTES,
      objType,
      objId,
      idLocal,
      idArmoire,
    };
  },

  // STORE DATA.............................
  storeSite(site) {
    return { type: siteTypes.STORE_SITE, site };
  },

  storeLocals(locals) {
    return { type: siteTypes.STORE_LOCALS, locals };
  },

  storeArmoires(armoires, idLocal) {
    return { type: siteTypes.STORE_ARMOIRES, armoires, idLocal };
  },

  storeBpes(bpes, idLocal) {
    return { type: siteTypes.STORE_BPES, bpes, idLocal };
  },

  storeEquipements(equipements, idArmoire, idLocal) {
    return {
      type: siteTypes.STORE_EQUIPEMENTS,
      equipements,
      idArmoire,
      idLocal,
    };
  },

  storeCassettes(cassettes, objType, objId, idLocal, idArmoire) {
    return {
      type: siteTypes.STORE_CASSETTES,
      cassettes,
      objType,
      objId,
      idLocal,
      idArmoire,
    };
  },

  // ORIGINE / EXTREMITE.............................
  deleteLocalOrigineExtremite() {
    return { type: siteTypes.DELETE_LOCAL_ORIGINE_EXTREMITE };
  },

  deletePttOrigineExtremite() {
    return { type: siteTypes.DELETE_PTT_ORIGINE_EXTREMITE };
  },

  // OTHER ACTIONS.............................
  setLocalCheck(idLocal) {
    return { type: siteTypes.SET_LOCAL_CHECK, idLocal };
  },

  handleSiteChange(element, name, value) {
    return { type: siteTypes.HANDLE_SITE_CHANGE, element, name, value };
  },
};

export default siteActions;
