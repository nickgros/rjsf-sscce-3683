//Types
import pluginsTypes from "src/actions/plugins/actionTypes";

//Initial State
export const initialState = {
  referenceBpe: {},
  referenceCable: {},
  objType: "",
  identifier: null,
  disabled: false,
  responseStatus: null,
  process: null,
};

//Reducer
const PluginsReducer = (state = initialState, action) => {
  switch (action.type) {
    case pluginsTypes.SET_DISABLED:
      return {
        ...state,
        disabled: action.id,
      };
    case pluginsTypes.GET_MATERIAL_REFERENCE:
      return {
        ...state,
        objType: action.objType,
      };
    case pluginsTypes.STORE_MATERIAL_REFERENCE_BPE:
      return {
        ...state,
        objType: action.objType,
        referenceBpe: action.referenceBpe,
      };
    case pluginsTypes.STORE_MATERIAL_REFERENCE_CABLE:
      return {
        ...state,
        objType: action.objType,
        referenceCable: action.referenceCable,
      };
    case pluginsTypes.GET_PROCESS_PLUGINS:
      return {
        ...state,
        process: action.process,
        identifier: action.identifier,
        responseStatus: action.responseStatus,
      };
    case pluginsTypes.POST_PROCESS_PLUGINS:
      return {
        process: action.process,
        data: action.data,
      };
    default:
      return state;
  }
};
export default PluginsReducer;
