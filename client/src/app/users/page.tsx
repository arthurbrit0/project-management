"use client";

import { useGetUsersQuery } from '@/src/state/api';
import React from 'react';
import { useAppSelector } from '../redux';
import Header from '@/src/components/Header';
import { DataGrid, GridColDef, GridToolbarFilterButton, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Image from 'next/image';
import { dataGridClassNames, dataGridSxStyles } from '@/src/libs/utils';

const CustomToolbar = () => (
    <GridToolbarContainer className="toolbar flex gap-2">
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </GridToolbarContainer>
);

const columns: GridColDef[] = [
    { field: 'userId', headerName: 'ID', width: 90 },
    { field: 'username', headerName: "Usuário", width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    {
        field: 'profilePictureUrl', headerName: 'Foto de Perfil', width: 100, renderCell: (params) => (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-9 w-9">
                    <Image
                        src={`/${params.value}`}
                        alt={params.row.username}
                        width={100}
                        height={50}
                        className="h-full rounded-full object-cover"
                    />
                </div>
            </div>
        )
    }
];

const localeText = {
    noRowsLabel: 'Nenhuma linha',
    noResultsOverlayLabel: 'Nenhum resultado encontrado.',
    errorOverlayDefaultLabel: 'Ocorreu um erro.',
    toolbarDensity: 'Densidade',
    toolbarDensityLabel: 'Densidade',
    toolbarDensityCompact: 'Compacta',
    toolbarDensityStandard: 'Padrão',
    toolbarDensityComfortable: 'Confortável',
    toolbarColumns: 'Colunas',
    toolbarColumnsLabel: 'Selecionar colunas',
    toolbarFilters: 'Filtros',
    toolbarFiltersLabel: 'Mostrar filtros',
    toolbarFiltersTooltipHide: 'Ocultar filtros',
    toolbarFiltersTooltipShow: 'Mostrar filtros',
    toolbarFiltersTooltipActive: (count: number) => 
        count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,
    toolbarExport: 'Exportar',
    toolbarExportLabel: 'Exportar',
    toolbarExportCSV: 'Download CSV',
    toolbarExportPrint: 'Imprimir',
    columnMenuLabel: 'Menu',
    columnMenuShowColumns: 'Mostrar colunas',
    columnMenuFilter: 'Filtrar',
    columnMenuHideColumn: 'Ocultar',
    columnMenuUnsort: 'Desfazer ordenação',
    columnMenuSortAsc: 'Ordenar ascendente',
    columnMenuSortDesc: 'Ordenar descendente',

    // Paginacao
    MuiTablePagination: {
        labelRowsPerPage: 'Linhas por página:',
        labelDisplayedRows: ({ from, to, count }: {from: number, to: number, count:number}) =>
            `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`,
    },
    
    // Outras mensagens
    footerRowSelected: (count: number) =>
        count !== 1 ? `${count.toLocaleString()} linhas selecionadas` : `${count.toLocaleString()} linha selecionada`,
    footerTotalRows: 'Total de linhas:',
    footerTotalVisibleRows: (visibleCount:number, totalCount:number) =>
        `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
};

const Users = () => {

    const { data: users, isLoading, isError } = useGetUsersQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (isError || !users) {
        return <div>Erro ao resgatar usuários.</div>;
    }

    return (
        <div className="flex w-full flex-col p-8">
            <Header name="Usuários" />
            <div style={{ height: 650, width: '100%' }} className="flex flex-col items-center">
                <DataGrid
                    slots={{ toolbar: CustomToolbar }}
                    rows={users || []}
                    columns={columns}
                    getRowId={(row) => row.userId}
                    pagination
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkMode)}
                    localeText={localeText} 
                />
            </div>
        </div>
    );
};

export default Users;
