// MainView.jsx
import  { useState, useEffect } from 'react';

import style from '../styles/pages/HomePage.module.scss';
import Navbar from '../components/Navbar';

const HomePage = () => {
	return (
		<div className={style.container}>
			<Navbar />
		</div>
	);
};

export default HomePage;
