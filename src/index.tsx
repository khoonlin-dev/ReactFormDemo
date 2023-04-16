import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app/App";
//import "./index.css";

import { store } from "./state/store";
import { fetchGroup } from "./state/revenueSlice";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
store.dispatch(fetchGroup());

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
        <App />
    </Provider>
);
