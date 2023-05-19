import PropTypes from "prop-types";

import {
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Divider,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "src/styles/MaterialUiComponentsStyles/PluginsStyle.js";
import "src/components/Plugins/UiSchema/styleCss/uiSchemaCableur.css";

export function ObjectFieldTemplate(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [expand, setExpand] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpand(isExpanded ? panel : false);
  };
  return (
    <div id="cableur_template">
      {props.title === "" ? null : props.title === "subscriber" ? null : (
        <div id={"cableur_title_" + props.description}>{props.title}</div>
      )}
      <div id={"cableur_description_" + props.description} name="description">
        {props.description}{" "}
      </div>

      <div id="cableur_properties" name="properties">
        {props.properties.map((element) =>
          element.name === "general" ? (
            <>
              <Divider className={classes.dividerStyleOther} />

              <Accordion
                className={classes.accordion}
                style={{ padding: 0 }}
                expanded={expand === "general"}
                onChange={handleChange("general")}
              >
                <AccordionSummary
                  style={{ textAlign: "center" }}
                  className={classes.accordionSummary}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography
                    subtitle="true"
                    className={classes.typoTitleAccordion}
                  >
                    {t("general")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ display: "block", padding: 0 }}>
                  {element === "" ? null : (
                    <div id={"cableur_element"} key={element.name}>
                      <fieldset key={element.name} id={"cableur_fieldset"}>
                        {element.content}
                      </fieldset>
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>
            </>
          ) : element.name === "cables_nodes" ? (
            <>
              <Divider className={classes.dividerStyleOther} />
              <Accordion
                className={classes.accordion}
                style={{ padding: 0 }}
                expanded={expand === "nodes"}
                onChange={handleChange("nodes")}
              >
                <AccordionSummary
                  className={classes.accordionSummary}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography subtitle="true">{t("nodes")}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ display: "block", padding: 0 }}>
                  <div id={"cableur_element"} key={element.name}>
                    <fieldset key={element.name} id={"cableur_fieldset"}>
                      {element.content}
                    </fieldset>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Divider
                className={classes.dividerStyleOther}
                style={{ marginBottom: "20px" }}
              />
            </>
          ) : (
            //Partie désactivé pour le moment, pas de rendu côté client
            // mais envoi en dur dans le formdata quand même
            //: element.name === "infrastructure" ? (
            //   <>
            //     <Divider className={classes.dividerStyleOther} />
            //     <Accordion
            //       className={classes.accordion}
            //       style={{ padding: 0 }}
            //       expanded={expand === "infrastructure"}
            //       onChange={handleChange("infrastructure")}
            //     >
            //       <AccordionSummary
            //         content={{ display: "flex", justifyContent: "center" }}
            //         className={classes.accordionSummary}
            //         expandIcon={<ExpandMoreIcon />}
            //       >
            //         <Typography
            //           subtitle="true"
            //           className={classes.typoTitleAccordion}
            //         >
            //           {t("infrastructure")}
            //         </Typography>
            //       </AccordionSummary>
            //       <AccordionDetails style={{ display: "block", padding: 0 }}>
            //         {element === "" ? null : (
            //           <div id={"cableur_element"} key={element.name}>
            //             <fieldset key={element.name} id={"cableur_fieldset"}>
            //               {element.content}
            //             </fieldset>
            //           </div>
            //         )}
            //       </AccordionDetails>
            //     </Accordion>
            //     <Divider
            //       className={classes.dividerStyleOther}
            //       style={{ marginBottom: "20px" }}
            //     />
            //   </>
            // )
            <div id={"cableur_element"} key={element.name}>
              <fieldset key={element.name} id={"cableur_fieldset"}>
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
  description: PropTypes.string,
};
