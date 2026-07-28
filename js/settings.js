/* ==========================================
   MacroTrack
   Step 10 — Settings Page
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadSettingsForm();
    setupSettingsForm();
    setupResetGoalsButton();
    setupClearTodayButton();
});


/* ==========================================
   LOAD CURRENT SETTINGS
========================================== */

function loadSettingsForm() {
    const settings = getSettings();

    setInputValue(
        "calorieGoal",
        settings.calorieGoal
    );

    setInputValue(
        "proteinGoal",
        settings.proteinGoal
    );

    setInputValue(
        "carbsGoal",
        settings.carbsGoal
    );

    setInputValue(
        "fatGoal",
        settings.fatGoal
    );
}


function setInputValue(inputId, value) {
    const input = document.getElementById(inputId);

    if (!input) {
        return;
    }

    input.value = value;
}


/* ==========================================
   SAVE SETTINGS
========================================== */

function setupSettingsForm() {
    const settingsForm =
        document.getElementById("settingsForm");

    if (!settingsForm) {
        return;
    }

    settingsForm.addEventListener("submit", event => {
        event.preventDefault();
        saveSettingsForm();
    });
}


function saveSettingsForm() {
    const settingsMessage =
        document.getElementById("settingsMessage");

    const updatedSettings = {
        calorieGoal: getInputNumber("calorieGoal"),
        proteinGoal: getInputNumber("proteinGoal"),
        carbsGoal: getInputNumber("carbsGoal"),
        fatGoal: getInputNumber("fatGoal")
    };

    if (!areSettingsValid(updatedSettings)) {
        showSettingsMessage(
            settingsMessage,
            "Please enter a number greater than zero for every goal.",
            true
        );

        return;
    }

    const wasSaved = saveSettings(updatedSettings);

    if (!wasSaved) {
        showSettingsMessage(
            settingsMessage,
            "Your goals could not be saved.",
            true
        );

        return;
    }

    showSettingsMessage(
        settingsMessage,
        "Your daily goals were saved.",
        false
    );
}


/* ==========================================
   VALIDATION
========================================== */

function getInputNumber(inputId) {
    const input = document.getElementById(inputId);

    if (!input) {
        return 0;
    }

    return Number(input.value);
}


function areSettingsValid(settings) {
    return (
        Number.isFinite(settings.calorieGoal) &&
        Number.isFinite(settings.proteinGoal) &&
        Number.isFinite(settings.carbsGoal) &&
        Number.isFinite(settings.fatGoal) &&
        settings.calorieGoal > 0 &&
        settings.proteinGoal > 0 &&
        settings.carbsGoal > 0 &&
        settings.fatGoal > 0
    );
}


/* ==========================================
   RESET GOALS
========================================== */

function setupResetGoalsButton() {
    const resetButton =
        document.getElementById("resetGoalsButton");

    if (!resetButton) {
        return;
    }

    resetButton.addEventListener("click", () => {
        resetDailyGoals();
    });
}


function resetDailyGoals() {
    const confirmed = window.confirm(
        "Reset your goals to the original defaults?"
    );

    if (!confirmed) {
        return;
    }

    saveSettings(DEFAULT_SETTINGS);
    loadSettingsForm();

    const settingsMessage =
        document.getElementById("settingsMessage");

    showSettingsMessage(
        settingsMessage,
        "Your goals were reset.",
        false
    );
}


/* ==========================================
   CLEAR TODAY'S LOG
========================================== */

function setupClearTodayButton() {
    const clearButton =
        document.getElementById("clearTodayButton");

    if (!clearButton) {
        return;
    }

    clearButton.addEventListener("click", () => {
        clearTodayLog();
    });
}


function clearTodayLog() {
    const confirmed = window.confirm(
        "Remove every food logged today?"
    );

    if (!confirmed) {
        return;
    }

    const wasCleared = clearDailyLog();

    const settingsMessage =
        document.getElementById("settingsMessage");

    if (!wasCleared) {
        showSettingsMessage(
            settingsMessage,
            "Today's log could not be cleared.",
            true
        );

        return;
    }

    showSettingsMessage(
        settingsMessage,
        "Today's food log was cleared.",
        false
    );
}


/* ==========================================
   MESSAGE
========================================== */

function showSettingsMessage(element, message, isError) {
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