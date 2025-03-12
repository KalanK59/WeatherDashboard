document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const comment = document.getElementById('comment').value.trim();

        let hasError = false;

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach((elem) => elem.textContent = '');

        // Validate First Name
        if (!firstName) {
            showError('first-name-error', 'First name is required.');
            hasError = true;
        }
        else if (!validateCharacters(firstName)) {
            showError('first-name-error', 'Must contain alphabetic characters.');
        }

        // Validate Last Name
        if (!lastName) {
            showError('last-name-error', 'Last name is required.');
            hasError = true;
        }
        else if (!validateCharacters(lastName)) {
            showError('last-name-error', 'Must contain alphabetic characters.');
        }

        // Validate Email
        if (!email) {
            showError('email-error', 'Email is required.');
            hasError = true;
        }
        else if (!validateEmail(email)) {
            showError('email-error', 'Please enter a valid email address.');
            hasError = true;
        }

        // Validate Comment
        if (!comment) {
            showError('comment-error', 'Please enter your comment.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // Create the mailto link with form data
        const subject = encodeURIComponent('Contact Form Submission');
        const body = encodeURIComponent(`Name: ${firstName} ${lastName}\nEmail: ${email}\n\nComment: ${comment}`);

        // Open the mailto link
        window.location.href = `mailto:kalynka6893@saskpolytech.ca?cc=broley0000@saskpolytech.ca&subject=${subject}&body=${body}`;
    });

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.style.color = 'red';
        errorElement.textContent = message;
    }

    function validateCharacters(name) {
        // Check if the name contains only alphabetic characters (including spaces)
        const re = /^[A-Za-z\s]+$/; // Allow letters and spaces
        return re.test(name);
    }

    function validateEmail(email) {
        // Simple email validation regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
