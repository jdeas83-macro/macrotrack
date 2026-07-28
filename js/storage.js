/* ==========================================
   MacroTrack
   Step 4 — Local Storage System
========================================== */

const STORAGE_KEYS = {
    settings: "macroTrack_settings",
    foods: "macroTrack_foods",
    dailyLogs: "macroTrack_dailyLogs"
};


/* ==========================================
   DEFAULT DATA
========================================== */

const DEFAULT_SETTINGS = {
    calorieGoal: 2400,
    proteinGoal: 180,
    carbsGoal: 220,
    fatGoal: 70
};


const DEFAULT_FOODS = [
    {
        id: "chicken-breast",
        name: "Chicken Breast",
        serving: "100 g",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6
    },
    {
        id: "white-rice",
        name: "Cooked White Rice",
        serving: "100 g",
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3
    },
    {
        id: "egg",
        name: "Large Egg",
        serving: "1 egg",
        calories: 72,
        protein: 6.3,
        carbs: 0.4,
        fat: 4.8
    },
    {
        id: "banana",
        name: "Banana",
        serving: "1 medium",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4
    },
    {
        id: "oats",
        name: "Rolled Oats",
        serving: "40 g",
        calories: 150,
        protein: 5,
        carbs: 27,
        fat: 3
    }
];


/* ==========================================
   GENERAL STORAGE HELPERS
========================================== */

function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Could not save ${key}:`, error);
        return false;
    }
}


function loadData(key, fallbackValue) {
    try {
        const savedValue = localStorage.getItem(key);

        if (savedValue === null) {
            return fallbackValue;
        }

        return JSON.parse(savedValue);
    } catch (error) {
        console.error(`Could not load ${key}:`, error);
        return fallbackValue;
    }
}


/* ==========================================
   DATE HELPERS
========================================== */

function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* ==========================================
   SETTINGS
========================================== */

function getSettings() {
    const savedSettings = loadData(
        STORAGE_KEYS.settings,
        DEFAULT_SETTINGS
    );

    return {
        ...DEFAULT_SETTINGS,
        ...savedSettings
    };
}


function saveSettings(settings) {
    const updatedSettings = {
        calorieGoal: Number(settings.calorieGoal),
        proteinGoal: Number(settings.proteinGoal),
        carbsGoal: Number(settings.carbsGoal),
        fatGoal: Number(settings.fatGoal)
    };

    return saveData(
        STORAGE_KEYS.settings,
        updatedSettings
    );
}


/* ==========================================
   FOOD LIBRARY
========================================== */

function getFoods() {
    const savedFoods = loadData(
        STORAGE_KEYS.foods,
        null
    );

    if (!Array.isArray(savedFoods)) {
        saveFoods(DEFAULT_FOODS);
        return [...DEFAULT_FOODS];
    }

    return savedFoods;
}


function saveFoods(foods) {
    return saveData(
        STORAGE_KEYS.foods,
        foods
    );
}


function addFood(food) {
    const foods = getFoods();

    const newFood = {
        id: createId(),
        name: String(food.name).trim(),
        serving: String(food.serving).trim(),
        calories: Number(food.calories),
        protein: Number(food.protein),
        carbs: Number(food.carbs),
        fat: Number(food.fat)
    };

    foods.push(newFood);
    saveFoods(foods);

    return newFood;
}


function deleteFood(foodId) {
    const foods = getFoods();

    const updatedFoods = foods.filter(
        food => food.id !== foodId
    );

    saveFoods(updatedFoods);
}


/* ==========================================
   DAILY FOOD LOGS
========================================== */

function getAllDailyLogs() {
    const logs = loadData(
        STORAGE_KEYS.dailyLogs,
        {}
    );

    if (
        logs === null ||
        typeof logs !== "object" ||
        Array.isArray(logs)
    ) {
        return {};
    }

    return logs;
}


function getDailyLog(dateKey = getTodayKey()) {
    const allLogs = getAllDailyLogs();

    if (!Array.isArray(allLogs[dateKey])) {
        return [];
    }

    return allLogs[dateKey];
}


function saveDailyLog(dateKey, entries) {
    const allLogs = getAllDailyLogs();

    allLogs[dateKey] = entries;

    return saveData(
        STORAGE_KEYS.dailyLogs,
        allLogs
    );
}


function addFoodToDailyLog(food, quantity = 1, dateKey = getTodayKey()) {
    const entries = getDailyLog(dateKey);

    const safeQuantity = Number(quantity);

    const newEntry = {
        logId: createId(),
        foodId: food.id,
        name: food.name,
        serving: food.serving,
        quantity: safeQuantity,
        calories: roundNumber(food.calories * safeQuantity),
        protein: roundNumber(food.protein * safeQuantity),
        carbs: roundNumber(food.carbs * safeQuantity),
        fat: roundNumber(food.fat * safeQuantity),
        createdAt: new Date().toISOString()
    };

    entries.push(newEntry);

    saveDailyLog(dateKey, entries);

    return newEntry;
}


function removeFoodFromDailyLog(logId, dateKey = getTodayKey()) {
    const entries = getDailyLog(dateKey);

    const updatedEntries = entries.filter(
        entry => entry.logId !== logId
    );

    saveDailyLog(dateKey, updatedEntries);
}


function clearDailyLog(dateKey = getTodayKey()) {
    return saveDailyLog(dateKey, []);
}


/* ==========================================
   DAILY TOTALS
========================================== */

function calculateDailyTotals(dateKey = getTodayKey()) {
    const entries = getDailyLog(dateKey);

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
   UTILITY FUNCTIONS
========================================== */

function createId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;
}


function roundNumber(number) {
    return Math.round((Number(number) + Number.EPSILON) * 10) / 10;
}


/* ==========================================
   INITIALISE STORAGE
========================================== */

function initialiseStorage() {
    if (localStorage.getItem(STORAGE_KEYS.settings) === null) {
        saveSettings(DEFAULT_SETTINGS);
    }

    if (localStorage.getItem(STORAGE_KEYS.foods) === null) {
        saveFoods(DEFAULT_FOODS);
    }

    if (localStorage.getItem(STORAGE_KEYS.dailyLogs) === null) {
        saveData(STORAGE_KEYS.dailyLogs, {});
    }
}


initialiseStorage();
