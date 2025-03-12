// Submits the form through the add event listener.
document.getElementById('formSubmit').addEventListener('submit', async function (e) {
    // Prevent the form from submitting in the default traditional way (page reload)
    e.preventDefault();

    // Get the input values for username, password, and remember checkbox status
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    try {
        // Make a POST request to the server's login route with the provided username, password, and remember data.
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Sending data as a JSON object
            body: JSON.stringify({
                username,
                password,
                remember,
            }),
        });
        // Parse the response from the server as JSON.
        const result = await response.json();

        // If there is an error in the response, display it on the login form.
        if (result.error) {
            // Show error message on the login form.
            document.getElementById('message').textContent = result.error;
            document.getElementById('message').classList.add('alert', 'alert-danger');
        } else if (result.success) {
            // On success, redirect to the protected page or weather page.
            window.location.href = '/weather';
        }
    }
        // Log any errors that occur during the fetch request.
    catch (error) {
        console.error('Error:', error);
    }
});