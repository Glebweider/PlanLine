import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IProject {
	id: string;               // ID проекта (uuid или другой внешний id)
	discordId: string;
	name: string;             // Название проекта
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

export enum EMemberRole {
	ADMIN = 'Admin',
	NORMAL = 'Normal',
	OBSERVER = 'Observer',
}

export interface IUser {
	id: string;
	name: string;
	avatar: string;
}

export interface IBoardMember {
	id: string;
	role: EMemberRole;  // Роль Пользователя
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
	members: string[];
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
	discordId: '',
	name: '',
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
			state.discordId = action.payload.discordId;
			state.name = action.payload.name;
			state.ownerId = action.payload.ownerId;
			state.members = action.payload.members;
			state.boards = action.payload.boards;
		},
		updateBoardMemberRole: (state, action: PayloadAction<{
			boardId: string;
			userId: string;
			newRole: EMemberRole;
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
		removeUserFromProject: (state, action: PayloadAction<string>) => {
			const userIdToRemove = action.payload;

			state.members = state.members.filter(member => member.id !== userIdToRemove);
			state.boards.forEach(board => {
				board.members = board.members.filter(member => member.id !== userIdToRemove);
			});
		},
		deleteBoardFromProject: (state, action: PayloadAction<string>) => {
			const boardIdToDelete = action.payload;
			state.boards = state.boards.filter(board => board.id !== boardIdToDelete);
		},
		addListToBoard: (state, action: PayloadAction<{ boardId: string; list: IList }>) => {
			const { boardId, list } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				board.lists.push(list);
			}
		},
		deleteListFromBoard: (state, action: PayloadAction<{ boardId: string; listId: string }>) => {
			const { boardId, listId } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				board.lists = board.lists.filter((list) => list.id !== listId);
			}
		},
		renameListInBoard: (state, action: PayloadAction<{ boardId: string; listId: string; newName: string }>) => {
			const { boardId, listId, newName } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				const list = board.lists.find((l) => l.id === listId);
				if (list) {
					list.name = newName;
				}
			}
		},
		addCardToList: (state, action: PayloadAction<{ boardId: string; listId: string; card: ICard }>) => {
			const { boardId, listId, card } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				const list = board.lists.find((l) => l.id === listId);
				if (list) {
					list.cards.push(card);
				}
			}
		},
		removeCardFromList: (state, action: PayloadAction<{ boardId: string; listId: string; cardId: string }>) => {
			const { boardId, listId, cardId } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				const list = board.lists.find((l) => l.id === listId);
				if (list) {
					list.cards = list.cards.filter((card) => card.id !== cardId);
				}
			}
		},
	},
});

export const {
	setProject,
	updateBoardMemberRole,
	removeUserFromProject,
	deleteBoardFromProject,
	addCardToList,
	deleteListFromBoard,
	renameListInBoard,
	addListToBoard,
	removeCardFromList
} = projectSlice.actions;

export default projectSlice.reducer;
