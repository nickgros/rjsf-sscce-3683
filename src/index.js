import "src/utils/initJsVanilla";

console.dev("Index");

import { render } from "react-dom";

// Redux
import { Provider } from "react-redux";
import SettingsProvider from "src/components/Settings/context/SettingsProvider";
import store from "src/store";
// Router Component
import App from "src/containers/App";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Suspense } from "react";
import { suspenseFallback } from "src/styles/MaterialUiComponentsStyles/SuspenseFallback";

// Internal APi
import { API } from "src/utils/API";

import "./i18n.js";

import packageJson from "/package.json";
import manifest from "/public/manifest.json";

const version = `v${packageJson.version}`;
const versionStr = ` - ${version}`;

document.title += versionStr;
document
  .querySelector('meta[name="description"]')
  .setAttribute("content", document.title);

const manifestElement = document.getElementById("manifest");
const manifestString = JSON.stringify({
  ...manifest,
  description: version,
});
manifestElement?.setAttribute(
  "href",
  `data:application/json;charset=utf-8,${encodeURIComponent(manifestString)}`
);

// App config
// eslint-disable-next-line no-undef
const CONFIG = JSON.parse(process.env.REACT_APP_CONFIG);
window.config = CONFIG;

// Api setup
Object.keys(CONFIG.services).forEach((name) => {
  API.add(name, CONFIG.services[name]);
});

// == Render
// 1. Le composant racine (celui qui contient l'ensemble de l'app)
const rootComponent = (
  <Router history={createBrowserHistory()}>
    <Suspense fallback={suspenseFallback}>
      <Provider store={store}>
        <SettingsProvider
          currentColor={store.getState().appProcessReducer.mainColor}
        >
          <App />
        </SettingsProvider>
      </Provider>
    </Suspense>
  </Router>
);

if (module.hot) {
  module.hot.accept();
}

// 2. La cible du DOM (là où la structure doit prendre vie dans le DOM)
const target = document.getElementById("root");

// Le rendu de React => DOM
render(rootComponent, target);
