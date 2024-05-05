console.log("WE WON'T GIVE UP!!!");

let currentProblemIndex = 0;
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;
const dragSound = new Audio("sound/drag.mp3");
const dropSound = new Audio("sound/drop.mp3");

function getCurrentProblem() {
  return problemSolutions[currentProblemIndex];
}


function loadQuestion() {
    const problem = getCurrentProblem();
    const questionElement = document.getElementById('question');
    questionElement.innerHTML = problem.question;
    createDropZones(problem.NumberOfStepsOFProblem);
    problem.currentStep = 1;
    problem.foundSolutions = [];
  }

function createDropZones(numberOfSteps) {
    const equationArea = document.getElementById('equationArea');
    equationArea.innerHTML = ''; // Clear previous steps
    for (let step = 1; step <= numberOfSteps; step++) {
      const dropZone = document.createElement('div');
      dropZone.classList.add('equationStep');
      dropZone.setAttribute('ondrop', 'drop(event)');
      dropZone.setAttribute('ondragover', 'allowDrop(event)');
      equationArea.appendChild(dropZone);
    }
  }
function searchElement() {
    const input = document.getElementById('searchBox').value.toLowerCase();
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
  
    // Assume elementTools is an array with a single object from the database
    // We are interested in the first item of the array, hence elementTools[0]
    const tools = elementTools[0]; // Getting the actual object with the tool values
    for (const key in tools) {
      if (tools.hasOwnProperty(key)) {
        const value = tools[key];
        // Ensure that the value is a string and not another object like _id or __v
        if (typeof value === 'string' && (key.includes(input) || value.includes(input))) {
          const element = document.createElement('div');
          element.textContent = value;
          element.classList.add('draggable');
          element.setAttribute('draggable', true);
          element.ondragstart = drag;
          results.appendChild(element);
        }
      }
    }
  }
  
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.textContent);
  playSound(dragSound);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const newElement = document.createElement('span');
    newElement.textContent = data;
    newElement.classList.add('editable');
    newElement.setAttribute('contenteditable', true);
    newElement.ondragstart = drag;
    event.target.appendChild(newElement);
    playSound(dropSound);
  }

function checkSolution() {
    const problem = getCurrentProblem();
    const userSolution = document.getElementById('equationArea').textContent.trim();
    const correctSolutions = problem.solutions[`step${problem.currentStep}`];
    const normalizedUserSolution = userSolution.replace(/\s+/g, '').toLowerCase();
  
    if (correctSolutions.includes(normalizedUserSolution)) {
      problem.foundSolutions.push(normalizedUserSolution);
      correctAnswersCount++;
      alert(`Correct! You have solved step ${problem.currentStep}.`);
      if (problem.currentStep < problem.NumberOfStepsOFProblem) {
        problem.currentStep++;
        alert(`Now proceed to step ${problem.currentStep}.`);
      } else {
        alert("You've completed this problem!");
        nextQuestion();
      }
    } else {
      incorrectAnswersCount++;
      alert("That's not correct. Try again.");
    }
  }
  
  function nextQuestion() {
    currentProblemIndex = (currentProblemIndex + 1) % problemSolutions.length;
    loadQuestion();
  }

function backQuestion() {
    // Decrease current problem index, but don't go below 0
    currentProblemIndex = Math.max(currentProblemIndex - 1, 0);
    loadQuestion();
  }


document.addEventListener('DOMContentLoaded', function() {
    
    // loadQuestion();
  

    loadQuestion();
    searchElement();
  populateTools(); // Populate the tools and attach event listeners
    document.getElementById('submitSolution').addEventListener('click', checkSolution);
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('backQuestion').addEventListener('click', backQuestion); // Add this line
  });
  
// The rest of your code for setting up the application, handling user session, etc.
// ...
function logElement(event) {
    const elementText = event.target.textContent.trim();
    console.log(elementText);
  }
  

  function populateTools() {
    const tools = elementTools[0]; // Or however your data structure is formatted
    const results = document.getElementById('searchResults');
    results.innerHTML = ''; // Clear existing tools
  
    for (const category in tools) {
      if (tools.hasOwnProperty(category)) {
        const categoryTools = tools[category];
        for (const toolName in categoryTools) {
          if (categoryTools.hasOwnProperty(toolName)) {
            const toolValue = categoryTools[toolName];
            // Now create an element for each tool
            const element = document.createElement('div');
            element.textContent = toolValue;
            element.classList.add('draggable');
            element.setAttribute('draggable', true);
            element.ondragstart = drag;
            // Attach the logElement function to click and mouseover events
            element.addEventListener('click', logElement);
            // element.addEventListener('mouseover', logElement);
            results.appendChild(element);
          }
        }
      }
    }
  }
  
  window.addEventListener('beforeunload', logOutUser);
  // Call populateTools() to populate the tool area when the page loads or the data is fetched
  
  populateTools()