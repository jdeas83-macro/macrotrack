/* ==========================================
   MacroTrack
   Step 8 — Food Library
========================================== */


/* ==========================================
   START FOOD LIBRARY
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    setupFoodLibrary();
});


function setupFoodLibrary() {
    displayFoods(getFoods());
    setupFoodSearch();
    setupAddFoodForm();
}


/* ==========================================
   DISPLAY FOODS
========================================== */

function displayFoods(foods) {
    const foodLibrary = document.getElementById("foodLibrary");
    const foodCount = document.getElementById("foodCount");

    if (!foodLibrary || !foodCount) {
        return;
    }

    foodLibrary.innerHTML = "";

    const safeFoods = Array.isArray(foods) ? foods : [];

    foodCount.textContent =
        `${safeFoods.length} ${safeFoods.length === 1 ? "food" : "foods"}`;

    if (safeFoods.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty";
        emptyMessage.textContent = "No foods found.";

        foodLibrary.appendChild(emptyMessage);
        return;
    }

    safeFoods.forEach(food => {
        const foodItem = createLibraryFoodItem(food);
        foodLibrary.appendChild(foodItem);
    });
}


/* ==========================================
   CREATE FOOD CARD
========================================== */

function createLibraryFoodItem(food) {
    const foodItem = document.createElement("article");
    foodItem.className = "library-food-item";

    const header = document.createElement("div");
    header.className = "library-food-header";

    const titleArea = document.createElement("div");

    const foodName = document.createElement("div");
    foodName.className = "library-food-name";
    foodName.textContent = food.name;

    const serving = document.createElement("div");
    serving.className = "library-food-serving";
    serving.textContent = `Per ${food.serving}`;

    titleArea.appendChild(foodName);
    titleArea.appendChild(serving);

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-library-food";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
        "aria-label",
        `Delete ${food.name}`
    );

    deleteButton.addEventListener("click", () => {
        deleteFoodFromLibrary(food.id, food.name);
    });

    header.appendChild(titleArea);
    header.appendChild(deleteButton);


    const macros = document.createElement("div");
    macros.className = "library-food-macros";

    macros.appendChild(
        createMacroValue(food.calories, "Calories")
    );

    macros.appendChild(
        createMacroValue(food.protein, "Protein")
    );

    macros.appendChild(
        createMacroValue(food.carbs, "Carbs")
    );

    macros.appendChild(
        createMacroValue(food.fat, "Fat")
    );


    const actions = document.createElement("div");
    actions.className = "library-food-actions";

    const quantityInput = document.createElement("input");

    quantityInput.type = "number";
    quantityInput.className = "quantity-input";
    quantityInput.min = "0.1";
    quantityInput.step = "0.1";
    quantityInput.value = "1";
    quantityInput.setAttribute(
        "aria-label",
        `Quantity for ${food.name}`
    );

    const addButton = document.createElement("button");

    addButton.type = "button";
    addButton.className = "add-food-button";
    addButton.textContent = "Add";

    addButton.addEventListener("click", () => {
        addSelectedFood(food, quantityInput, addButton);
    });

    actions.appendChild(quantityInput);
    actions.appendChild(addButton);


    foodItem.appendChild(header);
    foodItem.appendChild(macros);
    foodItem.appendChild(actions);

    return foodItem;
}


/* ==========================================
   CREATE MACRO VALUE
========================================== */

function createMacroValue(value, label) {
    const container = document.createElement("div");
    container.className = "macro-value";

    const number = document.createElement("strong");

    if (label === "Calories") {
        number.textContent = formatFoodNumber(value);
    } else {
        number.textContent = `${formatFoodNumber(value)}g`;
    }

    const description = document.createElement("span");
    description.textContent = label;

    container.appendChild(number);
    container.appendChild(description);

    return container;
}


/* ==========================================
   ADD FOOD TO TODAY
========================================== */

function addSelectedFood(food, quantityInput, addButton) {
    const quantity = Number(quantityInput.value);

    if (!Number.isFinite(quantity) || quantity <= 0) {
        quantityInput.focus();
        return;
    }

    addFoodToDailyLog(food, quantity);

    const originalText = addButton.textContent;

    addButton.textContent = "Added";
    addButton.disabled = true;

    window.setTimeout(() => {
        addButton.textContent = originalText;
        addButton.disabled = false;
    }, 900);
}


/* ==========================================
   SEARCH FOODS
========================================== */

function setupFoodSearch() {
    const searchInput = document.getElementById("foodSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", () => {
        const searchTerm =
            searchInput.value.trim().toLowerCase();

        const foods = getFoods();

        const filteredFoods = foods.filter(food =>
            food.name.toLowerCase().includes(searchTerm)
        );

        displayFoods(filteredFoods);
    });
}


/* ==========================================
   CUSTOM FOOD FORM
========================================== */

function setupAddFoodForm() {
    const form = document.getElementById("addFoodForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        saveCustomFood(form);
    });
}


function saveCustomFood(form) {
    const formMessage = document.getElementById("formMessage");

    const food = {
        name: document.getElementById("foodName").value,
        serving: document.getElementById("foodServing").value,
        calories: document.getElementById("foodCalories").value,
        protein: document.getElementById("foodProtein").value,
        carbs: document.getElementById("foodCarbs").value,
        fat: document.getElementById("foodFat").value
    };

    if (!isValidFood(food)) {
        showFormMessage(
            formMessage,
            "Please complete every field with valid values.",
            true
        );

        return;
    }

    addFood(food);

    form.reset();

    showFormMessage(
        formMessage,
        `${food.name.trim()} was saved.`,
        false
    );

    displayFoods(getFoods());

    const searchInput = document.getElementById("foodSearch");

    if (searchInput) {
        searchInput.value = "";
    }
}


/* ==========================================
   VALIDATE CUSTOM FOOD
========================================== */

function isValidFood(food) {
    const name = String(food.name).trim();
    const serving = String(food.serving).trim();

    const calories = Number(food.calories);
    const protein = Number(food.protein);
    const carbs = Number(food.carbs);
    const fat = Number(food.fat);

    return (
        name.length > 0 &&
        serving.length > 0 &&
        Number.isFinite(calories) &&
        Number.isFinite(protein) &&
        Number.isFinite(carbs) &&
        Number.isFinite(fat) &&
        calories >= 0 &&
        protein >= 0 &&
        carbs >= 0 &&
        fat >= 0
    );
}


/* ==========================================
   DELETE FOOD
========================================== */

function deleteFoodFromLibrary(foodId, foodName) {
    const confirmed = window.confirm(
        `Delete ${foodName} from the food library?`
    );

    if (!confirmed) {
        return;
    }

    deleteFood(foodId);

    const searchInput = document.getElementById("foodSearch");
    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const filteredFoods = getFoods().filter(food =>
        food.name.toLowerCase().includes(searchTerm)
    );

    displayFoods(filteredFoods);
}


/* ==========================================
   FORM MESSAGE
========================================== */

function showFormMessage(element, message, isError) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.classList.toggle("error", isError);

    window.setTimeout(() => {
        element.textContent = "";
        element.classList.remove("error");
    }, 3000);
}


/* ==========================================
   NUMBER FORMATTING
========================================== */

function formatFoodNumber(value) {
    const number = Number(value) || 0;

    return number.toLocaleString("en-AU", {
        maximumFractionDigits: 1
    });
}
