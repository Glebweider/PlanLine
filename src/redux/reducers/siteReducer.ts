import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ISite {
	isNavbarOpen: boolean;
}


const initialState: ISite = {
	isNavbarOpen: false
};

const siteSlice = createSlice({
	name: 'site',
	initialState,
	reducers: {
		setIsNavbarOpen: (state, action: PayloadAction<boolean>) => {
			state.isNavbarOpen = action.payload;
		},
	},
});

export const { setIsNavbarOpen } = siteSlice.actions;

export default siteSlice.reducer;
