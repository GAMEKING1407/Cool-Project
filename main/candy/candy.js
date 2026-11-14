const candyList = document.getElementById("candy-list");
const candyDetails = document.getElementById("candy-details");

const main = document.querySelector("main");
const hideListButton = document.getElementById("hide-list");

const showListButton = document.createElement("button");
showListButton.id = "show-list";
showListButton.textContent = "← Show Candy";
showListButton.hidden = true;

candyDetails.before(showListButton);

hideListButton.addEventListener("click", () => {
    main.classList.add("list-hidden");
    showListButton.hidden = false;
});

showListButton.addEventListener("click", () => {
    main.classList.remove("list-hidden");
    showListButton.hidden = true;
});

async function loadCandy() {
    try {
        const response = await fetch("/api/candy");

        if (!response.ok) {
            throw new Error("Failed to load candy");
        }

        const candy = await response.json();

        candyList.replaceChildren();

        candy.forEach(item => {
            const button = document.createElement("button");

            button.className = "candy-button";
            button.textContent = item.name;

            button.addEventListener("click", () => {
                selectCandy(item.name, button);
            });

            candyList.appendChild(button);
        });
    } catch (error) {
        candyList.textContent = "Could not load candy.";
        console.error(error);
    }
}

async function selectCandy(name, button) {
    document.querySelectorAll(".candy-button").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    candyDetails.textContent = "Loading candy data...";

    try {
        const response = await fetch(
            `/api/candy/${encodeURIComponent(name)}`
        );

        if (!response.ok) {
            throw new Error("Candy not found");
        }

        const candy = await response.json();

        displayCandy(candy);
    } catch (error) {
        candyDetails.textContent = "Could not load candy data.";
        console.error(error);
    }
}

function displayCandy(candy) {
    candyDetails.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = candy.name;

    const brand = document.createElement("p");
    brand.textContent = candy.brand;

    const grid = document.createElement("div");
    grid.className = "detail-grid";

    const fields = [
        ["Brand", candy.brand],
        ["Type", candy.type],
        ["Flavors", candy.flavor.join(", ")],
        ["Colors", candy.color.join(", ")],
        ["Taste", candy.taste.join(", ")],
        ["Origin", candy.origin]
    ];

    fields.forEach(([label, value]) => {
        const detail = document.createElement("div");
        detail.className = "detail";

        const strong = document.createElement("strong");
        strong.textContent = label;

        const span = document.createElement("span");
        span.textContent = value;

        detail.append(strong, span);
        grid.appendChild(detail);
    });

    candyDetails.append(title, brand, grid);
}

loadCandy();