// initiateAuthentication.js

function initiateAuthentication() {
    // Make a GET request to the /initiate-authentication endpoint on your server
    axios.get('/initiate-authentication')
        .then(response => {
            // Extract the Twitter authentication URL from the JSON response
            const twitterAuthUrl = response.data.twitterAuthUrl;

            // Redirect to the Twitter authentication URL
            window.location.href = twitterAuthUrl;
        })
        .catch(error => {
            // Handle errors as needed
            console.error('Error initiating authentication:', error.message);
        });
}