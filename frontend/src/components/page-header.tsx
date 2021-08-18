import { chakra } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const PageHeader = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <chakra.h1
      textAlign={"center"}
      fontSize={"4xl"}
      py={10}
      fontWeight={"bold"}
    >
      {children}
    </chakra.h1>
  );
};
