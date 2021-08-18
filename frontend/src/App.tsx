import { ChakraProvider, theme } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Navigation } from "./components/nav-bar";
import { LandingPage, ShopsPage } from "./pages/";

const Framework = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route path="/" exact>
            <LandingPage />
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
  return <Framework />;
};
