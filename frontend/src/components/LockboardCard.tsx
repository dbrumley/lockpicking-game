import React from 'react';
import {
  Avatar,
  AvatarBadge,
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';

import {
  LockIcon,
  UnlockIcon
} from '@chakra-ui/icons';

import { formatTime } from "../utils";
import Lockboard from './Lockboard';

interface Props {
  board: Lockboard;
  onEdit: (board: Lockboard) => void;
  place: null | number;
}

function LockboardCard({ board, onEdit, place }: Props) {

  const handleInputChange = (e) => {
    const newPlayer = e.target.value;
    onEdit({ ...board, player: newPlayer });
  };


  function getAvatar() {
    const s = board.locked;
    const color = s ? 'gray.500' : 'gray.500';
    const iconColor = s ? 'green.400' : 'red.400';

    const icon = s ? <UnlockIcon /> : <LockIcon />
    return (
      <Avatar name={String(board.number)} size='xl' bg={color}>
        <AvatarBadge
          borderWidth={0}
          boxSize='1.25em'
          color={iconColor}
        >
          {icon}
        </AvatarBadge>
      </Avatar >
    );
  }


  return (
    <Card maxW='sm'>
      <CardBody>
        <Center>
          {getAvatar()}
        </Center>
        <Box p={'24px'}>
          <Center>
            <Text fontSize='2xl'>{formatTime(board.solveTime)}</Text>
          </Center>
        </Box>

        <Box p={'16px'}>
          <Center>
            <Stack direction='column'>
              <Text>{board.numberLockPins} Pins</Text>
              <Input
                value={board.player}
                type='text'
                onChange={handleInputChange}
                placeholder="Mayhem"
                size='sm'
                id={"player-" + String(board.number)}
              />
            </Stack>
          </Center>
        </Box>

      </CardBody>
    </Card >
  );

}

export default LockboardCard;
