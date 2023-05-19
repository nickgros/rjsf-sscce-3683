import { createActionLog } from "redux-action-log";

// redux-action-log record the redux action history and access it
// limit: Soft limit to the number of actions recorded. May be set to null to mean no limit. Defaults to 200.
const actionLog = createActionLog({ limit: 100 });

export default actionLog;
