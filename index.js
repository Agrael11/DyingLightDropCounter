var levelExpNextTable;
var levelExpDropTable;

var currentLevelElement;
var currentXPElement;
var currentNextInfoElement;
var currentProgressElement;
var currentSkillPointsElement;

const levelMax = 24;
const levelMin = 1;


function main()
{
    //Lookup table for next required EXP on current level and EXP gained by DROP on the level
    levelExpNextTable = [1000,3250,5000,10000,10500,20750,20750,30000,40000,50000,55000,60000,65000,70000,72500,77500,80000,95000,100000,125000,150000,175000,200000,475000,-1]
    levelExpDropTable = [1000,1000,1070,1528,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000,8500,9000,9500,10000,10500,11000,11950,12000]
    
    currentLevelElement = document.getElementById("CurrentLevel");
    currentXPElement = document.getElementById("CurrentXP");
    currentNextInfoElement = document.getElementById("NextLevelInfo");
    currentProgressElement = document.getElementById("ProgressBarFilled");
    currentSkillPointsElement = document.getElementById("ZeroLabel");

    //Yay, events!
    currentLevelElement.addEventListener('change', update);
    currentLevelElement.addEventListener('keypress', update);
    currentLevelElement.addEventListener('keypress', update);
    currentLevelElement.addEventListener('input', update);
    currentXPElement.addEventListener('change', update);
    currentXPElement.addEventListener('keypress', update);
    currentXPElement.addEventListener('keypress', update);
    currentXPElement.addEventListener('input', update);
    
    update();
}

function updateVisuals(level, requiredForNext, nextLevelExperience)
{
    //Updates sizes of input boxes, to match the content.
    currentLevelElement.style.width = currentLevelElement.value.length + "ch";
    currentXPElement.style.width = currentXPElement.value.length + "ch";
    
    //Updates progres bar to next level
    let percentage = Math.round(10000-((10000*requiredForNext)/nextLevelExperience))/100;
    currentProgressElement.style.width = percentage+"%";

    //Just current level - 1. Simulates number of gained skill points until now.
    currentSkillPointsElement.innerHTML = level - 1;
}

function getLevelAndExperience()
{
    //Gets levels and provides sanity checks. If not correct numbers, select minimum or maximum for element. Minimum is default if not number at all.
    let level = currentLevelElement.value;
    let currentExperience = currentXPElement.value

    if (isNaN(parseInt(level))) {
        level = levelMin;
        currentLevelElement.value = level;
    }

    if (isNaN(parseInt(currentExperience))) {
        currentExperience = 0;
        currentXPElement.value = currentExperience;
    }

    if (level < levelMin)
    {
        level = 1;
        currentLevelElement.value = level;
    }
    else if (level > levelMax + 1)
    {
        level = levelMax + 1;
        currentLevelElement.value = level;
    }

    let nextLevelExperience = levelExpNextTable[level - 1];
    let requiredForNext = nextLevelExperience - currentExperience;

    if (requiredForNext < 0) {
        if (nextLevelExperience == -1) nextLevelExperience = 0;
        currentExperience = nextLevelExperience;
        currentXPElement.value = currentExperience;
        requiredForNext = 0;
    }

    return [level, requiredForNext, nextLevelExperience]
}

function showNextInfo(level, requiredForNext, nextLevelExperience)
{
    //Shows info about next level - Required drops, remaining exp after them and of course required exp for next level,
    //OR information about already being on max level
    if (level > levelMax) {
        currentNextInfoElement.innerHTML = "MAX LEVEL";
        return;
    }

    let experiencePerDrop = levelExpDropTable[level - 1];
    let requiredDrops = Math.floor(requiredForNext/experiencePerDrop);
    let requiredBesidesDrops = requiredForNext - (requiredDrops*experiencePerDrop);

    let drops = "";
    if (requiredDrops == 0)
    {
        drops = requiredBesidesDrops + "XP";
    }
    else
    {
        drops = (requiredDrops != 0 ? (requiredDrops + "DR") : "") + (requiredBesidesDrops != 0 ? ("+" + requiredBesidesDrops + "XP") : "");
    }
    currentNextInfoElement.innerHTML = drops + "/" + nextLevelExperience;
}

function update()
{
    //Updates page
    let [level, requiredForNext, nextLevelExperience] = getLevelAndExperience();

    showNextInfo(level, requiredForNext, nextLevelExperience);

    updateVisuals(level, requiredForNext, nextLevelExperience);
}

main();