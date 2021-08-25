import { useGetCurrentlySelectedShop } from "../features/shops";
import { Heading } from "@chakra-ui/react";
interface ProductGridProps {}
export const ProductGrid = ({}: ProductGridProps) => {
  const currentShop = useGetCurrentlySelectedShop();
  return <>{currentShop && <Heading>{currentShop.name}</Heading>}</>;
};
