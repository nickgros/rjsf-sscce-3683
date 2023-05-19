import modelTypes from "src/actions/model/actionTypes";

const modelActions = {
  getModelByType(objType) {
    return { type: modelTypes.GET_MODEL_BY_TYPE, objType };
  },

  storeModelByType(models, objType) {
    return { type: modelTypes.STORE_MODEL_BY_TYPE, models, objType };
  },

  handleModelChange(element, name, value) {
    return { type: modelTypes.HANDLE_MODEL_CHANGE, element, name, value };
  },

  setEquipment(objType) {
    return { type: modelTypes.SET_EQUIPMENT, objType };
  },

  setDialogOpen(mode) {
    return { type: modelTypes.SET_DIALOG_OPEN, mode };
  },
};

export default modelActions;
