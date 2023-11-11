import React, { useMemo } from 'react';
import {
  createColumnHelper,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';


import {
  FaTrophy,
  FaLock,
  FaUnlock
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
        size: 20,
        cell: (context) => {
          const isLocked = context.row.original.locked;
          return isLocked ? <FaLock color="#C0392B" size="25px" /> : <FaUnlock color="#27AE60" size="25px" />;
        },
        meta: {
          type: 'boolean',
          required: true,
        }
      }),


      columnHelper.accessor('solved', {
        header: 'Solve Time',
        size: 30,
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
      <Table fontSize="18" className="table-tiny">
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
