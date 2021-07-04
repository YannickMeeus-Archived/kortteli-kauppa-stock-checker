import { ChakraProvider, theme } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Landing } from "./landing";

const AppProviders = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};
export const App = () => {
  return <AppProviders></AppProviders>;
};
