import dropDownListTypes from "../dropDownList/actionTypes";

const dropDownListActions = {
  setItemSelect(itemSelect) {
    return {
      type: dropDownListTypes.SET_ITEM_SELECT,
      itemSelect,
    };
  },

  setSecondItemSelect(secondItemSelect) {
    return {
      type: dropDownListTypes.SET_SECOND_ITEM_SELECT,
      secondItemSelect,
    };
  },
};

export default dropDownListActions;
