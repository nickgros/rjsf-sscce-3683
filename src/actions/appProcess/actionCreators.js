import appProcessTypes from "src/actions/appProcess/actionTypes";

const appProcessActions = {
  // UX ACTIONS........................................
  setUserLog(bool) {
    return { type: appProcessTypes.SET_USER_LOG, bool };
  },

  setOverlayOpen(bool) {
    return { type: appProcessTypes.SET_OVERLAY_OPEN, bool };
  },

  setActionComplete(bool) {
    return { type: appProcessTypes.SET_ACTION_COMPLETE, bool };
  },

  setSnackbar(alertType, positionY, message, isOpen) {
    return {
      type: appProcessTypes.SET_SNACKBAR,
      alertType,
      positionY,
      message,
      isOpen,
    };
  },

  // WINDOWS HANDLERS........................................
  handleWindowOpen(editAction, windowCode) {
    return {
      type: appProcessTypes.HANDLE_WINDOW_OPEN,
      editAction,
      windowCode,
    };
  },

  handleWindowChildren(editAction, window) {
    return {
      type: appProcessTypes.HANDLE_WINDOW_CHILDREN,
      editAction,
      window,
    };
  },

  // LAYERS FORM........................................
  setOpen(id) {
    return { type: appProcessTypes.SET_OPEN, id };
  },

  setReadOnly(bool) {
    return { type: appProcessTypes.SET_READ_ONLY, bool };
  },

  getEmprises() {
    return { type: appProcessTypes.GET_EMPRISES };
  },
  storeEmprises(emprises) {
    return { type: appProcessTypes.STORE_EMPRISES, emprises };
  },

  updateForm(formName, form) {
    return { type: appProcessTypes.UPDATE_FORM, formName, form };
  },

  // OBJECT HANDLERS (add/delete)........................................
  addNewObject(objectType, insertObject) {
    return {
      type: appProcessTypes.ADD_NEW_OBJECT,
      objectType,
      insertObject,
    };
  },
  handleDelete(objectType, objCode, objId) {
    return {
      type: appProcessTypes.HANDLE_DELETE,
      objectType,
      objCode,
      objId,
    };
  },
  getFeature(objType, attribute, value, operator) {
    return {
      type: appProcessTypes.GET_FEATURE,
      objType,
      attribute,
      value,
      operator,
    };
  },

  getConfigsByType(objType) {
    return { type: appProcessTypes.GET_CONFIGS_BY_TYPE, objType };
  },

  storeConfigsByType(objType, configs) {
    return { type: appProcessTypes.STORE_CONFIGS_BY_TYPE, objType, configs };
  },

  // SQL requests........................................
  getSQLResult(table, attributes, message, page, rowsPerPage, offset, order) {
    return {
      type: appProcessTypes.GET_SQL_RESULT,
      table,
      attributes,
      message,
      page,
      rowsPerPage,
      offset,
      order,
    };
  },
  storeSQLResult(result, request, pages) {
    return {
      type: appProcessTypes.STORE_SQL_RESULT,
      result,
      request,
      pages,
    };
  },

  storeSQLRequest(request) {
    return { type: appProcessTypes.STORE_SQL_REQUEST, request };
  },

  setSQLPages(pages) {
    return {
      type: appProcessTypes.SET_SQL_PAGES,
      pages,
    };
  },

  // Speed dial controls...........;
  setControls(controlName, bool) {
    return {
      type: appProcessTypes.SET_CONTROLS,
      controlName,
      bool,
    };
  },

  // Models requests...........;
  addNewModel(objectType, insertObject) {
    return {
      type: appProcessTypes.ADD_NEW_MODEL,
      objectType,
      insertObject,
    };
  },
  handleModelDelete(objectType, objId) {
    return {
      type: appProcessTypes.HANDLE_MODEL_DELETE,
      objectType,
      objId,
    };
  },
  updateModelForm(formName, form) {
    return {
      type: appProcessTypes.UPDATE_MODEL_FORM,
      formName,
      form,
    };
  },

  // DropDownList requests...........;
  updateDropDown(table, field, old_value, new_value) {
    return {
      type: appProcessTypes.UPDATE_DROPDOWN,
      table,
      field,
      old_value,
      new_value,
    };
  },
  addDataDropDown(table, field, value) {
    return {
      type: appProcessTypes.ADD_DATA_DROPDOWN,
      table,
      field,
      value,
    };
  },
  deleteDataDropDown(table, field, value) {
    return {
      type: appProcessTypes.DELETE_DATA_DROPDOWN,
      table,
      field,
      value,
    };
  },

  // Tags assignment...................;
  getFeaturesTags(currentDomain) {
    return { type: appProcessTypes.GET_FEATURES_TAGS, currentDomain };
  },
  addFeaturesTag(currentDomain, featuresObj) {
    return {
      type: appProcessTypes.ADD_FEATURES_TAG,
      currentDomain,
      featuresObj,
    };
  },
  removeFeaturesTag(currentDomain, featuresObj) {
    return {
      type: appProcessTypes.REMOVE_FEATURES_TAG,
      currentDomain,
      featuresObj,
    };
  },

  getLayerModel(layerType) {
    return { type: appProcessTypes.GET_LAYER_MODEL, layerType };
  },

  sendExternalLayer(layerType, layerFile) {
    return { type: appProcessTypes.SEND_EXTERNAL_LAYER, layerType, layerFile };
  },

  // Settings.........................;
  getInitialSettings(setting) {
    return { type: appProcessTypes.GET_INITIAL_SETTINGS, setting };
  },

  // Task manager.......................;
  getDatesList(author, selector) {
    return { type: appProcessTypes.GET_DATES_LIST, author, selector };
  },
  getTasksFromDate(author, date) {
    return {
      type: appProcessTypes.GET_TASKS_FROM_DATE,
      author,
      date,
    };
  },
  getTaskStatus(taskUuid) {
    return {
      type: appProcessTypes.GET_TASK_STATUS,
      taskUuid,
    };
  },
};

export default appProcessActions;
