import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IProject {
	id: string;               // ID проекта (uuid или другой внешний id)
	name: string;             // Название проекта
	icon: string;             // Иконка проекта (например, URL)
	ownerId: string;          // ID владельца
	members: IUser[];         // ID пользователей, которые состоят в проекте
	boards: IBoard[];         // Доски внутри проекта
}

export interface IBoard {
	id: string;
	name: string;
	members: IBoardMember[];
	lists: IList[];
}

export enum MemberRole {
	ADMIN = 'Admin',
	NORMAL = 'Normal',
	OBSERVER = 'Observer',
}

export interface IUser {
	id: string;
	username: string;
	avatar: string;
}

export interface IBoardMember {
	id: string;
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
	dueDate: Date | null;
	comments: IComment[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IComment {
	id: string;
	authorId: string;
	content: string;
	createdAt: Date;
}

const initialState: IProject = {
	id: '',
	name: '',
	icon: '',
	ownerId: '',
	members: [],
	boards: [],
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
		},
		updateBoardMemberRole: (state, action: PayloadAction<{
			boardId: string;
			userId: string;
			newRole: MemberRole;
		}>) => {
			const { boardId, userId, newRole } = action.payload;

			const board = state.boards.find(b => b.id === boardId);
			if (board) {
				const member = board.members.find(m => m.id === userId);
				if (member) {
					member.role = newRole;
				}
			}
		},
	},
});

export const { setProject, updateBoardMemberRole } = projectSlice.actions;

export default projectSlice.reducer;
