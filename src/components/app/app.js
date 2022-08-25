import React from "react";
import AppHead from "../app-header";
import SideBar from "../app-sidebar";
import TaskList from "../task-list";

function App() {
	return (
		<div className="todo">
			<AppHead />
			<SideBar />
			<TaskList />
		</div>
	);
}

export default App;
