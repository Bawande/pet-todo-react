import React from 'react'
import PopUp from "../pop-up/";
import { DataGroupContext } from '../../contexts/data';
import { InterfaceContext } from "../../contexts/interface";

import { useRef } from "react";
import { useContext } from "react";

const ChangeGroup = () => {

	const [objectInterfaceState, dispatchInterfaceState] = useContext(InterfaceContext);
	const [objectDataState, dispatchDataState] = useContext(DataGroupContext);
	const inputNameNewGroup = useRef(null);

	const idChangeGroup = objectInterfaceState.openPopupChangeGroup.idGroup;
	const objectChangeGroup = objectDataState.groupsArray.find((object) => object.idGroup === idChangeGroup);
	// const colorChangeGroup = objectChangeGroup ? objectChangeGroup.colorGroup : '';
	const nameChangeGroup = objectChangeGroup ? objectChangeGroup.nameGroup : '';

	const isTextValid = (text) => {
		const re = /^[а-яА-ЯёЁa-zA-Z0-9\s]{3,30}$/i;
		return re.test(String(text))
	}

	const handlerChangeGroup = () => {
		// console.log('cange group')

		const name = inputNameNewGroup.current.value.trim();

		if (!isTextValid(name)) return;

		const idGroup = idChangeGroup;

		const colorId = objectInterfaceState.colorGroupArray
			.find((object) => object.active === true)
			.id;

		dispatchDataState({
			type: 'CHANGE_GROUP',
			idGroup,
			name,
			colorId,
		})

		dispatchInterfaceState({
			type: 'CLOSE_POPUP_CHANGE_GROUP',
			idGroup: 0,
		})

		dispatchInterfaceState({
			type: 'DEFAULT_COLOR'
		})
	}

	const handlerSelectColor = (colorId) => {
		dispatchInterfaceState({
			type: 'CHANGE_COLOR_ADD_GROUP',
			colorId,
		})
	}

	return (
		<>
			{objectInterfaceState.showPopupGroupChangeGroup && (

				<div
					className="change-group__popup-wrapper"
				>

					<PopUp
						closePopup={'CLOSE_POPUP_CHANGE_GROUP'}
						title={'Редактировать группу'}
						children={
							(<>

								<input
									ref={inputNameNewGroup}
									type="text"
									defaultValue={nameChangeGroup}
									className="change-group__input-name input-media input-media__text"
									onKeyDown={(event) => ((event.code === 'Enter') || (event.code === 'NumpadEnter')) && handlerChangeGroup()}
								/>

								<ul className="change-group__colors-list">
									{objectInterfaceState.colorGroupArray.map((color, index) => (
										color['name'] !== "none" && (
											<li
												key={`colors-list${index}`}
												className={`change-group__color-item ${color['active'] ? "active" : ""} group-color--${color['name']}`}
												style={{ backgroundColor: color['hex'] }}
												onClick={() => {
													handlerSelectColor(color.id)
												}}
											></li>
										)
									))}
								</ul>

								<button
									className="change-group__btn-add btn-media"
									onClick={() => handlerChangeGroup()}
								>
									Изменить
								</button>

							</>)

						} />
				</div>
			)
			}
		</>
	)
}

export default ChangeGroup