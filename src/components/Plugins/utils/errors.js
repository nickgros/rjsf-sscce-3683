import { useTranslation } from "react-i18next";

export const useErrors = () => {
  const { t } = useTranslation();

  function errorsSplicePlan(errors) {
    console.log(errors);
    return errors.map((error) => {
      if (error) {
        console.log(error);
        error.message = `${t("required")}*`;
        if (error.property) {
          switch (error.property) {
            case ".cables.constraints.tr.authorized_ref":
              error.stack = `${t("cable_one")} -- ${t("plugin.transport")} ${t(
                "plugin.required"
              )}`;
              break;
            case ".cables.constraints.di.authorized_ref":
              error.stack = `${t("cable_one")} -- ${t(
                "plugin.distribution"
              )} ${t("plugin.required")}`;
              break;
            case ".cables.constraints.ad.authorized_ref":
              error.stack = `${t("cable_one")} -- ${t(
                "adduction"
              ).toLowerCase()} ${t("plugin.required")}`;
              break;
            case ".cables.constraints.ab.authorized_ref":
              error.stack = `${t("cable_one")} -- ${t("plugin.subscriber")} ${t(
                "plugin.required"
              )}`;
              break;
            case ".nodes.constraints.tr.authorized_ref":
              error.stack = `${t("nodes")} -- ${t("plugin.transport")} ${t(
                "plugin.required"
              )}`;
              break;
            case ".nodes.constraints.di.authorized_ref":
              error.stack = `${t("nodes")} -- ${t("plugin.distribution")} ${t(
                "plugin.required"
              )}`;
              break;
            case ".nodes.constraints.ad.authorized_ref":
              error.stack = `${t("nodes")} -- ${t(
                "adduction"
              ).toLowerCase()} ${t("plugin.required")}`;
              break;
            case ".nodes.constraints.ab.authorized_ref":
              error.stack = `${t("nodes")} -- ${t("plugin.subscriber")} ${t(
                "plugin.required"
              )}`;
              break;
          }
        }
      }
      return error;
    });
  }
  function errorsPattern(errors) {
    return errors.map((error) => {
      if (error.stack) {
        error.stack = t("form.unsupportedCharacters");
      }
      if (error.name === "pattern") {
        error.message = t("form.unsupportedCharacters");
      }
      return error;
    });
  }
  return { errorsSplicePlan, errorsPattern };
};
