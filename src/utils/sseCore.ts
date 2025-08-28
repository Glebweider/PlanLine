/* eslint-disable @typescript-eslint/no-empty-function */

import {
    addCard,
    deleteCard,
    updateCard,
    addList,
    deleteList,
    updateListName,
    ProjectEvent,
    setProject,
    addBoard,
    updateBoard,
    deleteBoard,
    updateProjectName,
    clearProject,
    addCardMember,
    removeCardMember,
    removeProjectMember,
    updateBoardMemberRole,
    addProjectMember
} from '../redux/reducers/projectReducer';
import store from '../redux/store';


class SseCore {
    private eventSource: EventSource | null = null;
    private currentProjectId: string | null = null;

    private hiddenTimeout: NodeJS.Timeout | null = null;
    private shouldReloadOnReturn = false;

    constructor() {
        store.subscribe(() => {
            const state = store.getState();
            const newProjectId = state.projectReducer.id;

            if (newProjectId !== this.currentProjectId && newProjectId) {
                this.currentProjectId = newProjectId;
                this.connect();
            }
        })

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.hiddenTimeout = setTimeout(() => {
                    this.disconnect();
                    this.shouldReloadOnReturn = true;
                }, 5 * 60 * 1000);
            } else {
                if (this.hiddenTimeout) {
                    clearTimeout(this.hiddenTimeout);
                    this.hiddenTimeout = null;
                }

                if (this.shouldReloadOnReturn) {
                    window.location.reload();
                }
            }
        });
    }

    connect() {
        this.disconnect();

        this.eventSource = new EventSource(
            `${process.env.REACT_APP_BACKEND_URI}/projects/${this.currentProjectId}/stream`,
            { withCredentials: true }
        );

        this.eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleEvent(data);
        };

        this.eventSource.onerror = (err) => {
            console.error('SSE error:', err);
        };
    }

    disconnect() {
        this.eventSource?.close();
        this.eventSource = null;
    }

    private handleEvent(event: ProjectEvent) {
        const { type, entity, payload, path } = event;
        if (!path) return;

        const pathParts = path.split('.');
        const getIds = (parts: string[]) => {
            const ids: Record<string, string> = {};
            for (let i = 0; i < parts.length; i += 2) {
                ids[parts[i]] = parts[i + 1];
            }
            return ids;
        };

        const ids = getIds(pathParts);
        const actions: Record<string, Record<ProjectEvent['type'], () => void>> = {
            project: {
                create: () => store.dispatch(setProject(payload)),
                update: () => store.dispatch(updateProjectName(payload)),
                delete: () => store.dispatch(clearProject()),
                add: () => store.dispatch(addProjectMember(payload)),
                change: () => { },
                remove: () => store.dispatch(removeProjectMember(payload)),
            },
            board: {
                create: () => { store.dispatch(addBoard(payload)) },
                update: () => { store.dispatch(updateBoard({ boardId: ids.boards, updates: payload })) },
                delete: () => { store.dispatch(deleteBoard(ids.boards)) },
                add: () => { },
                change: () => { store.dispatch(updateBoardMemberRole({ boardId: ids.boards, userId: payload.userId, newRole: payload.newRole })) },
                remove: () => { }
            },
            list: {
                create: () => store.dispatch(addList({ boardId: ids.boards, list: payload })),
                update: () => store.dispatch(updateListName({ boardId: ids.boards, listId: ids.lists, newName: payload })),
                delete: () => store.dispatch(deleteList({ boardId: ids.boards, listId: ids.lists })),
                add: () => { },
                change: () => { },
                remove: () => { },
            },
            card: {
                create: () => store.dispatch(addCard({ boardId: ids.boards, listId: ids.lists, card: payload })),
                update: () => store.dispatch(updateCard({ boardId: ids.boards, listId: ids.lists, cardId: ids.cards, updates: payload })),
                delete: () => store.dispatch(deleteCard({ boardId: ids.boards, listId: ids.lists, cardId: ids.cards })),
                add: () => store.dispatch(addCardMember({ boardId: ids.boards, listId: ids.lists, cardId: ids.cards, userId: payload })),
                change: () => {
                    store.dispatch(deleteCard({ boardId: ids.boards, listId: ids.lists, cardId: ids.cards }));
                    store.dispatch(addCard({ boardId: ids.boards, listId: payload.newListId, card: payload.card }));
                }, // Move Card
                remove: () => store.dispatch(removeCardMember({ boardId: ids.boards, listId: ids.lists, cardId: ids.cards, userId: payload })),
            },
            // comment: {
            //     create: () => store.dispatch(addComment({ cardId: ids.card, comment: payload })),
            //     update: () => store.dispatch(updateComment({ cardId: ids.card, commentId: payload.id, updates: payload })),
            //     delete: () => store.dispatch(removeComment({ cardId: ids.card, commentId: payload.id })),
            //     add: () => { },
            //     remove: () => { }
            // },
        };

        actions[entity]?.[type]?.();
    }
}

export const sseCore = new SseCore();