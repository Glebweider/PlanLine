import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import style from './List.module.scss';
import CardItem from '../Cards/TaskCard';
import { IList, setProject } from '../../redux/reducers/projectReducer';
import { useAlert } from '../Alert/context';
import { RootState } from '../../redux/store';


interface ListProps {
    list: IList;
    projectId: string | undefined; 
    boardId: string | undefined;
}

const ListItem: React.FC<ListProps> = ({ list, projectId, boardId }) => {
    const { showAlert } = useAlert();
    const dispatch = useDispatch();

    const projectState = useSelector((state: RootState) => state.projectReducer);

    const [isCreateCard, setCreateCard] = useState<boolean>(false);
    const [isCreatingCard, setIsCreatingCard] = useState<boolean>(false);
    const [isEditingList, setIsEditingList] = useState<boolean>(false);
    const [isEditingCard, setIsEditingCard] = useState<boolean>(false);
    const [isOpenSettingsList, setIsOpenSettingsList] = useState<boolean>(false);
    
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isCreateCard && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [isCreateCard]);

	const createCard = async () => {
        if (isCreatingCard) return;

        const cardTitle = inputRef.current?.value?.trim() || '';

        if (cardTitle.length < 1 || cardTitle.length > 1024) {
            showAlert('Название должно быть от 1 до 1024 символов.');
            return;
        }

        const unsafePattern = /<[^>]*>|script|onerror|onload|javascript:/i;
        if (unsafePattern.test(cardTitle)) {
            showAlert('Название не должно содержать HTML или потенциально опасный код.');
            return;
        }

        try {
            setIsCreatingCard(true);
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URI}/projects/${projectId}/boards/${boardId}/${list.id}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: cardTitle })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showAlert(`Server error: ${response.status}, ${data.message}`);
                return;
            }

            dispatch(setProject({
                ...projectState,
                boards: projectState.boards.map(board =>
                    board.id === boardId
                    ? {
                        ...board,
                        lists: board.lists.map(list =>
                            list.id === list.id
                            ? { ...list, cards: [...list.cards, data] }
                            : list
                        )
                        }
                    : board
                )
            }));
        } catch (error) {
            showAlert(`Fetch failed: ${error}`);
        } finally {
            setIsCreatingCard(false);
        }
	};

    return(
        <div key={list.id} className={style.listContainer}>
			<div className={style.header}>
				{!isEditingList ?
                    <text 
                        onClick={() => setIsEditingList(true)}
                        className={style.listName}>
                            {list.name}
                    </text>
                    :
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Enter card name"
                        onBlur={(e) => {
                            const related = e.relatedTarget as HTMLElement | null;
                            if (!related || !related.closest(`.${style.addCardContainer}`)) {
                                setCreateCard(false);
                            }
                        }}
                        className={style.newCardContainer} />
                }
				<SettingOutlined
                    onClick={() => setIsOpenSettingsList(true)}
                    className={style.settingsCard} />							
			</div>
			{list.cards.map(card => (
				<CardItem key={card.id} card={card} />
			))}
			{isCreateCard &&
				<input
					ref={inputRef}
					type="text"
					placeholder="Enter card name"
					onBlur={(e) => {
                        const related = e.relatedTarget as HTMLElement | null;
                        if (!related || !related.closest(`.${style.addCardContainer}`)) {
                            setCreateCard(false);
                        }
                    }}
					className={style.newCardContainer} />
			}
            {!isCreateCard ?
                <div 
                    onClick={() => setCreateCard(true)}
                    className={style.createCardContainer}>
                    <PlusOutlined style={{ marginLeft: 10, marginRight: 10}} />
                    <text>Create card</text>
                </div>
                :
                <div
                    onMouseDown={() => createCard()}
                    className={style.addCardContainer}>
                    <text style={{ marginLeft: 10 }}>Add card</text>
                </div>
            }
		</div>
    )
}

export default ListItem;