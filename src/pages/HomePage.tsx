import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket, Bug, Sparkles } from 'lucide-react';
// Game constants
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 7;
const FLY_SIZE = 40;
const FLY_SPEED = 2;
const LASER_WIDTH = 6;
const SPAWN_INTERVAL = 1000; // ms
type Fly = {
  id: number;
  x: number;
  y: number;
};
type Explosion = {
  id: number;
  x: number;
  y: number;
};
type GameState = 'playing' | 'gameOver';
export function HomePage() {
  const [playerX, setPlayerX] = useState(0);
  const playerXRef = useRef(playerX);
  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);
  useEffect(() => {
    if (gameAreaRef.current) {
      setPlayerX(gameAreaRef.current.offsetWidth / 2);
    }
  }, []);
  const [flies, setFlies] = useState<Fly[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<number>();
  const lastSpawnTimeRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const resetGame = useCallback(() => {
    if (gameAreaRef.current) {
      setPlayerX(gameAreaRef.current.offsetWidth / 2);
    }
    setFlies([]);
    setExplosions([]);
    setScore(0);
    setGameState('playing');
    lastSpawnTimeRef.current = 0;
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const gameWidth = gameAreaRef.current.offsetWidth;
    const gameHeight = gameAreaRef.current.offsetHeight;
    // Player movement
    setPlayerX(prevX => {
      let nextX = prevX;
      if (keysPressed.current['ArrowLeft']) {
        nextX -= PLAYER_SPEED;
      }
      if (keysPressed.current['ArrowRight']) {
        nextX += PLAYER_SPEED;
      }
      return Math.max(PLAYER_WIDTH / 2, Math.min(gameWidth - PLAYER_WIDTH / 2, nextX));
    });
    // Fly spawning
    if (timestamp - lastSpawnTimeRef.current > SPAWN_INTERVAL) {
      lastSpawnTimeRef.current = timestamp;
      const newFly: Fly = {
        id: Date.now(),
        x: Math.random() * (gameWidth - FLY_SIZE),
        y: -FLY_SIZE,
      };
      setFlies(prev => [...prev, newFly]);
    }
    // Update flies and check collisions
    setFlies(prevFlies => {
      const newFlies: Fly[] = [];
      const hitFlies: Fly[] = [];
      let isGameOver = false;
      const currentX = playerXRef.current;
      for (const fly of prevFlies) {
        const newY = fly.y + FLY_SPEED;
        let wasHit = false;
        // Laser collision
        const laserLeft = currentX - LASER_WIDTH / 2;
        const laserRight = currentX + LASER_WIDTH / 2;
        const flyLeft = fly.x;
        const flyRight = fly.x + FLY_SIZE;
        if (newY > 0 && newY < gameHeight && laserRight > flyLeft && laserLeft < flyRight) {
            hitFlies.push(fly);
            wasHit = true;
        }
        // Player collision
        const playerLeft = currentX - PLAYER_WIDTH / 2;
        const playerRight = currentX + PLAYER_WIDTH / 2;
        const playerTop = gameHeight - PLAYER_HEIGHT;
        if (
            !wasHit &&
            flyRight > playerLeft &&
            flyLeft < playerRight &&
            newY + FLY_SIZE > playerTop &&
            fly.y < gameHeight
        ) {
            isGameOver = true;
        }
        if (wasHit) continue;
        // Reached bottom
        if (newY > gameHeight) {
          isGameOver = true;
        } else {
          newFlies.push({ ...fly, y: newY });
        }
      }
      if (isGameOver) {
        setGameState('gameOver');
      }
      if (hitFlies.length > 0) {
        setScore(s => s + hitFlies.length);
        setExplosions(e => [
          ...e,
          ...hitFlies.map(f => ({ id: f.id, x: f.x + FLY_SIZE / 2, y: f.y + FLY_SIZE / 2 })),
        ]);
      }
      return newFlies;
    });
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState]);
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);
  return (
    <div ref={gameAreaRef} className="relative w-full h-full overflow-hidden bg-sky-blue cursor-none">
      {/* Score */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 text-white font-display text-4xl md:text-6xl z-10 select-none">
        {score}
      </div>
      {/* Laser */}
      <div
        className="absolute bottom-0 bg-laser-yellow"
        style={{
          left: `${playerX - LASER_WIDTH / 2}px`,
          width: `${LASER_WIDTH}px`,
          height: '100%',
          boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700'
        }}
      />
      {/* Player */}
      <div
        className="absolute bottom-0 bg-player-red rounded-t-lg flex items-center justify-center"
        style={{
          width: `${PLAYER_WIDTH}px`,
          height: `${PLAYER_HEIGHT}px`,
          left: `${playerX - PLAYER_WIDTH / 2}px`,
          transform: 'translateX(0)', // for GPU acceleration
        }}
      >
        <Rocket className="text-white w-6 h-6" />
      </div>
      {/* Flies */}
      {flies.map(fly => (
        <div
          key={fly.id}
          className="absolute bg-fly-purple rounded-full flex items-center justify-center"
          style={{
            width: `${FLY_SIZE}px`,
            height: `${FLY_SIZE}px`,
            left: `${fly.x}px`,
            top: `${fly.y}px`,
          }}
        >
          <Bug className="text-white w-6 h-6" />
        </div>
      ))}
      {/* Explosions */}
      <AnimatePresence>
        {explosions.map(explosion => (
          <motion.div
            key={explosion.id}
            className="absolute"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              left: explosion.x,
              top: explosion.y,
              transform: 'translate(-50%, -50%)',
            }}
            onAnimationComplete={() => {
              setExplosions(exps => exps.filter(e => e.id !== explosion.id));
            }}
          >
            <Sparkles className="text-laser-yellow w-10 h-10" />
          </motion.div>
        ))}
      </AnimatePresence>
      {/* Game Over Modal */}
      <AnimatePresence>
        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white rounded-2xl p-8 text-center shadow-2xl"
            >
              <h2 className="font-display text-5xl text-player-red mb-2">Game Over</h2>
              <p className="text-2xl text-gray-700 mb-6">
                Final Score: <span className="font-bold text-fly-purple">{score}</span>
              </p>
              <Button
                onClick={resetGame}
                className="bg-player-red text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-red-500 transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                Play Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}