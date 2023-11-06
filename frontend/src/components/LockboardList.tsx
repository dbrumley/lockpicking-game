import React, { useState, useEffect } from 'react';
import { SimpleGrid, Box } from '@chakra-ui/react';

import Lockboard, { createLockboards } from './Lockboard';
import LockboardCard from './LockboardCard';

interface Props {
  boards: Lockboard[];
  onSave: (board: Lockboard) => void;
};

function LockboardList({ boards, onSave }: Props) {


  return (
    <Box mx='6' as='section' mt='10'>

      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {
          boards.map((board,) => (
            <LockboardCard key={"board-" + board.number} board={board} onEdit={onSave} place={null} />
          ))
        }

      </SimpleGrid>
    </Box>
  );
}

export default LockboardList;