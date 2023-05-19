import { useState, useEffect, useRef } from "react";
import { findDOMNode } from "react-dom";

console.dev("ColorPicker");

import PropTypes from "prop-types";

import { useStyles } from "src/styles/MaterialUiComponentsStyles/ColorPickerStyle";
import { useTheme } from "@material-ui/core/styles";

import objectTypes from "src/utils/constants/objectTypes";

import {
  restrictToNumbers,
  onlyAlphaNumeric,
} from "src/utils/GenericFunctions";

import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grid,
  Input,
  Paper,
  Slider,
} from "@material-ui/core";

import { SketchPicker } from "react-color";
import { colorNames } from "src/styles/FeaturesStyle/colorNames";
import { LineWeight } from "@material-ui/icons";

// Icon mdi
import Icon from "@mdi/react";
import { mdiRadius } from "@mdi/js";
import { isGeomType } from "src/utils/GenericFunctions";

import { useTranslation, Trans } from "react-i18next";

// Props set trough colorPicker
// (local useState prop in TabMenu/index)
// setColorPicker() in FilterContextMenu
// ? colorPicker structure example :
// {
//   layerName: "cable",
//   filterName: "etude",
//   color: {
//    fill: "#FF0000",
//    stroke: "#FF0000"
//    },
// }

const ColorPicker = ({
  colorPicker,
  setColorPicker,
  updateLayer,
  folder,
  updateFilterLayer,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const sketchPickerRef = useRef();

  const inUseFilter = colorPicker.filterName.includes("in_use");
  const inStudyFilter = colorPicker.filterName.includes("in_study");
  const isOtherFilter = colorPicker.filterName.includes("other");

  const parentFilterName = colorPicker.filterName.substring(
    0,
    colorPicker.filterName.indexOf("-")
  );

  // When ColorPicker opens, old filter layer's color is used as default color
  const [styleColor, setStyleColor] = useState({
    fill: { color: colorPicker.style.fill.color },
    stroke: {
      color: colorPicker.style.stroke.color,
      width: colorPicker.style.stroke.width,
    },
    radius: colorPicker.style.radius,
  });

  //Restrict the RGBA input just for number
  const restrictNumbers = () => restrictToNumbers.bind(this);

  //Accept only alpha numerics, no special characters
  const alphaNumeric = () => onlyAlphaNumeric.bind(this);

  useEffect(() => {
    // Set values of inputs
    if (colorPicker) {
      const sketchPickerEl = findDOMNode(sketchPickerRef.current); // eslint-disable-line react/no-find-dom-node
      for (let input of sketchPickerEl.getElementsByTagName("input")) {
        {
          input.parentElement.lastChild.innerHTML !== "hex"
            ? ((input.maxLength = 3), (input.onkeypress = restrictNumbers()))
            : ((input.maxLength = 6), (input.onkeypress = alphaNumeric()));
        }
      }
    }
  }, [colorPicker]);

  /**
   * Update local state with new width/radius value
   * @param {string} type 'width' | 'radius'
   * @param {number} value size
   */
  const handleFeatureChange = (type, value) => {
    if (type === "width") {
      // Change stroke width
      setStyleColor((prevState) => ({
        ...prevState,
        stroke: { ...prevState.stroke, [type]: value },
      }));
      actionsByFolder[folder].changeStroke(type, value);
    } else {
      // Change feature radius
      setStyleColor((prevState) => ({
        ...prevState,
        radius: value,
      }));
      actionsByFolder[folder].changeRadius(value);
    }
  };

  // Picker color button type
  const buttonsColorPicker = [
    { type: "stroke", text: t("colorPicker.border") },
    { type: "fill", text: t("colorPicker.surface") },
  ];

  // Color default according to feature type
  const [strokeOrFill, setStrokeOrFill] = useState(
    colorPicker.layerName === "cable" ||
      colorPicker.layerName === "support" ||
      isGeomType("LineString", colorPicker.featureType)
      ? buttonsColorPicker[0].type
      : buttonsColorPicker[1].type
  );

  // Execute actions according to folder
  const actionsByFolder = {
    importLayers: {
      /**
       * Update Stroke's styles
       * @param {string} type stroke style prop ('color', 'width'...)
       * @param {number|string} value value to apply to concerned passed key 'type'
       */
      changeStroke: (type, value) =>
        // Change stroke color or width
        window.postMessage([
          "setImportLayerColor",
          colorPicker.layerName,
          {
            ...styleColor,
            [strokeOrFill]: {
              ...styleColor[strokeOrFill],
              [type]: value,
            },
          },
        ]),
      /**
       * Update radius value
       * @param {number} radius size
       */
      changeRadius: (radius) =>
        window.postMessage([
          "setImportLayerColor",
          colorPicker.layerName,
          { ...styleColor, radius },
        ]),
    },
    tabMenu: {
      /**
       * Update Stroke's styles
       * @param {string} type stroke style prop ('color', 'width'...)
       * @param {number|string} value value to apply to concerned passed key 'type'
       */
      changeStroke: (type, value) =>
        // Change stroke color or width
        window.postMessage([
          "setLayerColor",
          colorPicker.layerName,
          colorPicker.filterName,
          {
            ...styleColor,
            [strokeOrFill]: {
              ...styleColor[strokeOrFill],
              [type]: value,
            },
          },
        ]),
      /**
       * Update radius value
       * @param {number} radius size
       */
      changeRadius: (radius) =>
        window.postMessage([
          "setLayerColor",
          colorPicker.layerName,
          colorPicker.filterName,
          { ...styleColor, radius },
        ]),
    },
  };

  return (
    <div
      id="colorPicker"
      // Fixed position otherwise the picker
      // could exceed Ilion's extent
      className={classes.colorPicker}
    >
      <ClickAwayListener
        onClickAway={() => {
          // Update action sent to mapReducer
          if (colorPicker.layerName === colorPicker.filterName) {
            updateLayer(colorPicker.layerName, "style", styleColor);
          } else {
            updateFilterLayer(
              colorPicker.layerName,
              colorPicker.filterName,
              "style",
              styleColor
            );
          }
          setColorPicker(false);
        }}
      >
        <Paper className={classes.paperColorPicker}>
          <div className={classes.layerName}>
            {colorPicker.layerName === colorPicker.filterName ? (
              t(colorPicker.layerName).toUpperCase()
            ) : inUseFilter ? (
              <Trans
                i18nKey="layers.filters.inUseFilter"
                name={parentFilterName}
              >
                {parentFilterName}
                In use
              </Trans>
            ) : inStudyFilter ? (
              <Trans
                i18nKey="layers.filters.inStudyFilter"
                name={parentFilterName}
              >
                {parentFilterName}
                In study
              </Trans>
            ) : isOtherFilter ? (
              <Trans
                i18nKey="layers.filters.otherFilter"
                name={t(objectTypes[colorPicker.layerName], { count: 2 })}
              >
                Other
                {t(objectTypes[colorPicker.layerName], { count: 2 })}
              </Trans>
            ) : (
              `${t(objectTypes[colorPicker.layerName], {
                count: 1,
              }).toUpperCase()} | ${t(colorPicker.filterName).toUpperCase()}`
            )}
          </div>
          {/* Change picker color type */}
          {(colorPicker.layerName === "domaine" ||
            colorPicker.layerName === "pt_tech" ||
            colorPicker.layerName === "site" ||
            isGeomType("Point", colorPicker.featureType) ||
            isGeomType("Polygon", colorPicker.featureType)) && (
            <ButtonGroup
              fullWidth
              variant="contained"
              disableElevation
              size="small"
            >
              {buttonsColorPicker.map(({ type, text }) => (
                <Button
                  key={type}
                  fullWidth
                  color={strokeOrFill === type ? "primary" : "default"}
                  onClick={() => setStrokeOrFill(type)}
                  className={classes.noBorderRadius}
                >
                  {text}
                </Button>
              ))}
            </ButtonGroup>
          )}
          {/*
          The reducer's update action is only triggered when user
          will click outside of the picker.
          Used to prevent mass reducer's action calls
      */}
          <SketchPicker
            ref={sketchPickerRef}
            className={classes.shadow}
            color={styleColor[strokeOrFill].color}
            onChange={(color) => {
              // action set to the local state prop 'color'
              setStyleColor((prevState) => ({
                ...prevState,
                [strokeOrFill]: {
                  ...prevState[strokeOrFill],
                  color: color.rgb,
                },
              }));
              // action sent to map (Ilion)
              actionsByFolder[folder].changeStroke("color", color.rgb);
            }}
            // Standard colors used at Free (as tubes / fibres)
            presetColors={[
              colorNames[255].hex, // Rouge
              colorNames[16711680].hex, // Bleu
              colorNames[65280].hex, // Vert
              colorNames[65535].hex, // Jaune
              colorNames[9699434].hex, // Violet
              colorNames[16777215].hex, // Blanc
              colorNames[33023].hex, // Orange
              colorNames[8421504].hex, // Gris
              colorNames[13158].hex, // Marron
              colorNames[0].hex, // Noir
              colorNames[12632064].hex, // Turquoise
              colorNames[12632319].hex, //  Rose
            ]}
          />

          {/* ....................WIDTH STROKE.................... */}
          <div hidden={strokeOrFill === "fill"} className={classes.root}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <LineWeight />
              </Grid>
              <Grid item xs>
                <Slider
                  value={styleColor.stroke.width}
                  onChange={(_, number) => handleFeatureChange("width", number)}
                  aria-labelledby="input-slider"
                  min={1}
                  max={30}
                />
              </Grid>
              <Grid item>
                <Input
                  className={classes.input}
                  value={styleColor.stroke.width}
                  margin="dense"
                  onChange={(event) =>
                    handleFeatureChange("width", event.target.value)
                  }
                  inputProps={{
                    step: 2,
                    min: 1,
                    max: 30,
                    type: "number",
                    "aria-labelledby": "width-slider",
                  }}
                />
              </Grid>
            </Grid>
          </div>

          {/* ....................RADIUS................... */}
          <div
            hidden={
              strokeOrFill === "stroke" ||
              colorPicker.layerName === "domaine" ||
              isGeomType("Polygon", colorPicker.featureType)
            }
            className={classes.root}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Icon path={mdiRadius} size={theme.typography.fontSize / 16} />
              </Grid>
              <Grid item xs>
                <Slider
                  value={styleColor.radius}
                  onChange={(_, number) =>
                    handleFeatureChange("radius", number)
                  }
                  aria-labelledby="input-slider"
                  min={1}
                  max={30}
                />
              </Grid>
              <Grid item>
                <Input
                  className={classes.input}
                  value={styleColor.radius}
                  margin="dense"
                  onChange={(event) =>
                    handleFeatureChange("radius", event.target.value)
                  }
                  inputProps={{
                    step: 2,
                    min: 1,
                    max: 30,
                    type: "number",
                    "aria-labelledby": "radius-slider",
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </Paper>
      </ClickAwayListener>
    </div>
  );
};

ColorPicker.propTypes = {
  colorPicker: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  folder: PropTypes.string.isRequired,
  updateFilterLayer: PropTypes.func,
  updateLayer: PropTypes.func.isRequired,
  setColorPicker: PropTypes.func.isRequired,
};

ColorPicker.defaultProps = {
  updateFilterLayer: undefined,
};

export default ColorPicker;
