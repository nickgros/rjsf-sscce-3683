import PropTypes from "prop-types";

// constants
import {
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Divider,
  Slider,
} from "@material-ui/core";
import { useStyles } from "src/styles/MaterialUiComponentsStyles/PluginsStyle.js";
import { useTranslation } from "react-i18next";

import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useState } from "react";

// MUI Components, Icons, Styles
import "src/components/Plugins/UiSchema/styleCss/uiSchemaSplice.css";

//Template of the component
export function ObjectFieldTemplate(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expand, setExpand] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpand(isExpanded ? panel : false);
  };

  return (
    <div id="splice_general">
      <div id="properties" name="properties">
        <div id={props.title} name="title">
          {props.title}
        </div>

        {props.properties.map((element) =>
          element.name === "cables" ? (
            <>
              <Divider className={classes.dividerStyleOther} />
              <Accordion
                className={classes.accordion}
                style={{ padding: 0 }}
                expanded={expand === "cables"}
                onChange={handleChange("cables")}
              >
                <AccordionSummary
                  className={classes.accordionSummary}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography
                    subtitle1="true"
                    className={classes.typoTitleAccordion}
                  >
                    {t("cable_one")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ display: "block", padding: 0 }}>
                  <div id={element.name} key={element.name}>
                    <fieldset key={element.name} id={"content_" + element.name}>
                      {element.content}
                    </fieldset>
                  </div>
                </AccordionDetails>
              </Accordion>
            </>
          ) : element.name === "nodes" ? (
            <>
              <Divider className={classes.dividerStyleOther} />
              <Accordion
                onChange={handleChange("nodes")}
                className={classes.accordion}
                style={{ padding: 0 }}
                expanded={expand === "nodes"}
              >
                <AccordionSummary
                  className={classes.accordionSummary}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography
                    subtitle1="h6"
                    className={classes.typoTitleAccordion}
                  >
                    {t("spliceBox")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ display: "block", padding: 0 }}>
                  <div id={"splice_" + element.name} key={element.name}>
                    <div id={props.description} name="description">
                      {props.description}{" "}
                    </div>
                    <fieldset key={element.name} id={"content_" + element.name}>
                      {element.content}
                    </fieldset>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Divider
                style={{
                  display: "block",
                  width: "90%",
                  margin: "0 auto",
                  marginBottom: "20px",
                }}
              />
            </>
          ) : (
            <div id={element.name} key={element.name}>
              <fieldset key={element.name} id={"content_" + element.name}>
                {element.content}
              </fieldset>
            </div>
          )
        )}
      </div>
    </div>
  );
}
ObjectFieldTemplate.propTypes = {
  title: PropTypes.string,
  properties: PropTypes.array,
  description: PropTypes.object,
};

//Widget to fix NaN error message
export function CustomRangeFix(props) {
  const { value, onChange, id, label } = props;
  const sliderProps = { value, label, id, name: id };
  return label === "reserve_percentage" ? (
    <Slider
      {...sliderProps}
      aria-label="Volume"
      value={value}
      valueLabelDisplay="auto"
      onChange={(e, b) => onChange(b)}
      min={0}
      max={50}
      step={5}
    />
  ) : label === "max_length" ? (
    <Slider
      {...sliderProps}
      aria-label="Volume"
      value={value}
      valueLabelDisplay="auto"
      onChange={(e, b) => onChange(b)}
      min={0}
      max={5000}
      step={100}
    />
  ) : id === "length_tolerance_percentage" ? (
    <Slider
      {...sliderProps}
      aria-label="Volume"
      value={value}
      valueLabelDisplay="auto"
      onChange={(e, b) => onChange(b)}
      min={0}
      max={100}
      step={5}
    />
  ) : (
    <Slider
      {...sliderProps}
      aria-label="Volume"
      value={value}
      valueLabelDisplay="auto"
      onChange={(e, b) => onChange(b)}
    />
  );
}
CustomRangeFix.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.string,
};
