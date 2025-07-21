// MainView.jsx
import { DiscordOutlined } from '@ant-design/icons';
import style from '../styles/pages/AuthPage.module.scss';
import AuthFunc from 'src/components/Auth';

const AuthPage = () => {
	return (
		<div className={style.container}>
			<div className={style.content}>
				<text style={{ marginTop: 25 }} >Авторизация</text>
				<button onClick={AuthFunc} className={style.discordButton}>
					Auth with Discord
					<DiscordOutlined style={{ marginLeft: 8 }} />
				</button>
			</div>
		</div>
	);
};

export default AuthPage;
