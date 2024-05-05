let currentQuestionIndex = 0;
let selectedTopic = ''; // Keeps track of the selected topic
let isAwaitingInput = false; // Manages when to expect input
let currentSetIndex = 1; // Manages the current set of questions
let correctAnswers = 0; // Tracks the number of correct answers
let totalAttempts = 0; // Tracks the total number of attempted questions

const questionsSet1 = [
    { image: "Candles in Box .png", q1: "How many candles are there?", solution: 5, possibleanswers: [3, 6, "I am not sure", 5] },
    { image: "Candles on rack.png", q2: "How many boxes on a rack?", solution: 7, possibleanswers: [8, 4, 6, "I am not sure", 7] },
    { image: "Candles on rack.png", q3: "How many candles on a rack?", solution: 50, possibleanswers: [30, 50, 10, "I am not sure", 10] },
];

const questionsSet2 = [
    { image: "Candl.png", q1: "How much money did Math buddy spend to buy 2 blankets?", solution: 5, possibleanswers: [3, 6, "I am not sure", 5] },
    { image: "Candles on rack.png", q2: "How much money will Math Buddy spend to buy 4 blankets?", solution: 7, possibleanswers: [8, 4, 6, "I am not sure", 7] },
    { image: "Candles on rack.png", q3: "How many blankets will maths buddy get for R250?", solution: 50, possibleanswers: [30, 50, 10, "I am not sure", 10] },
];

let currentQuestions = questionsSet1; // Start with the first set of questions

(function() {
    function createQuestionElement(question, modalContent) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        const questionText = document.createElement('p');
        questionText.textContent = question.q1 || question.q2 || question.q3;
        questionDiv.appendChild(questionText);

        if (question.image) {
            const img = document.createElement('img');
            img.src = `images/${question.image}`;
            img.style.width = '30%';
            questionDiv.appendChild(img);
        }

        const dropzone = document.createElement('div');
        dropzone.className = 'dropzone';
        dropzone.textContent = 'Drag your answer here';
        questionDiv.appendChild(dropzone);

        question.possibleanswers.forEach(answer => {
            const answerButton = document.createElement('div');
            answerButton.className = 'draggable';
            answerButton.textContent = answer;
            answerButton.draggable = true;
            answerButton.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', answer);
            });
            questionDiv.appendChild(answerButton);
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            const answer = e.dataTransfer.getData('text/plain');
            console.log('Selected answer:', answer); // Log the selected answer to the console
            if (parseInt(answer) === question.solution) {
                dropzone.style.backgroundColor = '#4CAF50'; // Correct answer
                dropzone.textContent = 'Correct! Loading next question...';
                setTimeout(() => {
                    // Send the user's answer to the backend
                    sendAnswerToBackend(answer);
                    displayQuestion();
                }, 1000);
            } else {
                dropzone.style.backgroundColor = '#f44336'; // Incorrect answer
                dropzone.textContent = 'Incorrect, try again!';
                setTimeout(() => {
                    dropzone.style.backgroundColor = '#f8f8f8';
                    dropzone.textContent = 'Drag your answer here';
                }, 2000);
            }
        });
        
    // Define the answerIsValid function
function answerIsValid(answer) {
    // Add your validation logic here
    return answer !== null && answer !== undefined;
}

function sendAnswerToBackend(answer) {
    // Send the user's answer to the backend using fetch or another method
    fetch('/api/submit-answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit answer');
        }
        return response.json();
    })
    .then(data => {
        // Handle successful submission if needed
        console.log('Answer submitted successfully:', data);
    })
    .catch(error => {
        console.error('Error submitting answer:', error);
        // Handle error appropriately (e.g., display an error message to the user)
    });
}

return questionDiv;
    }

    function displayQuestion() {
        if (currentQuestionIndex < currentQuestions.length) {
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = ''; // Clear previous content
            const question = currentQuestions[currentQuestionIndex++];
            modalContent.appendChild(createQuestionElement(question, modalContent));
            isAwaitingInput = true; // Set to expect input for the new question
        } else {
            // Check if all questions in the set are completed
            if (currentSetIndex === 1) {
                // Display a message indicating the end of the first set
                const modalContent = document.getElementById('modalContent');
                modalContent.innerHTML = '<p>End of Set 1. Would you like to continue with Set 2?</p>';
                const continueButton = document.createElement('button');
                continueButton.textContent = "Continue to Set 2";
                continueButton.onclick = () => {
                    currentSetIndex++; // Move to the next set
                    currentQuestionIndex = 0; // Reset question index for the new set
                    currentQuestions = questionsSet2; // Switch to the second set of questions
                    displayQuestion(); // Display the first question of the second set
                };
                modalContent.appendChild(continueButton);
            } else {
                // Display a message indicating the completion of both sets
                const modalContent = document.getElementById('modalContent');
                modalContent.innerHTML = '<p>All questions completed!</p>';
                // Optionally, you can redirect to the profile page after a delay
                setTimeout(() => {
                    window.location.href = 'http://localhost:9002/profile';
                }, 5000);
            }
        }
    }
    
    
    function displayEndOfSetMessage(modalContent) {
        modalContent.innerHTML = '<p>Well done on completing this set! Do you want to continue with more challenges?</p>';
        const continueButton = document.createElement('button');
        continueButton.textContent = "Continue";
        continueButton.onclick = () => displayQuestion(modalContent); // Continue with next set
        modalContent.appendChild(continueButton);
    }
    

    function showCompletionModal(modalContent) {
        modalContent.innerHTML = '<p>Well done on completing this set! Would you like to continue with more challenges?</p>';
        const continueButton = document.createElement('button');
        continueButton.textContent = "Yes, keep going!";
        continueButton.onclick = () => displayQuestion(modalContent);
        modalContent.appendChild(continueButton);
    }

    window.showQuestions = function(modalContent) {
        currentQuestionIndex = 0;
        displayQuestion(modalContent);
    };
})();

function closeVideoModal() {
    document.getElementById('modalContainer').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');

    console.log(currentQuestionIndex )
    displayBotMessage(questions[currentQuestionIndex].text); // Initial bot message display

    document.getElementById('sendBtn').addEventListener('click', handleUserInput);
    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUserInput();
        }

       // Attach the event listener for the close button here, outside of any other function, to ensure it's done right after the DOM is fully loaded
    const closeModalButton = document.querySelector('.close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            closeVideoModal();
        });
    }
          
    });

    function handleUserInput() {
        const userInput = document.getElementById('userInput').value.trim();

        if (userInput === '') {
            alert('Please enter something in the input field.');
            document.getElementById('userInput').style.borderColor = 'red';
            return;
        } else {
            document.getElementById('userInput').style.borderColor = '';
            displayUserMessage(userInput);
            document.getElementById('userInput').value = ''; // Clear input field immediately after use
        }
    
        totalAttempts++; // Increment total attempts
    
        // Simulate a delay before showing the bot message (replace with your actual logic)
        setTimeout(function() {
            displayBotMessage(`🎉👋 Welcome to our Math Adventure, ${userInput}! 🚀✨ I'm super excited to explore the magical world of numbers with you! Let's dive in and have some fun with math! 🧮🌈`);
        }, 3000);
    
        // Additional logic to handle the transition between questions or actions
        setTimeout(function() {
            const currentQuestion = questions[currentQuestionIndex];
            if (currentQuestion.type === "bot") {
                currentQuestionIndex++;
                switch (currentQuestionIndex) {
                    case 1:
                        presentImages();
                        isAwaitingInput = true; // Expecting input after presenting images
                        break;
                    case 2:
                        presentGrades();
                        break;
                    case 3:
                        presentTopics();
                        break;
                    default:
                        // Handle other cases or end of questions
                        break;
                }
    
                // Dynamic question handling
                if (currentQuestion.isDynamic) {
                    displayBotMessage(currentQuestion.text.replace("${topic}", selectedTopic), currentQuestion.button);
                } else {
                    displayBotMessage(questions[currentQuestionIndex].text);
                }
            }
    
            // Clear the input field after processing the input
            document.getElementById('userInput').value = '';
            // Reset the awaiting input flag as we've processed the input
            isAwaitingInput = false;
        }, 8000);
        

    
    
        // Simulate a delay before moving to the next question
        setTimeout(() => {
            displayQuestion(); // Move to the next question
        }, 3000);
    }

    function displayBotMessage(message, button) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message chatbot-message';
        messageDiv.textContent = message;
    
        // Check if a button is provided and render it
        if (button) {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = button;
            buttonElement.className = 'chatbot-button';
            buttonElement.onclick = function() {
                handleButtonClicked(button);
            };
            messageDiv.appendChild(buttonElement);
        }
    
        chatBox.appendChild(messageDiv);
        scrollToBottom(); // Ensure the new message is in view
    }
    function displayBotMessageWithDynamicContent(text) {
        let message = text;
        if (message.includes('${topic}')) {
            message = message.replace('${topic}', selectedTopic);
        }
        displayBotMessage(message); // Assuming you have a function called displayBotMessage that handles displaying messages.
    }
    


function handleButtonClick() {
    // Replace this with your logic to play the video
    // For example, you can open a modal or initiate video playback
    // Here, we're just logging a message to the console
    console.log('Play video button clicked!');
}
// Function to handle the button click event



function handleOptionSelect(option) {
    displayUserMessage(option); // Display the selected option as a user message in the chat
    selectedTopic = option; // Update the selected topic

    // Check if the selected option is either Multiplication or Addition
    if (option === "Multiplication" || option === "Addition") {
        // Display the specific message for video after selecting Multiplication or Addition
        displayBotMessage("Great!! I made you a short explanation video.", "Play video");
    } else {
        // For other selections, you can continue with the normal flow or handle them specifically
        currentQuestionIndex++; // Assuming you're using a question index to track the conversation flow
        if (currentQuestionIndex < questions.length) {
            const nextQuestion = questions[currentQuestionIndex];
            displayBotMessageWithDynamicContent(nextQuestion.text);
            
            // Display options if there are any for the next question
            if (nextQuestion.options) {
                nextQuestion.options.forEach(displayOptionButton);
            }
        }
    }
}


function handleButtonClicked(button) {
    if (button === 'Play video') {
        openVideoModal();
    }
}
// Function to display a message from the bot
function displayBotMessage(message, button) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message chatbot-message';
    messageDiv.textContent = message;

    // Check if a button is provided and render it
    if (button) {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button;
        buttonElement.className = 'chatbot-button';
        buttonElement.onclick = function() {
            handleButtonClicked(button);
        };
        messageDiv.appendChild(buttonElement);
    }

    chatBox.appendChild(messageDiv);
    scrollToBottom(); // Ensure the new message is in view
}


    // Function to display a message from the user
    function displayUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        scrollToBottom(); // Ensure the new message is in view
    }
    // Present images for the second question
    function presentImages() {
        const images = ['images/U (5).png', 'images/U (7).png', 'images/U (8).png', 'images/U (9).png']; // Update with your image paths
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'images-container';

        images.forEach((image) => {
            const imgElement = document.createElement('img');
            imgElement.src = image; // Use the actual path to your images
            imgElement.alt = `Image`;
            imgElement.className = 'chat-image';
            imgElement.onclick = function() {
                userSelectedImage(this.src); // Pass the src directly
            };
            imagesContainer.appendChild(imgElement);
        });
        
        chatBox.appendChild(imagesContainer);
        scrollToBottom(); // Ensure the images are in view
    }

    // Handle user selection of an image
    function userSelectedImage(imageSrc) {
        const imageContainer = document.getElementById('selectedImageContainer');
        imageContainer.innerHTML = ''; // Clear the container

        const imgElement = document.createElement('img');
        imgElement.src = imageSrc; // Use the source of the clicked image
        imgElement.className = 'selected-image'; // Use this class for styling and animations
        imageContainer.appendChild(imgElement);

        animateImage(imgElement); // Call function to animate the image appearance
        
        // Move to the next question
        currentQuestionIndex++;
        const nextQuestion = questions[currentQuestionIndex];
        if (nextQuestion.type === "bot") {
            displayBotMessageWithDynamicContent(nextQuestion.text);
            if (currentQuestionIndex === 2) {
                presentGrades(); // Present grades for the third question
            } else if (currentQuestionIndex === 3) {
                presentTopics(); // Present topics for the fourth question
            }
        }
    }

    // Animate the image appearance
    function animateImage(imgElement) {
        imgElement.style.opacity = 0;
        let opacity = 0;
        const interval = setInterval(() => {
            opacity += 0.1;
            imgElement.style.opacity = opacity;
            if (opacity >= 1) clearInterval(interval);
        }, 100);
    }

    // Present grade options for the third question
    function presentGrades() {
        // Find the question about grades in the questions array
        const gradeQuestion = questions.find(question => question.text.includes("which grade"));
        // Use the options from the found question for grades
        const grades = gradeQuestion.options;
        const gradesContainer = document.createElement('div');
        gradesContainer.className = 'grades-container';
    
        grades.forEach(grade => {
            const gradeButton = document.createElement('button');
            
            gradeButton.textContent = `Grade ${grade}`;
            gradeButton.className = 'grade-button';
            gradeButton.onclick = function() {
                userSelectedGrade(grade);
            };
            gradesContainer.appendChild(gradeButton);
        });
    
        // Assuming you have a way to append gradesContainer to your chat UI
        chatBox.appendChild(gradesContainer);
        scrollToBottom();
    }
    
    // Handle user selection of a grade
    function userSelectedGrade(grade) {
        displayBotMessage(`Fantastic! You're in Grade ${grade}.`);
        
        // Move to the next question
        currentQuestionIndex++;
        const nextQuestion = questions[currentQuestionIndex];
        if (nextQuestion.type === "bot") {
            displayBotMessageWithDynamicContent(nextQuestion.text);
            if (currentQuestionIndex === 3) {
                presentTopics(); // Present topics for the fourth question
            }
        }
    }

    // Present topic options for the fourth question
    function presentTopics() {
        // Optionally, find the question about topics in the questions array if you store it there
        const topicQuestion = questions.find(question => question.text.includes("what topic are you interested in"));
        // If you've decided to move topics to the questions array
        const topics = topicQuestion ? topicQuestion.options : ["Addition", "Subtraction", "Multiplication"];
        
        const topicsContainer = document.createElement('div');
        topicsContainer.className = 'topics-container';
    
        topics.forEach(topic => {
            const topicButton = document.createElement('button');
            topicButton.textContent = topic;
            topicButton.className = 'topic-button';
            topicButton.onclick = function() {

                // -----SPOT----
                console.log(topic);
                userSelectedTopic(topic);
                        displayBotMessage("Great!! I made you a short explanation video.", "Play video");


            };
            topicsContainer.appendChild(topicButton);
        });
    
        chatBox.appendChild(topicsContainer);
        scrollToBottom(); // Ensure the topic options are in view
    }
    
    // displayBotMessage("Great!! I made you a short explanation video.", "Play video");
    // Handle user selection of a topic
    function userSelectedTopic(topic) {
        selectedTopic = topic; // Capture the user's topic choice
    
        // Alert based on the selected topic
        
        // Move to the next question
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) { // Ensure we're within bounds
            const nextQuestion = questions[currentQuestionIndex];
            if (nextQuestion && nextQuestion.type === "bot") {
                if (nextQuestion.isDynamic) {
                    displayBotMessageWithDynamicContent(nextQuestion.text.replace("${topic}", selectedTopic), nextQuestion.button);
                } else {
                    displayBotMessage(questions[currentQuestionIndex].text);
                }
                if (currentQuestionIndex === 4) {
                    // presentExplanationVideo(); // Assuming this needs to be called here based on your setup
                    // displayUserMessage("Chama");
                    khethea()
                
                }
            }
        } else {
            console.error('No more questions available.');
            // Handle end of questions or reset the conversation flow
        }
    }
    


    // Present explanation video for the fifth question
    function presentExplanationVideo() {
        // displayBotMessage("Great!! I made you a short explanation video.");
        displayBotMessage("Great!! I made you a short explanation video.", "Play video");

        // Move to the next question
        currentQuestionIndex++;
        const nextQuestion = questions[currentQuestionIndex];
        if (nextQuestion.type === "bot") {
            displayBotMessageWithDynamicContent(nextQuestion.text);
            if (currentQuestionIndex === 5) {
                displayVideoButton(); // Display the video button for the final question
            }
        }
    }

    // Function to display the video button
    function displayVideoButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'video-button-container';

        const videoButton = document.createElement('button');
        videoButton.textContent = 'Play Video';
        videoButton.className = 'button';
        videoButton.onclick = function() {
            openVideoModal();
        };

        buttonContainer.appendChild(videoButton);
        chatBox.appendChild(buttonContainer);
        scrollToBottom(); // Ensure the button is in view
    }

 function khethea(){
    switch (selectedTopic) {
        case "Subtraction":
            alert("Alert 1: Ready to subtract our way through?");
            break;
        case "Addition":
            // displayBotMessage("What is 6 + 9?");
       
            // displayUserMessage();
            // setTimeout(() => displayBotMessage("Hint, want me show yes?"), 3000);
           
         
            // const userInput = document.getElementById('userInput').value.trim();
            // alert(userInput)
            // displayUserMessage("Hey ");
            break;
        case "Multiplication":
            alert("Alert 3: Time to multiply our knowledge!");
            break;
        default:
            alert("Hmm, looks like an interesting choice!");
    }



 }


// Function to open the video modal
function openVideoModal() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.style.display = 'flex';

    const modalContent = document.getElementById('modalContent');
    // Clear previous content and set up for video
    modalContent.innerHTML = '<span class="close-modal" style="align-self: flex-end; cursor: pointer;" onclick="closeVideoModal()">&times;</span>';
    
    const video = document.createElement('video');
    video.setAttribute('src', '/videos/Loadshedding mayhem.mp4'); // Ensure path is correct
    video.style.width = '80%';
    video.controls = true;
    video.autoplay = true;
    video.muted = true; // Mute to allow autoplay in most browsers
    
    modalContent.appendChild(video);

    // Use the 'ended' event to ensure questions show right after the video ends
    video.onended = () => {
        video.style.opacity = '0';
        // Ensure transitionend event is properly used to wait for fade out
        video.ontransitionend = () => {
            video.remove(); // Remove the video element after fade-out
            showQuestions(modalContent); // Function to start showing questions
        };
    };
    
    video.style.transition = 'opacity 2s'; // Set fade-out transition
}

function displayResult() {
    console.log(`You got ${correctAnswers}/${totalAttempts} correct.`);
    
}

    

    // Auto-scroll to the latest message or image
  // Correct and consolidate the scrollToBottom function
// Correct and consolidate the scrollToBottom function
// Correct and consolidate the scrollToBottom function
function scrollToBottom() {

    const chatMessages = document.getElementById('chatBox');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
}

displayResult();

   // Event listener for the close button in the video modal
});

function fetchSessionState() {
    fetch('/api/session/state') // You need to implement this route
        .then(response => response.json())
        .then(data => {
            currentQuestionIndex = data.currentQuestionIndex;
            currentSetIndex = data.currentSetIndex;
            showQuestions(); // Adjust to load the correct question based on updated indices
        })
        .catch(error => console.error('Error fetching session state:', error));
}

function updateSessionState() {
    const payload = {
        currentQuestionIndex: currentQuestionIndex,
        currentSetIndex: currentSetIndex,
    };

    fetch('/api/session/update', { // Implement this API route on server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => console.log('Session updated'))
    .catch(error => console.error('Error updating session:', error));
}

