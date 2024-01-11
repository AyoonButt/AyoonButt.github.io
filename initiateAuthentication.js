// initiateAuthentication.js

function initiateAuthentication() {
    // Make a GET request to fetch the Twitter authentication URL from the server
    fetch('/initiate-authentication')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const twitterAuthUrl = data.twitterAuthUrl;

            // Redirect to the Twitter authentication URL
            window.location.href = twitterAuthUrl;
        })
        .catch(error => {
            console.error('Error initiating Twitter authentication:', error);
        });
}
