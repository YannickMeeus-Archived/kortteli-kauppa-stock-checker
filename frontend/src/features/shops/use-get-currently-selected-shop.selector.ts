import { Shop, useGetShopsQuery } from ".";
import { useAppSelector } from "../../store";

export const useGetCurrentlySelectedShop = (): Shop | undefined => {
  const currentShopIdentifier = useAppSelector(
    (state) => state.shop.selectedShop
  );
  const { data } = useGetShopsQuery();

  if (currentShopIdentifier && data) {
    return data.data.find((shop) => shop.id === currentShopIdentifier);
  }
  return undefined;
};
