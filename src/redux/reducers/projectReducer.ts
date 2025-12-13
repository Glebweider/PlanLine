import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectEvent {
	type: 'create' | 'update' | 'delete' | 'add' | 'change' | 'remove';
	entity: 'project' | 'board' | 'list' | 'card' | 'comment';
	payload: any;
	path?: string;
}

export interface IProject {
	id: string;               // ID проекта (uuid или другой внешний id)
	discordId: string;
	name: string;             // Название проекта
	ownerId: string;          // ID владельца
	members: IUserProject[];         // ID пользователей, которые состоят в проекте
	boards: IBoard[];         // Доски внутри проекта
	dateOfCreation: Date;
	discordIntegration: IDiscordIntegration;
}

export interface IDiscordIntegration {
	updateChannelId: string;
	// summary: {
	// 	enabled: boolean;
	// 	time: Date;
	// 	channelId: string;
	// }
}

export interface IBoard {
	id: string;
	name: string;
	members: IBoardMember[];
	lists: IList[];
}

export enum EMemberRole {
	ADMIN = 'Administrator',
	NORMAL = 'Performer',
	OBSERVER = 'Observer',
}

export interface IUserProject {
	id: string;
	name: string;
	avatar: string;
	displayName: string;
	dateOfCreation: string;
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
	dateOfCreation: new Date(),
	discordIntegration: {
		updateChannelId: ''
	}
};

const projectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		/* Project */
		setProjectId: (state, action: PayloadAction<{ id: string; }>) => {
			return {
				...initialState,
				id: action.payload.id,
			};
		},
		setProject: (state, action: PayloadAction<IProject>) => {
			const discordIntegration = action.payload.discordIntegration || { updateChannelId: '' };
			state.id = action.payload.id;
			state.discordId = action.payload.discordId;
			state.name = action.payload.name;
			state.ownerId = action.payload.ownerId;
			state.members = action.payload.members;
			state.boards = action.payload.boards;
			state.dateOfCreation = action.payload.dateOfCreation;
			state.discordIntegration = discordIntegration;
		},
		updateProjectName: (state, action: PayloadAction<string>) => {
			state.name = action.payload;
		},
		updateDiscordChannelId: (state, action: PayloadAction<string>) => {
			if (state.discordIntegration) {
				state.discordIntegration.updateChannelId = action.payload;
			} else {
				state.discordIntegration = { updateChannelId: action.payload };
			}
		},
		clearProject: () => initialState,

		/* Members */
		removeProjectMember: (state, action: PayloadAction<string>) => {
			const userIdToRemove = action.payload;

			state.members = state.members.filter((member) => member.id !== userIdToRemove);

			state.boards.forEach((board) => {
				board.members = board.members.filter((member) => member.id !== userIdToRemove);
			});

			state.boards.forEach((board) => {
				board.lists.forEach((list) => {
					list.cards.forEach((card) => {
						card.members = card.members.filter((id) => id !== userIdToRemove);
					});
				});
			});
		},
		addProjectMember: (state, action: PayloadAction<{ user: IUserProject; boardId?: string, role?: EMemberRole }>) => {
			const { user, boardId, role } = action.payload;

			if (!state.members.find((m) => m.id === user.id))
				state.members.push(user);

			state.boards.forEach((board) => {
				if (!board.members.find((m) => m.id === user.id)) {
					board.members.push({
						id: user.id,
						role: board.id === boardId ? role || EMemberRole.NORMAL : EMemberRole.OBSERVER,
					});
				}
			});
		},


		/* Board Members in Card */
		addCardMember: (state, action: PayloadAction<{ boardId: string; listId: string; cardId: string; userId: string }>) => {
			const { boardId, listId, cardId, userId } = action.payload;
			const board = state.boards.find(b => b.id === boardId);
			if (board) {
				const list = board.lists.find(l => l.id === listId);
				if (list) {
					const card = list.cards.find(c => c.id === cardId);
					if (card) {
						if (!card.members) {
							card.members = [];
						}
						if (!card.members.includes(userId)) {
							card.members.push(userId);
						}
					}
				}
			}
		},
		removeCardMember: (state, action: PayloadAction<{ boardId: string; listId: string; cardId: string; userId: string }>) => {
			const { boardId, listId, cardId, userId } = action.payload;
			const board = state.boards.find(b => b.id === boardId);
			if (board) {
				const list = board.lists.find(l => l.id === listId);
				if (list) {
					const card = list.cards.find(c => c.id === cardId);
					if (card && card.members) {
						card.members = card.members.filter(id => id !== userId);
					}
				}
			}
		},

		/* Boards */
		addBoard(state, action: PayloadAction<IBoard>) {
			state.boards.push(action.payload);
		},
		updateBoard(state, action: PayloadAction<{ boardId: string; updates: Partial<IBoard> }>) {
			const { boardId, updates } = action.payload;
			state.boards = state.boards.map((board) =>
				board.id === boardId ? { ...board, ...updates } : board
			);
		},
		deleteBoard(state, action: PayloadAction<string>) {
			state.boards = state.boards.filter(
				(board) => board.id !== action.payload
			);
		},
		updateBoardMemberRole: (state, action: PayloadAction<{ boardId: string; userId: string; newRole: EMemberRole; }>) => {
			const { boardId, userId, newRole } = action.payload;
			const board = state.boards.find(b => b.id === boardId);
			if (board) {
				const member = board.members.find(m => m.id === userId);
				if (member) {
					member.role = newRole;
				}
			}
		},

		/* Lists */
		addList: (state, action: PayloadAction<{ boardId: string; list: IList }>) => {
			const { boardId, list } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				board.lists.push(list);
			}
		},
		deleteList: (state, action: PayloadAction<{ boardId: string; listId: string }>) => {
			const { boardId, listId } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				board.lists = board.lists.filter((list) => list.id !== listId);
			}
		},
		updateListName: (state, action: PayloadAction<{ boardId: string; listId: string; newName: string }>) => {
			const { boardId, listId, newName } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				const list = board.lists.find((l) => l.id === listId);
				if (list) {
					list.name = newName;
				}
			}
		},

		/* Cards */
		addCard: (state, action: PayloadAction<{ boardId: string; listId: string; card: ICard }>) => {
			const { boardId, listId, card } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				const list = board.lists.find((l) => l.id === listId);
				if (list) {
					list.cards.push(card);
				}
			}
		},
		deleteCard: (state, action: PayloadAction<{ boardId: string; listId: string; cardId: string }>) => {
			const { boardId, listId, cardId } = action.payload;
			const board = state.boards.find((b) => b.id === boardId);
			if (board) {
				const list = board.lists.find((l) => l.id === listId);
				if (list) {
					list.cards = list.cards.filter((card) => card.id !== cardId);
				}
			}
		},
		updateCard: (state, action: PayloadAction<{
			boardId: string;
			listId: string;
			cardId: string;
			updates: Partial<Pick<ICard, 'dueDate' | 'title' | 'description'>>
		}>) => {
			const { boardId, listId, cardId, updates } = action.payload;
			const board = state.boards.find(b => b.id === boardId);
			if (board) {
				const list = board.lists.find(l => l.id === listId);
				if (list) {
					const card = list.cards.find(c => c.id === cardId);
					if (card) {
						if (updates.title !== undefined) card.title = updates.title;
						if (updates.description !== undefined) card.description = updates.description;
						if (updates.dueDate !== undefined) card.dueDate = updates.dueDate;
					}
				}
			}
		},
	},
});

export const {
	setProject,
	updateProjectName,
	clearProject,
	updateBoardMemberRole,
	updateDiscordChannelId,
	removeProjectMember,
	addProjectMember,
	addCardMember,
	removeCardMember,
	addBoard,
	updateBoard,
	deleteBoard,
	addList,
	deleteList,
	updateListName,
	addCard,
	deleteCard,
	updateCard,
	setProjectId
} = projectSlice.actions;


export default projectSlice.reducer;
