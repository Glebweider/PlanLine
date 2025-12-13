import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import projectReducer from './reducers/projectReducer';

const store = configureStore({
	reducer: {
		userReducer,
		projectReducer,
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
