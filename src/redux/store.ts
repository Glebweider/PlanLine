import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import projectReducer from './reducers/projectReducer';
import siteReducer from './reducers/siteReducer';

const store = configureStore({
	reducer: {
		userReducer,
		projectReducer,
		siteReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
