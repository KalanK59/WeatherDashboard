<template>
  <div>
    <!-- Header displayed when user data is available -->
    <h1 v-if="data">User List Data</h1>
    <p></p>

    <!-- Loop through the data to display each user's information -->
    <div v-for="user in data" :key="user._id">
      <!-- Display the username and their access level -->
      <h3>{{ user.username }}'s access level is {{ user.accessLevel }}</h3>

      <!-- Display action buttons if the user has sufficient permissions -->
      <div v-if="hasPermission(user)">
        <!-- Button to delete a user -->
        <button @click="deleteUser(user._id)">Delete</button>
        <!-- Button to open the update form for editing user details -->
        <button @click="editUser(user)">Update</button>
      </div>
    </div>

    <!-- Form to update a user's details, displayed when editing a user -->
    <div v-if="editingUser">
      <h2>Edit User</h2>
      <form @submit.prevent="updateUser">
        <div>
          <!-- Input field to update the username -->
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="editingUser.username" />
        </div>
        <div>
          <!-- Dropdown to select the user's new access level -->
          <label for="accessLevel">Access Level:</label>
          <select id="accessLevel" v-model="editingUser.accessLevel">
            <option value="admin">Admin</option>
            <option value="write">Write</option>
            <option value="read">Read</option>
          </select>
        </div>
        <!-- Buttons to save the updated details or cancel editing -->
        <button type="submit">Update User</button>
        <button @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
// Import Vue utilities and dependencies
import { ref } from 'vue'; // Reactive state management
// Library for handling browser cookies
import Cookies from 'js-cookie';
// Vue Router for navigation
import { useRouter } from 'vue-router';

export default {
  // Component name for identification
  name: 'UserOnPage',

  // Data properties for managing component state
  data() {
    return {
      data: null, // Stores the list of users fetched from the server
      editingUser: null, // Stores the user currently being edited
      isAuthenticated: false, // Tracks if the current user is authenticated
      user: null, // Stores details of the logged-in user
      token: Cookies.get('token') || null, // Retrieves the authentication token from cookies
    };
  },

  // Lifecycle hook to fetch data when the component is created
  created() {
    // Fetch user data from the server
    this.fetchData();
    // Debugging to check token value
    console.log('Token:', this.token);
  },

  // Methods for handling various actions
  methods: {
    // Fetch the list of users from the backend
    async fetchData() {
      try {
        const response = await fetch("http://127.0.0.1:8080/userInDB/userOnPage", {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Authentication failed or session expired');
        }
        // Populate the data property with the response
        this.data = await response.json();
        // Mark the user as authenticated
        this.isAuthenticated = true;
      } catch (error) {
        // Mark the user as unauthenticated
        this.isAuthenticated = false;
        // Show an error message
        alert(error.message);
      }
    },

    // Check if the user has the required permissions for certain actions
    hasPermission(user) {
      return user && (user.accessLevel === 'admin' || user.accessLevel === 'write' || user.accessLevel === 'read');
    },

    // Delete a user by sending a DELETE request to the backend
    async deleteUser(userId) {
      const response = await fetch(`http://127.0.0.1:8080/userInDB/deleteUser/${userId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        this.fetchData(); // Refresh the user list after successful deletion
        alert('User deleted successfully!');
      } else {
        alert('Error deleting user: ' + result.message || 'Unknown error');
      }
    },

    // Update a user's details by sending a PUT request to the backend
    async updateUser() {
      const updatedData = {
        // Updated username
        username: this.editingUser.username,
        // Updated access level
        accessLevel: this.editingUser.accessLevel
      };
      //Fetches from this route.
      const response = await fetch(`http://127.0.0.1:8080/userInDB/updateUser/${this.editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh the user list after successful update
        this.fetchData();
        alert('User updated successfully!');
        // Clear the editing state
        this.editingUser = null;
      } else {
        alert('Error updating user: ' + result.message || 'Unknown error');
      }
    },

    // Open the edit form for the selected user
    editUser(user) {
      // Create a copy of the user to avoid modifying the original object
      this.editingUser = { ...user };
    },

    // Cancel the editing process and close the edit form
    cancelEdit() {
      // Clear the editing state
      this.editingUser = null;
    },
  }
};
</script>

<style scoped>
/* Add styles for buttons and layout as needed */
</style>
