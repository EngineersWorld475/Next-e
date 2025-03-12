"use client"
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import authReducer from './auth-slice'
import { thunk } from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: 'scholarly_root',
    storage
} 
 
// combine all reducers 
const rootReducer = combineReducers({
    auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// configure store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(thunk),

}) 

export const persistor = persistStore(store) 
export default store;  