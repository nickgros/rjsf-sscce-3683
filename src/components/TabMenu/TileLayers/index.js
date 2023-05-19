import React from "react";

console.dev("TileLayers");

// MUI components
import { Slider } from "@material-ui/core";

// Material UI Icons
import { Visibility, VisibilityOff } from "@material-ui/icons";

// MUI Styles
import { useStyles } from "src/styles/MaterialUiComponentsStyles/TabMenuStyle";
import { useTheme, alpha } from "@material-ui/core/styles";

// LS handler
import SettingsContext from "src/components/Settings/context/SettingsContext";

// OSM & Satellite settings : hide / show & set opacity
const TileLayers = () => {
  // context allows to store OSM props in localStorage
  // If user reloads, new props will stay
  const context = React.useContext(SettingsContext);
  const classes = useStyles();
  const theme = useTheme();

  const [previewOverlay, setPreviewOverlay] = React.useState("");

  return context.tileLayers.map((tileLayer) => {
    const tileUrlFormatted = tileLayer.url
      .replace("{x}", "16823")
      .replace("{y}", "11688")
      .replace("{z}", "15");

    return (
      <div key={tileLayer.name} className={classes.tileContainer}>
        <div
          className={classes.tilePreviewOverlay}
          onMouseEnter={() =>
            previewOverlay !== tileLayer.name &&
            setPreviewOverlay(tileLayer.name)
          }
          onMouseLeave={() => previewOverlay !== "" && setPreviewOverlay("")}
          onClick={(event) => {
            event.preventDefault();
            // send new prop to Ilion/index.js -> window.onmessage
            window.postMessage([
              "tileLayersHandler",
              [
                {
                  ...tileLayer,
                  visible: !tileLayer.visible,
                  visibleBefore:
                    tileLayer.visible &&
                    context.tileLayers.filter((layer) => layer.visible)
                      .length === 1,
                },
              ],
            ]);
          }}
        >
          {previewOverlay === tileLayer.name && (
            <>
              {!tileLayer.visible ? (
                <Visibility
                  fontSize="small"
                  style={{ color: theme.palette.menuColor }}
                />
              ) : (
                <VisibilityOff
                  fontSize="small"
                  style={{ color: alpha(theme.palette.menuColor, 0.5) }}
                />
              )}
            </>
          )}
        </div>
        <div
          className={
            tileLayer.visible ? classes.tilePreview : classes.tilePreviewOff
          }
          style={{
            backgroundImage: `url(${tileUrlFormatted})`,
          }}
        />
        <div className={classes.tileHandler}>
          <p className={classes.name}>{tileLayer.name}</p>
          <Slider
            value={tileLayer.opacity}
            color="secondary"
            onChange={(_, newValue) => {
              window.postMessage([
                "tileLayersHandler",
                [
                  {
                    ...tileLayer,
                    userOpacity: newValue,
                    opacity: newValue,
                  },
                ],
              ]);
            }}
            step={0.1}
            marks
            min={0.1}
            max={1}
            disabled={!tileLayer.visible}
            getAriaValueText={() => tileLayer.opacity}
            valueLabelDisplay="auto"
          />
        </div>
      </div>
    );
  });
};

export default TileLayers;
