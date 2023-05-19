import { useStyles } from "src/styles/MaterialUiComponentsStyles/TaskManagerStyle";
import { Typography, Chip, Link, Box } from "@material-ui/core";

import {
  CheckCircleOutlined,
  CheckOutlined,
  AttachmentOutlined,
} from "@material-ui/icons";

import PropTypes from "prop-types";

console.dev("SuccessTask");

const SuccessTask = ({ t, task, relativeTaskDate }) => {
  const classes = useStyles();

  const taskDocuments = Object.values(task.result);

  return (
    <>
      <Box className={classes.listWrapper}>
        <CheckCircleOutlined className={classes.successIcon} />
        <Box>
          <Typography variant="body2" className={classes.listItemText}>
            {task.label}
          </Typography>
          <Typography variant="body2" className={classes.listItemDate}>
            {relativeTaskDate(task)}
          </Typography>
        </Box>
      </Box>
      {!Array.isEmpty(taskDocuments) ? (
        <Link
          classes={{
            root: classes.successLinkRoot,
          }}
          href={taskDocuments[0]}
          target="_blank"
          rel="noreferrer"
          download
        >
          <Chip
            classes={{
              root: classes.documentChipRoot,
            }}
            clickable
            size="medium"
            icon={
              <AttachmentOutlined
                classes={{
                  root: classes.successIconRoot,
                }}
              />
            }
            label={t("taskManager.link")}
          />
        </Link>
      ) : (
        <Chip
          classes={{
            root: classes.successChipRoot,
          }}
          size="medium"
          icon={
            <CheckOutlined
              classes={{
                root: classes.successIconRoot,
              }}
            />
          }
          label={t("taskManager.sucess")}
        />
      )}
    </>
  );
};

SuccessTask.propTypes = {
  t: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  relativeTaskDate: PropTypes.func.isRequired,
};

export default SuccessTask;
