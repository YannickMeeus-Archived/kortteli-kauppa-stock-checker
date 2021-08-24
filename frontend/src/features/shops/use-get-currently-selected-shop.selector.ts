import { useAppSelector } from "../../store";

export const useGetCurrentlySelectedShop = () =>
  useAppSelector((state) => state.shop.selectedShop);
