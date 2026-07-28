/* ==========================================
   MacroTrack
   Step 5 — Dashboard
========================================== */


/* ==========================================
   START DASHBOARD
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    displayTodayDate();
    refreshDashboard();
});


/* ==========================================
   DISPLAY TODAY'S DATE
========================================== */

function displayTodayDate() {
    const dateElement = document.getElementById("todayDate");

    if (!dateElement) {
        return;
    }

    const today = new Date();

    dateElement.textContent = today.toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}


/* ==========================================
   REFRESH DASHBOARD
========================================== */

function refreshDashboard() {
    const settings = getSettings();
    const totals = calculateDailyTotals();
    const foodEntries = getDailyLog();

    updateMacroProgress(settings, totals);
    displayFoodLog(foodEntries);
}


/* ==========================================
   UPDATE MACRO PROGRESS
========================================== */

function updateMacroProgress(settings, totals) {
    updateProgressBar({
        textId: "caloriesText",
        barId: "caloriesBar",
        currentValue: totals.calories,
        goalValue: settings.calorieGoal,
        unit: ""
    });

    updateProgressBar({
        textId: "proteinText",
        barId: "proteinBar",
        currentValue: totals.protein,
        goalValue: settings.proteinGoal,
        unit: "g"
    });

    updateProgressBar({
        textId: "carbsText",
        barId: "carbsBar",
        currentValue: totals.carbs,
        goalValue: settings.carbsGoal,
        unit: "g"
    });

    updateProgressBar({
        textId: "fatText",
        barId: "fatBar",
        currentValue: totals.fat,
        goalValue: settings.fatGoal,
        unit: "g"
    });
}


/* ==========================================
   UPDATE ONE PROGRESS BAR
========================================== */

function updateProgressBar({
    textId,
    barId,
    currentValue,
    goalValue,
    unit
}) {
    const textElement = document.getElementById(textId);
    const barElement = document.getElementById(barId);

    if (!textElement || !barElement) {
        return;
    }

    const safeCurrentValue = Number(currentValue) || 0;
    const safeGoalValue = Number(goalValue) || 0;

    textElement.textContent =
        `${formatNumber(safeCurrentValue)} / ` +
        `${formatNumber(safeGoalValue)}${unit}`;

    let percentage = 0;

    if (safeGoalValue > 0) {
        percentage = (safeCurrentValue / safeGoalValue) * 100;
    }

    const visiblePercentage = Math.min(
        Math.max(percentage, 0),
        100
    );

    barElement.style.width = `${visiblePercentage}%`;

    if (percentage >= 100) {
        barElement.style.filter = "brightness(1.25)";
    } else {
        barElement.style.filter = "";
    }
}


/* ==========================================
   DISPLAY TODAY'S FOOD
========================================== */

function displayFoodLog(entries) {
    const foodLogElement = document.getElementById("foodLog");

    if (!foodLogElement) {
        return;
    }

    foodLogElement.innerHTML = "";

    if (!Array.isArray(entries) || entries.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty";
        emptyMessage.textContent = "No food logged today.";

        foodLogElement.appendChild(emptyMessage);
        return;
    }

    entries.forEach(entry => {
        const foodItem = createFoodItem(entry);
        foodLogElement.appendChild(foodItem);
    });
}


/* ==========================================
   CREATE FOOD ITEM
========================================== */

function createFoodItem(entry) {
    const foodItem = document.createElement("div");
    foodItem.className = "food-item";

    const foodDetails = document.createElement("div");
    foodDetails.className = "food-item-details";

    const foodName = document.createElement("div");
    foodName.className = "food-item-name";
    foodName.textContent = entry.name || "Unnamed food";

    const foodMacros = document.createElement("div");
    foodMacros.className = "food-item-macros";

    const servingText = createServingText(entry);

    foodMacros.textContent =
        `${servingText} · ` +
        `${formatNumber(entry.calories)} cal · ` +
        `${formatNumber(entry.protein)}g protein · ` +
        `${formatNumber(entry.carbs)}g carbs · ` +
        `${formatNumber(entry.fat)}g fat`;

    foodDetails.appendChild(foodName);
    foodDetails.appendChild(foodMacros);

    const removeButton = document.createElement("button");

    removeButton.type = "button";
    removeButton.className = "remove-food-button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute(
        "aria-label",
        `Remove ${entry.name || "food"}`
    );

    removeButton.addEventListener("click", () => {
        removeLoggedFood(entry.logId);
    });

    foodItem.appendChild(foodDetails);
    foodItem.appendChild(removeButton);

    return foodItem;
}


/* ==========================================
   CREATE SERVING TEXT
========================================== */

function createServingText(entry) {
    const quantity = Number(entry.quantity) || 1;
    const serving = entry.serving || "serving";

    if (quantity === 1) {
        return serving;
    }

    return `${formatNumber(quantity)} × ${serving}`;
}


/* ==========================================
   REMOVE LOGGED FOOD
========================================== */

function removeLoggedFood(logId) {
    if (!logId) {
        return;
    }

    removeFoodFromDailyLog(logId);
    refreshDashboard();
}


/* ==========================================
   FORMAT NUMBERS
========================================== */

function formatNumber(value) {
    const number = Number(value) || 0;

    return number.toLocaleString("en-AU", {
        maximumFractionDigits: 1
    });
}
