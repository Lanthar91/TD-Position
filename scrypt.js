const maps = [
    "abbey", "airfield", "asia_great_wall", "cliff", "el_hallouf", "ensk",
    "erlenberg", "fishing_bay", "fjord", "highway", "himmelsdorf", "karelia",
    "kharkiv", "lakeville", "live_oaks", "malinovka", "mannerheim_line", "mines",
    "mountain_pass", "munchen", "murovanka", "nebelburg", "overlord", "paris",
    "pilsen", "prohorovka", "redshire", "ruinberg", "sand_river", "siegfried_line",
    "sirene_coast", "steppes", "tundra", "westfeld"
];

const mapList = document.getElementById("map-list");
const mapImage = document.getElementById("map-image");
const gridOverlay = document.getElementById("grid-overlay");
const submitButton = document.getElementById("submit-button");
const popup = document.getElementById("thank-you-popup");

let selectedCoords = [];

maps.forEach(map => {
    const btn = document.createElement("button");
    btn.textContent = map
        .replace(/_/g, " ")
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    btn.onclick = () => loadMap(map);
    mapList.appendChild(btn);
});

function loadMap(mapName) {
    mapImage.src = `image/maps/${mapName}.jpg`;
    selectedCoords = [];
    updateGrid();
    submitButton.style.display = "none";
    // Обновим заголовок
    const title = mapName
        .replace(/_/g, " ")
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    document.getElementById("map-title").textContent = title;

    // Подсветим активную кнопку
    Array.from(mapList.children).forEach(btn => {
        btn.classList.toggle("active", btn.textContent === title);
    });
}

function updateGrid() {
    gridOverlay.innerHTML = "";
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
            const cell = document.createElement("div");
            const key = `${x},${y}`;
            if (selectedCoords.includes(key)) {
                cell.classList.add("selected");
            }
            cell.onclick = () => {
                const idx = selectedCoords.indexOf(key);
                if (idx > -1) {
                    selectedCoords.splice(idx, 1);
                    cell.classList.remove("selected");
                } else {
                    if (selectedCoords.length >= 7) {
                        alert("Можно выбрать не более 7 позиций. Пожалуйста, уберите лишнюю.");
                        return;
                    }
                    selectedCoords.push(key);
                    cell.classList.add("selected");
                }
                submitButton.style.display = selectedCoords.length > 0 ? "inline-block" : "none";
            };
            gridOverlay.appendChild(cell);
        }
    }
}

submitButton.onclick = () => {
    const mapName = mapImage.src.split("/").pop().replace(".jpg", "");
    const coordsStr = selectedCoords.join(";");
    const emailValue = document.querySelector("#thank-you-popup input").value;

    // создаём невидимую форму
    const form = document.createElement("form");
    form.action = "https://script.google.com/macros/s/AKfycbyjcg5Zu0KJfAqTK_ySkkRjGkFLnT7WoCQGB8oeJN35jf0fLc2A2-xujwu8Vufq2r5qLw/exec";
    form.method = "POST";
    form.style.display = "none";

    // map
    const mapInput = document.createElement("input");
    mapInput.name = "map";
    mapInput.value = mapName;
    form.appendChild(mapInput);

    // coords
    const coordsInput = document.createElement("input");
    coordsInput.name = "coords";
    coordsInput.value = coordsStr;
    form.appendChild(coordsInput);

    // email
    const emailInput = document.createElement("input");
    emailInput.name = "email";
    emailInput.value = emailValue;
    form.appendChild(emailInput);

    document.body.appendChild(form);
    let iframe = document.createElement("iframe");
iframe.name = "hidden_iframe";
iframe.style.display = "none";
document.body.appendChild(iframe);

// Настраиваем форму на отправку в iframe
form.target = "hidden_iframe";
document.body.appendChild(form);
form.submit();

// Показываем popup
popup.classList.remove("hidden");

// Очищаем состояние
selectedCoords = [];
submitButton.style.display = "none";
updateGrid();
};

function closePopup() {
    popup.classList.add("hidden");
}

// Загружаем случайную карту при первом открытии
window.addEventListener("DOMContentLoaded", () => {
    const randomMap = maps[Math.floor(Math.random() * maps.length)];
    loadMap(randomMap);
});
