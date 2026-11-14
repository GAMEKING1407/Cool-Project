
const pepperList = document.getElementById("pepper-list");
const pepperDetails = document.getElementById("pepper-details");

const main = document.querySelector("main");
const hideListButton = document.getElementById("hide-list");
const sortParameter = document.getElementById("sort-parameter");
const sortOrder = document.getElementById("sort-order");

const showListButton = document.createElement("button");
showListButton.id = "show-list";
showListButton.textContent = "Show Peppers";
showListButton.hidden = true;

pepperDetails.before(showListButton);

let allPeppers = [];

async function loadPeppers() {
    try {
        const response = await fetch("/api/peppers");

        if (!response.ok) {
            throw new Error("Failed to load peppers");
        }

        allPeppers = await response.json();

        updatePepperList();
    } catch (error) {
        pepperList.textContent = "Could not load peppers.";
        console.error(error);
    }
}

function sortPeppers(peppers, parameter, order = "asc") {
    return [...peppers].sort((a, b) => {
        const valueA = a[parameter];
        const valueB = b[parameter];

        let result;

        if (typeof valueA === "string") {
            result = valueA.localeCompare(valueB);
        } else {
            result = Number(valueA) - Number(valueB);
        }

        return order === "desc" ? -result : result;
    });
}

function updatePepperList() {
    const parameter = sortParameter.value;
    const order = sortOrder.value;

    const sorted = sortPeppers(allPeppers, parameter, order);

    pepperList.replaceChildren();

    sorted.forEach(pepper => {
        const button = document.createElement("button");

        button.className = "pepper-button";
        button.textContent = pepper.name;

        button.addEventListener("click", () => {
            selectPepper(pepper.name, button);
        });

        pepperList.appendChild(button);
    });
}

sortParameter.addEventListener("change", updatePepperList);
sortOrder.addEventListener("change", updatePepperList);

async function selectPepper(name, button) {
    document.querySelectorAll(".pepper-button").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    pepperDetails.textContent = "Loading pepper data...";

    try {
        const response = await fetch(
            `/api/peppers/${encodeURIComponent(name)}`
        );

        if (!response.ok) {
            throw new Error("Pepper not found");
        }

        const pepper = await response.json();

        displayPepper(pepper);

        main.classList.add("list-hidden");
        showListButton.hidden = false;
    } catch (error) {
        pepperDetails.textContent = "Could not load pepper data.";
        console.error(error);
    }
}

function displayPepper(pepper) {
    pepperDetails.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = pepper.name;

    const scientific = document.createElement("p");
    scientific.textContent = pepper.scientific_name;

    const grid = document.createElement("div");
    grid.className = "detail-grid";

    const fields = [
        ["SHU Minimum", pepper.shu_min.toLocaleString()],
        ["SHU Maximum", pepper.shu_max.toLocaleString()],
        ["Minimum Length", `${pepper.length_min} inches`],
        ["Maximum Length", `${pepper.length_max} inches`],
        ["Ripe Color", pepper.color_ripe],
        ["Growing Color", pepper.color_growing],
        ["Days to Harvest", `${pepper.days_to_harvest} days`]
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

    pepperDetails.append(title, scientific, grid);
}

hideListButton.addEventListener("click", () => {
    main.classList.add("list-hidden");
    showListButton.hidden = false;
});

showListButton.addEventListener("click", () => {
    main.classList.remove("list-hidden");
    showListButton.hidden = true;
});

loadPeppers();
