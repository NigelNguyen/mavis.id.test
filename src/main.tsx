import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import IdProvider from "./view/context/IdProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IdProvider>
      <App />
    </IdProvider>
  </React.StrictMode>
);
