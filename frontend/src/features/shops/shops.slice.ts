import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShopIdentifier } from "./types/shop-identifier.type";
import { ShopsState } from "./types/shops-state.type";

export const shopsSlice = createSlice({
  name: "shops",
  initialState: { selectedShop: undefined } as ShopsState,
  reducers: {
    selectShop: (state, action: PayloadAction<ShopIdentifier>) => {
      // Only really need the Id, as I can always match that to the shop list if I
      //  desperately need the name itself.
      //
      // Current assumption is that only one shop can be selected at any given time.
      state.selectedShop = action.payload;
    },
  },
});

export const { selectShop } = shopsSlice.actions;
