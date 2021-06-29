import { ChakraProvider, theme } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthenticatedNavbar } from "./Authenticated/AuthenticatedNavbar";
import { AuthProvider } from "./Contexts/authContext";

const AppProviders = ({ children }: PropsWithChildren<{}>) => {
  const queryClient = new QueryClient();

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
};
export const App = () => {
  return (
    <AppProviders>
      <AuthenticatedNavbar />
    </AppProviders>
  );
};
