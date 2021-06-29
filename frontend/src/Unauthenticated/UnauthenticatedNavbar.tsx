import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../Contexts/authContext";

export const UnauthenticatedNavbar = () => {
  const { login } = useAuth();
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          direction={"row-reverse"}
        >
          <Button onClick={login}>Login</Button>
        </Flex>
      </Box>
    </>
  );
};
