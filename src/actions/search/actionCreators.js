import searchTypes from "src/actions/search/actionTypes";

const searchActions = {
  storeResultCoords(locationType, coords) {
    return { type: searchTypes.STORE_RESULT_COORDS, locationType, coords };
  },
};

export default searchActions;
