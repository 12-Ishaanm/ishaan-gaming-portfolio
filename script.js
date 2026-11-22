
// Loading screen
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hide");
    }, 1500);
});

// Reveal sections as the visitor scrolls
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.12
});

sections.forEach(section => observer.observe(section));

// Add reveal animation
const style = document.createElement("style");
style.textContent = `
.section {
    opacity: 0;
    transform: translateY(25px);
    transition: opacity .8s ease, transform .8s ease;
}

.section.visible {
    opacity: 1;
    transform: translateY(0);
}
`;
document.head.appendChild(style);

// Active navigation highlighting
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";

    document.querySelectorAll("main section[id]").forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + current
        );
    });
});



// MISSION SELECTION + BRIEFING SYSTEM

// FRESH PLAYER SESSION
let completedMissions = new Set();

let currentXP = 2450;
let playerLevel = 7;

// Clear previous visitor progress
localStorage.removeItem("playerProgress");

const maxXP = 3000;
const missionXP = 500;

// UPDATE PLAYER LEVEL AND XP DISPLAY
function updateXPDisplay() {
    while (currentXP >= maxXP) {
        currentXP -= maxXP;
        playerLevel++;
    }

    document.getElementById("playerLevel").textContent =
        `LEVEL ${String(playerLevel).padStart(2, "0")}`;

    document.getElementById("xpText").textContent =
        `${currentXP.toLocaleString()} / ${maxXP.toLocaleString()} XP`;

    document.getElementById("xpProgress").style.width =
        `${(currentXP / maxXP) * 100}%`;
}


function selectMission(card) {

    const missions = document.querySelectorAll(".mission-card");

    const briefing = document.getElementById("missionBriefing");
    const title = document.getElementById("briefingTitle");
    const description = document.getElementById("briefingDescription");
    const status = document.getElementById("briefingStatus");

    const missionData = {
        "PLAYER RETENTION": {
            title: "PLAYER RETENTION",
            description: "Investigate why players abandon a game feature. Analyse player behaviour, identify friction points and recommend improvements to increase engagement and retention.",
            status: "STATUS: MISSION SELECTED"
        },

        "PLAYER ESCALATIONS": {
            title: "PLAYER ESCALATIONS",
            description: "Handle complex player situations involving account suspensions, payment complaints and sensitive issues. Build a structured resolution process that protects player trust.",
            status: "STATUS: MISSION SELECTED"
        },

        "OPERATION EXCELLENCE": {
            title: "OPERATION EXCELLENCE",
            description: "Design a performance-monitoring approach to improve resolution time, strengthen operational efficiency and maintain service quality.",
            status: "STATUS: MISSION SELECTED"
        }
    };

    missions.forEach(mission => {
        mission.classList.remove("selected");

        const button = mission.querySelector(".mission-button");
        button.textContent = "SELECT MISSION →";
    });

    card.classList.add("selected");

    const selectedButton = card.querySelector(".mission-button");
    selectedButton.textContent = "MISSION SELECTED ✓";

    const missionName = card.querySelector("h3").textContent.trim();

    const selectedMission = missionData[missionName];

    if (!selectedMission) return;

    title.textContent = selectedMission.title;
    description.textContent = selectedMission.description;
    status.textContent = selectedMission.status;

    briefing.classList.add("active");

    const completeButton = document.getElementById("completeMission");

if (completedMissions.has(missionName)) {
    completeButton.style.display = "inline-block";
    completeButton.disabled = true;
    completeButton.textContent = "MISSION COMPLETED ✓";
    status.textContent = "STATUS: MISSION COMPLETED | +500 XP";
} else {
    completeButton.style.display = "inline-block";
    completeButton.disabled = false;
    completeButton.textContent = "COMPLETE MISSION ✓";
}

    briefing.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// MISSION COMPLETION SYSTEM
function completeSelectedMission() {
    const status = document.getElementById("briefingStatus");
    const button = document.getElementById("completeMission");
    const title = document.getElementById("briefingTitle");

    completedMissions.add(title.textContent.trim());

    // Award XP for completing the mission
currentXP += missionXP;

// Refresh the player stats
updateXPDisplay();

    status.textContent = "STATUS: MISSION COMPLETED | +500 XP";

    button.textContent = "MISSION COMPLETED ✓";
    button.disabled = true;
    // UPDATE PLAYER ACHIEVEMENTS
updateAchievements();
}

// Initialize player progress when the page loads
updateXPDisplay();
updateAchievements();

// ACHIEVEMENT UNLOCK SYSTEM
function updateAchievements() {
    const firstAchievement = document.getElementById("achievementFirst");
    const masterAchievement = document.getElementById("achievementMaster");
    const levelAchievement = document.getElementById("achievementLevel");

    // FIRST BLOOD: Complete at least one mission
    if (completedMissions.size >= 1) {
        unlockAchievement(firstAchievement);
    }

    // MISSION MASTER: Complete all three missions
    if (completedMissions.size === 3) {
        unlockAchievement(masterAchievement);
    }

    // LEVEL UP: Reach Level 08
    if (playerLevel >= 8) {
        unlockAchievement(levelAchievement);
    }
}

// VISUAL ACHIEVEMENT UNLOCK
function unlockAchievement(achievement) {
    achievement.classList.add("unlocked");

    const status = achievement.querySelector(".achievement-status");
    status.textContent = "UNLOCKED ✓";
}