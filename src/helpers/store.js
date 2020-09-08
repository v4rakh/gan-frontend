import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/rootReducer';
import { checkAuthAfterDeserialize } from './api';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { appConstants } from '../constants/appConstants';

const loggerMiddleware = createLogger();

const persistConfig = {
	key: 'redux-store',
	whitelist: ['authentication'],
	storage,
	migrate: async (state) => {
		if (state && state.auth && state.auth.username && state.auth.password) {
			let res = await checkAuthAfterDeserialize(state.auth.username, state.auth.password);

			if (!res) {
				state.auth = null;
			}
		}

		return Promise.resolve(state);
	},
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
	persistedReducer,
	appConstants.PRODUCTION ? applyMiddleware(thunkMiddleware) : applyMiddleware(thunkMiddleware, loggerMiddleware)
);
export const persistedStore = persistStore(store);
