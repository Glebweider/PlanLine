import { useState } from 'react';
import { useDrop } from 'react-dnd';

import styles from './BoardList.module.scss';
import { EMemberRole, ICard, IList, IProject } from '../../redux/reducers/projectReducer';
import TaskCard from '../Cards/Task';
import TaskModal from '../Modals/Task';
import { IUserState } from '../../redux/reducers/userReducer';
import { useAlert } from '../Alert/context';
import { IProjectPreviewCard } from '../../pages/ProjectsPage';
import ListMenu from '../Menus/List';


interface BoardListProps {
    list: IList;
    boardId: string;
    projectState: IProject;
    userState: IUserState;
    setOpenModalCreateTask: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedListId: React.Dispatch<React.SetStateAction<string>>;
    setProjects: React.Dispatch<React.SetStateAction<IProjectPreviewCard[]>>;
}

const BoardList: React.FC<BoardListProps> = ({
    list,
    boardId,
    projectState,
    userState,
    setOpenModalCreateTask,
    setSelectedListId,
    setProjects
}) => {
    const { showAlert } = useAlert();

    const [selectedTask, setSelectedTask] = useState<ICard>({
        id: '',
        title: '',
        description: '',
        members: [],
        labels: [],
        dueDate: null,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
    });
    const [isOpenTask, setIsOpenTask] = useState<boolean>(false);
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const [isMoveCard, setIsMoveCard] = useState<boolean>(false);


    const [, dropTaskRef] = useDrop({
        accept: 'TASK',
        drop: (item: any) => {
            moveCard(item);
        }
    });

    const moveCard = async (item: { task: ICard, listId: string }) => {
        if (isMoveCard || !list.id || item.listId == list.id) return;

        setIsMoveCard(true);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectState.id}/boards/${boardId}/${item.listId}/move-card`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cardId: item.task.id,
                        moveToList: list.id
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message?.message}`);
                return;
            }
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsMoveCard(false);
        }
    };

    return (
        <>
            <div className={styles.container} ref={dropTaskRef}>
                <div className={styles.containerData}>
                    <div className={styles.containerLeftData}>
                        <ListMenu
                            isOpen={isOpenMenu}
                            project={projectState}
                            boardId={boardId}
                            list={list}
                            onClose={() => setIsOpenMenu(false)}
                            setProjects={setProjects} />
                        <img
                            onClick={() => setIsOpenMenu(true)}
                            src='./icons/Settings.svg' />
                        <span>{list.name}</span>
                    </div>
                    <img
                        onClick={() => console.log("TODO: ADD DRAG")}
                        src='./icons/Drag.svg' />
                </div>
                {list?.cards.length != 0 &&
                    <div className={styles.containerTasks}>
                        {list.cards.map(task => (
                            <TaskCard
                                key={task.id}
                                setSelectedTask={setSelectedTask}
                                setIsOpenTask={setIsOpenTask}
                                task={task}
                                listId={list.id}
                                projectState={projectState}
                                userPermission={
                                    projectState.boards
                                        ?.find(board => board.id === boardId)?.members
                                        ?.find(member => member.id === userState.id)?.role != EMemberRole.OBSERVER
                                } />
                        ))}
                    </div>
                }
                {projectState.boards
                    ?.find(board => board.id === boardId)?.members
                    ?.find(member => member.id === userState.id)?.role != EMemberRole.OBSERVER && list?.cards?.length < 120 &&
                    <div
                        onClick={() => {
                            setSelectedListId(list.id);
                            setOpenModalCreateTask(true);
                        }}
                        className={styles.addTaskToList}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x={7} y={0} width={2.5} height={18} rx={2.25} fill="#222225" />
                            <rect x={18.75} y={7.75} width={2.5} height={18} rx={2.25} transform="rotate(90 18 6.75)" fill="#222225" />
                        </svg>
                        {/* SVG - Copy Paste, TODO: Move to SVG File */}
                    </div>
                }
            </div>

            <TaskModal
                task={selectedTask}
                isOpen={isOpenTask}
                onClose={() => setIsOpenTask(false)} />
        </>
    );
};

export default BoardList;
