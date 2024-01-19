// initiateAuthentication.js

function initiateAuthentication() {
    // Make a GET request to fetch the Twitter authentication URL from the server
    axios.get('<backend-origin>/initiate-authentication/') // Replace '<backend-origin>' with the actual URL of your backend
        .then(response => {
            // Check if the response contains JSON data
            if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
                const twitterAuthUrl = response.data.twitterAuthUrl;

                // Function to redirect to the Twitter authentication URL
                function redirectToTwitter() {
                    window.location.href = twitterAuthUrl;
                }

                // Add event listener to the button for redirection
                document.getElementById('authButton').addEventListener('click', redirectToTwitter);
            } else {
                // Handle unexpected content type
                console.error('Unexpected content type in the response:', response.headers['content-type']);
            }
        })
        .catch(error => {
            // Handle other errors
            console.error('Error initiating Twitter authentication:', error);
        });
}
