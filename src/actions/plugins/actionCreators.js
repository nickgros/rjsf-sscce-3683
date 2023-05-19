import pluginsTypes from "src/actions/plugins/actionTypes";

const pluginsActions = {
  //Plugins Requests
  setDisabled(id) {
    return { type: pluginsTypes.SET_DISABLED, id };
  },
  getMaterialReference(objType) {
    return {
      type: pluginsTypes.GET_MATERIAL_REFERENCE,
      objType,
    };
  },
  storeMaterialReferenceBpe(objType, referenceBpe) {
    return {
      type: pluginsTypes.STORE_MATERIAL_REFERENCE_BPE,
      objType,
      referenceBpe,
    };
  },
  storeMaterialReferenceCable(objType, referenceCable) {
    return {
      type: pluginsTypes.STORE_MATERIAL_REFERENCE_CABLE,
      objType,
      referenceCable,
    };
  },
  getProcessPlugins(process, identifier, responseStatus) {
    return {
      type: pluginsTypes.GET_PROCESS_PLUGINS,
      process,
      identifier,
      responseStatus,
    };
  },
  postProcessPlugins(process, formData) {
    return {
      type: pluginsTypes.POST_PROCESS_PLUGINS,
      process,
      formData,
    };
  },
};

export default pluginsActions;
