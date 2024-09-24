import Snackbar from "@Components/Snackbar";
import { SnackbarProvider } from "@Utils/snackbar";
import { themeInstance } from "@Utils/theme";
import { AuthenticationProvider } from "@carp-dk/authentication-react";
import setupLocatorUI from "@locator/runtime";
import { CssBaseline } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import validateEnv from "./envValidator";
import App from "./pages/App";
import QueryClientComponent from "./queryClientComponent";
import i18n from "./i18n";

if (process.env.NODE_ENV === "development") {
  setupLocatorUI();
}
validateEnv();
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={themeInstance}>
      <SnackbarProvider>
        <CssBaseline />
        <AuthenticationProvider
          config={{
            client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
            redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
            authority: `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
          }}
        >
          <BrowserRouter basename={`${import.meta.env.VITE_BASE_NAME}`}>
            <QueryClientComponent>
              <I18nextProvider i18n={i18n}>
                <ReactQueryDevtools initialIsOpen={false} position="right" />
                <App />
                <Snackbar />
              </I18nextProvider>
            </QueryClientComponent>
          </BrowserRouter>
        </AuthenticationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StyledEngineProvider>,
);
