import { Center, Container } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
export const LoggedInLandingPage = () => {
  return (
    <Container>
      <Center bg="gray.100" h="100px" color="gray.900" margin="4" rounded="lg">
        Redirecting...
      </Center>
    </Container>
  );
};
