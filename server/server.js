
const express = require("express");
const path = require("path");
const peppers = require("../main/peppers/peppers.json");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.get("/api/peppers", (req, res) => {
    res.json(
        peppers.map((pepper, index) => ({
            id: index,
            name: pepper.name
        }))
    );
});

app.get("/api/peppers/:name", (req, res) => {
    const name = req.params.name;

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
    console.log(`Server running at http://localhost:${PORT}`);
});
