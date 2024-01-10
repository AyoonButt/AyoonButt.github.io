// initiateAuthentication.js
// Fetch the Twitter authentication URL from the JSON file
axios.get('twitterAuthUrl.json')
  .then(response => {
    const twitterAuthUrl = response.data.twitterAuthUrl;

    // Function to redirect to the Twitter authentication URL
    function redirectToTwitter() {
      window.location.href = twitterAuthUrl;
    }

    // Add event listener to the button for redirection
    document.getElementById('authButton').addEventListener('click', redirectToTwitter);
  })
  .catch(error => {
    console.error('Error reading Twitter Auth URL:', error);
  });
