import { useState, useEffect, useMemo, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

import style from '../styles/pages/BoardPage.module.scss';
import { RootState } from '../redux/store';
import { useGetProject } from '../utils/fetch/getProjectById';
import ButtonCreate from '../components/ButtonCreate';
import BoardList from '../components/BoardList';
import { EMemberRole, ICard } from '../redux/reducers/projectReducer';
import NewListModal from '../components/Modals/NewList';
import NewTaskModal from '../components/Modals/NewTask';
import TaskModal from 'src/components/Modals/Task';


const BoardPage = () => {
	const { projectId, boardId } = useParams();
	const { getProject } = useGetProject();

	const projectState = useSelector((state: RootState) => state.projectReducer);
	const isOpenNavbar = useSelector((state: RootState) => state.siteReducer).isNavbarOpen;
	const userId = useSelector((state: RootState) => state.userReducer).id;
	const board = projectState.boards.find(board => board.id === boardId);
	const userRole = board?.members.find((m) => m.id === userId)?.role;

	const [isOpenCreateListModal, setIsOpenCreateListModal] = useState<boolean>(false);
	const [isOpenCreateTaskModal, setIsOpenCreateTaskModal] = useState<boolean>(false);
	const [isOpenTaskModal, setIsOpenTaskModal] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [selectedListId, setSelectedListId] = useState<string>('');
	const [selectedCard, setSelectedCard] = useState<ICard>({
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
	const [direction, setDirection] = useState<"left" | "right">("right");

	const itemsPerPage = isOpenNavbar ? 6 : 5;
	const boardMemberIds = new Set(board?.members.map(m => m.id));

	const filteredMembers = projectState.members.filter(user =>
		boardMemberIds.has(user.id)
	);


	const pages = useMemo(() => {
		if (!board?.lists) return [];

		const lists = [...board.lists];

		if (userRole === EMemberRole.ADMIN) {
			lists.push({ id: '__create__' } as any);
		}

		const result = [];
		for (let i = 0; i < lists.length; i += itemsPerPage) {
			result.push(lists.slice(i, i + itemsPerPage));
		}
		return result;
	}, [board?.lists, itemsPerPage, userRole]);


	useEffect(() => {
		if (!projectState.id || projectState.id !== projectId) {
			getProject(projectId || "");
		}
	}, [projectId]);

	const handlePageChange = (dir: "left" | "right") => {
		if (dir === "left" && currentPage > 0) {
			setDirection("left");
			setCurrentPage((prev) => prev - 1);
		} else if (dir === "right" && currentPage < pages.length - 1) {
			setDirection("right");
			setCurrentPage((prev) => prev + 1);
		}
	};

	return (
		<div className={style.container}>
			<div className={style.slider}>
				{pages.length == 0 &&
					userRole === EMemberRole.ADMIN && (
						<ButtonCreate setIsOpenCreateBoardModal={setIsOpenCreateListModal} style={style.buttonCreate} />
					)
				}
				{pages.map((page, index) => (
					<div
						key={index}
						className={`${style.slide} ${index === currentPage ? style.active : ""
							} ${index < currentPage ? style.prev : index > currentPage ? style.next : ""} ${direction === "left" ? style.fromLeft : style.fromRight
							}`}>
						{page.map((list) =>
							list.id === '__create__' ? (
								<ButtonCreate
									key="create"
									setIsOpenCreateBoardModal={setIsOpenCreateListModal}
									style={style.buttonCreate} />
							) : (
								<BoardList
									key={list.id}
									list={list}
									setIsOpenCreateTaskModal={setIsOpenCreateTaskModal}
									setIsOpenTaskModal={setIsOpenTaskModal}
									setSelectedCard={setSelectedCard}
									setSelectedListId={setSelectedListId}
									projectState={projectState}
									boardId={boardId || ""}
									userRole={userRole || EMemberRole.OBSERVER}
									style={pages.length <= 1 ? style.listContainerPagination : style.listContainer}
									isOpenCreateTaskModal={isOpenCreateTaskModal} />
							)
						)}
					</div>
				))}
			</div>

			{pages.length > 1 && (
				<div className={style.pagination}>
					<ArrowLeftOutlined onClick={() => handlePageChange("left")} disabled={currentPage === 0} />
					<text>{currentPage + 1} / {pages.length}</text>
					<ArrowRightOutlined onClick={() => handlePageChange("right")} disabled={currentPage === pages.length - 1} />
				</div>
			)}
			<NewListModal
				isOpenModal={isOpenCreateListModal}
				setOpenModal={setIsOpenCreateListModal}
				projectId={projectId || ""}
				boardId={boardId || ""} />
			<NewTaskModal
				isOpenModal={isOpenCreateTaskModal}
				setOpenModal={setIsOpenCreateTaskModal}
				projectId={projectId || ""}
				boardId={boardId || ""}
				users={filteredMembers}
				listId={selectedListId} />
			<TaskModal
				isOpenModal={isOpenTaskModal}
				setOpenModal={setIsOpenTaskModal}
				task={selectedCard}
				userRole={userRole || EMemberRole.OBSERVER}
				project={projectState}
				boardId={boardId || ""}
				listId={selectedListId}
				users={filteredMembers} />
		</div>
	);
};


export default BoardPage;