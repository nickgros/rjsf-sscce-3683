/* eslint-disable no-case-declarations */
import URL from "src/utils/URL";
import { API, API_ODYSSEE } from "src/utils/API";
import axios from "axios";

// ? YAML parser linrary for JS
// https://github.com/eemeli/yaml

import {
  arrayToObject,
  oneOfLayers,
  orderProps,
  refreshWinAfterAPICall,
  dateGmtFormat,
} from "src/utils/GenericFunctions";
import { get as getProjection } from "ol/proj";
import EPSG from "src/utils/EPSG";
import GeoJSON from "ol/format/GeoJSON";

// constants
import objectTypes from "src/utils/constants/objectTypes";

import appProcessTypes from "src/actions/appProcess/actionTypes";
import mapTypes from "src/actions/map/actionTypes";
import cableTypes from "src/actions/cable/actionTypes";
import siteTypes from "src/actions/site/actionTypes";
import ptTechTypes from "src/actions/ptTech/actionTypes";
import supportTypes from "src/actions/support/actionTypes";
import geometrieTypes from "src/actions/geometrie/actionTypes";
import modelTypes from "src/actions/model/actionTypes";
import relationsTypes from "src/actions/relations/actionTypes";
import epissureTypes from "src/actions/epissure/actionTypes";
import domaineTypes from "src/actions/domaine/actionTypes";
import pluginsTypes from "../actions/plugins/actionTypes";

import cableActions from "src/actions/cable/actionCreators";
import siteActions from "src/actions/site/actionCreators";
import ptTechActions from "src/actions/ptTech/actionCreators";
import supportActions from "src/actions/support/actionCreators";
import relationsActions from "src/actions/relations/actionCreators";
import epissureActions from "src/actions/epissure/actionCreators";
import appProcessActions from "src/actions/appProcess/actionCreators";
import modelActions from "src/actions/model/actionCreators";
import domaineActions from "src/actions/domaine/actionCreators";
import pluginsActions from "src/actions/plugins/actionCreators";

import { storeProjectionFromEpsgIo } from "src/store/reducers/mapReducer";
import { projectionConst } from "src/utils/constants/projectionConst.js";

import i18next from "i18next";

const ajaxMiddleware = (store) => (next) => (action) => {
  console.info("AJAX MIDDLEWARE", action);

  switch (action.type) {
    //.................APP PROCESS.................

    // Get Feature
    case appProcessTypes.GET_FEATURE:
      return axios
        .get(
          `${API_ODYSSEE}/v1/search?table=${action.objType}&attribut=${
            action.attribute
          }&value=${action.value}&operator=${action.operator || "equal"}`
        )
        .then(({ data }) => {
          if (data instanceof Array) {
            if (Array.isEmpty(data)) {
              alert(i18next.t("noResults"));
              return;
            } else {
              if (data.length === 1) {
                const featureProps = data[0];
                const currentFeature = new GeoJSON().readFeature(
                  featureProps.geom
                );
                delete featureProps.geom;
                featureProps["@type"] = action.objType;
                currentFeature.setProperties(featureProps);

                return currentFeature;
              } else {
                let readFeaturesArr = [];

                data.map((featureProps) => {
                  const currentFeature = new GeoJSON().readFeature(
                    featureProps.geom
                  );
                  delete featureProps.geom;
                  featureProps["@type"] = action.objType;
                  currentFeature.setProperties(featureProps);

                  readFeaturesArr.push(currentFeature);
                });

                return readFeaturesArr;
              }
            }
          } else {
            return data;
          }
        })
        .catch((error) => {
          console.error(i18next.t("errors.generic"));
          return error;
        });

    // Add object
    case appProcessTypes.ADD_NEW_OBJECT:
      return API.to(
        action.objectType === "equipement" ? "equipment" : action.objectType
      )
        .post("", {
          headers: {
            "Content-Type": oneOfLayers(action.objectType)
              ? "application/geo+json"
              : "application/json",
          },
          data: action.insertObject,
        })
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          console.error(error);
          return error;
        });

    // Delete object
    case appProcessTypes.HANDLE_DELETE:
      API.to(action.objectType)
        .delete(`/${action.objId}`)
        .then(function () {
          if (oneOfLayers(action.objectType)) {
            store.getState().appProcessReducer.snackbar.isOpen === false &&
              setTimeout(
                appProcessActions.setSnackbar(
                  "success",
                  "top",
                  "alerts.deleteObjectSuccess",
                  true
                ),
                3000
              );

            window.open("", "_self", "");
            window.close(self);
            window.opener.location.reload(false);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    // Update Form
    case appProcessTypes.UPDATE_FORM:
      return API.to(action.formName)
        .put(`/${action.form.uuid}`, {
          headers: {
            "Content-Type": "application/json",
          },
          data: action.form,
        })
        .then(() => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "success",
              "top",
              "alerts.saveSuccess",
              true
            )
          );
        })
        .catch((error) => {
          console.error(error);
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              "alerts.errors.500",
              true
            )
          );
        });

    // Emprises
    case appProcessTypes.GET_EMPRISES:
      API.to("emprise")
        .get("")
        .then((emprisesArr) => {
          const emprises = arrayToObject(emprisesArr, "id");
          store.dispatch(appProcessActions.storeEmprises(emprises));
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    // Configuration by type (used in AutoCompleteSelectField.js)
    case appProcessTypes.GET_CONFIGS_BY_TYPE:
      API.to(
        // condition for "armoires" -> /armoires/configuration
        action.objType === "armoire"
          ? "cabinet"
          : // condition for "equipement" -> /equipments/configuration
          action.objType === "equipement"
          ? "equipment"
          : action.objType === "groupe"
          ? "groupes_infra"
          : // condition for "equipement" -> /domains/configuration
          action.objType === "domains"
          ? "domaine"
          : // regular form name
            action.objType
      )
        // API call ex: /cables/configuration
        .get("/configuration")
        .then(function (configs) {
          const objType =
            action.objType === "equipement" ? "equipment" : action.objType;
          store.dispatch(
            appProcessActions.storeConfigsByType(objType, configs)
          );
        })
        .catch((error) => console.error(error));
      break;

    // SQL Requests
    case appProcessTypes.GET_SQL_RESULT:
      !action.attributes.includes("uuid") && action.attributes.push("uuid");
      !action.attributes.includes("code") && action.attributes.unshift("code");

      const pages = {
        page: action.page,
        rowsPerPage: action.rowsPerPage,
        offset: action.offset,
      };

      let request = {
        table: action.table,
        order: action.order,
        attributes: action.attributes,
        message: action.message,
        total: 0,
      };

      store.getState().appProcessReducer.sqlResult.length !== 0 &&
        store.dispatch(appProcessActions.storeSQLResult([], request, pages));

      axios
        .get(`${API_ODYSSEE}/v1/select_where`, {
          params: {
            table: action.table,
            attributs: action.attributes.join(),
            where: action.message,
            order: action.order,
            limit: action.rowsPerPage,
            offset: action.offset,
          },
        })
        .then(({ data }) => {
          if (data.length > 0) {
            request.total = data[0].count_result;
            store.dispatch(
              appProcessActions.storeSQLResult(data, request, pages)
            );
          } else {
            alert(i18next.t("noResults"));
            store.dispatch(
              appProcessActions.storeSQLResult(["none"], request, pages)
            );
          }
        })
        .catch(() => {
          alert(i18next.t("alerts.sqlRequestError"));
          store.dispatch(
            appProcessActions.storeSQLResult(["none"], request, pages)
          );
        });
      break;

    // .................EPISSURE.................
    case epissureTypes.GET_C_AFFECT_INFOS:
      API.to(action.objType)
        .get(`/${action.objId}`)
        .then(function (response) {
          store.dispatch(epissureActions.storeCAffectInfos(response));
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    case epissureTypes.GET_C_AFFECT_DATA:
      API.to(action.objType)
        .get(`/${action.objId}/epissures`)
        .then(function (response) {
          store.dispatch(epissureActions.storeCAffectData(response));
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    case epissureTypes.GET_C_AFFECT_CABLES_DATA:
      // Get related cables
      // Route BPE : /bpes/:bpe_id/cables
      // Route EQUIP : /cabinets/:cabinet_id/cables
      API.to(action.objType)
        .get(`/${action.objId}/cables`)
        .then(function (response) {
          store.dispatch(epissureActions.storeCAffectCablesData(response));

          // Get attributions by cables fetched previously
          // Route BPE : /bpes/:bpe_id/cables/:cable_gid/fibres/attributions
          // Route EQUIP : /cabinets/:cabinet_id/cables/:cable_gid/fibres/attributions
          response.map((cable) => {
            API.to(action.objType)
              .get(`/${action.objId}/cables/${cable.gid}/fibres/attributions`)
              .then(function (response) {
                store.dispatch(
                  epissureActions.storeAttributionsByCable(cable.code, response)
                );
              })

              .catch(function (error) {
                console.error(error);
              });
          });
        })
        .catch(function (error) {
          console.error(error);
        });

      break;

    case epissureTypes.SAVE_C_AFFECT:
      API.to(action.objType)
        .get(`/${action.objId}/epissures`)
        .then(function (response) {
          const difference = store
            .getState()
            .epissureReducer.cAffectData.filter(
              (row, index) =>
                row.etat !== response[index].etat ||
                row.c1_code !== response[index].c1_code ||
                row.c2_code !== response[index].c2_code
            );

          const propsArr = [
            "id_fib1",
            "sens1",
            "id_fib2",
            "sens2",
            "etat",
            "e_uuid",
          ];

          if (difference.length > 0) {
            difference.map((row) =>
              Object.keys(row).map(
                (key) =>
                  !propsArr.includes(key) &&
                  delete row[key] &&
                  (row.uuid = row.e_uuid)
              )
            );

            difference.map((row) =>
              Object.keys(row).map((key) => key === "e_uuid" && delete row[key])
            );

            API.to("cAffect")
              .put("", {
                headers: {
                  "Content-Type": "application/json",
                },
                data: difference,
              })
              .then(function () {
                alert(i18next.t("alerts.saveSuccessReload"));
                window.location.reload();
              })
              .catch(function (error) {
                console.error(error);
                alert(i18next.t("errors.500"));
              });
          }
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    // .................MAP.................
    case mapTypes.GET_PROJECTION_FROM_EPSG_IO:
      const urlProjection =
        URL.getQueryParameters().projection || projectionConst[0].value;
      const askedProjection = getProjection(urlProjection);

      if (askedProjection === null) {
        EPSG.search(urlProjection)
          .then(({ code, bbox }) => {
            store.dispatch(storeProjectionFromEpsgIo(code, bbox));
          })
          .catch((error) => console.error(error));
      }
      break;

    //.................GEOMETRY.................
    case geometrieTypes.SAVE_NEW_GEOMETRY:
      const type = action.feature.get("@type");
      const uuid = action.feature.get("uuid");

      const objGeoJSON = new GeoJSON().writeFeature(action.feature);

      return API.to(type).put(`/${uuid}/geometry`, {
        headers: {
          "Content-Type": "application/geo+json",
        },
        data: objGeoJSON,
      });

    //.................RELATIONS.................
    case relationsTypes.CREATE_R_NDS:
      API.to("rNds")
        .post("", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            cable_uuid: action.cableUuid,
            lt_uuid: action.ndsType === "local" ? action.ndsUuid : "",
            ptt_uuid: action.ndsType === "pt_tech" ? action.ndsUuid : "",
            categorie: action.category,
            lovage: action.lovage,
          },
        })
        .then(function ({ categorie, lovage, uuid, id_lt, id_ptt }) {
          const nds = action.ndsObj;

          // If added as PASSAGE.........................................
          if (action.category === 3) {
            // Dispatch in PassageCable.js (if a cable is open)
            if (
              store.getState().appProcessReducer.open.objectType === "cable"
            ) {
              nds.categorie = categorie;
              nds.lovage = lovage;
              nds.r_uuid = uuid;
              store.dispatch(relationsActions.storePassages([nds]));

              // Dispatch in TableRCable.js (if a pt_tech or local is open)
            } else {
              const rNds = {
                categorie,
                lovage,
                uuid,
              };

              const newRNds = [{ cable: nds, r_cable: rNds }];

              store.dispatch(
                relationsActions.storeRCables(
                  newRNds,
                  action.ndsType,
                  id_lt || id_ptt
                )
              );
            }

            // If added as ORIGINE or EXTREMITE............................
          } else {
            nds.hierarchy = objectTypes.nds;
            nds.categorie = categorie;
            nds.r_uuid = uuid;
            nds.objectType = action.ndsType;

            store.dispatch(
              action.category === 1
                ? relationsActions.storeOrigineCable(action.ndsType, nds)
                : relationsActions.storeExtremiteCable(action.ndsType, nds)
            );

            // .......................LOCAL..........................
            if (action.ndsType === "local") {
              // Get Local ARMOIRES
              API.to("local")
                .get(`/${action.ndsObj.id}/cabinets`)
                .then((armoiresArr) => {
                  let ltChildren = [];

                  if (!Array.isEmpty(armoiresArr)) {
                    armoiresArr.map((arm) => {
                      arm.objectType = "armoire";
                      arm.categorie = categorie;
                      arm.hierarchy = objectTypes.ndi;
                    });
                  }

                  ltChildren = ltChildren.concat(armoiresArr);

                  // Get Local BPES
                  API.to("local")
                    .get(`/${action.ndsObj.id}/bpes`)
                    .then((bpesArr) => {
                      if (!Array.isEmpty(bpesArr)) {
                        bpesArr.map((bpe) => {
                          bpe.objectType = "bpe";
                          bpe.categorie = categorie;
                          bpe.hierarchy = objectTypes.ndi;
                        });
                      }

                      ltChildren = ltChildren.concat(bpesArr);

                      if (!Array.isEmpty(ltChildren)) {
                        if (ltChildren.length === 1) {
                          const ndiToAdd = ltChildren[0];

                          API.to("rNdi")
                            .post("", {
                              headers: {
                                "Content-Type": "application/json",
                              },
                              data: {
                                cable_uuid: action.cableUuid,
                                bpe_uuid:
                                  ndiToAdd.objectType === "bpe"
                                    ? ndiToAdd.uuid
                                    : "",
                                arm_uuid:
                                  ndiToAdd.objectType === "armoire"
                                    ? ndiToAdd.uuid
                                    : "",
                                categorie: action.category,
                              },
                            })
                            .then(function ({ uuid }) {
                              ndiToAdd.r_uuid = uuid;

                              store.dispatch(
                                action.category === 1
                                  ? relationsActions.storeOrigineCable(
                                      ndiToAdd.objectType,
                                      ndiToAdd
                                    )
                                  : relationsActions.storeExtremiteCable(
                                      ndiToAdd.objectType,
                                      ndiToAdd
                                    )
                              );
                            })
                            .catch(function (error) {
                              console.error(error);
                            });
                        } else {
                          const ndiChoices = arrayToObject(ltChildren, "code");

                          store.dispatch(
                            relationsActions.storeNdiChoices(ndiChoices)
                          );
                        }
                      }
                    });
                });

              // .......................PT TECH..........................
            } else if (action.ndsType === "pt_tech") {
              // Get Ptt BPES
              API.to("pt_tech")
                .get(`/${action.ndsObj.gid}/bpes`)
                .then((bpesArr) => {
                  if (!Array.isEmpty(bpesArr)) {
                    bpesArr.map((bpe) => {
                      bpe.objectType = "bpe";
                      bpe.categorie = categorie;
                      bpe.hierarchy = objectTypes.ndi;
                    });

                    if (bpesArr.length === 1) {
                      const ndiToAdd = bpesArr[0];

                      API.to("rNdi")
                        .post("", {
                          headers: {
                            "Content-Type": "application/json",
                          },
                          data: {
                            cable_uuid: action.cableUuid,
                            bpe_uuid: ndiToAdd.uuid,
                            arm_uuid: "",
                            categorie: action.category,
                          },
                        })
                        .then(function ({ uuid }) {
                          ndiToAdd.r_uuid = uuid;

                          store.dispatch(
                            action.category === 1
                              ? relationsActions.storeOrigineCable(
                                  "bpe",
                                  ndiToAdd
                                )
                              : relationsActions.storeExtremiteCable(
                                  "bpe",
                                  ndiToAdd
                                )
                          );
                        })
                        .catch(function (error) {
                          console.error(error);
                        });
                    } else {
                      const ndiChoices = arrayToObject(bpesArr, "code");

                      store.dispatch(
                        relationsActions.storeNdiChoices(ndiChoices)
                      );
                    }
                  }
                });
            }
          }

          // Will refresh concerned opened windows after an API call
          refreshWinAfterAPICall();
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    case relationsTypes.CREATE_R_NDI:
      API.to("rNdi")
        .post("", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            cable_uuid: action.cableUuid,
            bpe_uuid: action.ndiType === "bpe" ? action.ndiUuid : "",
            arm_uuid: action.ndiType === "armoire" ? action.ndiUuid : "",
            categorie: action.category,
          },
        })
        .then(function ({ categorie, uuid, id_arm, id_bpe }) {
          const ndi = action.ndiObj;

          // Dispatch in OrigineExtremiteCable (if a cable is open)
          if (store.getState().appProcessReducer.open.objectType === "cable") {
            ndi.categorie = categorie;
            ndi.hierarchy = objectTypes.ndi;
            ndi.r_uuid = uuid;
            ndi.objectType = action.ndiType;

            store.dispatch(
              action.category === 1
                ? relationsActions.storeOrigineCable(action.ndiType, ndi)
                : relationsActions.storeExtremiteCable(action.ndiType, ndi)
            );
          } else {
            const rNdi = {
              categorie,
              uuid,
            };

            const newRNdi = [{ cable: ndi, r_cable: rNdi }];

            store.dispatch(
              relationsActions.storeRCables(
                newRNdi,
                action.ndiType,
                id_arm || id_bpe
              )
            );
          }

          // Will refresh concerned opened windows after an API call
          refreshWinAfterAPICall();
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    case relationsTypes.CREATE_R_INFRA:
      API.to("rInfra")
        .post("", {
          headers: {
            "Content-Type": "application/json",
          },
          data: [
            {
              cable_uuid: action.cableUuid,
              infra_uuid: action.infraUuid,
            },
          ],
        })
        .then(function (response) {
          const { id_cable, uuid } = response[0];
          const newInfra = action.infra;

          newInfra.r_cable = { uuid: uuid };

          action.windowType === "cable" &&
            store.dispatch(
              relationsActions.storeRInfras([newInfra], "cable", id_cable)
            );

          if (action.windowType instanceof Object) {
            let newRelationCable = action.windowType;
            newRelationCable.r_cable.uuid = uuid;
            newRelationCable.cable.r_cable.uuid = uuid;

            store.dispatch(
              relationsActions.storeRCables(
                [newRelationCable],
                "infra",
                newInfra.id
              )
            );
          }

          // Will refresh concerned opened windows after an API call
          refreshWinAfterAPICall();
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    case relationsTypes.UPDATE_LOVAGE:
      API.to(action.openType)
        .put(`/${action.openUuid}/cables/${action.cableUuid}`, {
          headers: {
            "Content-Type": "application/json",
          },
          data: { lovage: action.lovage },
        })
        .then(() => {
          const { openType, openId, cableCode, lovage } = action;

          store.dispatch(
            relationsActions.storeNewLovage(openType, openId, cableCode, lovage)
          );
        })
        .catch(function (error) {
          console.error(error);
        });
      break;

    case relationsTypes.GET_RELATIONS_CABLE:
      return API.to("cable")
        .get(`/${action.objectId}/r_cables`)
        .then((allRelations) => {
          const objId = action.objectId;

          let nds = [];
          let ndi = [];
          let infras = [];

          Object.keys(allRelations.nds).map((rUuid) => {
            allRelations.nds[rUuid].r_uuid = rUuid;
            nds.push(allRelations.nds[rUuid]);
          });

          Object.keys(allRelations.ndi).map((rUuid) => {
            allRelations.ndi[rUuid].r_uuid = rUuid;
            ndi.push(allRelations.ndi[rUuid]);
          });

          Object.keys(allRelations.infras).map((rUuid) => {
            allRelations.infras[rUuid].r_cable = { uuid: rUuid };
            infras.push(allRelations.infras[rUuid]);
          });

          // STORE_PASSAGES (PassageCable)...................................
          const passages = nds.filter((item) => item.categorie === 3);

          if (!Array.isEmpty(passages)) {
            store.dispatch(relationsActions.storePassages(passages));
          }

          // STORE_[ORIGINE/EXTREMITE]_CABLE (OrigineExtremiteCable).........
          nds = nds.filter((item) => item.categorie !== 3);
          const origineExtremiteCable = { nds, ndi };

          Object.keys(origineExtremiteCable).map((hierarchy) => {
            origineExtremiteCable[hierarchy].map((element) => {
              element.hierarchy = hierarchy;

              // Origine..............
              element.categorie === 1 &&
                store.dispatch(
                  relationsActions.storeOrigineCable(element.type, element)
                );

              // Extremite............
              element.categorie === 2 &&
                store.dispatch(
                  relationsActions.storeExtremiteCable(element.type, element)
                );
            });
          });

          // STORE_R_INFRAS (TableRInfra)......................................
          if (
            allRelations.infras &&
            Object.keys(allRelations.infras).length > 0
          ) {
            store.dispatch(
              relationsActions.storeRInfras(infras, "cable", objId)
            );
          }

          // SET_ACTION_COMPLETE
          store.dispatch(appProcessActions.setActionComplete(true));

          return allRelations;
        })
        .catch((error) => {
          console.error(error);
          return error;
        });

    case relationsTypes.GET_R_CABLES:
      return API.to(action.objectType)
        .get(`/${action.objectId}/r_cables`)
        .then((cables) => {
          const cablesFiltered = cables.filter(
            (cable) => cable.cable.gid !== null
          );
          const objType = action.objectType;
          const objId = action.objectId;

          if (!Array.isEmpty(cablesFiltered)) {
            store.dispatch(
              relationsActions.storeRCables(cablesFiltered, objType, objId)
            );
          }

          // SET_ACTION_COMPLETE
          store.dispatch(appProcessActions.setActionComplete(true));

          return cablesFiltered;
        })
        .catch((error) => {
          console.error(error);
          return error;
        });

    case relationsTypes.GET_R_GROUPES:
      return API.to(action.objectType)
        .get(`/${action.objectId}/groupe_infras`)
        .then((groupes) => {
          const objType = action.objectType;
          const objId = action.objectId;

          store.dispatch(
            relationsActions.storeRGroupes(groupes, objType, objId)
          );

          // SET_ACTION_COMPLETE
          store.dispatch(appProcessActions.setActionComplete(true));

          return groupes;
        })
        .catch((error) => {
          console.error(error);
          return error;
        });

    case relationsTypes.GET_R_INFRAS:
      return API.to(action.objectType)
        .get(`/${action.objectId}/infras`)
        .then((infras) => {
          const infrasFiltered = infras.filter((infra) => infra.code !== null);
          const objType = action.objectType;
          const objId = action.objectId;
          if (!Array.isEmpty(infrasFiltered)) {
            store.dispatch(
              relationsActions.storeRInfras(infrasFiltered, objType, objId)
            );
          }

          // SET_ACTION_COMPLETE
          store.dispatch(appProcessActions.setActionComplete(true));

          return infrasFiltered;
        })
        .catch((error) => {
          console.error(error);
          return error;
        });

    case relationsTypes.GET_ORIGINE_GROUPE:
      return API.to(action.objType)
        .get(`/${action.objId}`)
        .then((objProps) => {
          const objType = action.objType;

          store.dispatch(
            relationsActions.storeOrigineGroupe(
              action.openId,
              objType,
              objProps
            )
          );

          // SET_ACTION_COMPLETE
          store.dispatch(appProcessActions.setActionComplete(true));

          return objProps;
        })
        .catch((error) => {
          console.error(error);
          return error;
        });

    case relationsTypes.GET_EXTREMITE_GROUPE:
      return API.to(action.objType)
        .get(`/${action.objId}`)
        .then((objProps) => {
          const objType = action.objType;

          store.dispatch(
            relationsActions.storeExtremiteGroupe(
              action.openId,
              objType,
              objProps
            )
          );

          // SET_ACTION_COMPLETE
          store.dispatch(appProcessActions.setActionComplete(true));

          return objProps;
        })
        .catch((error) => {
          console.error(error);
          return error;
        });

    //.........DOMAINE.........

    case domaineTypes.GET_DOMAINE:
      API.to("domaine")
        .get(`/${action.gid}`)
        .then((domaine) => {
          store.dispatch(domaineActions.storeDomaine(orderProps(domaine)));
        });
      break;

    //.........CABLES / TUBES / FIBRES.........

    case cableTypes.GET_CABLE:
      API.to("cable")
        .get(`/${action.gid}`)
        .then((cable) => {
          store.dispatch(cableActions.storeCable(orderProps(cable)));
        });
      break;

    case cableTypes.GET_TUBES:
      API.to("cable")
        .get(`/${action.gid}/tubes`)
        .then((tubesArr) => {
          const tubes = arrayToObject(tubesArr, "id");
          store.dispatch(cableActions.storeTubes(tubes));
        });
      break;

    case cableTypes.GET_FIBRES:
      return API.to("tube")
        .get(`/${action.tubeId}/fibres`)
        .then((fibresArr) => {
          const tubeCheckId = action.tubeCheckId;
          const fibres = arrayToObject(fibresArr, "id");
          store.dispatch(cableActions.storeFibres(fibres, tubeCheckId));
          return fibresArr;
        });

    //.........SITE / LOCALS / ARMOIRES / BPES / EQUIPEMENTS / CASSETTES.........

    case siteTypes.GET_SITE:
      API.to("site")
        .get(`/${action.gid}`)
        .then((site) => {
          store.dispatch(siteActions.storeSite(orderProps(site)));
        });
      break;

    case siteTypes.GET_LOCALS:
      return API.to("site")
        .get(`/${action.gid}/locals`)
        .then((localsArr) => {
          const locals = arrayToObject(localsArr, "id");
          store.dispatch(siteActions.storeLocals(locals));
          return locals;
        });

    case siteTypes.GET_ARMOIRES:
      return API.to("local")
        .get(`/${action.idLocal}/cabinets`)
        .then((armoiresArr) => {
          const armoires = arrayToObject(armoiresArr, "id");
          const idLocal = action.idLocal;
          store.dispatch(siteActions.storeArmoires(armoires, idLocal));
          return armoires;
        });

    case siteTypes.GET_BPES:
      return API.to("local")
        .get(`/${action.idLocal}/bpes`)
        .then((bpesArr) => {
          const bpes = arrayToObject(bpesArr, "id");
          const idLocal = action.idLocal;
          store.dispatch(siteActions.storeBpes(bpes, idLocal));
          return bpes;
        });

    case siteTypes.GET_EQUIPEMENTS:
      return API.to("armoire")
        .get(`/${action.idArmoire}/equipments`)
        .then((equipementsArr) => {
          const equipements = arrayToObject(equipementsArr, "id");
          const idLocal = action.idLocal;
          const idArmoire = action.idArmoire;
          store.dispatch(
            siteActions.storeEquipements(
              equipements,
              idArmoire,
              idLocal,
              idArmoire
            )
          );

          return equipements;
        });

    case siteTypes.GET_CASSETTES:
      API.to(action.objType)
        .get(`/${action.objId}/cassettes`)
        .then((cassettesArr) => {
          const cassettes = arrayToObject(cassettesArr, "id");
          const idLocal = action.idLocal;
          const idArmoire = action.idArmoire;
          const objType = action.objType;
          const objId = action.objId;

          store.dispatch(
            siteActions.storeCassettes(
              cassettes,
              objType,
              objId,
              idLocal,
              idArmoire
            )
          );
        });
      break;

    //.........SUPPORT / GROUPES / INFRAS.........

    case supportTypes.GET_SUPPORT:
      API.to("support")
        .get(`/${action.gid}`)
        .then((support) => {
          store.dispatch(supportActions.storeSupport(orderProps(support)));
        });
      break;

    case supportTypes.GET_GROUPES:
      return API.to("support")
        .get(`/${action.gid}/groupes`)
        .then((groupesArr) => {
          const groupes = arrayToObject(groupesArr, "id");
          store.dispatch(supportActions.storeGroupes(groupes));
          return groupes;
        });

    case supportTypes.GET_INFRAS:
      return API.to("groupe")
        .get(`/${action.idGroupe}/infras`)
        .then((infrasArr) => {
          const idGroupe = action.idGroupe;
          const infras = arrayToObject(infrasArr, "id");
          store.dispatch(supportActions.storeInfras(infras, idGroupe));
          return infras;
        });

    //.........PT_TECH / BPES / CASSETTES.........

    case ptTechTypes.GET_PTT_TECH:
      API.to("pt_tech")
        .get(`/${action.gid}`)
        .then((ptTech) => {
          // STORE_PTT_TECH
          store.dispatch(ptTechActions.storePtTech(orderProps(ptTech)));
        });
      break;

    case ptTechTypes.GET_PTT_BPES:
      return API.to("pt_tech")
        .get(`/${action.gid}/bpes`)
        .then((bpesArr) => {
          const bpes = arrayToObject(bpesArr, "id");
          // STORE_PTT_BPES
          store.dispatch(ptTechActions.storeBpes(bpes));
          return bpes;
        });

    case ptTechTypes.GET_PTT_CASSETTES:
      API.to("bpe")
        .get(`/${action.idBpe}/cassettes`)
        .then((cassettesArr) => {
          const cassettes = arrayToObject(cassettesArr, "id");
          // STORE_PTT_CASSETTES
          store.dispatch(ptTechActions.storeCassettes(cassettes, action.idBpe));
        });
      break;

    //.................MODELS.................
    case modelTypes.GET_MODEL_BY_TYPE:
      API.to("models")
        .get(`/${action.objType}s`)
        .then((modelsArr) => {
          const objType = action.objType;
          const models = arrayToObject(modelsArr, "code");
          store.dispatch(modelActions.storeModelByType(models, objType));
        });
      break;

    // Add model
    case appProcessTypes.ADD_NEW_MODEL:
      return API.to(`models_${action.objectType}s`)
        .post("", {
          headers: {
            "Content-Type": "application/json",
          },
          data: action.insertObject,
        })
        .then((response) => {
          store.dispatch(modelActions.getModelByType(action.objectType));
          store.dispatch(
            appProcessActions.setSnackbar(
              "success",
              "top",
              {
                message: "alerts.modelCreated",
                type: action.objectType.toUpperCase(),
                code: response.code.toUpperCase(),
              },
              true
            )
          );
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    // Delete model
    case appProcessTypes.HANDLE_MODEL_DELETE:
      API.to(`models_${action.objectType}s`)
        .delete(`/${action.objId}`)
        .then((response) => {
          store.dispatch(modelActions.getModelByType(action.objectType));
          store.dispatch(
            appProcessActions.setSnackbar(
              "success",
              "top",
              {
                message: "alerts.modelDeleted",
                type: action.objectType.toUpperCase(),
                code: response.code.toUpperCase(),
              },
              true
            )
          );
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });
      break;

    // Update model Form
    case appProcessTypes.UPDATE_MODEL_FORM:
      return API.to(`models_${action.formName}s`)
        .put(`/${action.form.uuid}`, {
          headers: {
            "Content-Type": "application/json",
          },
          data: action.form,
        })
        .then((response) => {
          store.dispatch(modelActions.getModelByType(action.formName));
          store.dispatch(
            appProcessActions.setSnackbar(
              "success",
              "top",
              {
                message: "alerts.modelEdited",
                code: response.code.toUpperCase(),
              },
              true
            )
          );
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    //.................DROPDOWNLIST.................

    //Update dropdownList
    case appProcessTypes.UPDATE_DROPDOWN:
      return API.to("enums")
        .put("", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            table:
              action.table === "domains"
                ? "domaine"
                : action.table === "groupes_infra"
                ? "groupe_infra"
                : action.table === "local"
                ? "lt"
                : action.table,
            field: action.field,
            old_value: action.old_value,
            new_value: action.new_value,
          },
        })
        .then(() => {
          store.dispatch(
            appProcessActions.getConfigsByType(
              action.table,
              action.field,
              action.old_value,
              action.new_value
            )
          );
          store.dispatch(
            appProcessActions.setSnackbar(
              "success",
              "top",
              "dropdownlist.success_ok",
              true
            )
          );
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    // Add data drop down
    case appProcessTypes.ADD_DATA_DROPDOWN:
      return API.to("enums")
        .post("", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            table:
              action.table === "domains"
                ? "domaine"
                : action.table === "groupes_infra"
                ? "groupe_infra"
                : action.table === "local"
                ? "lt"
                : action.table,
            field: action.field,
            value: action.value,
          },
        })
        .then((data) => {
          store.dispatch(
            appProcessActions.getConfigsByType(
              action.table,
              action.field,
              action.value
            )
          );
          if (data.add_value_in_enum === false) {
            store.dispatch(
              appProcessActions.setSnackbar(
                "error",
                "top",
                "alerts.bugReport.error" + " : " + "nameAlreadyUsed",
                true
              )
            );
          } else {
            store.dispatch(
              appProcessActions.setSnackbar(
                "success",
                "top",
                "dropdownlist.success_add",
                true
              )
            );
          }
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    //Delete data drop down
    case appProcessTypes.DELETE_DATA_DROPDOWN:
      const randomAction =
        action.table === "domains"
          ? "domaine"
          : action.table === "groupes_infra"
          ? "groupe_infra"
          : action.table === "local"
          ? "lt"
          : action.table === "equipment"
          ? "equipement"
          : action.table;
      return API.to("enums")
        .delete(`/${randomAction}/${action.field}/${action.value}`)
        .then((data) => {
          store.dispatch(
            appProcessActions.getConfigsByType(
              action.table,
              action.field,
              action.value
            )
          );
          if (data.delete_value_in_enum === false) {
            store.dispatch(
              appProcessActions.setSnackbar(
                "warning",
                "top",
                "dropdownlist.impossible_delete",
                true
              )
            );
          } else {
            store.dispatch(
              appProcessActions.setSnackbar(
                "success",
                "top",
                "dropdownlist.success_delete",
                true
              )
            );
          }
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    //.................TAGS ASSIGNMENT..............

    // Get features list from defined zone
    case appProcessTypes.GET_FEATURES_TAGS:
      API.to("domaine")
        .get(`/${action.currentDomain}/tag`)
        .then((featuresTags) => {
          store.dispatch(domaineActions.storeFeaturesTags(featuresTags));
        });
      break;

    // Add tag to selected features from same zone
    case appProcessTypes.ADD_FEATURES_TAG:
      return API.to("domaine")
        .put(`/${action.currentDomain.uuid}/tag`, {
          headers: {
            "Content-Type": "application/json",
          },
          data: action.featuresObj,
        })
        .then(() => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "success",
              "top",
              {
                message: "alerts.tagAssigned",
                zone: action.currentDomain.zone,
              },
              true
            )
          );
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    // Remove tag to selected features from same zone
    case appProcessTypes.REMOVE_FEATURES_TAG:
      return API.to("domaine")
        .delete(`/${action.currentDomain.uuid}/tag`, {
          params: action.featuresObj,
        })
        .then(() => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "success",
              "top",
              {
                message: "alerts.tagRemoved",
                zone: action.currentDomain.zone,
              },
              true
            )
          );
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    //.................EXTERNAL LAYERS................

    // Get layer template by type
    case appProcessTypes.GET_LAYER_MODEL:
      return API.to(`layers_${action.layerType}s`)
        .get("/example")
        .then((layerModel) => {
          return layerModel;
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    // Send external layer to database
    case appProcessTypes.SEND_EXTERNAL_LAYER:
      return API.to(`layers_${action.layerType}s`)
        .post("", {
          headers: {
            "Content-Type": "application/geo+json",
          },
          data: action.layerFile,
        })
        .then(() => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "success",
              "top",
              "importedLayers.send",
              true
            )
          );
          setTimeout(location.reload(), 1500);
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    //.................PLUGINS..............
    case pluginsTypes.GET_MATERIAL_REFERENCE:
      axios
        .get(`${API_ODYSSEE}/v1/material_reference/bpe`)
        .then((referenceBpe) => {
          return store.dispatch(
            pluginsActions.storeMaterialReferenceBpe("bpe", referenceBpe.data)
          );
        })
        .catch((error) => console.error(error));

      axios
        .get(`${API_ODYSSEE}/v1/material_reference/cable`)
        .then((referenceCable) => {
          return store.dispatch(
            pluginsActions.storeMaterialReferenceCable(
              "cable",
              referenceCable.data
            )
          );
        })
        .catch((error) => console.error(error));
      break;

    case pluginsTypes.POST_PROCESS_PLUGINS:
      store.dispatch(
        appProcessActions.setSnackbar("info", "top", "plugin.in_progress", true)
      );
      const formDataDocu = {
        attribute: action.formData.attribute,
        company: action.formData.company,
        document_language: action.formData.document_language,
        label: action.formData.label,
        project_type: action.formData.project_type,
        project_name: action.formData.label,
        user: action.formData.user,
        value: action.formData.value,
      };
      axios
        .post(
          `https://controller.odyssee.internal.ftth.iliad.fr/v1/process/${action.process}`,
          action.process === "documentation" ? formDataDocu : action.formData
        )
        .then((response) => {
          const getValidDataPlugins = {
            name: response.data.rpc,
            crea_auteur: action.formData.user,
            label: action.formData.label,
            crea_date: dateGmtFormat(),
            uuid: response.data.identifier,
            result: null,
            result_date: null,
            status: null,
          };
          return (
            store.dispatch(
              pluginsActions.getProcessPlugins(
                action.process,
                getValidDataPlugins,
                response.status
              )
            ),
            store.dispatch(
              appProcessActions.setSnackbar(
                "success",
                "top",
                "form.success",
                true
              )
            ),
            store.dispatch(appProcessActions.setOpen(false)),
            store.dispatch(pluginsActions.setDisabled(false))
          );
        })
        .catch((error) => {
          return (
            store.dispatch(
              pluginsActions.getProcessPlugins(action.process, error)
            ),
            store.dispatch(
              appProcessActions.setSnackbar(
                "error",
                "top",
                `${error.response.data.response.error}`,
                true
              )
            ),
            store.dispatch(appProcessActions.setOpen(false)),
            store.dispatch(pluginsActions.setDisabled(false))
          );
        });
      break;
    //.................SETTINGS..................

    // Get application initial settings
    case appProcessTypes.GET_INITIAL_SETTINGS:
      return API.to("settings")
        .get("")
        .then((settings) => {
          return settings[action.setting];
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    //.................TASK MANAGER..............

    // Get list of dates where task been started
    case appProcessTypes.GET_DATES_LIST:
      return API.to("process_dates")
        .get("", {
          crea_auteur: `eq.${action.author}`,
          select: action.selector,
        })
        .then((dates) => {
          return dates;
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    // Get list of tasks by selected date
    case appProcessTypes.GET_TASKS_FROM_DATE:
      return API.to("process_status")
        .get("", {
          user: action.author,
          crea_date: action.date,
        })
        .then((tasks) => {
          return tasks;
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    // Check status of launched tasks
    case appProcessTypes.GET_TASK_STATUS:
      return API.to("process_status")
        .get(`/${action.taskUuid}`)
        .then((status) => {
          return status;
        })
        .catch((error) => {
          store.dispatch(
            appProcessActions.setSnackbar(
              "error",
              "top",
              {
                message: "alerts.errors.generic",
                error,
              },
              true
            )
          );
        });

    default:
      next({ ...action, getState: store.getState });
  }
};

export default ajaxMiddleware;
