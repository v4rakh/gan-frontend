import { useTranslation } from 'react-i18next';
import { usePagination, useSortBy, useTable } from 'react-table';
import React, { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Table as BootstrapTable } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { paginationConstants } from '../constants/paginationConstants';

function Table({ columns, data, loading, pageCount: controlledPageCount, fetchData, withPagination = true }) {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, sortBy },
	} = useTable(
		{
			columns,
			data,
			initialState: {
				pageIndex: paginationConstants.DEFAULT_PAGE,
				pageSize: paginationConstants.DEFAULT_PAGE_SIZE,
				pageCount: controlledPageCount,
			},
			manualPagination: true,
			manualSortBy: true,
			disableMultiSort: true,
			pageCount: controlledPageCount,
		},
		useSortBy,
		usePagination
	);

	const [t] = useTranslation();

	useEffect(() => {
		fetchData({ pageIndex, pageSize, sortBy });
	}, [fetchData, pageIndex, pageSize, sortBy]);

	return (
		<>
			<BootstrapTable {...getTableProps()} bordered striped responsive>
				<thead>
					{headerGroups.map((headerGroup, i) => (
						<tr {...headerGroup.getHeaderGroupProps()} key={i}>
							{headerGroup.headers.map((column) => (
								<th key={`${i}_th`} scope="col" {...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render('Header')}
									<span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row, i) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()} key={i}>
								{row.cells.map((cell) => {
									return (
										<td {...cell.getCellProps()} key={`${i}_td_${cell.column.id}`}>
											{cell.render('Cell')}
										</td>
									);
								})}
							</tr>
						);
					})}
					<tr>
						{loading ? (
							<td colSpan="10000">
								<LoadingSpinner />
								{t('misc.loading')}
							</td>
						) : (
							withPagination &&
							pageCount > 0 && (
								<td colSpan="10000">
									{t('pagination.page')} {pageIndex + 1} of {pageOptions.length}{' '}
								</td>
							)
						)}
					</tr>
				</tbody>
			</BootstrapTable>

			{withPagination && (
				<div>
					<nav>
						<ul className="pagination">
							<li className={canPreviousPage ? 'page-item' : 'page-item disabled'}>
								<button
									className="page-link"
									aria-label={t('pagination.first')}
									onClick={() => gotoPage(0)}
									disabled={!canPreviousPage}>
									<span aria-hidden="true">&laquo;</span>
									<span className="sr-only">{t('pagination.first')}</span>
								</button>
							</li>
							<li className={canPreviousPage ? 'page-item' : 'page-item disabled'}>
								<button
									className="page-link"
									aria-label={t('pagination.previous')}
									onClick={() => previousPage()}
									disabled={!canPreviousPage}>
									<span aria-hidden="true">&lsaquo;</span>
									<span className="sr-only">{t('pagination.previous')}</span>
								</button>
							</li>
							<li className={canNextPage ? 'page-item' : 'page-item disabled'}>
								<button
									className="page-link"
									aria-label={t('pagination.next')}
									onClick={() => nextPage()}
									disabled={!canNextPage}>
									<span aria-hidden="true">&rsaquo;</span>
									<span className="sr-only">{t('pagination.next')}</span>
								</button>
							</li>
							<li className={canNextPage ? 'page-item' : 'page-item disabled'}>
								<button
									className="page-link"
									aria-label={t('pagination.last')}
									onClick={() => gotoPage(pageCount - 1)}
									disabled={!canNextPage}>
									<span aria-hidden="true">&raquo;</span>
									<span className="sr-only">{t('pagination.last')}</span>
								</button>
							</li>
							<li className="page-item ml-1">
								<input
									id="pageSelector"
									className="form-control"
									type="number"
									defaultValue={pageIndex + 1}
									onChange={(e) => {
										const page = e.target.value ? Number(e.target.value) - 1 : 0;
										gotoPage(page);
									}}
								/>
							</li>
							<li className="page-item ml-1">
								{/* eslint-disable-next-line jsx-a11y/no-onchange */}
								<select
									className="custom-select col-sm"
									value={pageSize || paginationConstants.DEFAULT_PAGE_SIZE}
									onChange={(e) => {
										setPageSize(Number(e.target.value));
									}}>
									{paginationConstants.PAGE_SIZES.map((pageSize) => (
										<option key={pageSize} value={pageSize}>
											{t('pagination.show')} {pageSize}
										</option>
									))}
								</select>
							</li>
						</ul>
					</nav>
				</div>
			)}
		</>
	);
}

Table.propTypes = {
	columns: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
	pageCount: PropTypes.number.isRequired,
	withPagination: PropTypes.bool,
	fetchData: PropTypes.func.isRequired,
};

export default Table;
