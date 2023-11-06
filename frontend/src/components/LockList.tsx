import React, { useMemo } from 'react';
import {
  createColumnHelper,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from '@tanstack/react-table';

import {
  LockIcon,
  UnlockIcon
} from '@chakra-ui/icons';

import {
  FaTrophy
} from 'react-icons/fa';

import { formatTime } from '../utils';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading
} from '@chakra-ui/react';

import Lockboard from './Lockboard';



interface Props {
  boards: Lockboard[];
};

function LockList({ boards }: Props) {
  const columnHelper = createColumnHelper<Lockboard>();

  const columns = useMemo<ColumnDef<Lockboard>[]>(
    () => [

      columnHelper.accessor('number', {
        header: 'Player',
        meta: {
          type: 'number',
        }
      }),

      columnHelper.accessor('locked', {
        header: 'Status',
        cell: (context) => {
          const isLocked = context.row.original.locked;
          return isLocked ? <LockIcon color="red.400" /> : <UnlockIcon color="green.400" />;
        },
        meta: {
          type: 'boolean',
          required: true,
        }
      }),


      columnHelper.accessor('solved', {
        header: 'Solved',
        cell: (context) => {
          const solved = context.row.original.solved;
          const solveTime = context.row.original.solveTime;
          return solved ? <span><FaTrophy color="#FFD700" /> {formatTime(solveTime)} </span> : null;
        },
        meta: {
          type: 'boolean',
          required: 'true'
        }
      }),

    ], []);

  const table = useReactTable({
    data: boards,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
    }
  })

  return (
    <Box>
      <Heading>Locks</Heading>
      <Table size="lg" fontSize="18">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder ? null : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )
                  }
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
      </Table>
    </Box>
  )

}

export default LockList;
