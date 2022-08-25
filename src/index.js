import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app';
import { DataProvider } from './contexts/data';
import { DataTaskProvider } from './contexts/data';
import { InterfaceProvider } from './contexts/interface';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
	<DataProvider>
		<DataTaskProvider>
			<InterfaceProvider>
				<App />
			</InterfaceProvider>
		</DataTaskProvider>
	</DataProvider>
	// </React.StrictMode>
);

