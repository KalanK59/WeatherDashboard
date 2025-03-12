<template>
  <!-- Main container that wraps the page content -->
  <div class="container">
    <!-- Page title displayed prominently at the top of the page -->
    <h1 class="text-center my-5 text-primary">{{ pageTitle }}</h1>

    <!-- Button group for navigation with equal spacing between buttons -->
    <div class="row justify-content-evenly my-3">
      <!-- Button for navigating to the Login page -->
      <div class="col-md-2">
        <router-link :to="loginLink" class="btn btn-lg btn-block btn-primary shadow-lg">
          {{ loginButtonText }}
        </router-link>
      </div>

      <!-- Button for navigating to the About Us page -->
      <div class="col-md-2">
        <router-link :to="aboutUsLink" class="btn btn-lg btn-block btn-info shadow-lg">
          {{ aboutUsButtonText }}
        </router-link>
      </div>

      <!-- Button for navigating to the User List page, triggers authentication form -->
      <div class="col-md-2">
        <router-link :to="userListLink" class="btn btn-lg btn-block btn-success shadow-lg" @click.native="showAuthenticationForm">
          {{ userListButtonText }}
        </router-link>
      </div>
    </div>

    <!-- View container for displaying dynamic content based on the route -->
    <div class="mt-5">
      <router-view></router-view>
    </div>

    <!-- Modal form for user authentication, displayed conditionally -->
    <div v-if="isAuthenticationFormVisible" class="authentication-form-container">
      <div class="form-container">
        <!-- Close button for the authentication modal -->
        <button class="btn btn-danger btn-sm close-btn" @click="closeAuthenticationForm">X</button>

        <!-- Authentication form for user credentials -->
        <form @submit.prevent="authenticateUser">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" v-model="username" id="username" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password" class="form-control" required />
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block">Authenticate</button>
          </div>
          <!-- Display an error message if authentication fails -->
          <div v-if="authenticationError" class="text-danger">
            <p>{{ authenticationError }}</p>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Component for additional page content displayed below the buttons -->
  <PageContent></PageContent>
</template>

<script>
// Import axios for HTTP requests and the PageContent component for dynamic content
import axios from 'axios';
import PageContent from './components/PageContent.vue';

export default {
  name: 'App', // Name of the Vue component

  // Register components used within this template
  components: {
    PageContent
  },

  // Defines props for customizable data passed to this component
  props: {
    pageTitle: {
      type: String,
      // Default title for the page
      default: 'WeatherDashboard Page',
    },
    // Default route for the Login page, under this prop
    loginLink: {
      type: String,
      default: '/login',
    },
    loginButtonText: {
      type: String,
      // Default button text for the Login page
      default: 'Login Page',
    },
    // Default route for the About Us page, under this prop
    aboutUsLink: {
      type: String,
      default: '/about_us',
    },
    // Default button text for the About Us page
    aboutUsButtonText: {
      type: String,
      default: 'About Us',
    },
    // Default route for the User List page, under this prop
    userListLink: {
      type: String,
      default: '/user',
    },
    // Default button text for the User List page
    userListButtonText: {
      type: String,
      default: "User's List",
    },
  },

  // Define data properties used within the component
  data() {
    return {
      isAuthenticationFormVisible: false, // Tracks if the authentication form is displayed
      // Stores the entered username
      username: '',
      // Stores the entered password
      password: '',
      // Error message if authentication fails
      authenticationError: '',
      // Required access level for the User List page
      requiredAccessLevel: "admin" || "write",
      // Tracks if the user is authenticated
      isAuthenticated: false,
      // Stores the authenticated user's access level
      userAccessLevel: 0,
    };
  },

  // Define methods for user interactions and functionality
  methods: {
    // Show the authentication form modal
    showAuthenticationForm() {
      this.isAuthenticationFormVisible = true;
    },
    // Hide the authentication form modal
    closeAuthenticationForm() {
      this.isAuthenticationFormVisible = false;
    },
    // Authenticate the user by sending credentials to the backend API
    authenticateUser() {
      axios
          .post('http://127.0.0.1:8080/login', {
            username: this.username,
            password: this.password,
          })
          .then((response) => {
            // Check if authentication is successful
            if (response.data.success) {
              const user = response.data.user;

              // Verify if the user has the required access level
              if (user.accessLevel === 'read') {
                this.authenticationError = 'Insufficient access level to access this page.';
                this.isAuthenticated = false;
                // Redirect to the homepage if unauthorized
                this.$router.push('/');
              } else {
                this.isAuthenticated = true;
                this.userAccessLevel = user.accessLevel;
                // Redirect to the User List page
                this.$router.push(this.userListLink);
              }
            }
            //Username or password is not recognized to the system.
            else {
              this.authenticationError = 'Invalid username or password.';
            }
          })
          .catch((error) => {
            console.error('Error during authentication:', error);
            this.authenticationError = 'An error occurred while authenticating.';
          });
    },
  },

  // Watcher to handle route changes
  watch: {
    $route(to, from) {
      // Prevent navigation to the User List page if the user is not authenticated or has insufficient access level
      if (to.path === this.userListLink && (!this.isAuthenticated || this.userAccessLevel === 'read')) {
        this.$router.push('/'); // Redirect to the homepage
      }
    },
  },
};
</script>

<style scoped>
/* General styling for the container */
.container {
  margin-top: 50px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Styling for the page title */
h1 {
  font-size: 2.5rem;
  color: #007bff;
  font-weight: 700;
}

/* Styling for the button group row */
.row.justify-content-evenly {
  /* Space buttons evenly in the row */
  justify-content: space-evenly;
}

/* General styling for buttons */
.btn {
  padding: 10px 20px;
  text-align: center;
}

/* Shadow styling for buttons */
.shadow-lg {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Styling for the authentication form modal */
.authentication-form-container {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Styling for the form container inside the modal */
.authentication-form-container .form-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  position: relative;
}

/* Styling for the close button inside the modal */
.authentication-form-container .close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
