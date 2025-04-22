const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./games.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the database.');
});

db.run(`
    CREATE TABLE IF NOT EXISTS game_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player1 TEXT,
        player2 TEXT,
        winner TEXT,
        date_played TEXT
    )
`);

app.post('/save-game', (req, res) => {
    const { player1, player2, winner } = req.body;
    const date_played = new Date().toISOString();

    db.run(`INSERT INTO game_results (player1, player2, winner, date_played) VALUES (?, ?, ?, ?)`,
        [player1, player2, winner, date_played],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, id: this.lastID });
        });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
