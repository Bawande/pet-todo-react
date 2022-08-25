import React from "react";
import taskGroupsArray from "../../data/dbGroup";
import GroupList from "../group-list";
import AddGroup from "../add-group";
import ChangeGroup from '../change-group';


const SideBar = () => {
	return (
		<div className="todo__sidebar">
			<GroupList />
			<ChangeGroup />
			<AddGroup />
		</div>
	)
}

export default SideBar;