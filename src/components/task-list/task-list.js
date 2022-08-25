import React, { useContext, useState } from 'react';
import TaskHead from '../task-header'
import { DataGroupContext, DataTaskContext } from '../../contexts/data';
import { InterfaceContext } from '../../contexts/interface';

const TaskList = () => {

	const [editTask, setEditTask] = useState(null);
	const [inputValueAddTask, setInputValueAddTask] = useState('');

	const [objectTaskDataState, dispatchTaskDataState] = useContext(DataTaskContext);
	const [objectDataState, dispatchDataState] = useContext(DataGroupContext);
	const [objectInterfaceState, dispatchInterfaceState] = useContext(InterfaceContext);


	const CURRENT_BOARD = 'TASK_LIST';

	const activeGroup = () => {
		return objectInterfaceState.activeGroupId;
	};

	const curentTaskIndex = (id) => {
		return objectTaskDataState.tasksArray.findIndex((object) => object.id === id)
	};

	const handlerCompletedTask = (taskId) => {
		taskId && dispatchTaskDataState({
			type: 'COMPLETED_TASK',
			taskId
		})
	};

	const findleGroupColor = (colorId) => {
		return objectInterfaceState.colorGroupArray
			.find((object) => object.id === colorId)
			.hex;
	};

	const onCkickTaskEdit = (event) => {
		if (!event.target.closest('.task-row.edit')) {
			document.body.removeEventListener('click', onCkickTaskEdit);
			document.querySelectorAll('.task-row').forEach((element) => {
				element.matches('.edit') && element.classList.remove('edit')
			});
			setEditTask(null);
		}
	}

	const handlerEditTask = (event, taskId, value) => {
		if (taskId) {
			event.target.closest('.task-row').classList.add('edit');
			document.body.addEventListener('click', onCkickTaskEdit)
			setEditTask(taskId);
			setInputValueAddTask(value)
		}
	};

	const handlerRemoveTask = (taskId) => {
		taskId && dispatchTaskDataState({
			type: 'REMOVE_TASK',
			taskId
		})
	};

	const handlerCancelEdit = (event) => {

		event.target.closest('.task-row').classList.remove('edit');
		setEditTask(null);
	}

	const isTextValid = (text) => {
		const re = /.{1,120}$/u;
		return re.test(String(text))
	}

	const handlerChangeTask = (taskId) => {
		if (isTextValid(inputValueAddTask)) {

			dispatchTaskDataState({
				type: 'CHANGE_TASK',
				taskId,
				textTask: inputValueAddTask
			});

			setEditTask(null);
			setInputValueAddTask('');
		}
	}

	const findIndexColor = (groupId) => {
		// console.log(objectDataState)
		return objectDataState.groupsArray.find((object) => object.idGroup === groupId).colorGroup;
	}


	const dragStartHandler = (event, taskId) => {

		dispatchInterfaceState({
			type: 'SET_CURENT_DRAG',
			itemId: taskId,
			board: CURRENT_BOARD,
		})
		// event.currentTarget.classList.add('drag-item--light');
		const dropList = document.querySelector('.task-list');
		dropList.querySelectorAll('.task-list__drop-zone')?.forEach(element => {
			element.classList.add('active');
		});

		const groupDropList = document.querySelector('.group-list');
		groupDropList.querySelectorAll('.group-list__drop-zone')?.forEach(element => {
			element.classList.add('active');
		});

		// console.log('dragStartHandler', objectInterfaceState.curentDragItemId);
	};

	const dragHandler = (event) => {

		event.currentTarget.classList.add('drag-item');
		// console.log('dragEndHandler', objectInterfaceState.curentDragItemId);
	};

	const dragEndHandler = (event) => {

		event.currentTarget.classList.remove('drag-item');

		const dropList = document.querySelector('.task-list');
		dropList.querySelectorAll('.task-list__drop-zone.active')?.forEach(element => {
			element.classList.remove('active');
		});

		const groupDropList = document.querySelector('.group-list');
		groupDropList.querySelectorAll('.group-list__drop-zone')?.forEach(element => {
			element.classList.remove('active');
		});

		dispatchInterfaceState({
			type: 'SET_CURENT_DRAG',
			itemId: null,
			board: null,
		});
		// console.log('dragEndHandler', objectInterfaceState.curentDragItemId);
	};

	const dragEnterHandler = (event, taskId) => {

		if (objectInterfaceState.curentDragBoard === 'GROUP_LIST') {
			console.log('dragEnterHandler > GROUP_LIST');
		}

		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {

			if (curentTaskIndex(taskId) < curentTaskIndex(objectInterfaceState.curentDragItemId)) {
				event.currentTarget.classList.add('drop-zone-up');
			}

			if (curentTaskIndex(taskId) > curentTaskIndex(objectInterfaceState.curentDragItemId)) {
				event.currentTarget.classList.add('drop-zone-dn');
			}

		}
	};

	const dragLeaveHandler = (event) => {

		if (objectInterfaceState.curentDragBoard === 'GROUP_LIST') {
			console.log('dragLeaveHandler > GROUP_LIST');
		}

		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {
			event.currentTarget.classList.remove('drop-zone-dn');
			event.currentTarget.classList.remove('drop-zone-up');
		}
	};

	const dragOverHandler = (event) => {

		if (objectInterfaceState.curentDragBoard === 'GROUP_LIST') {
			console.log('dragOverHandler > GROUP_LIST');
		}

		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {
			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';
		}
	};

	const dropHandler = (event, taskId) => {


		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {
			event.preventDefault();

			dispatchTaskDataState({
				type: 'SORT_TASK',
				dragTaskId: objectInterfaceState.curentDragItemId,
				dropTaskId: taskId,
			})

			event.currentTarget.classList.remove('drag-item');

			event.currentTarget.classList.remove('drop-zone-dn');
			event.currentTarget.classList.remove('drop-zone-up');

			const dropList = document.querySelector('.task-list');
			dropList.querySelectorAll('.task-list__drop-zone.active')?.forEach(element => {
				element.classList.remove('active');
			});

			const groupDropList = document.querySelector('.group-list');
			groupDropList.querySelectorAll('.group-list__drop-zone')?.forEach(element => {
				element.classList.remove('active');
			});

			dispatchInterfaceState({
				type: 'SET_CURENT_DRAG',
				itemId: null,
				board: null,
			});
		}
	};


	return (
		<div
			className='todo__task-list'
		>

			<TaskHead groupId={activeGroup()} dispatchTask={dispatchTaskDataState} />

			<ul className='task-list'>
				{objectTaskDataState.tasksArray
					.filter((object) => (activeGroup() === 10000) ? true : (object.groupId === activeGroup()) ? true : false)
					.map((object, index) => (

						<li
							key={`taskIten${index}`}
							className='task-list__item'

							draggable={true}

							onDragStart={(event) => dragStartHandler(event, object.id, true)}
							onDrag={(event) => dragHandler(event, true)}
							onDragEnd={(event) => dragEndHandler(event, true)}

							onDragEnter={(event) => dragEnterHandler(event, object.id, true)}
							onDragLeave={(event) => dragLeaveHandler(event, true)}
							onDragOver={(event) => dragOverHandler(event, true)}
							onDrop={(event) => dropHandler(event, object.id, true)}
						>
							<div className="task-list__drop-zone"></div>

							<div className="task-row">
								<div
									className="task-row__group-color"
									style={{ backgroundColor: findleGroupColor(findIndexColor(object.groupId)) }}
								></div>
								<label className="check task-row__check">
									<input
										onChange={() => handlerCompletedTask(object.id)}
										checked={object.completed ? true : false}
										className="check__input"
										type="checkbox"
									/>
									<span className='check__box'></span>
								</label>

								{(editTask === object.id) ? (
									<>
										<input
											type="text"
											className={`task-row__task ${object.completed ? 'completed' : ''}`}
											value={inputValueAddTask}
											onChange={(event) => setInputValueAddTask(event.target.value)}
											onKeyDown={(event) => (event.code === 'Enter') && handlerChangeTask(object.id)}
										/>

										<div className="task-row__tools">
											<span
												className='task-row__icon task-row__icon--add'
												onClick={() => handlerChangeTask(object.id)}
											></span>
											<span
												className='task-row__icon task-row__icon--cancel'
												onClick={(event) => handlerCancelEdit(event)}
											></span>
										</div>
									</>
								) : (
									<>
										<input
											type="text"
											readOnly
											className={`task-row__task ${object.completed ? 'completed' : ''}`}
											value={object.taskText}
											onDoubleClick={(event) => handlerEditTask(event, object.id, object.taskText)}
										/>

										<div className="task-row__tools">
											<span className='task-row__icon task-row__icon--options'></span>
											<span
												className='task-row__icon task-row__icon--edit'
												onClick={(event) => handlerEditTask(event, object.id, object.taskText)}
											></span>
											<span
												className='task-row__icon task-row__icon--remove'
												onClick={() => handlerRemoveTask(object.id)}
											></span>
										</div>
									</>
								)}

							</div>

						</li>
					))}

			</ul>




		</div>
	)
}

export default TaskList