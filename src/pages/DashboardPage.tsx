import style from '../styles/pages/DashboardPage.module.scss';

const DashboardPage = () => {

	const eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_URI}/projects/stream`);

	eventSource.onmessage = (event) => {
		console.log("update:", JSON.parse(event.data));
	};

	return (
		<div className={style.container}>
		</div>
	);
};

export default DashboardPage;
