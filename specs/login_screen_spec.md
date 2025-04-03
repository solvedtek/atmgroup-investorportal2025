# Specification: ATM Group Investor Portal - Login Screen Front-End

## 1. Overview

This document outlines the functional requirements, HTML structure pseudocode, and CSS requirements for the ATM Group Investor Portal Login Screen front-end. The design is based on the provided image ([cite: image_096b63.jpg]), featuring a clean, responsive layout for both desktop and mobile views.

## 2. Functional Requirements

The login screen must allow users to:
-   View the ATM Group logo (placeholder).
-   Read the "Welcome back" title and subtitle.
-   Enter their email address into a designated input field.
-   Enter their password into a designated input field (masked).
-   Optionally select a "Remember for 30 days" checkbox.
-   Click a "Forgot password?" link to navigate to a password recovery flow (link destination TBD).
-   Click a "Sign in" button to submit their credentials for authentication.
-   Click a "Sign in with Google" button to initiate Google OAuth authentication.
-   Click a "Sign up" link if they don't have an account, navigating to a registration flow (link destination TBD).

## 3. Non-Functional Requirements

-   **Responsiveness:** The layout must adapt seamlessly between desktop (wider layout) and mobile (narrower, card-like layout) viewports as shown in the design image.
-   **Placeholders:** Use placeholders for the ATM Group logo, specific brand colors, and font families (Inter, Nunito Sans). These will be provided later.
-   **Modularity:** The HTML and CSS should be structured modularly using classes.
-   **Constraints:** Adhere to SPARC validation rules (e.g., file size < 500 lines, no hard-coded secrets/config).
-   **Accessibility:** Basic accessibility considerations (e.g., semantic HTML, label associations) should be included.

## 4. HTML Structure (Pseudocode)

```html
<!-- Overall container for the login page -->
<div class="login-page-container">

    <!-- Left side (potentially hidden on mobile or stacked) - Could contain branding/illustration -->
    <div class="login-branding-section">
        <!-- Placeholder for potential illustration or branding elements -->
        <!-- This section might be visually distinct or just provide spacing on desktop -->
    </div>

    <!-- Right side / Main content area -->
    <div class="login-form-section">

        <!-- Logo Placeholder -->
        <div class="login-logo-container">
            <img src="placeholder_logo.png" alt="ATM Group Logo" class="login-logo">
        </div>

        <!-- Login Form Container -->
        <div class="login-form-container">

            <h1 class="login-title">Welcome back</h1>
            <p class="login-subtitle">Please enter your details.</p>

            <form class="login-form" action="/login" method="post"> <!-- Action/method are placeholders -->

                <!-- Email Input -->
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" name="email" class="form-input" placeholder="Enter your email" required>
                </div>

                <!-- Password Input -->
                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" name="password" class="form-input" placeholder="Enter your password" required>
                </div>

                <!-- Remember Me & Forgot Password Row -->
                <div class="form-options">
                    <div class="form-check">
                        <input type="checkbox" id="rememberMe" name="rememberMe" class="form-checkbox">
                        <label for="rememberMe" class="form-check-label">Remember for 30 days</label>
                    </div>
                    <a href="/forgot-password" class="form-link forgot-password-link">Forgot password?</a> <!-- Href is placeholder -->
                </div>

                <!-- Sign In Button -->
                <button type="submit" class="btn btn-primary btn-signin">Sign in</button>

                <!-- Google Sign In Button -->
                <button type="button" class="btn btn-secondary btn-google-signin">
                    <!-- Placeholder for Google Icon -->
                    <span class="google-icon">G</span> Sign in with Google
                </button>

            </form>

            <!-- Sign Up Link -->
            <p class="signup-prompt">
                Don't have an account? <a href="/signup" class="form-link signup-link">Sign up</a> <!-- Href is placeholder -->
            </p>

        </div> <!-- /.login-form-container -->

    </div> <!-- /.login-form-section -->

</div> <!-- /.login-page-container -->
```

## 5. CSS Requirements (Pseudocode / Class Definitions)

**Note:** Specific values for colors, fonts, and exact spacing units are placeholders and should be defined in theme/variable files later. Use CSS variables where appropriate.

```css
/* --- Variables (Placeholders) --- */
:root {
    --font-primary: 'Inter', sans-serif; /* Placeholder */
    --font-secondary: 'Nunito Sans', sans-serif; /* Placeholder */
    --color-primary: #4A90E2; /* Placeholder Blue */
    --color-secondary: #F5F5F5; /* Placeholder Light Gray */
    --color-text-primary: #333333; /* Placeholder Dark Gray */
    --color-text-secondary: #777777; /* Placeholder Medium Gray */
    --color-text-link: var(--color-primary);
    --color-background: #FFFFFF; /* Placeholder White */
    --color-border: #DDDDDD; /* Placeholder Light Border Gray */
    --spacing-unit: 8px; /* Base spacing unit */
}

/* --- General Layout --- */
.login-page-container {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-background); /* Or potentially a gradient/image */
}

.login-branding-section {
    flex: 1; /* Takes up space on desktop */
    /* Background image/color/illustration placeholder */
    /* Potentially hidden on mobile: display: none; below a certain breakpoint */
}

.login-form-section {
    flex: 1; /* Takes up space on desktop */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center content vertically */
    align-items: center; /* Center content horizontally */
    padding: calc(var(--spacing-unit) * 4); /* Example padding */
}

/* --- Logo --- */
.login-logo-container {
    margin-bottom: calc(var(--spacing-unit) * 4); /* Space below logo */
    /* Centered on mobile, top-left/top-center on desktop? Needs media query adjustment */
}

.login-logo {
    max-width: 150px; /* Example max width */
    height: auto;
}

/* --- Form Container --- */
.login-form-container {
    width: 100%;
    max-width: 400px; /* Max width for the form area */
    background-color: var(--color-background); /* Might be different if page bg is colored */
    padding: calc(var(--spacing-unit) * 3);
    border-radius: calc(var(--spacing-unit) * 1);
    /* Potential box-shadow on mobile/card view */
}

/* --- Typography --- */
.login-title {
    font-family: var(--font-primary);
    font-size: 2em; /* Example size */
    font-weight: 600; /* Example weight */
    color: var(--color-text-primary);
    text-align: center; /* Or left */
    margin-bottom: calc(var(--spacing-unit) * 1);
}

.login-subtitle {
    font-family: var(--font-secondary);
    font-size: 1em; /* Example size */
    color: var(--color-text-secondary);
    text-align: center; /* Or left */
    margin-bottom: calc(var(--spacing-unit) * 3);
}

/* --- Form Elements --- */
.login-form {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-unit) * 2); /* Space between form elements */
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-label {
    font-family: var(--font-secondary);
    font-size: 0.9em;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: calc(var(--spacing-unit) * 0.5);
}

.form-input {
    font-family: var(--font-secondary);
    padding: calc(var(--spacing-unit) * 1.5);
    border: 1px solid var(--color-border);
    border-radius: calc(var(--spacing-unit) * 0.5);
    font-size: 1em;
}

.form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary), 0.2); /* Example focus ring */
}

/* --- Form Options (Remember Me / Forgot Password) --- */
.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: calc(var(--spacing-unit) * 1);
    margin-bottom: calc(var(--spacing-unit) * 2);
}

.form-check {
    display: flex;
    align-items: center;
}

.form-checkbox {
    margin-right: calc(var(--spacing-unit) * 1);
    /* Custom checkbox styling might be needed */
}

.form-check-label {
    font-family: var(--font-secondary);
    font-size: 0.9em;
    color: var(--color-text-secondary);
}

.form-link {
    font-family: var(--font-secondary);
    font-size: 0.9em;
    color: var(--color-text-link);
    text-decoration: none;
}

.form-link:hover {
    text-decoration: underline;
}

/* --- Buttons --- */
.btn {
    padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2);
    border: none;
    border-radius: calc(var(--spacing-unit) * 0.5);
    font-family: var(--font-primary);
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.2s ease;
    display: flex; /* For icon alignment */
    align-items: center;
    justify-content: center;
    gap: calc(var(--spacing-unit) * 1); /* Space between icon and text */
}

.btn-primary {
    background-color: var(--color-primary);
    color: var(--color-background); /* White text */
}

.btn-primary:hover {
    background-color: darken(var(--color-primary), 10%); /* Darker shade on hover */
}

.btn-secondary {
    background-color: var(--color-background); /* White/Light background */
    color: var(--color-text-primary); /* Dark text */
    border: 1px solid var(--color-border);
}

.btn-secondary:hover {
    background-color: var(--color-secondary); /* Light gray on hover */
}

.google-icon {
    /* Style for Google 'G' icon placeholder */
    font-weight: bold; /* Example */
}

/* --- Sign Up Prompt --- */
.signup-prompt {
    font-family: var(--font-secondary);
    font-size: 0.9em;
    color: var(--color-text-secondary);
    text-align: center;
    margin-top: calc(var(--spacing-unit) * 3);
}

/* --- Responsiveness (Example Media Query) --- */
@media (max-width: 768px) { /* Example breakpoint */
    .login-page-container {
        flex-direction: column;
    }

    .login-branding-section {
        display: none; /* Hide branding section on smaller screens */
    }

    .login-form-section {
        flex: 1; /* Take full width */
        justify-content: flex-start; /* Align form to top */
        padding-top: calc(var(--spacing-unit) * 5); /* More padding top */
    }

    .login-form-container {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Add shadow for card effect */
        border: 1px solid var(--color-border); /* Optional border */
    }

    .login-logo-container {
        /* Ensure logo is centered if needed */
        align-self: center;
    }
}

```

## 6. TDD Anchors / Testing Considerations

-   **Component Tests:**
    -   Verify all form elements render correctly (labels, inputs, buttons, links).
    -   Test input validation (e.g., required fields, email format).
    -   Check checkbox state changes.
    -   Verify button click handlers are triggered (mock functions).
    -   Test link navigation (mock router/navigation).
-   **Visual Regression Tests:**
    -   Compare snapshots across different viewport sizes (desktop, mobile) to ensure layout consistency and responsiveness.
    -   Verify placeholder styles are applied correctly.
-   **Accessibility Tests:**
    -   Check for proper label associations (`for`/`id`).
    -   Ensure sufficient color contrast (once final colors are defined).
    -   Test keyboard navigation and focus states.

## 7. Future Considerations

-   Integration with actual authentication API.
-   Handling authentication errors (displaying messages to the user).
-   Implementing the actual Google Sign-In flow.
-   Replacing placeholders with final assets (logo) and styles (fonts, colors).
-   Adding more robust input validation.