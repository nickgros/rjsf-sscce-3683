import { useStyles } from "src/styles/MaterialUiComponentsStyles/TaskManagerStyle";
import { Typography, Chip, Box } from "@material-ui/core";
import { ErrorOutlineOutlined, HelpOutlineOutlined } from "@material-ui/icons";

import PropTypes from "prop-types";

console.dev("FailedTask");

const FailedTask = ({ t, task, setSnackbar, relativeTaskDate }) => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.listWrapper}>
        <ErrorOutlineOutlined className={classes.failedIcon} />
        <Box>
          <Typography variant="body2" className={classes.listItemText}>
            {task.label}
          </Typography>
          <Typography variant="body2" className={classes.listItemDate}>
            {relativeTaskDate(task)}
          </Typography>
        </Box>
      </Box>
      <Chip
        classes={{
          root: classes.failedChipRoot,
        }}
        size="medium"
        icon={
          <HelpOutlineOutlined
            classes={{
              root: classes.failedIconRoot,
            }}
          />
        }
        label={t("taskManager.failed")}
        onClick={() => setSnackbar("error", "top", task.result.error, true)}
      />
    </>
  );
};

FailedTask.propTypes = {
  t: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  setSnackbar: PropTypes.func.isRequired,
  relativeTaskDate: PropTypes.func.isRequired,
};

export default FailedTask;
