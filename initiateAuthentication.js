// initiateAuthentication.js



async function initiateAuthentication() {
    try {
        const response = await axios.get('https://authenthicatebot.azurewebsites.net/initiate-authentication');
        console.log(response.data);
        // Continue with your logic here
    } catch (error) {
        console.error('Error initiating authentication:', error.message);
        // Handle the error appropriately
    }
}
