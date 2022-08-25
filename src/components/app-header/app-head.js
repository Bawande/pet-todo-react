import React, { useContext } from 'react'
import { DataGroupContext, DataTaskContext } from '../../contexts/data';
import { InterfaceContext } from '../../contexts/interface';


const AppHead = () => {
	const [objectDataState, dispatchDataState] = useContext(DataGroupContext);
	const [objectInterfaceState, dispatchInterfaceState] = useContext(InterfaceContext);
	const [objectTaskDataState, dispatchTaskDataState] = useContext(DataTaskContext);


	const activeGroup = () => {
		return objectInterfaceState.activeGroupId;
	};

	const findleGroupColor = () => {
		return objectInterfaceState.colorGroupArray
			.find((object) => object.id === findColorActiveGroup())
			.hex;
	};

	const findNameActiveGroup = () => {
		return objectDataState.groupsArray.find((object) => object.idGroup === activeGroup()).nameGroup;
	};

	const findColorActiveGroup = () => {
		return objectDataState.groupsArray.find((object) => object.idGroup === activeGroup()).colorGroup;
	};

	const closeMenuClick = (event) => {
		if (!event.target.closest('.head__btn-menu')) {
			dispatchInterfaceState({
				type: 'CLOSE_HEAD_MENU'
			});
			window.removeEventListener('click', closeMenuClick);
		}
	};

	const resetData = () => {
		dispatchDataState({
			type: 'RESET_DATA'
		});

		dispatchTaskDataState({
			type: 'RESET_DATA'
		});
	};

	const handlerClickBtnMenu = (event) => {
		if (!objectInterfaceState.showHeadMenu) {
			dispatchInterfaceState({
				type: 'OPEN_HEAD_MENU'
			});

			window.addEventListener('click', closeMenuClick);

		} else {
			dispatchInterfaceState({
				type: 'CLOSE_HEAD_MENU'
			});
		}
	}


	return (
		<div
			className='todo__head'
		>
			<div className="head">
				<span
					className="head__color-group color-group--"
					style={{ backgroundColor: findleGroupColor() }}
				></span>

				<h2 className="head__title">
					{findNameActiveGroup()}
				</h2>
				<div
					className="head__btn-menu"
					onClick={handlerClickBtnMenu}
				>
				</div>
				{objectInterfaceState.showHeadMenu && (
					<div className="head__menu head-menu">
						<ul className='head-menu__list'>

							<li
								className='head-menu__item'
								onClick={resetData}
							>
								Сбросить данные
							</li>

							{/* <li className='head-menu__item'>
								загрузить данные по умолчанию
							</li>

							<li className='head-menu__item'>
								загрузить данные по умолчанию
							</li>

							<li className='head-menu__item'>
								загрузить данные по умолчанию
							</li>

							<li className='head-menu__item'>
								загрузить данные по умолчанию
							</li> */}

						</ul>
					</div>
				)}

			</div>

		</div>
	)
}

export default AppHead