// Leaderboard functionality for Tic-Tac-Toe

const leaderboardCollection = "leaderboard";
const leaderboardKey = "stats";

interface UserStats {
    wins: number;
    losses: number;
    streak: number;
}

interface LeaderboardEntry {
    userId: string;
    username: string;
    wins: number;
    losses: number;
    streak: number;
    rank: number;
}

interface LeaderboardResponse {
    entries: LeaderboardEntry[];
}

export let rpcLeaderboard: nkruntime.RpcFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    // Get all user stats
    const stats: { [userId: string]: UserStats } = {};

    // Query storage for all leaderboard entries
    const objects = nk.storageRead([
        {
            collection: leaderboardCollection,
            key: leaderboardKey,
            userId: "*"
        }
    ]);

    objects.forEach((obj: any) => {
        if (obj.value) {
            stats[obj.userId] = obj.value as UserStats;
        }
    });

    // Convert to sorted array
    const entries: LeaderboardEntry[] = Object.keys(stats).map(userId => {
        const user = nk.usersGetId([userId])[0];
        return {
            userId: userId,
            username: user.displayName || user.username || "Anonymous",
            wins: stats[userId].wins || 0,
            losses: stats[userId].losses || 0,
            streak: stats[userId].streak || 0,
            rank: 0 // Will be set after sorting
        };
    });

    // Sort by wins descending, then by streak
    entries.sort((a, b) => {
        if (a.wins !== b.wins) return b.wins - a.wins;
        return b.streak - a.streak;
    });

    // Assign ranks
    entries.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    const response: LeaderboardResponse = { entries };
    return JSON.stringify(response);
}

// Function to update user stats after a game
export function updateUserStats(nk: nkruntime.Nakama, userId: string, won: boolean): void {
    const objectIds = [{
        collection: leaderboardCollection,
        key: leaderboardKey,
        userId: userId
    }];

    let stats: UserStats = { wins: 0, losses: 0, streak: 0 };

    try {
        const objects = nk.storageRead(objectIds);
        if (objects.length > 0 && objects[0].value) {
            stats = objects[0].value as UserStats;
        }
    } catch (error) {
        // User has no stats yet, use defaults
    }

    if (won) {
        stats.wins++;
        stats.streak++;
    } else {
        stats.losses++;
        stats.streak = 0;
    }

    nk.storageWrite([{ collection: leaderboardCollection, key: leaderboardKey, userId: userId, value: stats }]);
}
