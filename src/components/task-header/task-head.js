import React, { useState } from 'react'

const TaskHead = ({ groupId, dispatchTask }) => {
	const [inputValueAddTask, setInputValueAddTask] = useState('');

	const isTextValid = (text) => {
		const re = /.{1,120}$/u;
		return re.test(String(text))
	}

	const handlerAddTask = () => {
		if (isTextValid(inputValueAddTask)) {
			dispatchTask({
				type: 'ADD_TASK',
				groupId,
				textTask: inputValueAddTask.trim()
			});
			setInputValueAddTask('');
		}
	};

	return (

		<div className='task-head'>

			<div className="task-head__add-task">
				<input
					type="text"
					placeholder="Введите текст задачи..."
					className="task-head__input input-media input-media__text"
					value={inputValueAddTask}
					onChange={(event) => setInputValueAddTask(event.target.value)}
					onKeyDown={(event) => ((event.code === 'Enter') || (event.code === 'NumpadEnter')) && handlerAddTask()}
				/>
				{/* {console.log(inputValueAddTask)} */}
				<button
					className='task-head__btn-add'
					onClick={() => handlerAddTask()}
				>
					<svg
						width="20px"
						hanging="20px"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M8 1V15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M1 8H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
			</div>
		</div>
	)
}

export default TaskHead