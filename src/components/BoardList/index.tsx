import { useEffect, useRef, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';

import styles from './BoardList.module.scss';
import { addCardToList, EMemberRole, ICard, IList, IProject, removeCardFromList, renameListInBoard } from '../../redux/reducers/projectReducer';
import BoardTaskCard from '../Cards/BoardTask';
import ButtonCreate from '../ButtonCreate';
import ListMenu from '../Menus/List';
import { useAlert } from '../Alert/context';


interface BoardListProps {
    list: IList;
    projectState: IProject;
    style: string;
    boardId: string;
    userRole: EMemberRole;
    setIsOpenCreateTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedCard: React.Dispatch<React.SetStateAction<ICard>>;
    setSelectedListId: React.Dispatch<React.SetStateAction<string>>;
}

const BoardList: React.FC<BoardListProps> = ({ 
    list, 
    projectState, 
    style, 
    setIsOpenCreateTaskModal,
    setIsOpenTaskModal, 
    setSelectedCard,
    setSelectedListId, 
    userRole, 
    boardId 
}) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const [isOpenMenuListSettings, setIsOpenMenuListSettings] = useState<boolean>(false);
    const [isRenamedList, setIsRenamedList] = useState<boolean>(false);
    const [newListName, setNewListName] = useState<string>(list.name);
    const [hasScroll, setHasScroll] = useState<boolean>(false);
    const [isMoveCard, setIsMoveCard] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    const [, dropRef] = useDrop({
        accept: 'CARD',
        drop: (item: any) => {
            moveCard(item);
        }
    });

    const handleRenameList = async () => {
        setIsRenamedList(false);

        const trimmedName = newListName.trim();
        if (trimmedName === '' || trimmedName === list.name) {
            setNewListName(list.name);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectState.id}/boards/${boardId}/${list.id}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: trimmedName
                    })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(renameListInBoard({
                boardId: boardId,
                listId: list.id,
                newName: trimmedName
            }))
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        }
    };

    const moveCard = async (item: { card: ICard, listId: string }) => {
        if (isMoveCard) return;

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
                        cardId: item.card.id,
                        moveToList: list.id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(removeCardFromList({
                boardId: boardId,
                listId: item.listId,
                cardId: item.card.id
            }));

            dispatch(addCardToList({
                boardId: boardId,
                listId: list.id,
                card: data
            }));
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsMoveCard(false);
        }
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const checkScroll = () => {
            setHasScroll(el.scrollHeight > el.clientHeight);
        };

        checkScroll();
        const observer = new ResizeObserver(checkScroll);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setSelectedListId(list.id);
    }, [setIsOpenCreateTaskModal]);

    return (
        <div style={{ position: 'relative', display: 'flex' }} ref={dropRef}>
            <div className={`${style} ${styles.container}`}>
                <div className={styles.main}>
                    {!isRenamedList ? (
                        <text
                            className={styles.listName}
                            onClick={(e) => setTimeout(() => textareaRef.current?.focus(), 0)}>
                            {list.name}
                        </text>
                    ) : (
                        <textarea
                            ref={textareaRef}
                            className={styles.listTextArea}
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            onBlur={handleRenameList}
                            maxLength={16}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleRenameList();
                                    textareaRef.current?.blur();
                                }
                            }}
                            rows={1} />
                    )}
                    {userRole === EMemberRole.ADMIN &&
                        <MoreOutlined
                            onClick={() => setIsOpenMenuListSettings(!isOpenMenuListSettings)}
                            style={{ fontSize: 34, marginRight: -10 }} />
                    }
                </div>
                <div
                    ref={ref}
                    style={{ marginRight: hasScroll ? -14 : 0 }}
                    className={styles.body}>
                    {list.cards.map(card =>
                        <BoardTaskCard
                            key={card.id}
                            listId={list.id}
                            card={card}
                            setSelectedCard={setSelectedCard}
                            setSelectedListId={setSelectedListId}
                            setIsOpenTaskModal={setIsOpenTaskModal}
                            projectState={projectState} />
                    )}
                </div>
                {(userRole === EMemberRole.ADMIN || userRole === EMemberRole.NORMAL) &&
                    <ButtonCreate
                        style={styles.buttonCreate}
                        setIsOpenCreateBoardModal={setIsOpenCreateTaskModal} />
                }
            </div>
            <ListMenu
                textareaRef={textareaRef}
                setIsRenameList={setIsRenamedList}
                setOpenModal={setIsOpenMenuListSettings}
                isOpenModal={isOpenMenuListSettings}
                projectId={projectState.id}
                boardId={boardId}
                listId={list.id} />
        </div>
    );
};

export default BoardList;
