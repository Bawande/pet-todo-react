import customData from '../data/data.json'

const tasksArray = [];

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

	if (!localStorage.getItem('tasks')) {
		localStorage.setItem('tasks', JSON.stringify(customData.tasksArray));
	}

	tasksArray.push(...JSON.parse(localStorage.getItem('tasks')));

} else {

	tasksArray.push(...customData.tasksArray);
}

export const initialDataTaskState = {
	tasksArray,
}

export const reducerDataTaskState = (state, action) => {

	const saveToLocalStorege = (array) => {
		if (isLocalStorageAvailable()) {
			localStorage.setItem('tasks', JSON.stringify(array));
		};
		return array;
	}

	const toggleCompletedTask = (taskArray, taskId) => {
		const resultArray = JSON.parse(taskArray);
		return resultArray.map((object) => {
			if (object.id === taskId) {
				if (object.completed) { object.completed = false } else { object.completed = true };
			}
			return object;
		});
	};

	const addTask = (text, groupId) => {
		return {
			id: Math.floor(Math.random() * 100000),
			groupId: groupId,
			subtaskId: 0,
			taskText: text,
			completed: false,
			remote: false,
		}
	}

	const removeTask = (taskArray, taskId) => {
		const resultArray = JSON.parse(taskArray);
		return resultArray.filter((object) => object.id !== taskId)
	};

	const removeTaskGroup = (taskArray, groupId) => {
		const resultArray = JSON.parse(taskArray);
		return resultArray.filter((object) => object.groupId !== groupId)
	};

	const changeTask = (taskArray, taskId, textTask) => {
		const resultArray = JSON.parse(taskArray);
		return resultArray.map((object) => {
			if (object.id === taskId) {
				return {
					...object,
					taskText: textTask,
				}
			} else {
				return object
			}
		})
	};

	const sortDragTask = (taskArray, dragTaskId, dropTaskId) => {
		const resultArray = JSON.parse(taskArray);
		const dragTask = resultArray.findIndex((object) => object.id === dragTaskId);
		const dropTask = resultArray.findIndex((object) => object.id === dropTaskId);
		resultArray.splice(dropTask, 0, resultArray.splice(dragTask, 1)[0]);
		return resultArray;
	};

	const changeGroupTask = (taskArray, taskId, groupId) => {
		const resultArray = JSON.parse(taskArray);
		return resultArray.map((object) => {
			if (object.id === taskId) {
				return {
					...object,
					groupId: groupId,
				};
			} else {
				return object;
			}
		});
	};

	const resetData = () => {
		if (isLocalStorageAvailable()) {
			if (localStorage.getItem('tasks')) {
				localStorage.removeItem('tasks');
				localStorage.setItem('tasks', JSON.stringify(customData.tasksArray));
				return [...JSON.parse(localStorage.getItem('tasks'))];
			}
			return [...customData.tasksArray];
		}
		return [];
	}

	switch (action.type) {

		case "COMPLETED_TASK": {
			const tempTasksArray = JSON.stringify(state.tasksArray);
			return {
				...state,
				tasksArray: saveToLocalStorege(toggleCompletedTask(tempTasksArray, action.taskId)),
			};
		}

		case "ADD_TASK": {
			return {
				...state,
				tasksArray: saveToLocalStorege([addTask(action.textTask, action.groupId), ...state.tasksArray]),
			};
		}

		case "CHANGING_TASK_GROUP": {
			const tempTasksArray = JSON.stringify(state.tasksArray);
			return {
				...state,
				tasksArray: saveToLocalStorege(sortDragTask(JSON.stringify(changeGroupTask(tempTasksArray, action.dragTaskId, action.dropGroupId)), action.dragTaskId, state.tasksArray[0].id)),
			};
		}

		case "CHANGE_TASK": {
			const tempTasksArray = JSON.stringify(state.tasksArray);
			return {
				...state,
				tasksArray: saveToLocalStorege(changeTask(tempTasksArray, action.taskId, action.textTask)),
			};
		}

		case "REMOVE_TASK_GROP": {
			console.log('REMOVE_TASK_GROP')
			const tempTasksArray = JSON.stringify(state.tasksArray);
			return {
				...state,
				tasksArray: saveToLocalStorege(removeTaskGroup(tempTasksArray, action.idGroup)),
			};
		}

		case "REMOVE_TASK": {

			const tempTasksArray = JSON.stringify(state.tasksArray);
			return {
				...state,
				tasksArray: saveToLocalStorege(removeTask(tempTasksArray, action.taskId)),
			};
		}

		case "SORT_TASK": {
			const tempTasksArray = JSON.stringify(state.tasksArray);
			return {
				...state,
				tasksArray: saveToLocalStorege(sortDragTask(tempTasksArray, action.dragTaskId, action.dropTaskId)),
			};
		}

		case "RESET_DATA": {
			return {
				...state,
				tasksArray: resetData(),
			};
		}

		default: {
			return state;
		}

	}
}