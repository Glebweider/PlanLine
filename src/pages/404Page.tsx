import style from '../styles/pages/404Page.module.scss';
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<div className={style.container}>
			<div className={style.content}>
				<text style={{ fontSize: 144 }}>404</text>
				<text style={{ fontSize: 28 }}>По данному запросу ничего не найдено :(</text>
				<text style={{ fontSize: 18, marginTop: 10 }}>Если вы уверенны что здесь что-то должно быть обратитесь к
					<a href={process.env.REACT_APP_OWNER_LINK} target="_blank" rel="noopener noreferrer"> администратору сайта.</a>
				</text>
			</div>
			<div className={style.messageContainer} onClick={() => navigate(-1)}>
				<div className={style.messageBox}>
					<ArrowLeftOutlined className={style.messageArrow} />
					<p className={style.messageText}>Вернуться назад</p>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
