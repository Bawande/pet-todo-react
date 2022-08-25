import React from "react";
import PopUp from "../pop-up/";
import { DataGroupContext } from '../../contexts/data';
import { InterfaceContext } from "../../contexts/interface";

import { useRef } from "react";
import { useContext } from "react";

const AddGroup = () => {
	const [objectInterfaceState, dispatchInterfaceState] = useContext(InterfaceContext);
	const [objectDataState, dispatchDataState] = useContext(DataGroupContext);
	const inputNameNewGroup = useRef(null);

	const handlerSelectColor = (colorId) => {
		dispatchInterfaceState({
			type: 'CHANGE_COLOR_ADD_GROUP',
			colorId
		})
	};


	const isTextValid = (text) => {
		const re = /^[а-яА-ЯёЁa-zA-Z0-9\s]{3,30}$/i;
		return re.test(String(text))
	}

	const handlerAddGroup = () => {

		const name = inputNameNewGroup.current.value.trim();

		if (!isTextValid(name)) return;

		const idGroup = Math.floor(Math.random() * 100000);

		const colorId = objectInterfaceState.colorGroupArray
			.find((object) => object.active === true)
			.id;

		dispatchDataState({
			idGroup,
			type: 'ADD_NEW_GROUP',
			name,
			colorId,
		});

		dispatchInterfaceState({
			type: 'SELECTED_GROUP',
			idGroup,
		});

		dispatchInterfaceState({
			type: 'CLOSE_POPUP_ADD_NEW_GROUP'
		});

		dispatchInterfaceState({
			type: 'DEFAULT_COLOR'
		});

	}

	const handlerAddPopupAddGroup = () => {

		dispatchInterfaceState({
			type: 'SHOW_POPUP_ADD_NEW_GROUP'
		});


	}

	return (
		<div className="add-group">

			<button
				className="add-group__btn"
				onClick={() => handlerAddPopupAddGroup()}
			>
				<svg
					viewBox="0 0 16 16"
					xmlns="http://www.w3.org/2000/svg">
					<path d="M8 1V15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M1 8H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				Добавить группу
			</button>

			{objectInterfaceState.showPopupGroupAddGroup && (
				<PopUp
					closePopup={'CLOSE_POPUP_ADD_NEW_GROUP'}
					title={'Добавить группу'}
					children={
						(<>
							<input
								ref={inputNameNewGroup}
								type="text"
								placeholder="Название группы"
								className="add-group__input-name input-media input-media__text"
								onKeyDown={(event) => ((event.code === 'Enter') || (event.code === 'NumpadEnter')) && handlerAddGroup()}
							/>

							<ul className="add-group__colors-list">
								{objectInterfaceState.colorGroupArray.map((color, index) => (
									color['name'] !== "none" && (
										<li
											key={`colors-list${index}`}
											className={`add-group__color-item ${color['active'] ? "active" : ""} group-color--${color['name']}`}
											style={{ backgroundColor: color['hex'] }}
											onClick={() => {
												handlerSelectColor(color.id)
											}}
										></li>
									)
								))}
							</ul>

							<button
								className="add-group__btn-add btn-media"
								onClick={() => handlerAddGroup()}
							>
								Добавить
							</button>

						</>)
					} />
			)}

		</div >
	)
}

export default AddGroup;