// initiateAuthentication.js

async function initiateAuthentication() {
  try {
    // Make a GET request to your server's initiate-authentication endpoint
    const response = await axios.get('https://authenthicatebot.azurewebsites.net/initiate-authentication/');
    
    // After the GET request, the server will redirect to the Twitter authentication URL
    // You can choose to open the URL in a new window or redirect the user to the Twitter authentication page
    window.location.href = response.request.res.responseUrl;
  } catch (error) {
    console.error(error);
    // Handle error if needed
  }
}