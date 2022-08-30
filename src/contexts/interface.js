import { createContext, useReducer } from "react";
import colorsArray from "../data/dbColor";

const initialInterfaceState = {
	showPopupGroupAddGroup: false,
	colorGroupArray: colorsArray,
	showPopupGroupChangeGroup: false,
	openPopupChangeGroup: { idGroup: 0 },
	curentDragItemId: null,
	curentDragBoard: null,
	activeGroupId: 10000,
	showHeadMenu: false,
	isMobile: false,
}

const changeStatusActiveColor = (colorArray, activeId) => {

	return colorArray.map((object) => {
		if (object.id !== activeId) {
			object.active = false;
		} else {
			object.active = true;
		}
		return object;
	})
}

const reducerInterfaceState = (state, action) => {

	switch (action.type) {

		case "SET_CURENT_DRAG": {
			return {
				...state,
				curentDragItemId: action.itemId,
				curentDragBoard: action.board,
			};
		}

		case "OPEN_HEAD_MENU": {
			return {
				...state,
				showHeadMenu: true,
			};
		}

		case "CLOSE_HEAD_MENU": {
			return {
				...state,
				showHeadMenu: false,
			};
		}

		case "CLOSE_POPUP_ADD_NEW_GROUP": {
			return {
				...state,
				showPopupGroupAddGroup: false,
			};
		}

		case "SHOW_POPUP_ADD_NEW_GROUP": {
			return {
				...state,
				showPopupGroupAddGroup: true
			};
		}

		case "CLOSE_POPUP_CHANGE_GROUP": {

			return {
				...state,
				showPopupGroupChangeGroup: false,
				openPopupChangeGroup: { idGroup: action.idGroup },
			};
		}

		case "SHOW_POPUP_CHANGE_GROUP": {

			return {
				...state,
				showPopupGroupChangeGroup: true,
				openPopupChangeGroup: { idGroup: action.idGroup },
			};
		}

		case "CHANGE_COLOR_ADD_GROUP": {
			// console.log(action.colorId)
			const colorGroupArray = changeStatusActiveColor(state.colorGroupArray, action.colorId)
			return {
				...state,
				colorGroupArray,
			};
		}

		case "SELECTED_GROUP": {
			// console.log(action.idGroup);
			return {
				...state,
				activeGroupId: action.idGroup,
			};
		}

		case "DEFAULT_COLOR": {

			const colorGroupArray = changeStatusActiveColor(state.colorGroupArray, 1)

			return {
				...state,
				colorGroupArray,
			};
		}

		case "ON_MOBILE": {
			return {
				...state,
				isMobile: true,
			};
		}

		case "OFF_MOBILE": {
			return {
				...state,
				isMobile: false,
			};
		}

		default: {
			return state;
		}

	}
}

export const InterfaceContext = createContext();

export const InterfaceProvider = ({ children }) => {

	const valueArray = useReducer(reducerInterfaceState, initialInterfaceState);

	return (
		<InterfaceContext.Provider value={valueArray}>
			{children}
		</InterfaceContext.Provider>
	)
}