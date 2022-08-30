import React, { useLayoutEffect, useState } from "react";
import AppHead from "../app-header";
import SideBar from "../app-sidebar";
import TaskList from "../task-list";
import PopUp from "../pop-up";


function App() {

	function useIsMobileDevice() {
		const [isMobile, setDevice] = useState(false);

		useLayoutEffect(() => {

			function updateDevice() {
				setDevice(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
					.test(navigator.userAgent));
			}

			const debounce = (fn, delay) => {
				let timerId;
				return (...args) => {
					clearTimeout(timerId);
					timerId = setTimeout(fn, delay, [...args]);
				};
			};

			const debouncedUpdateDevice = debounce(updateDevice, 200);

			window.addEventListener('resize', debouncedUpdateDevice);

			updateDevice();

			return () => window.removeEventListener('resize', debouncedUpdateDevice);
		}, []);

		return isMobile;
	}



	return !useIsMobileDevice() ? (
		<div className="todo">
			<AppHead />
			<SideBar />
			<TaskList />
		</div>
	) : (
		<PopUp
			closePopup={'NONE'}
			title={'Ошибка'}
			children={
				(<>
					<div>
						На текущий момент, приложение не оптимизировано для вашего устройства.
					</div>

				</>)
			} />
	);
}

export default App;
