import { useLocation, useParams } from 'react-router-dom';

export const webHelper = {
	getQueryParameter,
	getPathParameter,
	useQuery,
};

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

function getQueryParameter(key) {
	return useQuery().get(key);
}

function getPathParameter(key) {
	return useParams()[key];
}
