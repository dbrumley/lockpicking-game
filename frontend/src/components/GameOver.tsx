import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup
} from '@chakra-ui/react';
import Lockboard from './Lockboard'; // Ensure this import points to where your Lockboard class or type is defined

interface GameOverProps {
  isOpen: boolean,
  onClose: () => void,
  lockboards: Lockboard[];
  setPlayerName: (id: number, name: string) => void;
}

const GameOver: React.FC<GameOverProps> = ({ isOpen, onClose, lockboards, setPlayerName }) => {
  // Only solved lockboards should be displayed
  const solvedLockboards = lockboards.filter((lockboard) => lockboard.solved);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Game Over</ModalHeader>
        <ModalBody>

          <Text fontSize="xl" mb={4}>Winners</Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Number</Th>
                {/* Add other table headers here if needed */}
                <Th>Player Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {solvedLockboards.map((lockboard) => (
                <Tr key={lockboard.id}>
                  <Td>{lockboard.id}</Td>
                  <Td>{lockboard.number}</Td>
                  {/* Render other columns here if needed */}
                  <Td>
                    <Input
                      type="text"
                      defaultValue={lockboard.player}
                      onBlur={(e) => setPlayerName(lockboard.id, e.target.value)}
                      placeholder="Enter player name"
                      size="sm"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button colorScheme="purple" onClick={onClose}>Close</Button>
          </ButtonGroup>
        </ModalFooter>

      </ModalContent>
    </Modal >
  );

};

export default GameOver;
