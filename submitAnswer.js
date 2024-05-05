// submitAnswer function that sends the answer to the server
function submitAnswer(isCorrect) {
    // Assume you have the user's ID stored in the session or local storage
    const userId = sessionStorage.getItem('userId'); // Replace with actual logic to retrieve user ID
  
    fetch('/submit-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as needed
      },
      body: JSON.stringify({
        userId: userId,
        isCorrect: isCorrect
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message); // Log the response message
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  