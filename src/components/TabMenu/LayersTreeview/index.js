console.dev("LayersTreeview");

import PropTypes from "prop-types";

// MUI components
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";

// MUI Icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { oneOfLayers } from "src/utils/GenericFunctions";

// Generic BugerMenu components
import ParentLayerTreeItem from "src/components/TabMenu/LayersTreeview/ParentLayerTreeItem";
import FilterTreeItem from "src/components/TabMenu/LayersTreeview/FilterTreeItem";

const LayersTreeview = ({
  // Create new object handler
  setDrawParams,
  // Main Layers
  layerName,
  updateLayer,
  layers,
  loaders,
  isVisible,
  toggleVisibility,
  zoom,
  // Style
  iconColor,
  theme,
  tabPaperWidth,
  // Filter layers
  updateFilterLayer,
  setFilterMenu,
  setColorPicker,
  colorPicker,
  setFilterOpen,
  openedFilters,
}) => {
  /**
   * Show / hide filter layer recursively
   * @param {object} filter current object from mapReducer.layers
   * @param {boolean} isVisible new visibility to apply
   */
  const filterLayerVisibility = (filter, isVisible) => {
    updateFilterLayer(layerName, filter.name, "isVisible", isVisible);

    if (!Array.isEmpty(filter.filters)) {
      filter.filters
        .filter((f) => (isVisible ? !f.name.includes("other") : f))
        .map((childFilter) => {
          // update action on map (Ilion)
          window.postMessage([
            "toggleFilterLayer",
            layerName,
            childFilter.name,
            isVisible,
          ]);
          updateFilterLayer(
            layerName,
            childFilter.name,
            "isVisible",
            isVisible
          );

          filterLayerVisibility(childFilter, isVisible);
        });
    } else {
      // update action on map (Ilion)
      window.postMessage([
        "toggleFilterLayer",
        layerName,
        filter.name,
        isVisible,
      ]);
    }
  };

  /**
   * Switch from right to bottom arrow on open / close treeview element
   * @param {Event} event onClick event from any item holded by MUI <Treeview> component
   */
  const toggleArrow = (event) => {
    let nodeName =
      event.target.parentElement.parentElement.innerText || // from <svg>
      event.target.parentElement.parentElement.parentElement.innerText; // From <path>

    nodeName !== "" && setFilterOpen(nodeName);
  };

  /**
   * Treeview builder based on recursive objects from mapReducer.layers[layerName]
   * @param {object} item mapReducer.layers[layerName]
   * @returns {JSX.Element} JSX elements based on passed item props
   */
  const renderTree = (item) => {
    // ...............PARENT TREE ITEM...............
    if (oneOfLayers(item.name)) {
      return (
        <TreeView
          // className used by sortableJS in TabMenu.js
          key={item.name}
          className={"layerToDnd"}
          expanded={openedFilters}
          defaultCollapseIcon={
            <ExpandMoreIcon
              color="disabled"
              onClick={() => setFilterOpen(layerName)}
            />
          }
          defaultExpandIcon={
            <ChevronRightIcon
              color="disabled"
              onClick={() => setFilterOpen(layerName)}
            />
          }
          disableSelection
        >
          <TreeItem
            key={item.name}
            nodeId={item.name}
            onLabelClick={(event) => event.preventDefault()}
            onIconClick={(event) => event.preventDefault()}
            label={
              <ParentLayerTreeItem
                setDrawParams={setDrawParams}
                layerName={layerName}
                updateLayer={updateLayer}
                layers={layers}
                loaders={loaders}
                isVisible={isVisible}
                toggleVisibility={toggleVisibility}
                notVisible={layers[layerName].allowedZoom > zoom}
                iconColor={iconColor}
                theme={theme}
                setFilterMenu={setFilterMenu}
                setFilterOpen={setFilterOpen}
                openedFilters={openedFilters}
                setColorPicker={setColorPicker}
              />
            }
          >
            {Array.isArray(item.filters)
              ? item.filters.map((node) => renderTree(node))
              : null}
          </TreeItem>
        </TreeView>
      );
      // ...............CHILD TREE ITEM...............
    } else {
      return (
        <TreeView
          // className used by sortableJS in TabMenu.js
          key={item.name}
          className={"layerToDnd"}
          expanded={openedFilters}
          defaultCollapseIcon={
            <ExpandMoreIcon
              color="disabled"
              onClick={(event) => toggleArrow(event)}
            />
          }
          defaultExpandIcon={
            <ChevronRightIcon
              color="disabled"
              onClick={(event) => toggleArrow(event)}
            />
          }
          disableSelection
        >
          <TreeItem
            key={item.name}
            onLabelClick={(event) => event.preventDefault()}
            onIconClick={(event) => event.preventDefault()}
            nodeId={item.name}
            // className used by sortableJS in TabMenu.js
            className={"ignore-element"}
            label={
              <FilterTreeItem
                key={item.name}
                filter={item}
                isDisabled={layers[layerName].allowedZoom > zoom}
                setFilterMenu={setFilterMenu}
                iconColor={iconColor}
                filterVisibility={filterLayerVisibility}
                setColorPicker={setColorPicker}
                colorPicker={colorPicker}
                topParentName={layerName}
                setFilterOpen={setFilterOpen}
                tabPaperWidth={tabPaperWidth}
              />
            }
          >
            {Array.isArray(item.filters)
              ? item.filters.map((node) => renderTree(node))
              : null}
          </TreeItem>
        </TreeView>
      );
    }
  };

  return renderTree(layers[layerName]);
};

LayersTreeview.propTypes = {
  // Create new object handler
  setDrawParams: PropTypes.func.isRequired,
  // Main Layers
  layerName: PropTypes.string.isRequired,
  updateLayer: PropTypes.func.isRequired,
  layers: PropTypes.object.isRequired,
  loaders: PropTypes.object.isRequired,
  isVisible: PropTypes.bool,
  toggleVisibility: PropTypes.func.isRequired,
  zoom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // Style
  iconColor: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  // Filter layers
  updateFilterLayer: PropTypes.func.isRequired,
  setFilterMenu: PropTypes.func.isRequired,
  setColorPicker: PropTypes.func.isRequired,
  colorPicker: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  openedFilters: PropTypes.array.isRequired,
  setFilterOpen: PropTypes.func.isRequired,
  tabPaperWidth: PropTypes.number.isRequired,
};

export default LayersTreeview;
