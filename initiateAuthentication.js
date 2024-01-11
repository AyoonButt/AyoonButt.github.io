// initiateAuthentication.js

function initiateAuthentication() {
    // Make a GET request to fetch the Twitter authentication URL from the server
    axios.get('initiate-authentication')
        .then(response => {
            const twitterAuthUrl = response.data;

            // Function to redirect to the Twitter authentication URL
            function redirectToTwitter() {
                window.location.href = twitterAuthUrl;
            }

            // Add event listener to the button for redirection
            document.getElementById('authButton').addEventListener('click', redirectToTwitter);
        })
        .catch(error => {
            console.error('Error initiating Twitter authentication:', error);
        });
}