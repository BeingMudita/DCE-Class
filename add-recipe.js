// add-recipe.js

// Enable/disable button based on form validation
const inputs = document.querySelectorAll('input[required], textarea[required]');
const generateBtn = document.getElementById('generateBtn');

function validateForm() {
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
    });
    generateBtn.disabled = !isValid;
}
inputs.forEach(input => input.addEventListener('input', validateForm));

window.generateRecipe = function () {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    const name = document.getElementById('recipeName').value.trim();
    const image = document.getElementById('imageURL').value.trim();
    const desc = document.getElementById('description').value.trim();
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;

    if (!name) return document.getElementById('nameError').textContent = 'Recipe name is required';
    if (!image) return document.getElementById('imageError').textContent = 'Image URL is required';
    if (!desc) return document.getElementById('descError').textContent = 'Description is required';
    if (!ingredients) return document.getElementById('ingError').textContent = 'Ingredients are required';
    if (!instructions) return document.getElementById('instError').textContent = 'Instructions are required';

    const ingredientsList = ingredients.split("\n").filter(i => i.trim())
        .map(i => `<li>${i.trim()}</li>`).join("");
    const instructionsList = instructions.split("\n").filter(i => i.trim())
        .map((i, index) => `<li><strong>Step ${index + 1}:</strong> ${i.trim()}</li>`).join("");

    const filename = name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');

    const recipeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name}</title>
<link rel="stylesheet" href="../style.css">
<style>
.recipe {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
.recipe img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
}
.recipe h2 { color: #f57c00; margin-bottom: 15px; }
.recipe h3 { margin: 20px 0 10px; color: #333; }
.recipe ul, .recipe ol { margin-left: 20px; }
.recipe li { margin-bottom: 8px; }
</style>
</head>
<body>
<div class="recipe">
<h2>${name}</h2>
<img src="${image}" alt="${name}">
<p>${desc}</p>
<h3>Ingredients</h3>
<ul>${ingredientsList}</ul>
<h3>Instructions</h3>
<ol>${instructionsList}</ol>
<a href="../index.html" class="back-btn">← Back to Recipes</a>
</div>
</body>
</html>`;

    const cardSnippet = `
<div class="card">
    <img src="${image}" alt="${name}">
    <div class="container">
        <p>${desc}</p>
        <a href="./menu/${filename}.html">${name}</a>
    </div>
</div>`;

    // Send to backend
    fetch('/add-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, recipeHTML, cardSnippet })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('output').innerHTML =
            `<div class="success">${data.message}</div>`;
        document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => console.error(err));
};
