import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const Page = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      {children}
    </Box>
  );
};
