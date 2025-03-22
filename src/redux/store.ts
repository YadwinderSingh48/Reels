import {configureStore} from '@reduxjs/toolkit';
import {FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER,persistStore, persistReducer} from 'redux-persist';
import rootReducer from './reducers/rootReducer';
import reduxStorage from './storage';


const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    blacklist: [],
    whitelist: ['user']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
        reducer: persistedReducer,
        middleware: getDefaultMiddleware => 
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH]
                }
            })
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch