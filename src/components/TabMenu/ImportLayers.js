import { useState, useRef } from "react";

console.dev("ImportLayers");

import PropTypes from "prop-types";

// Mui components
import {
  Tooltip,
  IconButton,
  Link,
  Typography,
  Box,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Button,
} from "@material-ui/core";
// Mui icons
import { Clear, Visibility, VisibilityOff, Brush } from "@material-ui/icons";
// Custom svg icon
import ColorIcon from "src/styles/MaterialUiComponentsStyles/ColorIcon";
// Mui styles
import { useTheme, alpha } from "@material-ui/core/styles";
import { useStyles } from "src/styles/MaterialUiComponentsStyles/TabMenuStyle";

// ColorPicker
import ColorPicker from "src/components/TabMenu/ContextMenus/ColorPicker";

// Complete SortableJS (with all plugins)
import Sortable from "sortablejs/modular/sortable.complete.esm.js";

// Generic functions
import { compareByAttribute } from "src/utils/GenericFunctions";
import { ImportedLayersService } from "src/utils/services/imported-layers";

import { useTranslation } from "react-i18next";
import objectTypes from "src/utils/constants/objectTypes";

// Floating paper displaying list of all imported layers
// on map's top right side, below <AppBar />
const ImportLayers = ({
  importLayers,
  updateImportLayer,
  deleteImportLayer,
  tabPaperWidth,
  layerDialog,
  setLayerDialog,
  getLayerModel,
  sendExternalLayer,
}) => {
  const { t } = useTranslation();
  const layerLink = useRef();

  // DnD parentLayer to change order
  const sortableMenu = document.getElementById("importLayers");
  sortableMenu &&
    Sortable.create(sortableMenu, {
      animation: 150,
      handle: ".importLayerToDnd",
      filter: ".ignore-element",
      // Called when dragging element changes position
      onEnd: function (evt) {
        window.postMessage([
          "changeLayerIndex",
          evt.newIndex,
          evt.oldIndex,
          "importLayers",
        ]);
      },
    });

  const theme = useTheme();
  const classes = useStyles();

  // ColorPicker handler
  const [colorPicker, setColorPicker] = useState(false);

  // Contextual menu handler
  const [anchorEl, setAnchorElement] = useState(null);

  // Import layer
  const [layerModel, setLayerModel] = useState("");
  const [layerToDownload, setLayerToDownload] = useState(null);

  // Export layer
  const [layerTypes, setLayerTypes] = useState(null);
  const [layerDetails, setLayerDetails] = useState({});
  const [databaseExport, setDatabaseExport] = useState(false);

  // Layer types
  const pointLayer = ["site", "pt_tech"];
  const lineLayer = ["cable", "support", "domaine"];

  const filterFeaturesProps = async (fileName) => {
    const dataBaseService = await ImportedLayersService.getInstance();
    const importedLayers = await dataBaseService.get();

    const selectedLayer = importedLayers.find(
      (layer) => layer.fileName === fileName
    );
    const filteredFeatures = JSON.parse(selectedLayer.features);
    filteredFeatures.features.forEach((feature) =>
      ["@type", "uuid", "name", "layerName"].map(
        (key) => delete feature.properties[key]
      )
    );
    setLayerDetails({
      ...filteredFeatures,
      name: selectedLayer.fileName,
      crs: selectedLayer.crs,
    });
  };

  const sendFilteredLayer = async (layerType) => {
    await sendExternalLayer(layerType, layerDetails);
    setDatabaseExport(false);
  };

  const importLayerModel = async (layerModel) => {
    const layerFile = await getLayerModel(layerModel);
    setLayerToDownload(
      `data:text/geo+json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(layerFile)
      )}`
    );
    layerLink.current.click();
    setLayerToDownload(null);
    setLayerDialog(false);
    setLayerModel("");
  };

  return (
    <>
      {Object.isEmpty(importLayers) ? (
        // Empty conditionnal display
        <Typography
          variant="body2"
          style={{
            textAlign: "center",
            color: alpha(theme.palette.grey[500], 0.6),
            fontSize: theme.typography.fontSizeSmall,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {t("importedLayers.empty")}
        </Typography>
      ) : (
        // imported layers list
        <div id="importLayers">
          {[
            ...new Set(
              Object.keys(importLayers).map(
                (fileName) => importLayers[fileName]
              )
            ),
          ]
            .sort((a, b) => compareByAttribute(a, b, "zIndex"))
            .map((file) => {
              return (
                <div
                  className={`${classes.tabListItemContainer} importLayerToDnd`}
                  key={file.name}
                >
                  <div className={classes.tabListItemLeftContainer}>
                    {/* SHOW / HIDE LAYER */}
                    <IconButton
                      onClick={() => {
                        updateImportLayer(
                          file.name,
                          "isVisible",
                          !file.isVisible
                        );
                        window.postMessage([
                          "toggleImportLayerVisibility",
                          file.name,
                          !file.isVisible,
                        ]);
                      }}
                      style={{
                        color: file.isVisible
                          ? theme.palette.custom.green.hover
                          : theme.palette.custom.green.disabled,
                      }}
                      size="small"
                    >
                      {file.isVisible ? (
                        <Visibility
                          style={{ fontSize: theme.typography.fontSizeLarge }}
                        />
                      ) : (
                        <VisibilityOff
                          style={{ fontSize: theme.typography.fontSizeLarge }}
                        />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setColorPicker({
                          layerName: file.name,
                          filterName: file.name,
                          style: file.style,
                          featureType: file.featureType,
                        })
                      }
                    >
                      <ColorIcon
                        fontSize="small"
                        style={{ width: "0.8em" }}
                        stroke={file.style.stroke.color}
                        fill={file.style.fill.color}
                        shapeType={file.featureType}
                      />
                    </IconButton>

                    {/* FILE NAME */}
                    <Tooltip
                      arrow
                      title={
                        file.coords !== null
                          ? file.projection
                          : t("numberOfElements", { count: file.nbFeatures })
                      }
                      placement="top"
                    >
                      <Link
                        variant="body2"
                        component="p"
                        color="textPrimary"
                        className={classes.tabListItemText}
                        style={{
                          maxWidth: `${tabPaperWidth - 100}px`,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          window.postMessage([
                            "fitImportLayerAndBookmark",
                            "importLayer",
                            file.name,
                          ])
                        }
                        onContextMenu={(event) => {
                          filterFeaturesProps(file.name);
                          setAnchorElement({
                            mouseX: event.clientX - 2,
                            mouseY: event.clientY - 4,
                          });
                          setLayerTypes(
                            file.featureType === "Point"
                              ? pointLayer
                              : lineLayer
                          );
                        }}
                      >
                        {file.name}
                      </Link>
                    </Tooltip>
                  </div>
                  <div>
                    {colorPicker !== false &&
                      colorPicker.filterName === file.name && (
                        <Brush
                          fontSize="small"
                          style={{ color: theme.palette.custom.amber }}
                        />
                      )}
                  </div>

                  {/* ..........ACTION BUTTONS.......... */}
                  <div className={classes.tabListItemRightContainer}>
                    {/* DELETE LAYER */}
                    {databaseExport ? (
                      <CircularProgress size={16} />
                    ) : (
                      <IconButton
                        onClick={() => {
                          deleteImportLayer(file.name);
                          window.postMessage(["deleteImportLayer", file.name]);
                        }}
                        color="secondary"
                        size="small"
                      >
                        <Clear
                          style={{
                            fontSize: theme.typography.fontSize,
                          }}
                        />
                      </IconButton>
                    )}
                  </div>

                  {/* ..........Contextual menu.......... */}
                  {anchorEl && (
                    <Menu
                      keepMounted
                      open={anchorEl !== null}
                      anchorReference="anchorPosition"
                      anchorPosition={
                        anchorEl.mouseY !== null && anchorEl.mouseX !== null
                          ? { top: anchorEl.mouseY, left: anchorEl.mouseX }
                          : undefined
                      }
                      onContextMenu={() => setAnchorElement(null)}
                      onClose={() => setAnchorElement(null)}
                    >
                      <MenuItem
                        dense
                        disabled
                        style={{
                          fontSize: theme.typography.fontSizeSmall,
                          fontFamily: theme.typography.fontFamily,
                        }}
                      >
                        {t("importedLayers.export")}
                      </MenuItem>
                      <Divider />
                      {layerTypes.map((layerType) => (
                        <MenuItem
                          dense
                          key={layerType}
                          onClick={() => {
                            setDatabaseExport(true);
                            sendFilteredLayer(layerType);
                            setAnchorElement(null);
                          }}
                        >
                          {t(objectTypes[layerType], { count: 2 })}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}

                  {/* .........Layer models dialog......... */}
                  <Dialog
                    open={layerDialog}
                    onClose={() => {
                      setLayerModel("");
                      setLayerDialog(false);
                      setLayerToDownload(null);
                    }}
                  >
                    <DialogTitle>{t("importedLayers.import")}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {t("importedLayers.select")}
                      </DialogContentText>
                      <FormControl fullWidth style={{ marginBottom: 16 }}>
                        <InputLabel>{t("importedLayers.models")}</InputLabel>

                        {/*  Layer model selection */}
                        <Select
                          value={layerModel}
                          onChange={(event) =>
                            setLayerModel(event.target.value)
                          }
                        >
                          {pointLayer.concat(lineLayer).map((layer) => (
                            <MenuItem key={layer} value={layer}>
                              {t(objectTypes[layer], { count: 2 })}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </DialogContent>
                    <DialogActions>
                      {/*  CANCEL */}
                      <Button
                        aria-label="cancel"
                        onClick={() => {
                          setLayerModel("");
                          setLayerDialog(false);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      {/*  SAVE */}
                      <Link
                        ref={layerLink}
                        href={layerToDownload}
                        download={`${layerModel}_model.geojson`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          aria-label="save"
                          style={
                            !layerModel
                              ? {
                                  backgroundColor:
                                    theme.palette.custom.green.disabled,
                                  color: theme.palette.text.disabled,
                                }
                              : {
                                  backgroundColor:
                                    theme.palette.custom.green.main,
                                  color: theme.palette.common.white,
                                }
                          }
                          onClick={() => {
                            importLayerModel(layerModel);
                          }}
                          disabled={!layerModel}
                        >
                          {t("ok")}
                        </Button>
                      </Link>
                    </DialogActions>
                  </Dialog>
                </div>
              );
            })}
        </div>
      )}

      {/* ..........ColorPicker.......... */}
      {colorPicker !== false && (
        <Box
          className={classes.containerColorPicker}
          width={tabPaperWidth}
          top={0}
        >
          <ColorPicker
            colorPicker={colorPicker}
            setColorPicker={setColorPicker}
            updateLayer={updateImportLayer}
            folder="importLayers"
          />
        </Box>
      )}
    </>
  );
};

ImportLayers.propTypes = {
  tabPaperWidth: PropTypes.number.isRequired,
  updateImportLayer: PropTypes.func.isRequired,
  deleteImportLayer: PropTypes.func.isRequired,
  importLayers: PropTypes.object.isRequired,
  layerDialog: PropTypes.func.isRequired,
  setLayerDialog: PropTypes.func.isRequired,
  getLayerModel: PropTypes.func.isRequired,
  sendExternalLayer: PropTypes.func.isRequired,
};

export default ImportLayers;
