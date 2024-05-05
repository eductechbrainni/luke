// scoreCalculator.js

// This function calculates the score based on user answers
function calculateScore(userAnswers) {
    let score = 0;

    // Assuming each correct answer gives 1 point
    userAnswers.forEach(answer => {
        if (answer.selectedAnswer === 'correct') {
            score++;
        }
    });

    return score;
}

module.exports = calculateScore;
