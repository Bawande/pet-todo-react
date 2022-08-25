import { createContext, useReducer } from "react";
import { initialDataState, reducerDataState } from "./dataGroup";
import { initialDataTaskState, reducerDataTaskState } from "./dataTask";

export const DataGroupContext = createContext();

export const DataProvider = ({ children }) => {

	const groupArray = useReducer(reducerDataState, initialDataState);

	return (
		<DataGroupContext.Provider value={groupArray}>
			{children}
		</DataGroupContext.Provider>
	)
}

export const DataTaskContext = createContext();

export const DataTaskProvider = ({ children }) => {

	const taskArray = useReducer(reducerDataTaskState, initialDataTaskState);

	return (
		<DataTaskContext.Provider value={taskArray}>
			{children}
		</DataTaskContext.Provider>
	)
}