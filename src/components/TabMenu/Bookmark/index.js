import React, { memo } from "react";
import PropTypes from "prop-types";

// Mui styles
import { useTheme, alpha } from "@material-ui/core/styles";
import { useStyles } from "src/styles/MaterialUiComponentsStyles/TabMenuStyle";

// LocalStorage handler
import SettingsContext from "src/components/Settings/context/SettingsContext";

// Generic functions
import { compareByAttribute } from "src/utils/GenericFunctions";

import { IconButton, Link, TextField, Typography } from "@material-ui/core";
import { Clear, Done, Edit } from "@material-ui/icons";

import { useTranslation } from "react-i18next";

const initialEditState = {
  isActive: false,
  id: null,
  name: "",
  coords: [],
};

const Bookmark = ({ tabPaperWidth }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const [editBookmark, setEditBookmark] = React.useState(initialEditState);

  const context = React.useContext(SettingsContext);
  const bookmarks = context.bookmarks;

  /**
   * Save new bookmark name
   * @param {object} bookmark current bookmark
   */
  const saveBookmark = (bookmark) => {
    setEditBookmark(initialEditState);
    if (
      editBookmark.isActive &&
      editBookmark.name !== "" &&
      editBookmark.name !== bookmark.name
    ) {
      setEditBookmark((prevState) => ({
        ...prevState,
        name: editBookmark.name,
      }));
      // eslint-disable-next-line no-unused-vars
      const { isActive, ...newBookmark } = editBookmark;
      context.onSetBookmark("update", newBookmark);
    }
  };

  /**
   * Toggle edition mode on current bookmark
   * @param {object} bookmark current bookmark
   */
  const toggleBookmark = (bookmark) => {
    setEditBookmark((prevState) => ({
      ...prevState,
      isActive: true,
      id: editBookmark.isActive ? null : bookmark.id,
      coords: bookmark.coords,
      name: bookmark.name,
      zoom: bookmark.zoom,
    }));
  };

  return (
    <>
      {bookmarks !== null && bookmarks.length ? (
        bookmarks
          .sort((a, b) => compareByAttribute(a, b, "id"))
          .map((bookmark) => (
            <div key={bookmark.id} className={classes.tabListItemContainer}>
              <div className={classes.tabListItemLeftContainer}>
                <Link
                  variant="body2"
                  component="p"
                  color="textPrimary"
                  className={classes.tabListItemText}
                  underline={
                    editBookmark.isActive && bookmark.id === editBookmark.id
                      ? "none"
                      : "hover"
                  }
                  style={{
                    maxWidth: `${tabPaperWidth - 100}px`,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    !editBookmark.isActive &&
                    window.postMessage([
                      "fitImportLayerAndBookmark",
                      "bookmark",
                      bookmark,
                    ])
                  }
                >
                  {editBookmark.isActive && bookmark.id === editBookmark.id ? (
                    <TextField
                      value={editBookmark.name}
                      placeholder={bookmark.name}
                      autoFocus
                      size="small"
                      style={{ height: 20 }}
                      onKeyUp={(e) =>
                        e.key === "Enter" && saveBookmark(bookmark)
                      }
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputProps={{
                        style: {
                          fontSize: theme.typography.fontSizeSmall + 1,
                        },
                      }}
                      onChange={(event) =>
                        setEditBookmark((prevState) => ({
                          ...prevState,
                          name: event.target.value,
                          zoom: bookmark.zoom,
                        }))
                      }
                    />
                  ) : (
                    bookmark.name
                  )}
                </Link>
              </div>
              {/* ..........ACTION BUTTONS.......... */}
              <div className={classes.tabListItemRightContainer}>
                {editBookmark.isActive && bookmark.id === editBookmark.id ? (
                  // SAVE BOOKMARK
                  <IconButton
                    onClick={() => saveBookmark(bookmark)}
                    color="primary"
                    size="small"
                  >
                    <Done
                      style={{
                        fontSize: theme.typography.fontSize,
                      }}
                    />
                  </IconButton>
                ) : (
                  // EDIT BOOKMARK
                  <IconButton
                    onClick={() => toggleBookmark(bookmark)}
                    color="primary"
                    size="small"
                    disabled={
                      editBookmark.isActive && bookmark.id !== editBookmark.id
                    }
                  >
                    <Edit
                      style={{
                        fontSize: theme.typography.fontSize,
                      }}
                    />
                  </IconButton>
                )}
                {/* DELETE BOOKMARK */}
                <IconButton
                  onClick={() => context.onSetBookmark("remove", bookmark)}
                  color="secondary"
                  size="small"
                >
                  <Clear
                    style={{
                      fontSize: theme.typography.fontSize,
                    }}
                  />
                </IconButton>
              </div>
            </div>
          ))
      ) : (
        <Typography
          variant="body2"
          style={{
            textAlign: "center",
            color: alpha(theme.palette.grey[500], 0.6),
            fontSize: theme.typography.fontSizeSmall,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {t("bookmarks.empty")}
        </Typography>
      )}
    </>
  );
};

Bookmark.propTypes = {
  tabPaperWidth: PropTypes.number.isRequired,
};

export default memo(Bookmark);
