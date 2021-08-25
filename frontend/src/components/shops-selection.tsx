import { Select } from "@chakra-ui/react";
import {
  selectShop,
  Shop,
  ShopIdentifier,
  useGetShopsQuery,
} from "../features/shops";
import { useAppDispatch } from "../store";

export const ShopsSelection = () => {
  const { data, isLoading } = useGetShopsQuery();
  const dispatch = useAppDispatch();

  const toOption = ({ id, name }: Shop) => {
    return (
      <option value={id} key={id}>
        {name}
      </option>
    );
  };
  const handleShopSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const shopId: ShopIdentifier = event.target.value;
    dispatch(selectShop(shopId));
  };

  return (
    <>
      {!isLoading && data && (
        <Select onChange={handleShopSelected} placeholder="Select A Shop">
          {data.data.map(toOption)}
        </Select>
      )}
    </>
  );
};
