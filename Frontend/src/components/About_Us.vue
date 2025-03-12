<script setup>
// Import the 'onMounted' from Vue
import { onMounted } from 'vue';
// Import the 'useRouter' function from Vue Router
import { useRouter } from 'vue-router';

// Get the router instance
const router = useRouter();

// Show the modal automatically on page load
onMounted(() => {
  // Get the modal element by its ID from the DOM
  const modalElement = document.getElementById('aboutModal');
  // Check if the modal element exists before proceeding
  if (modalElement) {
    // Create a new Bootstrap Modal instance using the modal element
    const bootstrapModal = new bootstrap.Modal(modalElement);

    // Event listener to navigate when modal is closed
    modalElement.addEventListener('hidden.bs.modal', () => {
      // Navigate back to the default route of the application when the modal is closed
      router.replace('/');
    });

    // Automatically show the modal when the page is loaded
    bootstrapModal.show();
  }
});
</script>

<template>
  <div>
    <!-- Modal to display the about us-->
    <!--The ">" is used for the closing of the div tag-->
    <div
        id="aboutModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="aboutModalLabel"
        aria-hidden="true"

    >
      <!-- Modal Dialog to display the 'About Us' section with the content container below -->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Header section of the modal -->
          <div class="modal-header">
            <!-- Title of the modal with the close button being of type close -->
            <h5 class="modal-title" id="aboutModalLabel">About Us</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <!-- Body section of the modal with informational content about the webpage -->
          <div class="modal-body">
            <!-- Paragraph introducing the purpose of the application and its developers -->
            <p>Welcome to our application! Here is some information about us. This site was put together by Kalan Kalynka and Dominic Broley.
            Developed this for our CWEB 280 projects and overall we have developed a functioning WeatherDashboard webpage with many features.</p>
            <!-- Closing note for the introductory message -->
            <p>
              Sincerely,
            </p>
            <!-- Names of the developers involved in creating the project -->
            <p>Kalan Kalynka and Dominic Broley (The Developers)</p>
          </div>
          <!-- Footer section of the modal with a 'Close' button -->
          <div class="modal-footer">
            <!-- Button to close the modal -->
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>