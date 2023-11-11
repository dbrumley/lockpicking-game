import React, { useState, useEffect, useMemo } from 'react';
import {
  createColumnHelper,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  Row,
} from '@tanstack/react-table';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  chakra,
} from '@chakra-ui/react';

import Moment from 'moment';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';

import { Player } from '../../../types/Player';
import { formatTime } from '../utils';

interface Props {
  data: Player[];
}

const columnHelper = createColumnHelper<Player>();

function Leaderboard({ data }: Props) {
  const [sorting, setSorting] = useState([{ id: 'bestSolveTime', desc: false }]);

  const sortTime = (rowA: Row<Player>, rowB: Row<Player>, columnId: string) => {
    const aTime = rowA.getValue(columnId) as number | undefined;
    const bTime = rowB.getValue(columnId) as number | undefined;
    // Handle undefined values by sorting them to the end
    if (aTime === undefined && bTime === undefined) return 0;
    if (aTime === undefined) return 1;
    if (bTime === undefined) return -1;
    return aTime - bTime;
  };

  const columns = useMemo<ColumnDef<Player>[]>(
    () => [
      columnHelper.display({
        id: 'place',
        header: 'Place',
        cell: (info) => {
          // Sort the players, placing undefined bestSolveTime at the end
          const sortedPlayers = [...data].sort((a, b) => (a.bestSolveTime ?? Infinity) - (b.bestSolveTime ?? Infinity));
          const place = sortedPlayers.findIndex((p) => p.id === info.row.original.id) + 1;
          const suffixes = ['th', 'st', 'nd', 'rd'];
          const v = place % 100;
          const suffix = (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
          return `${place}${suffix}`;
        },
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('bestSolveTime', {
        header: 'Solve Time',
        cell: (info) => info.getValue() !== undefined ? formatTime(info.getValue()) : 'N/A',
        sortingFn: sortTime,
      }),
      columnHelper.accessor('bestSolveDate', {
        header: 'Date',
        cell: (info) => Moment(info.getValue()).format('MMMM Do YYYY, h:mm:ss a'),
      }),
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box>
      <Heading>Leaderboard</Heading>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <GoTriangleDown aria-label="sorted descending" />
                      ) : (
                        <GoTriangleUp aria-label="sorted ascending" />
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
                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default Leaderboard;
