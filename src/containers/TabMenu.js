import { connect } from "react-redux";
import TabMenu from "src/components/TabMenu";

// Action Creators
import mapActions from "src/actions/map/actionCreators";
import geometrieActions from "src/actions/geometrie/actionCreators";
import appProcessActions from "src/actions/appProcess/actionCreators";
import pluginsActions from "../actions/plugins/actionCreators";

const mapStateToProps = ({
  mapReducer,
  pluginsReducer,
  appProcessReducer,
}) => ({
  // Map
  layers: mapReducer.layers,
  zoom: mapReducer.zoom,
  openedFilters: mapReducer.openedFilters,
  importLayers: mapReducer.importLayers,

  //AppProcess
  open: appProcessReducer.open,

  //Plugins
  referenceCable: pluginsReducer.referenceCable,
  referenceBpe: pluginsReducer.referenceBpe,
  identifier: pluginsReducer.identifier,
  disabled: pluginsReducer.disabled,
  responseStatus: pluginsReducer.responseStatus,
  process: pluginsReducer.process,
});

const mapDispatchToProps = (dispatch) => ({
  // ................Map................
  toggleLayerVisibility: (name) => {
    dispatch(mapActions.toggleLayerVisibility(name));
  },

  updateFilterLayer: (parentName, filterName, attribute, newValue) => {
    dispatch(
      mapActions.updateFilterLayer(parentName, filterName, attribute, newValue)
    );
  },

  deleteFilterLayer: (parentName, filterName) => {
    dispatch(mapActions.deleteFilterLayer(parentName, filterName));
  },

  setFilterOpen: (filterName) => {
    dispatch(mapActions.setFilterOpen(filterName));
  },

  updateLayer: (name, prop, newValue) => {
    dispatch(mapActions.updateLayer(name, prop, newValue));
  },

  // Import Layers
  createImportLayer: (
    fileName,
    style,
    nbFeatures,
    proj,
    featureType,
    zIndex
  ) => {
    dispatch(
      mapActions.createImportLayer(
        fileName,
        style,
        nbFeatures,
        proj,
        featureType,
        zIndex
      )
    );
  },

  updateImportLayer: (fileName, prop, newValue) => {
    dispatch(mapActions.updateImportLayer(fileName, prop, newValue));
  },

  deleteImportLayer: (fileName) => {
    dispatch(mapActions.deleteImportLayer(fileName));
  },

  // ................AppProcess................
  getFeature: (objType, attribute, value) => {
    return dispatch(appProcessActions.getFeature(objType, attribute, value));
  },

  getLayerModel: (layerType) => {
    return dispatch(appProcessActions.getLayerModel(layerType));
  },

  sendExternalLayer: (layerType, layerFile) => {
    return dispatch(appProcessActions.sendExternalLayer(layerType, layerFile));
  },

  getDatesList: (author, selector) => {
    return dispatch(appProcessActions.getDatesList(author, selector));
  },

  getTasksFromDate: (author, date) => {
    return dispatch(appProcessActions.getTasksFromDate(author, date));
  },

  setSnackbar: (alertType, positionY, message, isOpen) => {
    dispatch(
      appProcessActions.setSnackbar(alertType, positionY, message, isOpen)
    );
  },
  setOpen: (id) => {
    dispatch(appProcessActions.setOpen(id));
  },

  // ................Geometry................
  setDrawParams: (objType, objCat, createMode) => {
    dispatch(geometrieActions.setDrawParams(objType, objCat, createMode));
  },

  // ................Plugins................
  setDisabled(id) {
    return dispatch(pluginsActions.setDisabled(id));
  },
  getMaterialReference: (objType) => {
    return dispatch(pluginsActions.getMaterialReference(objType));
  },
  storeMaterialReferenceBpe: (objType, referenceBpe) => {
    return dispatch(
      pluginsActions.storeMaterialReferenceBpe(objType, referenceBpe)
    );
  },
  storeMaterialReferenceCable: (objType, referenceCable) => {
    return dispatch(
      pluginsActions.storeMaterialReferenceCable(objType, referenceCable)
    );
  },
  getProcessPlugins(process, identifier, responseStatus) {
    return dispatch(
      pluginsActions.getProcessPlugins(process, identifier, responseStatus)
    );
  },
  postProcessPlugins(process, data) {
    return dispatch(pluginsActions.postProcessPlugins(process, data));
  },
});

const TabMenuContainer = connect(mapStateToProps, mapDispatchToProps)(TabMenu);

export default TabMenuContainer;
