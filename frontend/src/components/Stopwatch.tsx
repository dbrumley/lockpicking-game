import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  InputGroup,
  Text,
} from '@chakra-ui/react';

interface Props {
  gameActive: boolean;
  handleTimerEnd: () => void;
  handleStartStop: () => void;
  handleReset: () => void;
}

const Stopwatch = ({ gameActive, handleTimerEnd, handleStartStop, handleReset }: Props) => {
  const DEFAULT_TIME_LIMIT = 3 * 1000; // 5-minute default
  const [timeLimit, setTimeLimit] = useState(DEFAULT_TIME_LIMIT);
  const [time, setTime] = useState(DEFAULT_TIME_LIMIT);
  const [referenceTime, setReferenceTime] = useState(Date.now());
  const [editingMinutes, setEditingMinutes] = useState(false); // Declare editingMinutes
  const [editingSeconds, setEditingSeconds] = useState(false); // Declare editingSeconds

  function minutes() {
    const x = Math.floor(time / (1000 * 60));
    return x > 0 ? x : 0;
  }

  function seconds() {
    const x = Math.floor((time / 1000) % 60);
    return x > 0 ? x : 0;
  }

  useEffect(() => {
    let interval;

    if (gameActive) {
      const countDownUntilZero = () => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            // Game over
            handleTimerEnd();

            return 0;
          }

          const now = Date.now();
          const interval = now - referenceTime;
          setReferenceTime(now);
          return prevTime - interval;
        });
      };
      interval = setInterval(countDownUntilZero, 100);
    }

    return () => clearInterval(interval);
  }, [timeLimit, gameActive, time, referenceTime]);

  function updateMinutes(valueString) {
    const newMinutes = parseInt(valueString, 10);
    if (!isNaN(newMinutes)) {
      const newTimeLimit = (newMinutes * 60 + seconds()) * 1000;
      setTimeLimit(newTimeLimit);
      setTime(newTimeLimit);
    }
  }

  function updateSeconds(valueString) {
    const newSeconds = parseInt(valueString, 10);
    if (!isNaN(newSeconds)) {
      const newTimeLimit = ((minutes() * 60) + newSeconds) * 1000;
      setTimeLimit(newTimeLimit);
      setTime(newTimeLimit);
    }
  }


  function handleLocalStartStop() {
    console.log("local handleLocalStartStop: ", gameActive);

    if (!gameActive) {
      setTime(timeLimit);
      setReferenceTime(Date.now());
    }
    handleStartStop();
  }

  function handleLocalReset() {
    setReferenceTime(Date.now());
    setTime(timeLimit);
    handleReset();
  }

  return (
    <Box>
      <Center height="4em">
        <Input
          type='number'
          fontSize='6xl'
          value={minutes()}
          onChange={(e) => updateMinutes(e.target.value)}
          onFocus={() => setEditingMinutes(true)}
          onBlur={() => setEditingMinutes(false)}
          textAlign='center'
          outline='none'
          borderRadius='none'
          variant="outline"
          maxLength={2}
          height="1em"
          width="2em"
        />
        <Text fontSize='6xl' ml={2} mr={2}>:</Text>
        <Input
          type='number'
          fontSize='6xl'
          value={seconds().toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          })}
          onChange={(e) => updateSeconds(e.target.value)}
          onFocus={() => setEditingSeconds(true)}
          onBlur={() => setEditingSeconds(false)}
          textAlign='center'
          outline='none'
          maxLength={2}
          height="1em"
          width="2em"
          borderRadius='none'
        />
      </Center>
      <Center>
        <Text fontSize="28px">Remaining</Text>
      </Center>
      <Box>
        <Center>
          <Button
            colorScheme='purple'
            size='lg'
            onClick={handleLocalStartStop}
            mt={4}
          >
            {gameActive ? 'Pause' : 'Start'}
          </Button>
          <Button
            colorScheme='purple'
            size='lg'
            onClick={handleLocalReset}
            mt={4}
            ml={4}
          >
            Reset
          </Button>
        </Center>
      </Box>
    </Box>
  );
};

export default Stopwatch;
