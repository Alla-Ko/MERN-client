import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import { Provider } from 'react-redux';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";

import { ThemeProvider } from "@mui/material";
import "./index.scss";
import { theme } from "./theme";
import store from './redux/store'

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
			<BrowserRouter>
			
      <Provider store={store}>
				<App />
			</Provider>
			</BrowserRouter>
    </ThemeProvider>
  </>
);
