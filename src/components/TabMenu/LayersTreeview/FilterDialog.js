import { useState, Fragment } from "react";

console.dev("FilterDialog");

import PropTypes from "prop-types";

import { API_ODYSSEE } from "src/utils/API";
import axios from "axios";

// Material UI Components
import {
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@material-ui/core";
import CustomTextField from "src/components/GenericComponents/Forms/CustomTextField";

// Material UI Icons
import ClearIcon from "@material-ui/icons/Clear";

// Material UI styles
import { useTheme } from "@material-ui/core/styles";
import { useStyles } from "src/styles/MaterialUiComponentsStyles/TabMenuStyle";

import {
  hiddenLabels, // used to hide props like 'uuid' in configs
  configLabels, // used to allow GET config on certain props (like 'etat')
  intAttributes,
} from "src/components/GenericComponents/Forms/labels";

import { shortCategories, simpleCompare } from "src/utils/GenericFunctions";
import { useTranslation, Trans } from "react-i18next";

// Props set trough filterDialog
// (local useState prop in TabMenu/index)
// setFilterDialog() in FilterContextMenu
// ? filterDialog structure example :
// {
//   action: "edit",
//   topParentName: "pt_tech",
//   name: "etude",
//   sql: "etat = 'EN ETUDE'",
// }
const FilterDialog = ({ filterDialog, setFilterDialog, layers }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  // editMode will be used for a conditionnal text display
  // and if truthy, to pre-fill inputs like 'filterTitle' or 'sqlRequest'
  const editMode = filterDialog.action === "edit";
  const renameMode = filterDialog.action === "rename";

  let [filterTitle, setFilterTitle] = useState(
    filterDialog.action !== "add"
      ? filterDialog.name
      : t("layers.filtered", { name: filterDialog.name })
  );

  let [sqlRequest, setSqlRequest] = useState(editMode ? filterDialog.sql : "");

  // Loading UX displays
  const [loader, setLoader] = useState(false);
  const [done, setDone] = useState(false);

  // List of all attributes based on current topParentName
  // Content: Array of strings
  const [attributes, setAttributes] = useState([]);

  // set the current attribute name to highlight if clicked
  const [active, setActive] = useState("");

  // List of all configurations for a given attribute
  // Content: Array of objects
  const [configs, setConfigs] = useState([]);

  // Get all attributes based on current topParentName
  if (!done && !loader) {
    setLoader(true);
    // Empty attributes before a call
    setAttributes([]);
    axios
      .get(`${API_ODYSSEE}/v1/columns/${filterDialog.topParentName}`)
      .then(({ data }) => {
        // data = [
        //{character_maximum_length: value},
        //{column_name: value} Only key use here
        //{data_type: value}
        //{is_nullable: value}
        //{udt_name: value}
        //]
        let dataArray = data.map((result) => result.column_name);
        setAttributes(dataArray);
        // dataArray = ["etat", "code", "uuid"]
        setDone(dataArray.length);
        setLoader(false);
      })
      .catch(() => setLoader(false));
    // the local state prop 'done' is used here to
    // prevent infinite action call's loop
    setDone(true);
  }

  /**
   * Get all configurations for a given attribute
   * @param {string} attrib current attribute
   */
  const saveConfig = (attrib) => {
    // If the current attribute can return configs
    // example:
    // -'code' cannot, cause would return too many values
    // -'etat' can, and will return ["EN SERVICE", "EN ETUDE"...]
    // See GenericComponents/Forms/labels -> configLabels for authorized attributes
    configLabels.includes(attrib)
      ? axios
          .get(
            `${API_ODYSSEE}/v1/select_distinct/?table=${filterDialog.topParentName}&attribut=${attrib}`
          )
          .then(({ data }) => {
            // data = [ { etat: "EN SERVICE"},{techno: "PON"},etc... ]
            let configs = [];
            data.map((configObj) => configs.push(configObj[attrib]));
            setConfigs(configs);
          })
          .catch((error) => console.error(error))
      : setConfigs(
          t("sqlRequest.tooManyValuesAttribute", { attribute: attrib })
        );
  };

  const sqlOperators = [
    "=",
    "<",
    ">",
    "<=",
    ">=",
    "<>",
    "(",
    ")",
    "AND",
    "OR",
    "LIKE",
    "NOT",
  ];

  // Recursive f() to stock all existing filter names
  // in mapReducer.layers (all firstFilters & user filters names)
  // prevent duplicates, for map filter layers managing
  let filtersNames = [];

  /**
   * Recursive function to stock all existing filter names
   * @param {object} obj current object from mapReducer.layers
   * @return {function|void} getFiltersName(obj)
   */
  const getFiltersName = (obj) => {
    // Add topParent layerName
    !filtersNames.includes(obj.name) && filtersNames.push(obj.name);
    // As long as current obj has filters
    if (!Array.isEmpty(obj.filters)) {
      // map on theses filters
      obj.filters.map((filter) => {
        // add filter name if not already
        !filtersNames.includes(filter.name) && filtersNames.push(filter.name);
        // check if shortCategory exists
        shortCategories(filter.name) !== filter.name &&
          !filtersNames.includes(shortCategories(filter.name)) &&
          filtersNames.push(shortCategories(filter.name));
        // repeat process
        getFiltersName(filter);
      });
    }
  };
  // Start getFiltersName() recursive f() from topParent layers (all of them)
  Object.keys(layers).map((layerName) => getFiltersName(layers[layerName]));

  /**
   * Error text display handler
   * @returns {string} Text depending on filterDialog.action type
   */
  const errorHandler = () => {
    // Conditions are ALMOST similar
    // the only changing condition is ' filterTitle !== filterDialog.name '
    // only used for edit and rename action modes
    // This condition allows user to keep the same filterName on theses modes
    if (filterDialog.action === "add") {
      if (filtersNames.includes(filterTitle)) return t("nameAlreadyUsed");
      if (String.isEmpty(filterTitle))
        return t("sqlRequest.emptyFieldDisallowed");
    } else if (
      filterDialog.action === "edit" ||
      filterDialog.action === "rename"
    ) {
      if (
        filtersNames.includes(filterTitle) &&
        filterTitle !== filterDialog.name
      )
        return t("nameAlreadyUsed");
      if (String.isEmpty(filterTitle))
        return t("sqlRequest.emptyFieldDisallowed");
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={filterDialog !== false}
      onClose={() => setFilterDialog(false)}
    >
      {/* Dialog only for RENAME mode (only filterTitle + buttons) */}
      {renameMode ? (
        <>
          {/* .............Custom dialog title............. */}
          <DialogTitle>
            {t("layers.filters.rename", { name: filterDialog.name })}
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              {t("sqlRequest.current", { sql: filterDialog.sql })}
            </DialogContentText>

            {/* .............NEW filterTitle............. */}
            <CustomTextField
              style={{ margin: "16px 0" }}
              label={t("layers.filters.name")}
              error={Boolean(errorHandler())}
              helperText={errorHandler()}
              variant="outlined"
              required
              value={filterTitle}
              onChange={(event) => setFilterTitle(event.target.value)}
              fullWidth
            />
          </DialogContent>

          {/* .............Dialog actions buttons............. */}
          <DialogActions>
            {/* Cancel filter creation/edition */}
            <Button
              onClick={() => {
                setFilterDialog(false);
              }}
              color="secondary"
            >
              {t("cancel")}
            </Button>

            {/* Save filter */}

            <Button
              onClick={() => {
                // action sent to map (Ilion)
                window.postMessage([
                  "renameFilterLayer",
                  filterDialog.topParentName,
                  filterDialog.name,
                  "",
                  filterTitle,
                ]);

                // closes filter dialog
                setFilterDialog(false);
              }}
              variant="contained"
              color="primary"
              disabled={
                errorHandler() !== undefined || String.isEmpty(filterTitle)
              }
            >
              {t("ok")}
            </Button>
          </DialogActions>
        </>
      ) : (
        // ELSE, ADD OR EDIT DIALOG

        <>
          {/* .............Dialog Title............. */}

          {editMode ? (
            <DialogTitle>{t("layers.filters.edit")}</DialogTitle>
          ) : (
            <DialogTitle>
              {t("layers.filters.addName", { name: filterDialog.name })}
            </DialogTitle>
          )}

          <DialogContent>
            {!editMode && (
              <DialogContentText>
                {t("layers.filters.sqlTip")}
              </DialogContentText>
            )}

            {/* .............filterTitle............. */}
            <CustomTextField
              style={{ margin: "16px 0" }}
              label={t("layers.filters.name")}
              variant="outlined"
              error={Boolean(errorHandler())}
              helperText={errorHandler()}
              required
              value={filterTitle}
              onChange={(event) => setFilterTitle(event.target.value)}
              fullWidth
            />

            {/* .............Attributes, Buttons & Configs lists............. */}

            <Grid container spacing={2}>
              {/* .......1) Attributes....... */}
              <Grid item xs={4} lg={5}>
                <Paper className={classes.paper}>
                  {/* Circular Progress loader */}
                  {loader ? (
                    <Paper
                      className={classes.paper}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress disableShrink />
                    </Paper>
                  ) : (
                    <List dense component="div" role="list">
                      {/* Loop on all attributes based on current topParentName */}
                      {attributes.sort(simpleCompare).map((attrib) => {
                        return (
                          // if current attribute is allowed to be displayed
                          // hiddenLabels excludes uuid, id, gid...
                          !hiddenLabels.includes(attrib) && (
                            <ListItem
                              dense
                              key={attrib}
                              role="listitem"
                              button
                              style={{
                                height: 26,
                                backgroundColor:
                                  active === attrib
                                    ? theme.palette.highlight.active
                                    : "",
                              }}
                              onClick={() => {
                                // highlight current user attribute choice
                                setActive(attrib);
                                // get automatically the configs of current attribute
                                saveConfig(attrib);
                              }}
                              onDoubleClick={() =>
                                // add attribute to the SQL Request <CustomTextField />
                                setSqlRequest(sqlRequest + attrib + " ")
                              }
                            >
                              <ListItemText id={attrib} primary={attrib} />
                            </ListItem>
                          )
                        );
                      })}
                    </List>
                  )}
                </Paper>
              </Grid>

              {/* .......2) SQL buttons....... */}
              <Grid item xs={3} lg={2} container justifyContent="center">
                {sqlOperators.map((operator) => (
                  <Button
                    key={operator}
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={() => setSqlRequest(sqlRequest + operator + " ")}
                  >
                    {operator}
                  </Button>
                ))}
              </Grid>

              {/* .......3) Configs....... */}
              <Grid item xs={5}>
                <Paper className={classes.paper}>
                  <List dense component="div" role="list">
                    {/*
                    condition 'configs instanceof Array' takes consideration of
                    saveConfig() return : case current attribute doesn't trigger
                    the API call, configs = `L'attribut < ${attrib} > contient trop de valeurs.`
                */}
                    {configs.length > 0 && configs instanceof Array ? (
                      configs.sort(simpleCompare).map((value) => {
                        const labelId = `transfer-list-item-${value}-label`;

                        return (
                          value !== null && (
                            <Fragment key={labelId}>
                              <ListItem
                                onDoubleClick={() => {
                                  setSqlRequest(
                                    sqlRequest +
                                      (intAttributes[
                                        filterDialog.topParentName
                                      ].includes(active)
                                        ? value
                                        : "'" + value + "'")
                                  );
                                }}
                                dense
                                key={value}
                                button
                                role="listitem"
                                style={{
                                  height: 26,
                                }}
                              >
                                <ListItemText
                                  id={labelId}
                                  style={{ width: 100 }}
                                  primary={value}
                                  primaryTypographyProps={{
                                    noWrap: true,
                                    style: { letterSpacing: 0 },
                                  }}
                                />
                              </ListItem>
                              <Divider />
                            </Fragment>
                          )
                        );
                      })
                    ) : (
                      <ListItem
                        disabled
                        dense
                        role="listitem"
                        style={{
                          height: 26,
                        }}
                      >
                        {/*
                        Conditionnal display when filter dialog
                        is just lauched (no configs loaded)
                    */}
                        <ListItemText
                          primary={
                            typeof configs === "string"
                              ? configs
                              : t("sqlRequest.selectAttribute")
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>

            {/* .............Request text field............. */}
            <CustomTextField
              style={{ marginTop: 16 }}
              label={t("request")}
              variant="outlined"
              required
              multiline
              value={sqlRequest}
              maxRows={10}
              onChange={(event) => {
                event.persist();
                setSqlRequest(event.target.value);
              }}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setSqlRequest("")}
                      edge="end"
                      color="secondary"
                      size="small"
                    >
                      {sqlRequest !== "" && <ClearIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography
              style={{
                fontSize: theme.typography.fontSizeSmall,
                fontFamily: theme.typography.fontFamily,
              }}
              color="textSecondary"
            >
              <Trans i18nKey="sqlRequest.numberValueHint">
                Pour les attributs avec des valeurs en nombre, ne pas ajouter de
                guillemets. Ex:{" "}
                <strong style={{ fontWeight: "bold" }}>capacite = 144</strong>
              </Trans>
            </Typography>
          </DialogContent>

          {/* .............Dialog actions buttons............. */}
          <DialogActions>
            {/* Cancel filter creation/edition */}
            <Button
              onClick={() => {
                setFilterDialog(false);
              }}
              color="secondary"
            >
              {t("cancel")}
            </Button>

            {/* Save filter */}
            <Tooltip
              title={
                String.isEmpty(filterTitle)
                  ? t("layers.filters.nameRequired")
                  : t("sqlRequest.emptyRequestDisallowed")
              }
              open={String.isEmpty(sqlRequest) || String.isEmpty(filterTitle)}
            >
              <Button
                onClick={() => {
                  if (editMode) {
                    // action sent to map (Ilion)
                    window.postMessage([
                      "editFilterLayer",
                      filterDialog.topParentName,
                      filterDialog,
                      sqlRequest,
                      filterTitle,
                    ]);
                  } else {
                    // action sent to map (Ilion)
                    window.postMessage([
                      "createFilterLayer",
                      filterDialog.topParentName,
                      filterDialog,
                      sqlRequest,
                      filterTitle,
                    ]);
                  }
                  // closes filter dialog
                  setFilterDialog(false);
                }}
                variant="contained"
                color="primary"
                disabled={
                  errorHandler() !== undefined ||
                  String.isEmpty(sqlRequest) ||
                  String.isEmpty(filterTitle)
                }
              >
                {t("ok")}
              </Button>
            </Tooltip>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

FilterDialog.propTypes = {
  filterDialog: PropTypes.object.isRequired,
  setFilterDialog: PropTypes.func.isRequired,
  layers: PropTypes.object.isRequired,
};

export default FilterDialog;
