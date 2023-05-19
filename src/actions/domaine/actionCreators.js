import domaineTypes from "src/actions/domaine/actionTypes";

const domaineActions = {
  getDomaine(gid) {
    return { type: domaineTypes.GET_DOMAINE, gid };
  },

  storeDomaine(domaine) {
    return { type: domaineTypes.STORE_DOMAINE, domaine };
  },

  handleDomaineChange(element, name, value) {
    return { type: domaineTypes.HANDLE_DOMAINE_CHANGE, element, name, value };
  },

  storeFeaturesTags(featuresTags) {
    return { type: domaineTypes.STORE_FEATURES_TAGS, featuresTags };
  },

  setTagMode(mode) {
    return { type: domaineTypes.SET_TAG_MODE, mode };
  },

  setActionTab(tab) {
    return { type: domaineTypes.SET_ACTION_TAB, tab };
  },
};

export default domaineActions;
