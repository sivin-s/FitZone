import {configureStore} from '@reduxjs/toolkit';

export const store = configureStore({
    reducer:{
        // add  slices -> pending.
    },
    devTools: import.meta.env.DEV
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;