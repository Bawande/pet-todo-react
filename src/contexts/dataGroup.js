// import taskGroupsArray from "../data/dbGroup";

import customData from '../data/data.json'

const taskGroupsArray = [];

function isLocalStorageAvailable() {
	var test = 'test';
	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch (error) {
		return false;
	}
}

if (isLocalStorageAvailable()) {
	if (!localStorage.getItem('group')) {
		localStorage.setItem('group', JSON.stringify(customData.taskGroupsArray));
	}
	taskGroupsArray.push(...JSON.parse(localStorage.getItem('group')));
} else {
	taskGroupsArray.push(...customData.taskGroupsArray);
}


export const initialDataState = {
	groupsArray: taskGroupsArray,
}

export const reducerDataState = (state, action) => {

	const addCustomGroup = (idGroup, nameGroup, colorGroup) => {
		return {
			idGroup,
			typeGroup: 'custom-task',
			nameGroup,
			colorGroup,
		}
	}

	const saveToLocalStorege = (array) => {
		if (isLocalStorageAvailable()) {
			localStorage.setItem('group', JSON.stringify(array));
		};
		return array;
	}

	const removeCustomGroup = (tempGroupsArray, idGroup) => {
		const resultArray = JSON.parse(tempGroupsArray);
		return resultArray.filter((object) => {
			return object.idGroup !== idGroup
		})
	}

	const changeCustomGroup = (tempGroupsArray, idGroup, name, colorId) => {
		const resultArray = JSON.parse(tempGroupsArray);
		return resultArray.map((object) => {
			if (object.idGroup === idGroup) {
				return {
					...object,
					nameGroup: name,
					colorGroup: colorId,
				}
			} else {
				return object;
			}
		})
	};

	const sortCustomGroup = (tempGroupsArray, dragGroupId, dropPositionGroupId, dropPosition) => {
		const resultArray = JSON.parse(tempGroupsArray);
		const dragTask = resultArray.findIndex((object) => object.idGroup === dragGroupId);
		const dropTask = resultArray.findIndex((object) => object.idGroup === dropPositionGroupId);
		resultArray.splice(dropTask, 0, resultArray.splice(dragTask, 1)[0]);
		return resultArray;
	};

	const resetData = () => {
		if (isLocalStorageAvailable()) {
			if (localStorage.getItem('group')) {
				localStorage.removeItem('group');
				localStorage.setItem('group', JSON.stringify(customData.taskGroupsArray));
				return [...JSON.parse(localStorage.getItem('group'))];
			}
			return [...customData.taskGroupsArray];
		}
		return [];
	};

	switch (action.type) {

		case "ADD_NEW_GROUP": {
			return {
				...state,
				groupsArray: saveToLocalStorege([...state.groupsArray, addCustomGroup(action.idGroup, action.name, action.colorId)]),
			};
		}

		case "REMOVE_GROUP": {
			const tempGroupsArray = JSON.stringify(state.groupsArray);
			return {
				...state,
				groupsArray: saveToLocalStorege(removeCustomGroup(tempGroupsArray, action.idGroup)),
			};
		}

		case "CHANGE_GROUP": {
			const tempGroupsArray = JSON.stringify(state.groupsArray);
			return {
				...state,
				groupsArray: saveToLocalStorege(changeCustomGroup(tempGroupsArray, action.idGroup, action.name, action.colorId)),
			};
		}

		case "SORT_GROUP": {
			const tempGroupsArray = JSON.stringify(state.groupsArray);
			return {
				...state,
				groupsArray: saveToLocalStorege(sortCustomGroup(tempGroupsArray, action.dragGroupId, action.dropPositionGroupId, action.dropPosition)),
			};
		}

		case "RESET_DATA": {
			return {
				...state,
				groupsArray: resetData(),
			};
		}

		default: {
			return state;
		}

	}
}