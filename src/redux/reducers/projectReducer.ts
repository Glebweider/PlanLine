import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IProject {
	id: string;               // ID проекта (uuid или другой внешний id)
	name: string;             // Название проекта
	icon: string;             // Иконка проекта (например, URL)
	ownerId: string;          // ID владельца
	members: string[];        // ID пользователей, которые состоят в проекте
	boards: IBoard[];         // Доски внутри проекта
	dateOfCreation: Date;     // Дата создания проекта
}

export interface IBoard {
	id: string;
	name: string;
	ownerId: string;
	members: IBoardMember[];
	lists: IList[];
}

export enum MemberRole {
	ADMIN = 'Admin',
	NORMAL = 'Normal',
	OBSERVER = 'Observer',
}

export interface IBoardMember {
	id: string;        // ID Пользователя
	role: MemberRole;  // Роль Пользователя
}

export interface IList {
	id: string;
	name: string;
	cards: ICard[];
}

export interface ICard {
	id: string;
	title: string;
	description: string;
	labels: string[];
	dueDate: string;
	comments: IComment[];
	createdAt: string;
	updatedAt: string;
}

export interface IComment {
	id: string;
	authorId: string;
	content: string;
	createdAt: string;
}

const initialState: IProject = {
	id: '',
	name: '',
	icon: '',
	ownerId: '',
	members: [],
	boards: [],
	dateOfCreation: new Date(),
};

const projectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		setProject: (state, action: PayloadAction<IProject>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.icon = action.payload.icon;
			state.ownerId = action.payload.ownerId;
			state.members = action.payload.members;
			state.boards = action.payload.boards;
			state.dateOfCreation = action.payload.dateOfCreation;
		},
	},
});

export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;
