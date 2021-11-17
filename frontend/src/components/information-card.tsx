import { Stat, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const InformationCard = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={"5"}
      mb={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      {children}
    </Stat>
  );
};
