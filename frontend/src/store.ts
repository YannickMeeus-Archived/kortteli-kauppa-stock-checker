import { configureStore } from "@reduxjs/toolkit";
import { versionApi } from "./features/infrastructure/version";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { shopsApi } from "./features/shops/shops.api";
import { shopsSlice } from "./features/shops";
export const store = configureStore({
  reducer: {
    [versionApi.reducerPath]: versionApi.reducer,
    [shopsApi.reducerPath]: shopsApi.reducer,
    shop: shopsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(versionApi.middleware, shopsApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
