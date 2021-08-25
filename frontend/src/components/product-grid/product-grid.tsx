import { Center } from "@chakra-ui/react";
import { useGetCurrentlySelectedShop } from "../../features/shops";
import { ProductTable } from "./table";
export const ProductGrid = () => {
  const currentShop = useGetCurrentlySelectedShop();
  if (!currentShop) {
    return null;
  }
  return (
    <>
      {/* <ProductGridHeader>{currentShop.name}</ProductGridHeader> */}
      <Center mt={10}>
        <ProductTable forShop={currentShop} />
      </Center>
    </>
  );
};
