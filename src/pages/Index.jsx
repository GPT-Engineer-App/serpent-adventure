import React, { useState, useEffect, useCallback } from "react";
import { Container, Box, Button, Text, VStack } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 400;
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const getRandomPosition = () => {
  const x = Math.floor(Math.random() * (WIDTH / CELL_SIZE));
  const y = Math.floor(Math.random() * (HEIGHT / CELL_SIZE));
  return { x, y };
};

const Index = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case "ArrowUp":
        setDirection(DIRECTIONS.UP);
        break;
      case "ArrowDown":
        setDirection(DIRECTIONS.DOWN);
        break;
      case "ArrowLeft":
        setDirection(DIRECTIONS.LEFT);
        break;
      case "ArrowRight":
        setDirection(DIRECTIONS.RIGHT);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x === food.x && head.y === food.y) {
          newSnake.unshift(head);
          setFood(getRandomPosition());
        } else {
          newSnake.pop();
          newSnake.unshift(head);
        }

        if (head.x < 0 || head.x >= WIDTH / CELL_SIZE || head.y < 0 || head.y >= HEIGHT / CELL_SIZE || newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          clearInterval(interval);
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, isGameOver]);

  const handleRestart = () => {
    setSnake([{ x: 2, y: 2 }]);
    setFood(getRandomPosition());
    setDirection(DIRECTIONS.RIGHT);
    setIsGameOver(false);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Snake Game</Text>
        <Box position="relative" width={`${WIDTH}px`} height={`${HEIGHT}px`} border="1px solid black">
          {snake.map((segment, index) => (
            <Box key={index} position="absolute" width={`${CELL_SIZE}px`} height={`${CELL_SIZE}px`} backgroundColor="green" style={{ left: `${segment.x * CELL_SIZE}px`, top: `${segment.y * CELL_SIZE}px` }} />
          ))}
          <Box position="absolute" width={`${CELL_SIZE}px`} height={`${CELL_SIZE}px`} backgroundColor="red" style={{ left: `${food.x * CELL_SIZE}px`, top: `${food.y * CELL_SIZE}px` }} />
        </Box>
        {isGameOver && (
          <Text fontSize="xl" color="red.500">
            Game Over
          </Text>
        )}
        <Button onClick={handleRestart} colorScheme="teal">
          Restart
        </Button>
        <VStack>
          <Button onClick={() => setDirection(DIRECTIONS.UP)} leftIcon={<FaArrowUp />} colorScheme="teal">
            Up
          </Button>
          <Button onClick={() => setDirection(DIRECTIONS.LEFT)} leftIcon={<FaArrowLeft />} colorScheme="teal">
            Left
          </Button>
          <Button onClick={() => setDirection(DIRECTIONS.RIGHT)} leftIcon={<FaArrowRight />} colorScheme="teal">
            Right
          </Button>
          <Button onClick={() => setDirection(DIRECTIONS.DOWN)} leftIcon={<FaArrowDown />} colorScheme="teal">
            Down
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;
