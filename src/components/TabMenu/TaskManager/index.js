import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "src/styles/MaterialUiComponentsStyles/TaskManagerStyle";

import SettingsContext from "src/components/Settings/context/SettingsContext";
import SuccessTask from "src/components/TabMenu/TaskManager/SuccessTask";
import FailedTask from "src/components/TabMenu/TaskManager/FailedTask";

import { compareByAttribute, localeDate } from "src/utils/GenericFunctions";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Chip,
  Box,
} from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import { format, formatDistanceToNow } from "date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { ExpandMore, History } from "@material-ui/icons";

import PropTypes from "prop-types";

console.dev("TaskManager");

const TaskManager = ({ setSnackbar, getTasksFromDate, taskStatusCheck }) => {
  const { t, i18n } = useTranslation();
  const context = useContext(SettingsContext);
  const classes = useStyles();

  const taskCategories = [
    ...new Set(context.taskList.map((task) => task.name)),
  ];

  const relativeTaskDate = (task) => {
    const entryDate = new Date(task.crea_date);
    const dateToDisplay = entryDate.setHours(
      entryDate.getHours() + entryDate.getTimezoneOffset() / 60
    );
    return formatDistanceToNow(new Date(dateToDisplay), {
      locale: localeDate(i18n.language),
      addSuffix: true,
    });
  };

  const filteredTaskList = (date) => {
    const selectedDay = format(date, "yyyy-MM-dd");
    getTasksFromDate("Odyssee", selectedDay).then((tasks) => {
      context.onSetTaskList("setTaskList", tasks);
      taskStatusCheck(tasks);
    });
  };

  const filteredDays = (date) => {
    const datesList =
      context.taskDates.map((taskDate) => {
        return taskDate;
      }) + new Date();
    const calendarDate = new Date(date).toDateString();
    return !datesList.includes(calendarDate);
  };

  return (
    <Box className={classes.toolWrapper}>
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={localeDate(i18n.language)}
      >
        <DatePicker
          disableFuture
          animateYearScrolling
          margin="dense"
          open={context.datePickerOpen}
          format="PPPP"
          value={context.selectedDate}
          onChange={(date) => {
            context.onSetTaskList(
              "setSelectedDate",
              new Date(date).toDateString()
            );
            filteredTaskList(date);
          }}
          onClose={() => context.onSetTaskList("closePicker")}
          shouldDisableDate={filteredDays}
          className={classes.datePicker}
        />
      </MuiPickersUtilsProvider>
      {Array.isEmpty(context.taskList) ? (
        <Typography variant="body2" className={classes.emptyList}>
          {t("taskManager.noTask")}
        </Typography>
      ) : (
        taskCategories.map((category) => (
          <>
            <Accordion
              key={category}
              defaultExpanded={true}
              className={classes.categoryAccordion}
              classes={{
                root: classes.categoryAccordionRoot,
              }}
            >
              <Box className={classes.categoryWrapper}>
                <AccordionSummary
                  className={classes.categorySummary}
                  expandIcon={<ExpandMore />}
                >
                  <Typography
                    variant="subtitle1"
                    className={classes.categoryTitle}
                  >
                    {t(`taskManager.${category}`)}
                  </Typography>
                </AccordionSummary>
              </Box>
              {context.taskList
                .filter((task) => task.name === category)
                .sort((a, b) => compareByAttribute(a, b, "crea_date"))
                .map((task, index) => (
                  <>
                    <AccordionDetails
                      classes={{
                        root: classes.listDetailsRoot,
                      }}
                    >
                      {task.status === "ok" ? (
                        <SuccessTask
                          t={t}
                          task={task}
                          index={index}
                          relativeTaskDate={relativeTaskDate}
                        />
                      ) : task.status === "error" ? (
                        <FailedTask
                          t={t}
                          task={task}
                          index={index}
                          setSnackbar={setSnackbar}
                          relativeTaskDate={relativeTaskDate}
                        />
                      ) : (
                        <>
                          <Box display="flex" alignItems="center">
                            <CircularProgress
                              size={23}
                              classes={{
                                svg: classes.pendingSpinnerRoot,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                className={classes.listItemText}
                              >
                                {task.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                className={classes.listItemDate}
                              >
                                {relativeTaskDate(task)}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            classes={{
                              root: classes.pendingChipRoot,
                            }}
                            size="medium"
                            icon={
                              <History
                                classes={{
                                  root: classes.pendingIconRoot,
                                }}
                              />
                            }
                            label={t("taskManager.pending")}
                          />
                        </>
                      )}
                    </AccordionDetails>
                  </>
                ))}
            </Accordion>
          </>
        ))
      )}
    </Box>
  );
};

TaskManager.propTypes = {
  setSnackbar: PropTypes.func.isRequired,
  getTasksFromDate: PropTypes.func.isRequired,
  taskStatusCheck: PropTypes.func.isRequired,
};

export default TaskManager;
