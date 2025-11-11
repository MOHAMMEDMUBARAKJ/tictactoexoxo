'use client';
import { useState, useEffect, useRef } from 'react';
import Square from './square';
import { MatchData } from '@heroiclabs/nakama-js';
import Nakama from '@/lib/nakama';
import {
  OpCode,
  StartMessage,
  DoneMessage,
  UpdateMessage,
} from '@/lib/messages';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BoardProps {
  gameMode: 'single' | 'multi';
  onBackToMenu: () => void;
}

export default function Board({ gameMode, onBackToMenu }: BoardProps) {
  const [squares, setSquares] = useState<(number | null)[]>(
    Array(9).fill(null)
  );
  const [playerIndex, setPlayerIndex] = useState<number>(-1);
  const [playerTurn, setPlayerTurn] = useState<number>(-1);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [gameMessage, setMessage] = useState<string>('Welcome to TicTacToe');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [winnerPositions, setWinnerPositions] = useState<number[] | null>(null);
  const nakamaRef = useRef<Nakama | undefined>(undefined);

  // AI logic for single player
  const getAIMove = (board: (number | null)[]): number => {
    // Simple AI: try to win, block player, or take center/corners
    const availableMoves = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];

    // Check if AI can win
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 1; // AI is O (1)
      const result = checkWinner(testBoard);
      if (result.winner === 1) return move;
    }

    // Check if AI needs to block player
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 0; // Player is X (0)
      const result = checkWinner(testBoard);
      if (result.winner === 0) return move;
    }

    // Take center if available
    if (availableMoves.includes(4)) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) return availableCorners[0];

    // Take any available move
    return availableMoves[0];
  };

  const checkWinner = (board: (number | null)[]): { winner: number | null; positions: number[] | null } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], positions: [a, b, c] };
      }
    }
    return { winner: board.includes(null) ? null : -1, positions: null }; // -1 for draw
  };

  const handleSinglePlayerMove = (index: number) => {
    if (squares[index] !== null || winner !== null) return;

    const newSquares = [...squares];
    newSquares[index] = 0; // Player is X (0)
    setSquares(newSquares);

    const gameResult = checkWinner(newSquares);
    if (gameResult.winner === 0) {
      setWinner(0);
      setWinnerPositions(gameResult.positions);
      setMessage('🎉 You Win!');
      return;
    } else if (gameResult.winner === -1) {
      setWinner(-1);
      setMessage('🤝 It\'s a Draw!');
      return;
    }

    // AI move after a short delay - only if game is not over
    setTimeout(() => {
      // Double-check that game is still ongoing before AI moves
      if (winner !== null) return;

      const aiMove = getAIMove(newSquares);
      const aiSquares = [...newSquares];
      aiSquares[aiMove] = 1; // AI is O (1)
      setSquares(aiSquares);

      const aiResult = checkWinner(aiSquares);
      if (aiResult.winner === 1) {
        setWinner(1);
        setWinnerPositions(aiResult.positions);
        setMessage('🤖 AI Wins!');
      } else if (aiResult.winner === -1) {
        setWinner(-1);
        setMessage('🤝 It\'s a Draw!');
      } else {
        setMessage('Your Turn!');
      }
    }, 500);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setPlayerIndex(-1);
    setPlayerTurn(-1);
    setDeadline(null);
    setMessage(gameMode === 'single' ? 'Welcome to TicTacToe' : 'Welcome to TicTacToe');
    setGameStarted(false);
    setTimeLeft(0);
    setIsWaiting(false);
    setWinner(null);
    setWinnerPositions(null);
  };

  // Multiplayer logic
  function initSocket() {
    if (
      !nakamaRef.current ||
      !nakamaRef.current.socket ||
      !nakamaRef.current.session
    )
      return;
    const userId = nakamaRef.current.session.user_id;

    let socket = nakamaRef.current.socket;

    socket.onmatchdata = (matchState: MatchData) => {
      if (!nakamaRef.current) return;
      const json_string = new TextDecoder().decode(matchState.data);
      const json: string = json_string ? JSON.parse(json_string) : '';
      console.log('op_code: ', matchState.op_code);

      let myPlayerIndex = nakamaRef.current.gameState.playerIndex;

      if (typeof json === 'object' && json !== null) {
        switch (matchState.op_code) {
          case OpCode.START:
            const startMessage = json as StartMessage;
            setTimeLeft(0);
            setSquares(startMessage.board);
            setPlayerTurn(startMessage.mark);
            setGameStarted(true);
            setIsWaiting(false);
            setMessage('Game Started!');

            let tmpId = startMessage.marks[userId!];
            if (tmpId !== null) {
              setPlayerIndex(tmpId);
              nakamaRef.current.gameState.playerIndex = tmpId;
            } else {
              console.error('tmpId is null');
            }
            break;
          case OpCode.UPDATE:
            const updateMessage = json as UpdateMessage;
            if (updateMessage.mark === myPlayerIndex) {
              setMessage('Your Turn!');
            }
            setPlayerTurn(updateMessage.mark);
            setSquares(updateMessage.board);
            setDeadline(updateMessage.deadline);
            break;
          case OpCode.DONE:
            const doneMessage = json as DoneMessage;
            setSquares(doneMessage.board);
            setWinner(doneMessage.winner);
            setWinnerPositions(doneMessage.winnerPositions);
            if (doneMessage.winner === myPlayerIndex) {
              setMessage('🎉 You Win!');
            } else if (doneMessage.winner !== null) {
              setMessage('😞 You Lose!');
            } else {
              setMessage('🤝 It\'s a Draw!');
            }
            setGameStarted(false);
            break;
          case OpCode.REJECTED:
            setMessage('❌ Move rejected!');
            break;
        }
      }
    };
  }

  const findMatch = async () => {
    if (!nakamaRef.current) return;
    setIsWaiting(true);
    setMessage('Finding match...');
    await nakamaRef.current.findMatch();
    console.log('find match, matchId: ', nakamaRef.current.matchId!);
    setMessage('Wait Other Player to join...');
  };

  const handleClick = (index: number) => {
    if (gameMode === 'single') {
      handleSinglePlayerMove(index);
    } else {
      // Multiplayer move
      if (!nakamaRef.current || !gameStarted || playerTurn !== playerIndex || squares[index] !== null) return;
      nakamaRef.current.makeMove(index);
    }
  };

  useEffect(() => {
    if (gameMode === 'multi') {
      nakamaRef.current = new Nakama();
      nakamaRef.current.authenticate().then(() => {
        initSocket();
      });
    } else {
      resetGame();
    }
  }, [gameMode]);

  useEffect(() => {
    if (deadline !== null) {
      const interval = setInterval(() => {
        const now = Date.now() / 1000;
        const remaining = Math.max(0, deadline - now);
        setTimeLeft(remaining);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [deadline]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-white text-2xl font-bold">
            {gameMode === 'single' ? '🤖 Single Player' : '👥 Multiplayer'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-white mb-4 min-h-[2rem] flex items-center justify-center">
              {gameMessage}
            </div>
            {gameMode === 'multi' && !gameStarted && !isWaiting && (
              <div className="space-y-4">
                <Button
                  onClick={findMatch}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  ⚡ Find Match
                </Button>
                <div className="text-sm text-white/60">
                  Auto-matchmaking pairs you with another player
                </div>
              </div>
            )}
            {isWaiting && (
              <div className="flex items-center justify-center space-x-3 py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-4 border-purple-400"></div>
                <span className="text-white text-lg">Finding opponent...</span>
              </div>
            )}
          </div>

          {gameStarted && gameMode === 'multi' && (
            <div className="flex items-center justify-center space-x-4 bg-white/5 rounded-2xl p-4">
              <div className="text-center">
                <div className="text-white/80 text-sm mb-1">You are</div>
                <div className={`text-3xl font-bold ${playerIndex === 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                  {playerIndex === 0 ? 'X' : 'O'}
                </div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-white/80 text-sm mb-1">Turn</div>
                <div className={`text-3xl font-bold ${playerTurn === 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                  {playerTurn === 0 ? 'X' : 'O'}
                </div>
              </div>
            </div>
          )}

          {deadline !== null && gameMode === 'multi' && (
            <div className="text-center bg-white/5 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-2">
                {gameStarted ? 'Time left:' : 'Game will start after:'}
              </div>
              <div className="text-3xl font-bold text-white">
                {timeLeft > 0
                  ? new Date(timeLeft * 1000).toISOString().substr(14, 5)
                  : '0:00'}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-2xl">
            {squares.map((value, index) => (
              <Square
                key={index}
                value={value}
                onSquareClick={() => handleClick(index)}
                isWinner={winnerPositions?.includes(index) || false}
                disabled={winner !== null || (gameMode === 'multi' && (!gameStarted || playerTurn !== playerIndex))}
              />
            ))}
          </div>

          {(winner !== null || (gameMode === 'single' && squares.some(square => square !== null))) && (
            <div className="text-center space-y-3">
              <Button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🔄 Play Again
              </Button>
              <Button
                onClick={onBackToMenu}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 py-3 text-lg rounded-full backdrop-blur-sm"
              >
                ← Back to Menu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
