# Aetherium Estates - Luxury Real Estate Platform

Aetherium Estates is a sophisticated, modern web application designed for a luxury real estate agency.
It consists of two primary components: a visually stunning, animated public landing page to attract clients,
and a secure, feature-rich user dashboard for registered users to manage their property interests and personal information.
The project emphasizes a high-end user experience through elegant design, smooth animations, and robust functionality.

# Note : The default page that the user is going to see is landing page made with given design elements. If the user is not signed in he'll see
design like below -  

## 📜 Table of Contents

- [Project Goal](#-project-goal)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Development Process & Logic](#-development-process--logic)
- [Setup and Installation](#-setup-and-installation)

## 🎯 Project Goal

The primary goal of this project is to create a dynamic and engaging online platform for a high-end real estate company. This is achieved by:

1.  **Captivating First Impressions:** Utilizing a modern, animated, and interactive landing page to showcase featured properties and the company's brand philosophy, immediately capturing user interest.
2.  **Providing a Secure User Hub:** Offering a secure and personalized dashboard where registered users can save and manage properties, perform financial calculations, and view their profile information.
3.  **Ensuring Seamless Authentication:** Implementing a secure and user-friendly authentication system via Clerk to protect user data and provide a smooth login/signup experience.

## ✨ Key Features

### Public Landing Page (`script.js`, `style.css`)

* **Custom Animated Cursor:** A unique custom cursor that provides a premium, interactive feel.
* **GSAP-Powered Animations:** High-performance animations for the preloader, navigation menu, and scroll-triggered property reveals, creating a fluid and engaging user experience.
* **Dynamic Property Grid:** A responsive and visually appealing grid of featured properties that animates on scroll and adjusts to different screen sizes.
* **Interactive Marquee:** An auto-scrolling marquee showcasing the company's core philosophies, which pauses on hover for user interaction.
* **Agent Image Hover Effect:** An interactive list of agents that displays their image in a floating container as the user hovers over their name.

### User Dashboard (`index.html`, `dashboard.js`, `dashboard.css`)

* **Secure Authentication:** User authentication and route protection are handled by **Clerk**, ensuring that only logged-in users can access the dashboard. The `protect-route.js` script redirects unauthenticated users.
* **Personalized Experience:** The dashboard greets users by their first name and allows them to mount a user button for easy access to profile management and sign-out options.
* **Saved Properties Management:** Users can browse and add properties to a "Saved" list. This data is persisted in the browser's **Local Storage**, scoped to the user's ID.
* **Interactive Mortgage Calculator:** A functional calculator that estimates monthly mortgage payments and uses **Chart.js** to visualize the breakdown of principal vs. down payment.
* **Data-Driven Overview:** The main overview panel displays key stats like the number of saved properties and an activity chart, also rendered using Chart.js.
* **User Profile Display:** A dedicated section that securely fetches and displays the user's profile information (image, name, email, etc.) from their Clerk session.
* **Fully Responsive Design:** The dashboard features a collapsible sidebar and a fluid layout that is accessible and functional on both desktop and mobile devices.

## 🛠️ Technology Stack

This project leverages a combination of modern web technologies to deliver a high-quality user experience:

* **Frontend:**
    * **HTML5:** For the structure and content of the web pages.
    * **CSS3:** For all styling, layout, animations, and responsive design.
* **JavaScript (ES6+):** For all client-side interactivity, animations, and business logic.
* **Authentication:**
    * **Clerk:** For secure user authentication, session management, and user profile data.
* **Libraries:**
    * **GSAP (GreenSock Animation Platform):** For high-performance, complex JavaScript animations on the landing page.
    * **Chart.js:** For creating interactive and visually appealing charts in the user dashboard.
    * **Feather Icons:** For clean, lightweight, and modern icons used throughout the application.
* **Fonts:**
    * **Google Fonts:** The 'Inter' and 'Playfair Display' fonts are used to create a sophisticated and readable typography.

## 📂 Project Structure

The project is organized into the following files:


/
├── index.html            # The main user dashboard, accessible after login.
├── (landing.html)        # NOTE: The public landing page HTML is inferred from the other files.
|
├── style.css             # Main stylesheet for the public landing page.
├── dashboard.css         # Stylesheet specifically for the user dashboard.
|
├── script.js             # JavaScript for landing page animations and interactivity.
├── dashboard.js          # JavaScript for all user dashboard functionality.
└── protect-route.js      # A dedicated script to protect the dashboard route using Clerk.


## ⚙️ Development Process & Logic

The development of this project followed a structured, component-based approach:

1.  **Landing Page Creation:** The public-facing site was built first, focusing on aesthetics and animations using `style.css` and `script.js` with GSAP to create an immediate "wow" factor.
2.  **Dashboard Scaffolding:** The `index.html` (dashboard) was structured with distinct panels for each feature (Overview, Saved Properties, etc.). `dashboard.css` was written to style it with a clean, professional look.
3.  **Authentication with Clerk:** Clerk was integrated to handle all user authentication.
    * The landing page would contain the sign-in/sign-up buttons.
    * The `dashboard.js` script initializes Clerk and sets up a listener to react to changes in the user's authentication state.
    * The `protect-route.js` script acts as a guard, checking for an active Clerk session before allowing the page to render.
4.  **Dashboard Functionality (`dashboard.js`):**
    * **Data Persistence:** User-specific data, like saved properties, is stored in Local Storage. The key is dynamically created using the user's unique ID from Clerk (`savedProperties_${userId}`) to ensure data is isolated between different users on the same browser.
    * **Dynamic Rendering:** When the dashboard loads, the script fetches user data from Clerk and saved properties from Local Storage, then dynamically renders the content, including the welcome message, property lists, and stats.
    * **Component Initialization:** Functions like `initializeMortgageCalculator()` and `initActivityChart()` are called to set up the interactive widgets using Chart.js.
5.  **Refinement and Testing:** The final stage involved testing the entire user flow—from landing page to sign-up to dashboard interaction—across different browsers and devices to ensure a consistent and bug-free experience.

## 🚀 Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository or download the files** to a local directory.
2.  **Set up Clerk:**
    * Create a free account at [Clerk.com](https://clerk.com/).
    * Create a new application in your Clerk dashboard.
    * Find your **Publishable Key** in the API Keys section.
    * Open `dashboard.js` and replace the placeholder key with your own:
        ```javascript
        const clerkPublishableKey = "pk_test_your_real_publishable_key";
        ```
3.  **Run the application:**
    * Since this project uses client-side routing and logic, you can open the `(landing).html` file (if you create one) or the `index.html` file directly in your web browser. For best results and to avoid potential CORS issues with local files, it's recommended to use a simple local server extension like "Live Server" for Visual Studio Code.

