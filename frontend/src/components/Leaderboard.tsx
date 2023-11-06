import React, { useState, useMemo, useEffect } from 'react';
import {
  createColumnHelper,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  chakra,
  Heading
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Player } from './Player';
import Moment from 'Moment';
import { formatTime } from "../utils";

function FooterCell({ table }) {
  const meta = table.options.meta;
  const selectedRows = table.getSelectedRowModel().rows;

  const removeRows = () => {
    meta.removeSelectedRows(
      table.getSelectedRowModel().rows.map((row) => row.index)
    );
    table.resetRowSelection();
  };

  return (
    <Box className="footer-buttons">
      {selectedRows.length > 0 ? (
        <Button className="remove-button" onClick={removeRows}>
          Remove Selected x
        </Button>
      ) : null}
      <Button onClick={meta?.addRow}>
        Add New +
      </Button>
    </Box>
  );
}

interface Props {
  data: Player[];
}

function Leaderboard({ data }: Props) {
  //const [data, setData] = useState(() => [...playerData]);
  //const [originalData, setOriginalData] = useState(() => [...playerData]);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'bestSolveTime', desc: true }])

  const columnHelper = createColumnHelper<Player>();


  const removeCell = ({ row, table }) => {
    const meta = table.options.meta;

    const removeRow = () => {
      //console.log("Remove");
      meta?.removeRow(row.index);
    };

    return (
      <Button onClick={removeRow} name="remove">
        X
      </Button>
    )
  }

  const columns = useMemo<ColumnDef<Player>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        meta: {
          type: 'string',
          required: true,
        },

      }),
      columnHelper.accessor('name', {
        header: 'Name',
        meta: {
          type: 'string',
          required: true,
          pattern: '^[a-zA-Z ]+$',
        }
      }),
      columnHelper.accessor('bestSolveDate', {
        header: 'Date',
        cell: info => Moment(info.getValue()).local().format('MMMM Do YYYY, h:mm:ss a'),
        meta: {
          type: 'date',
          required: true,
        },
      }),
      columnHelper.accessor('bestSolveTime', {
        header: 'Solve Time',
        cell: info => formatTime(info.getValue()),
        invertSorting: true,
        enableSorting: true,
        meta: {
          type: 'number',
          sorting: true,
        }
      }),
      columnHelper.display({
        id: 'edit',
        cell: removeCell,
      })
    ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    meta: {
      /* removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: Player[]) =>
          old.filter((_row: Player, index: number) => index !== rowIndex);
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      }, */
    }
  })

  return (
    <Box>
      <Heading>Leaderboard</Heading>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )
                  }
                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>

                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th colSpan={table.getCenterLeafColumns().length} align="right">
              <FooterCell table={table} />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </Box>
  )
  //const [sorting, setSorting] = useState<SortingState>([]);

  //const columnHelper = createColumnHelper<Player>();

  /* columnHelper.accessor("bestSolveTime", {
    header: "Solve Time",
    cell: (info) => formatTime(info.getValue()),
  }),

  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("bestSolveDate", {
    header: "On",
    cell: (info) => info.getValue().toDateString(),
  }) */


  /* const columns = useMemo(() => [
    {
      Header: "Solve Time",
      accessor: "bestSolveTime",
      cell: (info) => formatTime(info.getValue()),
      columns: []
    },
    {
      Header: "Name",
      accessor: "name",
      columns: []

      //cell: (info) => info.getValue(),
    },

  ], []); */

  /* const columns = [
    columnHelper.accessor("bestSolveTime", {
      header: "Solve Time",
      cell: (info) => formatTime(info.getValue()),
    }),

    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("bestSolveDate", {
      header: "On",
      cell: (info) => info.getValue().toDateString(),
    })
  ]; */


  /* const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    players
  }); */

  /*  const table = useReactTable({
      players,
      columns,
      getCoreRowModel: getCoreRowModel(),
      state: {
        sorting,
      },
      initialState: {},
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
    });*/


  /* function handleAddScore() {
    setPlayers([...players, new Player(
      name: 'Added Player',
      bestSolveTime: 5 * 60 * 1000,
      bestSolveDate: '2023-09-04T22:40:41.473Z',
    )]);
    console.log("Adding player");
    console.log(players);
  };

  return (
    <Box mx='6' as='section' mt='10'>
      <Button onClick={handleAddScore}>Add Score</Button>

      <Heading textColor='gray.700'>Scoreboard</Heading>

      <Table>
        <Thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </Thead>
      </Table>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </Tbody>
    </Box>

  ); */


  /* return (
    <Box mx='6' as='section' mt='10'>
        <Button onClick={handleAddScore}>Add Score</Button>

        <Heading textColor='gray.700'>Scoreboard</Heading>
        <Table colorScheme='purple' variant='striped'>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta: any = header.column.columnDef.meta;
                  return (
                    <Th
                      bg='purple.50'
                      textColor='purple.700'
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <chakra.span pl="4">
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "desc" ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const meta: any = cell.column.columnDef.meta;
                  return (
                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>

      </Box >
      ); */
}

export default Leaderboard;