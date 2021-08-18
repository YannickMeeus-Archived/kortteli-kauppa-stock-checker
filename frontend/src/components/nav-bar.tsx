import {
  Box,
  Flex,
  HStack,
  Link,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const routing: { [key: string]: RoutingDetails } = {
  home: {
    path: "/",
    text: "Home",
  },
  shops: {
    path: "/shops",
    text: "Shops",
  },
};
interface NavLinkProps {
  routing: RoutingDetails;
}

interface RoutingDetails {
  path: string;
  text: string;
}
const NavLink = ({ routing }: NavLinkProps) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    as={RouterLink}
    to={routing.path}
  >
    {routing.text}
  </Link>
);

export const Navigation = () => {
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <RouterLink to={routing.home.path}>
              <Heading as="h4" size="md">
                Kortteli Kauppa - Stock Checker
              </Heading>
            </RouterLink>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <NavLink routing={routing.shops} />
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </>
  );
};
