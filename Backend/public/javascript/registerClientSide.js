// Submits the form through the add event listener.
document.getElementById('formRegister').addEventListener('submit', async function (e) {
    // Prevent the form from submitting in the default traditional way (page reload)
    e.preventDefault();

    // Get the input values for username, password, and access level
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const accessLevel = document.getElementById('accessLevel').value; // Get the selected access level

    try {
        // Make a POST request to the server's registration route
        const response = await fetch('/register', { // Updated to /register
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Sending data as a JSON object
            body: JSON.stringify({
                username,
                password,
                accessLevel
            }),
        });

        // Parse the response from the server as JSON.
        const result = await response.json();

        // If there is an error in the response, display it on the registration form.
        if (result.error) {
            // Show error message on the registration form.
            document.getElementById('message').textContent = result.error;
            document.getElementById('message').classList.add('alert', 'alert-danger');
        } else if (result.success) {
            // On success, redirect to the weather page.
            window.location.href = '/weather'; // Redirect to the weather page
        }
    }
        // Log any errors that occur during the fetch request.
    catch (error) {
        console.error('Error:', error);
    }
});