import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { randomUUID } from "crypto";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://10.0.0.63:5173",
      "http://10.0.0.63:3000",
    ],
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));

type Piece = "x" | "o" | null;

interface Game {
  id: string;
  board: Piece[];
  // Socket.id of player, or null if player is not connected
  player1: string | null;
  player2: string | null;
}

const games: { [key: Game["id"]]: Game } = {};

// Create a new game room
io.on("connection", (socket: Socket) => {
  console.log("A user connected: " + socket.id);

  // Let a client create a game or join one with a player waiting
  socket.on("createOrJoinGame", () => {
    // Check the game list for a game with an open player slot.
    // If there is one, join it. Otherwise, create a new game.
    const game = Object.values(games).find(
      (game) =>
        (game.player1 && !game.player2) || (game.player2 && !game.player1)
    );

    if (game) {
      // Join existing game
      console.log("Waiting game found: " + game.id);
      game.player2 = socket.id;
      socket.join(game.id);
      socket.emit("gameCreatedOrJoined", game);
      io.to(game.id).emit("gameUpdated", game);
      console.log(`${socket.id} joined game: ${game.id}`);
    } else {
      // Create a new game
      const newGame: Game = {
        id: randomUUID(),
        board: Array(9).fill(null),
        player1: socket.id,
        player2: null,
      };

      games[newGame.id] = newGame;
      socket.join(newGame.id);
      socket.emit("gameCreatedOrJoined", newGame);
      console.log(`${socket.id} created a new game: ${newGame.id}`);
    }
  });

  // Create a new game and room, assign socket as player1
  // NOTE: this is not currently used on the client
  socket.on("createGame", () => {
    const gameId = randomUUID();
    const game: Game = {
      id: gameId,
      board: Array(9).fill(null),
      player1: socket.id,
      player2: "",
    };

    games[gameId] = game;
    socket.join(gameId);
    socket.emit("gameCreated", game);
    console.log(`Game created: ${gameId} by ${socket.id}`);
  });

  // Join an existing game using provided gameId; assign socket as player2
  // NOTE: this is not currently used on the client
  socket.on("joinGame", (gameId: string) => {
    const game = games[gameId];

    if (!game) {
      socket.emit("error", "Game not found");
      return;
    }
    if (game.player2) {
      socket.emit("error", "Game already full");
      return;
    }

    game.player2 = socket.id;
    socket.join(gameId);
    socket.emit("gameJoined", game);
    io.to(gameId).emit("gameUpdated", game);
    console.log(`${socket.id} joined game: ${gameId}`);
  });

  // Handle moves. The client sends the game id and move index.
  socket.on(
    "makeMove",
    ({ gameId, index }: { gameId: string; index: number }) => {
      const game = games[gameId];

      if (!game) {
        socket.emit("error", "Game not found");
        return;
      }

      // Determine whose turn it is by counting moves on the board.
      const moves = game.board.filter((piece) => piece !== null).length;
      const expectedSocket = moves % 2 === 0 ? game.player1 : game.player2;

      if (socket.id !== expectedSocket) {
        socket.emit("error", "Not your turn");
        return;
      }

      if (game.board[index] !== null) {
        socket.emit("error", "Invalid move");
        return;
      }

      // Update board: player1 uses 'x', player2 uses 'o'
      game.board[index] = socket.id === game.player1 ? "x" : "o";
      io.to(gameId).emit("gameUpdated", game);
      console.log(
        `Move made in game ${gameId} at index ${index} by ${socket.id}`
      );
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);

    // Leave all games the user was in
    for (const gameId in games) {
      const game = games[gameId];
      const whichPlayer =
        socket.id === game.player1
          ? "player1"
          : socket.id === game.player2
          ? "player2"
          : null;

      if (whichPlayer) {
        const updatedGame = { ...game, [whichPlayer]: "disconnected" };
        io.to(gameId).emit("gameUpdated", updatedGame);
        console.log(`Game ${gameId} ended due to disconnect.`);

        if (
          updatedGame.player1 === "disconnected" &&
          updatedGame.player2 === "disconnected"
        ) {
          delete games[gameId];
          console.log(
            `Game ${gameId} removed from games due to both players disconnecting.`
          );
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
