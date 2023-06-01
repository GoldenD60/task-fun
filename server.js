const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Store the scoreboard data
let scoreboardData = [];

// Handle incoming connections
wss.on('connection', (ws) => {
  // Handle messages received from clients
  ws.on('message', (message) => {
    console.log('Received:', message);

    // Parse the incoming message
    const { type, name, score } = JSON.parse(message);

    if (type === 'scoreUpdate') {
      // Update the scoreboard data
      updateScoreboard(name, score);

      // Broadcast the updated scoreboard to all connected clients
      broadcastScoreboard();
    }
  });

  // Send the initial scoreboard data to the newly connected client
  ws.send(JSON.stringify({ type: 'scoreUpdate', data: scoreboardData }));
});

function updateScoreboard(name, score) {
  // Check if the player already exists in the scoreboard
  const playerIndex = scoreboardData.findIndex(entry => entry.name === name);

  if (playerIndex === -1) {
    // Player doesn't exist, add a new entry
    scoreboardData.push({ name, score });
  } else {
    // Player exists, update the score
    scoreboardData[playerIndex].score = score;
  }
}

function broadcastScoreboard() {
  const message = JSON.stringify({ type: 'scoreUpdate', data: scoreboardData });

  // Broadcast the updated scoreboard to all connected clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
