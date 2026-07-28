/* ==========================================
   MacroTrack
   Step 9 — History Page
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    displayHistory();
});


/* ==========================================
   DISPLAY HISTORY
========================================== */

function displayHistory() {
    const historyList = document.getElementById("historyList");
    const historyCount = document.getElementById("historyCount");

    if (!historyList || !historyCount) {
        return;
    }

    historyList.innerHTML = "";

    const allLogs = getAllDailyLogs();

    const loggedDates = Object.keys(allLogs)
        .filter(dateKey => {
            return (
                Array.isArray(allLogs[dateKey]) &&
                allLogs[dateKey].length > 0
            );
        })
        .sort((firstDate, secondDate) => {
            return secondDate.localeCompare(firstDate);
        });

    historyCount.textContent =
        `${loggedDates.length} ` +
        `${loggedDates.length === 1 ? "day" : "days"}`;

    if (loggedDates.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty";
        emptyMessage.textContent =
            "No food history yet. Add food from the Library.";

        historyList.appendChild(emptyMessage);
        return;
    }

    loggedDates.forEach(dateKey => {
        const entries = allLogs[dateKey];
        const historyCard = createHistoryDay(dateKey, entries);

        historyList.appendChild(historyCard);
    });
}


/* ==========================================
   CREATE HISTORY DAY
========================================== */

function createHistoryDay(dateKey, entries) {
    const historyDay = document.createElement("article");
    historyDay.className = "history-day";

    const totals = calculateTotalsFromEntries(entries);

    const headerButton = document.createElement("button");

    headerButton.type = "button";
    headerButton.className = "history-day-header";

    const dateArea = document.createElement("div");

    const dateText = document.createElement("div");
    dateText.className = "history-date";
    dateText.textContent = formatHistoryDate(dateKey);

    const calorieText = document.createElement("div");
    calorieText.className = "history-calories";
    calorieText.textContent =
        `${formatHistoryNumber(totals.calories)} calories`;

    dateArea.appendChild(dateText);
    dateArea.appendChild(calorieText);

    const toggleText = document.createElement("span");
    toggleText.className = "history-toggle";
    toggleText.textContent = "View foods";

    headerButton.appendChild(dateArea);
    headerButton.appendChild(toggleText);

    headerButton.addEventListener("click", () => {
        const isOpen = historyDay.classList.toggle("open");

        toggleText.textContent =
            isOpen ? "Hide foods" : "View foods";
    });


    const summary = document.createElement("div");
    summary.className = "history-summary";

    summary.appendChild(
        createHistoryMacro(totals.calories, "Calories", "")
    );

    summary.appendChild(
        createHistoryMacro(totals.protein, "Protein", "g")
    );

    summary.appendChild(
        createHistoryMacro(totals.carbs, "Carbs", "g")
    );

    summary.appendChild(
        createHistoryMacro(totals.fat, "Fat", "g")
    );


    const foodList = document.createElement("div");
    foodList.className = "history-foods";

    entries.forEach(entry => {
        foodList.appendChild(
            createHistoryFoodEntry(entry)
        );
    });


    historyDay.appendChild(headerButton);
    historyDay.appendChild(summary);
    historyDay.appendChild(foodList);

    return historyDay;
}


/* ==========================================
   CREATE MACRO BOX
========================================== */

function createHistoryMacro(value, label, unit) {
    const macroBox = document.createElement("div");
    macroBox.className = "macro-value";

    const number = document.createElement("strong");
    number.textContent =
        `${formatHistoryNumber(value)}${unit}`;

    const description = document.createElement("span");
    description.textContent = label;

    macroBox.appendChild(number);
    macroBox.appendChild(description);

    return macroBox;
}


/* ==========================================
   CREATE FOOD ENTRY
========================================== */

function createHistoryFoodEntry(entry) {
    const foodEntry = document.createElement("div");
    foodEntry.className = "history-food-entry";

    const details = document.createElement("div");

    const foodName = document.createElement("div");
    foodName.className = "history-food-name";
    foodName.textContent = entry.name || "Unnamed food";

    const serving = document.createElement("div");
    serving.className = "history-food-serving";
    serving.textContent = createHistoryServingText(entry);

    details.appendChild(foodName);
    details.appendChild(serving);

    const calories = document.createElement("div");
    calories.className = "history-food-calories";
    calories.textContent =
        `${formatHistoryNumber(entry.calories)} cal`;

    foodEntry.appendChild(details);
    foodEntry.appendChild(calories);

    return foodEntry;
}


/* ==========================================
   TOTALS
========================================== */

function calculateTotalsFromEntries(entries) {
    const totals = entries.reduce(
        (currentTotals, entry) => {
            currentTotals.calories += Number(entry.calories) || 0;
            currentTotals.protein += Number(entry.protein) || 0;
            currentTotals.carbs += Number(entry.carbs) || 0;
            currentTotals.fat += Number(entry.fat) || 0;

            return currentTotals;
        },
        {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        }
    );

    return {
        calories: roundNumber(totals.calories),
        protein: roundNumber(totals.protein),
        carbs: roundNumber(totals.carbs),
        fat: roundNumber(totals.fat)
    };
}


/* ==========================================
   DATE FORMATTING
========================================== */

function formatHistoryDate(dateKey) {
    const date = new Date(`${dateKey}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateKey;
    }

    return date.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


/* ==========================================
   SERVING TEXT
========================================== */

function createHistoryServingText(entry) {
    const quantity = Number(entry.quantity) || 1;
    const serving = entry.serving || "serving";

    if (quantity === 1) {
        return serving;
    }

    return `${formatHistoryNumber(quantity)} × ${serving}`;
}


/* ==========================================
   NUMBER FORMATTING
========================================== */

function formatHistoryNumber(value) {
    const number = Number(value) || 0;

    return number.toLocaleString("en-AU", {
        maximumFractionDigits: 1
    });
}