# Multiplayer Tic-Tac-Toe with Nakama

A production-ready, multiplayer Tic-Tac-Toe game with server-authoritative architecture using Nakama as the backend infrastructure.

<h1 align="center">
  <img src="demo.png" style="height: 400px;" alt="tic-tac-toe">
</h1>

## Features

- ✅ **Server-Authoritative Game Logic**: All game state managed on server-side
- ✅ **Real-time Multiplayer**: Instant game updates via WebSocket
- ✅ **Matchmaking System**: Automatic pairing of players
- ✅ **Leaderboard**: Track wins, losses, and win streaks
- ✅ **Timer-Based Gameplay**: 20-second turns with automatic forfeit
- ✅ **Mobile Responsive**: Optimized for all devices
- ✅ **Production Ready**: Deployable to cloud providers

## Architecture

- **Frontend**: Next.js 13+ with TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Nakama server with TypeScript runtime
- **Database**: PostgreSQL
- **Real-time**: WebSocket connections via Nakama Socket

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MOHAMMEDMUBARAKJ/xoxo-nextjs-nakama
   cd xoxo-nextjs-nakama
   ```

2. **Setup Client**
   ```bash
   cd client
   cp .env.example .env.local
   npm install
   npm run dev
   ```

3. **Setup Server**
   ```bash
   cd server
   npm install
   docker-compose up
   ```

### Environment Variables

Create `.env.local` in the client directory:

```env
NEXT_PUBLIC_NAKAMA_KEY=defaultkey
NEXT_PUBLIC_SERVER_API=127.0.0.1
NEXT_PUBLIC_SERVER_PORT=7350
NEXT_PUBLIC_USE_SSL=false
```

## Usage

1. Open http://localhost:3000
2. Click "🎮 Play Now" to start a game
3. Wait for automatic matchmaking
4. Play Tic-Tac-Toe with real-time updates
5. Check the leaderboard to see top players

## API Endpoints

### Server Ports
- **7349**: gRPC API server
- **7350**: HTTP API server
- **7351**: Nakama Console (admin panel)
  - Username: `admin`
  - Password: `password`

### RPC Endpoints
- `find_match_js`: Find or create a match
- `leaderboard_js`: Get leaderboard data

## Deployment

### Client Deployment
```bash
cd client
npm run build
npm run start
```

### Server Deployment
```bash
cd server
docker-compose up -d
```

### Cloud Deployment Options

**AWS/GCP/Azure**:
1. Deploy PostgreSQL database
2. Deploy Nakama server to EC2/GCE/VM
3. Deploy Next.js app to Vercel/Netlify or server

**DigitalOcean**:
1. Use DigitalOcean Managed Database for PostgreSQL
2. Deploy Nakama to App Platform or Droplet
3. Deploy client to App Platform

## Development

### Project Structure
```
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utilities and Nakama client
│   └── types/            # TypeScript types
├── server/                # Nakama backend
│   ├── src/              # Server runtime code
│   ├── data/             # Configuration
│   └── docker-compose.yml
└── README.md
```

### Key Files
- `client/lib/nakama.ts`: Nakama client wrapper
- `server/src/match_handler.ts`: Game logic and matchmaking
- `server/src/leaderboard.ts`: Leaderboard RPC implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Resources

- [Nakama Documentation](https://heroiclabs.com/docs/nakama/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Nakama Client Tutorial](https://www.youtube.com/watch?v=nbvVNmwjOrA)
- [Nakama Server Setup](https://www.youtube.com/watch?v=FXguREV6Zf8)
