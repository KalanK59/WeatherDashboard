// Imports the required functions and components to build the application
import { createApp } from 'vue' // Function to create a Vue application instance
import { createRouter, createWebHistory } from 'vue-router' // Functions to set up routing for the application
import App from './App.vue' // Root component of the application
import AboutUs from './components/About_Us.vue' // Component for the "About Us" page
import Login from './components/Login.vue' // Component for the "Login" page
import UserOnPage from './components/UserOnPage.vue' // Component for displaying the user-specific page

// Set up the router for navigation between different pages
const router = createRouter({
    // Uses web history mode for cleaner URLs (e.g., "/about_us" instead of "/#/about_us")
    history: createWebHistory(),
    // Defines all the routes (URL paths) and map them to specific components
    routes: [
        // Route configuration for the Login page
        { path: '/login', name: 'Login', component: Login },
        // Route configuration for the About Us page
        { path: '/about_us', name: 'About Us', component: AboutUs },
        // Route configuration for the User page
        { path: '/user', name: 'OnPage', component: UserOnPage },
    ]
});

// Creates  a Vue application instance and set the root component to App.vue
const app = createApp(App)

// Register the router with the Vue application so navigation works across components
app.use(router);

// Attaches the Vue application to the HTML element with the id "app"
// This makes the Vue application visible and functional in the browser
app.mount('#app')
