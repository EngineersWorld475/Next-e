"use client"
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from './auth-slice'; 
import profileReducer from './user-slice';
import groupReducer from './group-slice';
import collectionReducer from './pdf-slice';
import { thunk } from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";

const authPersistConfig = {
    key: 'scholarly_auth',
    storage: sessionStorage
} 
 
// combine all reducers 
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    userprofile: profileReducer,
    group: groupReducer,
    collection: collectionReducer,
})

// configure store
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),

}) 

export const persistor = persistStore(store) 
export default store;  