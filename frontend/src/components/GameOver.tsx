import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
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
import Lockboard, { SolvedBoard } from '../../../types/Lockboard'; // Ensure this import points to where your Lockboard class or type is defined


interface Props {
  isOpen: boolean,
  onClose: () => void,
  onSave: (solvedBoards: SolvedBoard[]) => void,
  boards: Lockboard[];
}

function GameOver({ isOpen, onClose, onSave, boards }: Props) {

  const [solvedBoards, setSolvedBoards] = useState<SolvedBoard[]>([]);

  if (isOpen) {
    console.log('here');
  }
  useEffect(() => {
    setSolvedBoards(
      boards
        .filter(board => board.solved)
        .sort((a, b) => (a.solveTime || 0) - (b.solveTime || 0))
        .map(board => ({ ...board, playerName: '' })) // Initialize playerName to an empty string
    );
  }, [boards]);

  const updatePlayerName = (id: number, name: string) => {
    setSolvedBoards(
      solvedBoards.map(board =>
        board.id === id ? { ...board, playerName: name } : board
      )
    );
  };

  const handleSave = () => {
    // You may want to do something with the solvedBoards state here before
    // calling onSave
    onSave(solvedBoards);
  };

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
                <Th>Place</Th>
                <Th>Player</Th>
                {/* Add other table headers here if needed */}
                <Th>Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {solvedBoards.map((board, index) => (
                <Tr key={board.id}>
                  <Td>{index + 1}</Td>
                  <Td>{board.number}</Td>
                  <Td>
                    <Input
                      type="text"
                      value={board.playerName}
                      onChange={(e) => updatePlayerName(board.id, e.target.value)}
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
            <Button colorScheme="purple" onClick={handleSave}>Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ButtonGroup>
        </ModalFooter>

      </ModalContent>
    </Modal >
  );

};

export default GameOver;
