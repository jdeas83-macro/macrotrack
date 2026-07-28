/* ==========================================
   MacroTrack
   Step 6 — App Navigation
========================================== */

let deferredInstallPrompt = null;

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    registerServiceWorker();
    setupInstallButton();
});


function setupNavigation() {
    const dashboardButton =
        document.getElementById("dashboardButton");

    const libraryButton =
        document.getElementById("libraryButton");

    const historyButton =
        document.getElementById("historyButton");

    const settingsButton =
        document.getElementById("settingsButton");


    if (dashboardButton) {
        dashboardButton.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }


    if (libraryButton) {
        libraryButton.addEventListener("click", () => {
            window.location.href = "food-library.html";
        });
    }


    if (historyButton) {
        historyButton.addEventListener("click", () => {
            window.location.href = "history.html";
        });
    }


    if (settingsButton) {
        settingsButton.addEventListener("click", () => {
            window.location.href = "settings.html";
        });
    }
}
/* ==========================================
   APP INSTALLATION
========================================== */

function setupInstallButton() {
    const installButton =
        document.getElementById("installAppButton");

    if (!installButton) {
        return;
    }

    installButton.addEventListener("click", () => {
        installMacroTrack();
    });

    window.addEventListener(
        "beforeinstallprompt",
        event => {
            event.preventDefault();

            deferredInstallPrompt = event;

            showInstallSection();
        }
    );

    window.addEventListener("appinstalled", () => {
        deferredInstallPrompt = null;

        hideInstallSection();

        console.log("MacroTrack was installed.");
    });

    checkStandaloneMode();
}


function showInstallSection() {
    const installSection =
        document.getElementById("installSection");

    if (!installSection) {
        return;
    }

    installSection.hidden = false;
}


function hideInstallSection() {
    const installSection =
        document.getElementById("installSection");

    if (!installSection) {
        return;
    }

    installSection.hidden = true;
}


async function installMacroTrack() {
    const installButton =
        document.getElementById("installAppButton");

    const installMessage =
        document.getElementById("installMessage");

    if (!deferredInstallPrompt) {
        showInstallMessage(
            installMessage,
            "Installation is not currently available."
        );

        return;
    }

    if (installButton) {
        installButton.disabled = true;
        installButton.textContent = "Opening...";
    }

    try {
        await deferredInstallPrompt.prompt();

        const choice =
            await deferredInstallPrompt.userChoice;

        if (choice.outcome === "accepted") {
            showInstallMessage(
                installMessage,
                "MacroTrack installation accepted."
            );
        } else {
            showInstallMessage(
                installMessage,
                "Installation was cancelled."
            );
        }
    } catch (error) {
        console.error(
            "MacroTrack installation failed:",
            error
        );

        showInstallMessage(
            installMessage,
            "MacroTrack could not be installed."
        );
    }

    deferredInstallPrompt = null;

    if (installButton) {
        installButton.disabled = false;
        installButton.textContent = "Install App";
    }

    hideInstallSection();
}


function checkStandaloneMode() {
    const isStandalone =
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches;

    const isIOSStandalone =
        window.navigator.standalone === true;

    if (isStandalone || isIOSStandalone) {
        hideInstallSection();
    }
}


function showInstallMessage(element, message) {
    if (!element) {
        return;
    }

    element.textContent = message;
}

/* ==========================================
   SERVICE WORKER
========================================== */

function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        console.log(
            "Service workers are not supported in this browser."
        );

        return;
    }

    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then(registration => {
                console.log(
                    "Service worker registered:",
                    registration.scope
                );
            })
            .catch(error => {
                console.error(
                    "Service worker registration failed:",
                    error
                );
            });
    });
}
