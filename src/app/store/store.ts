import {
    combineSlices,
    createSelector,
    ThunkAction,
    UnknownAction
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { newsApi } from "../../modules/HomePage/model/api";

const rootReducer = combineSlices({
    newsApi: newsApi.reducer,
})

export type AppState = any;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<R = void> = ThunkAction<R, AppState, any, UnknownAction>;

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(newsApi.middleware)   ,
})

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppAsyncThunk = createSelector.withTypes<AppState>();