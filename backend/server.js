const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const simpleGit = require('simple-git');

const app = express();
const git = simpleGit();

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// Save recipe and commit to GitHub
app.post('/add-recipe', async (req, res) => {
    const { filename, recipeHTML } = req.body;

    if (!filename || !recipeHTML) {
        return res.status(400).json({ error: 'Missing filename or recipeHTML' });
    }

    try {
        // Save the file in menu folder
        const filePath = path.join(__dirname, '../menu', filename);
        fs.writeFileSync(filePath, recipeHTML, 'utf8');

        // Commit and push
        await git.add(filePath);
        await git.commit(`Add new recipe: ${filename}`);
        await git.push();

        res.json({ message: 'Recipe added & pushed to GitHub successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save recipe' });
    }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
