import './chartSetup.js';
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.js";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
const App = React.lazy(() => import("./App.jsx"));
import { AuthProvider } from "./contexts/AuthContext.jsx"; // Import AuthProvider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <React.Suspense fallback={<div>Loading...</div>}>
            <App />
          </React.Suspense>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);
