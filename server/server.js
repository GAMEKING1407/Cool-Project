
const express = require("express");
const path = require("path");
const peppers = require("./peppers.json");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/peppers", (req, res) => {
    res.json(
        peppers.map((pepper, index) => ({
            id: index,
            name: pepper.name
        }))
    );
});

app.get("/api/peppers/:name", (req, res) => {
    const name = decodeURIComponent(req.params.name);

    const pepper = peppers.find(
        p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (!pepper) {
        return res.status(404).json({
            error: "Pepper not found"
        });
    }

    res.json(pepper);
});

app.listen(PORT, () => {
    console.log(`Peppers DB running at http://localhost:${PORT}`);
});
