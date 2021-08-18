import { ChakraProvider, Heading, theme } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Navigation } from "./components/nav-bar";
import { Landing } from "./landing";
import { ShopsPage } from "./pages/shops";

const AppProviders = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route path="/" exact>
            <Landing />
          </Route>
          <Route path="/shops">
            <ShopsPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};
export const App = () => {
  return <AppProviders></AppProviders>;
};
