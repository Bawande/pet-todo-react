import React, { useContext } from 'react';
import { DataGroupContext, DataTaskContext } from '../../contexts/data';
import { InterfaceContext } from "../../contexts/interface";

const GroupList = () => {


	const [objectDataState, dispatchDataState] = useContext(DataGroupContext);
	const [objectInterfaceState, dispatchInterfaceState] = useContext(InterfaceContext);
	const [objectTaskDataState, dispatchTaskDataState] = useContext(DataTaskContext);




	const CURRENT_BOARD = 'GROUP_LIST';

	const findleGroupColor = (colorId) => {
		return objectInterfaceState.colorGroupArray
			.find((object) => object.id === colorId)
			.hex;
	};

	const handlerGroupRemoved = (event, idGroup) => {

		event.stopPropagation();

		dispatchDataState({
			type: 'REMOVE_GROUP',
			idGroup,
		})

		dispatchTaskDataState({
			type: 'REMOVE_TASK_GROP',
			idGroup,
		})

		if (objectInterfaceState.activeGroupId === idGroup) {
			dispatchInterfaceState({
				type: 'SELECTED_GROUP',
				idGroup: 10000
			})
		}
	};

	const handlerGroupChange = (idGroup, colorGroup) => {

		dispatchInterfaceState({
			type: 'CHANGE_COLOR_ADD_GROUP',
			colorId: colorGroup,
		});

		dispatchInterfaceState({
			type: 'SHOW_POPUP_CHANGE_GROUP',
			idGroup,
		});
	};

	const handlerGroupSelected = (event, idGroup) => {
		event.stopPropagation();

		dispatchInterfaceState({
			type: 'SELECTED_GROUP',
			idGroup,
		})

	};

	const curentGropIndex = (id) => {
		return objectDataState.groupsArray.findIndex((object) => object.idGroup === id)
	};

	// - drag and drop

	const dragStartHandler = (event, groupId) => {

		dispatchInterfaceState({
			type: 'SET_CURENT_DRAG',
			itemId: groupId,
			board: CURRENT_BOARD,
		});

		event.currentTarget.classList.add('drag-item');

		const dropList = document.querySelector('.group-list');
		dropList.querySelectorAll('.group-list__drop-zone')?.forEach(element => {
			element.classList.add('active');
		});

	};

	const dragLeaveHandler = (event) => {

		if (objectInterfaceState.curentDragBoard === 'TASK_LIST') {
			event.currentTarget.classList.remove('drop-zone-task');
		}

		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {
			event.currentTarget.classList.remove('drop-zone-dn');
			event.currentTarget.classList.remove('drop-zone-up');
		};
	};

	const countTasksGroup = (idGroup) => {
		let resultTasksGroup = 0;
		objectTaskDataState.tasksArray.forEach((object) => {
			if (object.groupId === idGroup)
				resultTasksGroup++;
		})
		return resultTasksGroup;
	}

	const dragEnterHandler = (event, groupId) => {


		if (objectInterfaceState.curentDragBoard === 'TASK_LIST') {
			event.currentTarget.classList.add('drop-zone-task');
		}

		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {

			if (curentGropIndex(groupId) < curentGropIndex(objectInterfaceState.curentDragItemId)) {
				event.currentTarget.classList.add('drop-zone-up');
			};
			if (curentGropIndex(groupId) > curentGropIndex(objectInterfaceState.curentDragItemId)) {
				event.currentTarget.classList.add('drop-zone-dn');
			};
		};
	};

	const dragEndHandler = (event) => {

		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {

			event.currentTarget.classList.remove('drag-item');

			const dropList = document.querySelector('.group-list');
			dropList.querySelectorAll('.group-list__drop-zone')?.forEach(element => {
				element.classList.remove('active');
			});
		}

		dispatchInterfaceState({
			type: 'SET_CURENT_DRAG',
			itemId: null,
			board: null,
		});
	};

	const dragOverHandler = (event) => {

		if (objectInterfaceState.curentDragBoard === 'TASK_LIST') {

			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';
		}

		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {
			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';
		};
	};

	const dropHandler = (event, groupId) => {

		if (objectInterfaceState.curentDragBoard === 'TASK_LIST') {
			event.preventDefault();
			// console.log('dropHandler >', objectInterfaceState.curentDragBoard);

			dispatchTaskDataState({
				type: 'CHANGING_TASK_GROUP',
				dragTaskId: objectInterfaceState.curentDragItemId,
				dropGroupId: groupId,
			});

			event.currentTarget.classList.remove('drop-zone-task');
		}

		if (objectInterfaceState.curentDragBoard === CURRENT_BOARD) {
			event.preventDefault();

			event.currentTarget.classList.remove('drag-item');


			dispatchDataState({
				type: 'SORT_GROUP',
				dragGroupId: objectInterfaceState.curentDragItemId,
				dropPositionGroupId: groupId,
			})


			event.currentTarget.classList.remove('drop-zone-dn');
			event.currentTarget.classList.remove('drop-zone-up');

			const dropList = document.querySelector('.group-list');
			dropList.querySelectorAll('.group-list__drop-zone')?.forEach(element => {
				element.classList.remove('active');
			});

		}

		dispatchInterfaceState({
			type: 'SET_CURENT_DRAG',
			itemId: null,
			board: null,
		});

	};

	return (
		<ul className="group-list">
			{objectDataState.groupsArray.map((group, index) => {
				return (
					<li
						key={`${group.nameGroup},${index}`}
						className="group-list__item-wrap"

						onClick={(event) => handlerGroupSelected(event, group.idGroup)}

						draggable={index > 0 && true}
						onDragStart={(event) => index > 0 && dragStartHandler(event, group.idGroup)}
						onDragEnter={(event) => index > 0 && dragEnterHandler(event, group.idGroup)}
						onDragLeave={(event) => index > 0 && dragLeaveHandler(event)}
						onDragEnd={(event) => index > 0 && dragEndHandler(event)}
						onDragOver={(event) => index > 0 && dragOverHandler(event)}
						onDrop={(event) => index > 0 && dropHandler(event, group.idGroup)}
					>
						<div className="group-list__drop-zone"></div>
						<div
							className={`group-list__item group-list__item--${group.typeGroup} ${objectInterfaceState.activeGroupId === group.idGroup ? 'active' : ''}`}
						>
							<span
								className="group-list__ico"
								style={{ backgroundColor: index === 0 ? 'none' : findleGroupColor(group.colorGroup) }}
							></span>

							<span>
								{group.nameGroup}
							</span>

							<span
								className='group-list__count-task'
							>
								{(countTasksGroup(group.idGroup) === 0) ? '' : countTasksGroup(group.idGroup)}
							</span>

							<span
								className="group-list__edit"
								onClick={() => index > 0 && handlerGroupChange(group.idGroup, group.colorGroup)}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M19.5022 12C19.5022 12.34 19.4722 12.66 19.4322 12.98L21.5422 14.63C21.7322 14.78 21.7822 15.05 21.6622 15.27L19.6622 18.73C19.5722 18.89 19.4022 18.98 19.2322 18.98C19.1722 18.98 19.1122 18.97 19.0522 18.95L16.5622 17.95C16.0422 18.34 15.4822 18.68 14.8722 18.93L14.4922 21.58C14.4622 21.82 14.2522 22 14.0022 22H10.0022C9.7522 22 9.5422 21.82 9.5122 21.58L9.1322 18.93C8.5222 18.68 7.9622 18.35 7.4422 17.95L4.9522 18.95C4.9022 18.97 4.8422 18.98 4.7822 18.98C4.6022 18.98 4.4322 18.89 4.3422 18.73L2.3422 15.27C2.2222 15.05 2.2722 14.78 2.4622 14.63L4.5722 12.98C4.5322 12.66 4.5022 12.33 4.5022 12C4.5022 11.67 4.5322 11.34 4.5722 11.02L2.4622 9.37C2.2722 9.22 2.2122 8.95 2.3422 8.73L4.3422 5.27C4.4322 5.11 4.6022 5.02 4.7722 5.02C4.8322 5.02 4.8922 5.03 4.9522 5.05L7.4422 6.05C7.9622 5.66 8.5222 5.32 9.1322 5.07L9.5122 2.42C9.5422 2.18 9.7522 2 10.0022 2H14.0022C14.2522 2 14.4622 2.18 14.4922 2.42L14.8722 5.07C15.4822 5.32 16.0422 5.65 16.5622 6.05L19.0522 5.05C19.1022 5.03 19.1622 5.02 19.2222 5.02C19.4022 5.02 19.5722 5.11 19.6622 5.27L21.6622 8.73C21.7822 8.95 21.7322 9.22 21.5422 9.37L19.4322 11.02C19.4722 11.34 19.5022 11.66 19.5022 12ZM17.5022 12C17.5022 11.79 17.4922 11.58 17.4522 11.27L17.3122 10.14L18.2022 9.44L19.2722 8.59L18.5722 7.38L17.3022 7.89L16.2422 8.32L15.3322 7.62C14.9322 7.32 14.5322 7.09 14.1022 6.91L13.0422 6.48L12.8822 5.35L12.6922 4H11.3022L11.1022 5.35L10.9422 6.48L9.8822 6.91C9.4722 7.08 9.0622 7.32 8.6322 7.64L7.7322 8.32L6.6922 7.9L5.4222 7.39L4.7222 8.6L5.8022 9.44L6.6922 10.14L6.5522 11.27C6.5222 11.57 6.5022 11.8 6.5022 12C6.5022 12.2 6.5222 12.43 6.5522 12.74L6.6922 13.87L5.8022 14.57L4.7222 15.41L5.4222 16.62L6.6922 16.11L7.7522 15.68L8.6622 16.38C9.0622 16.68 9.4622 16.91 9.8922 17.09L10.9522 17.52L11.1122 18.65L11.3022 20H12.7022L12.9022 18.65L13.0622 17.52L14.1222 17.09C14.5322 16.92 14.9422 16.68 15.3722 16.36L16.2722 15.68L17.3122 16.1L18.5822 16.61L19.2822 15.4L18.2022 14.56L17.3122 13.86L17.4522 12.73C17.4822 12.43 17.5022 12.21 17.5022 12ZM12.0022 8C9.7922 8 8.0022 9.79 8.0022 12C8.0022 14.21 9.7922 16 12.0022 16C14.2122 16 16.0022 14.21 16.0022 12C16.0022 9.79 14.2122 8 12.0022 8ZM10.0022 12C10.0022 13.1 10.9022 14 12.0022 14C13.1022 14 14.0022 13.1 14.0022 12C14.0022 10.9 13.1022 10 12.0022 10C10.9022 10 10.0022 10.9 10.0022 12Z"
										fill="white"
									/>
								</svg>
							</span>

							<span
								className="group-list__remove"
								onClick={(event) => index > 0 && handlerGroupRemoved(event, group.idGroup)}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">

									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM16 9V19H8V9H16ZM6 7H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V7Z"
										fill="white" />
								</svg>
							</span>

						</div>
					</li>
				)
			})}
		</ul>
	)
}

export default GroupList; 