<script setup>
import { ref, onMounted } from 'vue';

// Reactive reference to store dynamically loaded footer HTML content
const footerHtml = ref('');

// Function to fetch footer content asynchronously
async function fetchFooter() {
  try {
    // Attempt to fetch footer content from the backend server
    const response = await fetch('http://127.0.0.1:8080/footer');
    if (!response.ok) {
      // Throw an error if response is not OK
      throw new Error('Failed to fetch footer');
    }
    // Load the fetched text content into the reactive variable
    footerHtml.value = await response.text();
  }
  catch (error) {
    // Log any error that occurs and fallback to a default error message
    console.error(error.message);
    // Fallback content
    footerHtml.value = '<p>Failed to load footer content.</p>';
  }
}
// Fetch footer content after the component has been mounted
onMounted(() => {
  fetchFooter();
});
</script>

<template>
  <!-- Text Content Section -->
  <div class="container mt-4">
    <!-- Section Header -->
    <div class="text-center mb-4">
      <h2 class="fw-bold">Welcome to the WeatherDashboard!</h2>
    </div>

    <!-- Description Section -->
    <div class="mb-4">
      <p class="lead">
        Use the buttons above to navigate to the <span class="text-primary fw-semibold">Login Page</span>,
        <span class="text-info fw-semibold">About Us</span>, or view the <span class="text-success fw-semibold">User's List</span>.
      </p>

      <p class="text-muted">
        Please note that accessing the <span class="text-success">User's List</span> requires authentication
        and appropriate access levels, which are <span class="text-warning">Admin</span> or <span class="text-warning">Write</span> access.
      </p>
    </div>

    <!-- Introduction Section -->
    <div>
      <h3 class="fw-bold text-info">Getting Started</h3>
      <p>
        Upon clicking on the <span class="text-primary">Login Page</span>, you will be directed to the login page
        where you will have the ability to register if you are not a part of the site yet.
        If you already have an account, you will be able to login and access the main page.
      </p>
    </div>
  </div>
  <!-- Footer Section -->
  <!-- Dynamically inject the fetched footer content into the footer using `v-html` -->
  <footer v-html="footerHtml" class="bg-light custom-footer"></footer>

</template>

<style scoped>
/* Custom class to move the footer down by adding margin-top */
.custom-footer {
  margin-top: 8%;
  padding: 20px 0;
  text-align: center;
}
</style>