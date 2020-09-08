import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import 'popper.js/dist/popper';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './style.css';
import './translations/i18n';
import { ModalProvider } from 'react-modal-hook';

import App from './App';
import { persistedStore, store } from './helpers/store';

render(
	<Provider store={store}>
		<PersistGate persistor={persistedStore}>
			<ModalProvider>
				<App />
			</ModalProvider>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);
