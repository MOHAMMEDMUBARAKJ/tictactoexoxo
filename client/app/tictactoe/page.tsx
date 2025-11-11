'use client';
import { useState } from 'react';
import Board from '@/components/board';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type GameMode = 'menu' | 'single' | 'multi';

export default function TicTacToePage() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');

  const handleSinglePlayer = () => {
    setGameMode('single');
  };

  const handleMultiPlayer = () => {
    setGameMode('multi');
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
  };

  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative z-10">
          <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/80">Choose your challenge</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                Game Mode
                <br />
                <span className="text-3xl md:text-5xl font-light text-purple-300">Selection</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                Choose how you want to experience Tic-Tac-Toe. Practice with AI or compete globally.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 cursor-pointer group" onClick={handleSinglePlayer}>
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🤖</span>
                  </div>
                  <CardTitle className="text-white text-3xl mb-2">Single Player</CardTitle>
                  <div className="text-purple-300 text-lg font-light">Practice Mode</div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-white/70 text-lg leading-relaxed">
                    Hone your skills against a smart AI opponent. Perfect for learning strategies and improving your game.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-400">⚡</div>
                      <div className="text-sm text-white/80">Instant</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-400">🧠</div>
                      <div className="text-sm text-white/80">Smart AI</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-400">🎯</div>
                      <div className="text-sm text-white/80">Practice</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-orange-400">🏆</div>
                      <div className="text-sm text-white/80">No Pressure</div>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 text-lg font-semibold rounded-full">
                    Start Practice
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 cursor-pointer group" onClick={handleMultiPlayer}>
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🌐</span>
                  </div>
                  <CardTitle className="text-white text-3xl mb-2">Multiplayer</CardTitle>
                  <div className="text-pink-300 text-lg font-light">Global Competition</div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-white/70 text-lg leading-relaxed">
                    Challenge real players from around the world. Experience true competitive gaming with rankings.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-400">⚡</div>
                      <div className="text-sm text-white/80">Real-time</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-400">🌍</div>
                      <div className="text-sm text-white/80">Global</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-orange-400">🏆</div>
                      <div className="text-sm text-white/80">Rankings</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-2xl font-bold text-red-400">🛡️</div>
                      <div className="text-sm text-white/80">Fair Play</div>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold rounded-full">
                    Find Match
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm"
                onClick={() => window.history.back()}
              >
                ← Back to Home
              </Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={handleBackToMenu}
              className="border-white/20 text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
            >
              ← Back to Menu
            </Button>
            <div className="text-lg font-medium text-white">
              {gameMode === 'single' ? '🤖 Single Player Mode' : '👥 Multiplayer Mode'}
            </div>
          </div>
          <Board gameMode={gameMode} onBackToMenu={handleBackToMenu} />
        </div>
      </div>
    </div>
  );
}
