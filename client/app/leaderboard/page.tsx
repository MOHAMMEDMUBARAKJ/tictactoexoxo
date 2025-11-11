'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Nakama from '@/lib/nakama';
import { LeaderboardEntry } from '@/lib/messages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const nakama = new Nakama();
      await nakama.authenticate();
      const data = await nakama.getLeaderboard();
      if (data) {
        const parsed = JSON.parse(data.payload);
        setLeaderboard(parsed.entries || []);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-blue-500" />;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-400 to-yellow-600';
      case 1:
        return 'from-gray-300 to-gray-500';
      case 2:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/80 text-xl">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

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
              <span className="text-sm text-white/80">Global rankings</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Leaderboard
              <br />
              <span className="text-3xl md:text-5xl font-light text-purple-300">Champions</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              See how you stack up against the best players worldwide.
            </p>
          </div>

          <Card className="w-full max-w-6xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-white text-4xl mb-2">🏆 Top Players</CardTitle>
              <p className="text-white/70 text-lg">The elite Tic-Tac-Toe champions</p>
            </CardHeader>
            <CardContent className="px-8">
              {leaderboard.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">🎮</div>
                  <h3 className="text-2xl font-bold text-white mb-4">No Games Yet</h3>
                  <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                    Be the first to play and claim the top spot on our leaderboard!
                  </p>
                  <Link href="/tictactoe">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Start Playing Now
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.userId} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] border border-white/10">
                      <div className="flex items-center space-x-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-r ${getRankBg(index)} shadow-lg`}>
                          {index < 3 ? getRankIcon(index) : index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-xl text-white mb-1">{entry.username}</div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-3 py-1">
                              🔥 {entry.streak} win streak
                            </Badge>
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1">
                              {((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)}% win rate
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-400 mb-1">{entry.wins}</div>
                            <div className="text-sm text-white/60 uppercase tracking-wide">Wins</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-400 mb-1">{entry.losses}</div>
                            <div className="text-sm text-white/60 uppercase tracking-wide">Losses</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm"
              >
                ← Back to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
