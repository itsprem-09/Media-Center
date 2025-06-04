# Media Center Project Documentation

## 1. Introduction

### Project Overview
The Media Center is a full-stack web application designed for managing and showcasing various types of media content, including articles, videos, and photo galleries. It features a public-facing interface for users to consume content and a comprehensive admin panel for content creators and administrators to manage the platform.

### Purpose and Goals
- To provide a centralized platform for publishing and organizing diverse media content.
- To offer a user-friendly experience for both content consumers and administrators.
- To enable rich content creation with features like a WYSIWYG editor for articles.
- To ensure secure and role-based access to administrative functionalities.
- To allow for easy searching and discovery of content.

### Key Features
- **Content Management:** CRUD (Create, Read, Update, Delete) operations for articles, videos, and galleries.
- **Rich Text Editor:** WYSIWYG editor for creating and formatting article content (powered by Draft.js and react-draft-wysiwyg).
- **Media Uploads:** Image and video uploads, integrated with Cloudinary for cloud-based storage.
- **User Authentication:** JWT-based authentication for secure login and registration.
- **Admin Panel:** A dedicated interface for managing all aspects of the application, including content, users (implicitly through admin roles), and API documentation viewing.
- **Search Functionality:** Users can search across different content types.
- **Categorization and Tagging:** Content can be organized with categories and tags for better discoverability.
- **Responsive Design:** The application is designed to work across various devices.
- **API Documentation:** In-app API documentation for developers and administrators.

## 2. Project Setup

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js:** (LTS version recommended)
- **npm** (Node Package Manager) or **yarn**
- **MongoDB:** A running instance of MongoDB (local or cloud-hosted like MongoDB Atlas).

### Repository Structure
The project is organized into two main directories:
- `frontend/`: Contains the React-based frontend application.
- [backend/](cci:7://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend:0:0-0:0): Contains the Node.js/Express.js backend API.

## 3. Backend Architecture

### Overview

The backend of the Media Center application is built using Node.js and Express.js, with MongoDB as the database and Mongoose as the ODM (Object Data Modeling) library. It follows a typical MVC-like pattern with routes, controllers, and models.

-   **Technology Stack:**
    -   **Node.js:** JavaScript runtime environment.
    -   **Express.js:** Web application framework for Node.js.
    -   **MongoDB:** NoSQL document database.
    -   **Mongoose:** ODM library for MongoDB and Node.js.
    -   **JWT (JSON Web Tokens):** For securing API endpoints and managing user authentication.
    -   **Cloudinary:** Cloud-based service for image and video management.
    -   **Multer:** Middleware for handling `multipart/form-data`, used for file uploads.
    -   **bcrypt:** Library for hashing passwords.
    -   **dotenv:** For managing environment variables.
    -   **cors:** Middleware for enabling Cross-Origin Resource Sharing.

-   **Directory Structure (Key Directories):**
    -   `routes/`: Contains route definitions for different API resources (e.g., `article.routes.js`, `auth.routes.js`).
    -   `controllers/`: Contains the business logic for handling requests (e.g., `article.controller.js`).
    -   `models/`: Defines Mongoose schemas for database collections (e.g., [Article.js](cci:7://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend/models/Article.js:0:0-0:0), [User.js](cci:7://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend/models/User.js:0:0-0:0)).
    -   `middleware/`: Contains custom middleware functions, such as authentication checks (e.g., `auth.middleware.js` - assumed).
    -   `config/`: Likely for configuration files (e.g., database connection, Cloudinary setup - assumed).
    -   `scripts/`: Contains utility scripts, like `create-admin.js`.
    -   [server.js](cci:7://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend/server.js:0:0-0:0): The main entry point for the backend application.

### API Endpoints

The backend exposes a RESTful API. The API documentation (largely based on the content from `frontend/src/admin/AdminDocs.js`) provides detailed information about each endpoint.

-   **Base URL:** All API requests are prefixed with `/api`. For example, `http://localhost:5000/api`.

-   **Authentication Endpoints (`/api/auth`)**
    -   `POST /login`: Authenticates a user and returns a JWT token.
        -   Request Body: `{ "email": "user@example.com", "password": "password123" }`
        -   Response: JWT token and user object.
    -   `POST /register`: Registers a new user.
        -   Request Body: `{ "name": "New User", "email": "user@example.com", "password": "password123" }`
        -   Response: JWT token and user object.
    -   `GET /user`: Retrieves the currently authenticated user's details (requires JWT).

-   **Articles API (`/api/articles`)**
    -   `GET /`: Get all articles (public, supports pagination, category, and tag filtering).
    -   `GET /id/:id`: Get a specific article by its ID (Admin Only).
    -   `GET /:slug`: Get a specific article by its slug (public).
    -   `POST /`: Create a new article (Admin Only).
        -   Request Body: JSON object with article details, including `title`, `content` (HTML), `rawContent` (Draft.js), `author`, `category`, `tags`, and optional `imageData`, `videoData`.
    -   `PUT /:id`: Update an existing article (Admin Only).
    -   `DELETE /:id`: Delete an article (Admin Only).

-   **Videos API (`/api/videos`)**
    -   `GET /`: Get all videos (public, supports pagination and category filtering).
    -   `GET /:id`: Get a specific video by ID (public).
    -   `POST /`: Create a new video (Admin Only).
        -   Request Body: JSON object with video details, including `title`, `description`, `category`, `videoUrl`, `thumbnailUrl`.
    -   `PUT /:id`: Update an existing video (Admin Only).
    -   `DELETE /:id`: Delete a video (Admin Only).

-   **Galleries API (`/api/galleries`)**
    -   `GET /`: Get all galleries (public, supports pagination and category filtering).
    -   `GET /:id`: Get a specific gallery by ID (public).
    -   `POST /`: Create a new gallery (Admin Only).
        -   Request Body: JSON object with gallery details, including `title`, `description`, `category`, `images` array.
    -   `PUT /:id`: Update an existing gallery (Admin Only).
    -   `DELETE /:id`: Delete a gallery (Admin Only).
    -   `POST /:id/images`: Add an image to an existing gallery (Admin Only).
    -   `DELETE /:id/images/:imageId`: Remove an image from a gallery (Admin Only).

-   **Media Upload API (`/api/upload`)** (Admin Only)
    -   `POST /image`: Uploads an image file. Expects `multipart/form-data` with an 'image' field. Returns URL and public_id of the uploaded image.
    -   `POST /video`: Uploads a video file. Expects `multipart/form-data` with a 'video' field. Returns URL and public_id of the uploaded video.

-   **Search API (`/api/search`)**
    -   `GET /`: Searches content across articles, videos, and galleries.
        -   Query Parameters: `query` (required search term), `type` (optional: articles, videos, galleries).

-   **Error Handling:**
    The API uses standard HTTP status codes to indicate success or failure. Error responses typically include a JSON object with a `message` field detailing the error.
    -   Common Status Codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error).

### Database

MongoDB is used as the database, with Mongoose schemas defining the structure of the collections.

-   **`User` Model ([models/User.js](cci:7://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend/models/User.js:0:0-0:0))**
    -   `email`: (String, required, unique, lowercase) - User's email address.
    -   `password`: (String, required) - Hashed password.
    -   `name`: (String, required) - User's name.
    -   `role`: (String, enum: ['admin', 'editor'], default: 'editor') - User's role.
    -   `createdAt`: (Date, default: Date.now) - Timestamp of user creation.
    -   *Middleware*: Hashes password before saving using `bcrypt`.
    -   *Methods*: [comparePassword(candidatePassword)](cci:1://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend/models/User.js:43:0-46:2) for password verification.

-   **`Article` Model ([models/Article.js](cci:7://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend/models/Article.js:0:0-0:0))**
    -   `title`: (String, required, trim) - Article title.
    -   `slug`: (String, required, unique, trim) - URL-friendly slug.
    -   `content`: (String, required) - HTML content from the rich text editor.
    -   `rawContent`: (String) - Raw Draft.js content state (as per memory, though not explicitly in schema, it's handled by controller).
    -   `author`: (String, required) - Author's name.
    -   `category`: (String, required) - Article category.
    -   `tags`: (Array of Strings, trim) - Tags associated with the article.
    -   `image`: (String) - URL of the featured image.
    -   `image_public_id`: (String, default: null) - Cloudinary public ID for the image.
    -   `video`: (String) - URL of the featured video.
    -   `video_public_id`: (String, default: null) - Cloudinary public ID for the video.
    -   `createdAt`: (Date, default: Date.now) - Timestamp of creation.
    -   `updatedAt`: (Date, default: Date.now) - Timestamp of last update.
    -   *Middleware*: Updates `updatedAt` timestamp before saving.

-   **`Video` Model ([models/Video.js](cci:7://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend/models/Video.js:0:0-0:0))**
    -   `title`: (String, required, trim) - Video title.
    -   `videoUrl`: (String, required) - URL of the video file.
    -   `video_public_id`: (String, default: null) - Cloudinary public ID for the video.
    -   `thumbnail`: (String) - URL of the video thumbnail.
    -   `thumbnail_public_id`: (String, default: null) - Cloudinary public ID for the thumbnail.
    -   `description`: (String, required) - Video description.
    -   `createdAt`: (Date, default: Date.now) - Timestamp of creation.
    -   `updatedAt`: (Date, default: Date.now) - Timestamp of last update.
    -   *Middleware*: Updates `updatedAt` timestamp before saving.

-   **`Gallery` Model ([models/Gallery.js](cci:7://file:///c:/DU-PROGRAMS/WEB%20TECHNOLOGY/Media%20Center/backend/models/Gallery.js:0:0-0:0))**
    -   `title`: (String, required, trim) - Gallery title.
    -   `images`: (Array of Objects) - List of images in the gallery.
        -   `url`: (String, required) - URL of the image.
        -   `public_id`: (String, default: null) - Cloudinary public ID for the image.
        -   `caption`: (String, default: '') - Image caption.
    -   `createdAt`: (Date, default: Date.now) - Timestamp of creation.
    -   `updatedAt`: (Date, default: Date.now) - Timestamp of last update.
    -   *Middleware*: Updates `updatedAt` timestamp before saving.

### Authentication & Authorization

-   **JWT Strategy:** User authentication is managed using JSON Web Tokens. Upon successful login or registration, a JWT is generated and sent to the client. This token must be included in the `Authorization` header (as a Bearer token) for subsequent requests to protected endpoints.
-   **Protected Routes:** Middleware functions (e.g., `authMiddleware.js`, `adminMiddleware.js` - assumed names) are used to protect routes. These middlewares verify the JWT and can also check user roles (e.g., ensuring only users with an 'admin' role can access certain admin-only endpoints).

### Cloudinary Integration

Cloudinary is used for storing and managing uploaded images and videos.
-   When media is uploaded via the `/api/upload` endpoints, files are sent to Cloudinary.
-   Cloudinary returns a secure URL and a `public_id` for each uploaded asset. These are stored in the respective MongoDB documents (Article, Video, Gallery).
-   The `public_id` is crucial for managing the assets on Cloudinary, such as deleting them when the corresponding content is removed from the Media Center.
-   Configuration for Cloudinary (cloud name, API key, API secret) is managed through environment variables.
## 4. Frontend Architecture

### Overview

The frontend of the Media Center application is a single-page application (SPA) built using React. It provides a dynamic and responsive user interface for both public content consumption and administrative tasks.

-   **Technology Stack:**
    -   **React:** A JavaScript library for building user interfaces.
    -   **React Router DOM (`react-router-dom`):** For client-side routing and navigation.
    -   **Axios:** Promise-based HTTP client for making API requests to the backend.
    -   **Styled Components:** For CSS-in-JS styling, allowing for component-scoped styles.
    -   **Material-UI (`@mui/material`, `@mui/icons-material`):** A popular React UI framework providing pre-built components and styling utilities.
    -   **Draft.js & React Draft Wysiwyg:** For the rich text editor used in article creation and editing.
    -   **`react-markdown`:** To render Markdown content (used in Admin Docs).
    -   **`date-fns`:** For date formatting and manipulation.
    -   **Create React App:** Used to bootstrap the project, providing a standard setup for React development (includes `react-scripts`).

-   **Directory Structure (Key Directories within `frontend/src/`):**
    -   `pages/`: Contains top-level components representing different pages of the public-facing site (e.g., `HomePage.js`, `ArticlePage.js`, `Login.js`).
    -   `admin/`: Contains components and pages specific to the admin panel.
        -   `admin/pages/`: Admin-specific views like `AdminArticlePage.js`, `ArticlesList.js`.
        -   `admin/components/`: Reusable UI elements for the admin panel (e.g., `AdminLayout.js`).
        -   `AdminDashboard.js`, `AdminDocs.js`.
    -   `components/`: Contains reusable UI components shared across the application (e.g., `Header.js`, `Footer.js`, `ProtectedRoute.js`, `ArticleCard.js`).
    -   `context/`: Holds React Context API implementations, such as `AuthContext.js` for managing global authentication state.
    -   `services/`: Likely contains modules for API interactions (e.g., `api.js` or specific service files like `articleService.js` - structure assumed).
    -   `assets/`: For static assets like images, logos, etc. (if any not directly linked).
    -   `App.js`: The main application component, responsible for setting up routing.
    -   `index.js`: The entry point for the React application, renders the `App` component.
    -   `App.css`: Global application-level styles.
    -   `index.css`: Base global styles, including font imports and resets.

### Routing

Client-side routing is managed by `react-router-dom`. Routes are defined in `App.js`.

-   **Public Routes:** Accessible to all users.
    -   `/`: Home Page (`HomePage`)
    -   `/article/:slug`: Single Article Page (`ArticlePage`)
    -   `/gallery/:id`: Single Gallery Page (`GalleryPage`)
    -   `/video/:id`: Single Video Page (`VideoPage`)
    -   `/category/:category`: Category Archive Page (`CategoryPage`)
    -   `/login`: Login Page (`Login`)
    -   `/register`: Registration Page (`Register`)
    -   `/search`: Search Results Page (`SearchResults`)
-   **Admin (Protected) Routes:** Require authentication and often admin privileges. These routes typically use the `ProtectedRoute` component to enforce access control.
    -   `/admin/dashboard`: Admin Dashboard (`AdminDashboard`)
    -   `/admin/articles`: List of articles in admin panel (`ArticlesList`)
    -   `/admin/articles/new`: Create new article form (`AdminArticlePage`)
    -   `/admin/articles/edit/:id`: Edit article form (`AdminArticlePage`)
    -   `/admin/galleries`: List of galleries (`GalleriesList`)
    -   `/admin/galleries/new`: Create new gallery form (`AdminGalleryPage`)
    -   `/admin/galleries/edit/:id`: Edit gallery form (`AdminGalleryPage`)
    -   `/admin/videos`: List of videos (`VideosList`)
    -   `/admin/videos/new`: Create new video form (`AdminVideoPage`)
    -   `/admin/videos/edit/:id`: Edit video form (`AdminVideoPage`)
    -   `/admin/docs`: API Documentation and Admin Guide (`AdminDocs`)

### State Management

-   **React Context API (`AuthContext`):**
    -   Located in `context/AuthContext.js`.
    -   Manages global authentication state, including the user object and JWT token.
    -   Provides functions for login, logout, and potentially user registration state updates.
    -   Wraps the application in `App.js` (via `<AuthProvider>`) to make auth state available to all components.
-   **Component-Level State:** React's built-in `useState` and `useEffect` hooks are used for managing local component state (e.g., form inputs, loading states, fetched data within specific components).

### Key Components & Pages

-   **Public-Facing:**
    -   `HomePage`: Displays a collection of recent or featured content.
    -   `ArticlePage`, `GalleryPage`, `VideoPage`: Display individual content items.
    -   `Header`, `Footer`, `Navbar`: Common layout elements.
    -   `ArticleCard`, `VideoCard`, `GalleryCard`: Reusable components for displaying content previews.
-   **Admin Panel:**
    -   `AdminLayout`: Provides the common structure for admin pages (sidebar, top bar).
    -   `AdminDashboard`: Overview page for administrators.
    -   `ArticlesList`, `GalleriesList`, `VideosList`: Display tables or lists of content items with management actions.
    -   `AdminArticlePage`, `AdminGalleryPage`, `AdminVideoPage`: Forms for creating and editing content, including the rich text editor for articles.
    -   `AdminDocs`: Displays API documentation and the admin usage guide.
-   **Shared:**
    -   `ProtectedRoute`: A higher-order component or wrapper that checks authentication status (and potentially user role) before rendering a protected route. Redirects to login if access is denied.

### Styling

-   **Global Styles:**
    -   `index.css`: Contains base styles, CSS resets, and global font imports (GFS Didot from Google Fonts).
    -   `App.css`: Contains application-wide styles and layout rules.
    -   The primary font for the application is "GFS Didot", with a generic `serif` fallback.
-   **Styled Components:** Used extensively for creating components with encapsulated styles. This allows for dynamic styling based on props and a more modular approach to CSS.
-   **Material-UI:** Provides a set of pre-designed React components (like `Paper`, `Tabs`, `Table`, `Accordion`, `Icons`) that come with their own styling, which can be customized using Material-UI's theming capabilities or overridden with styled-components/CSS.

### API Integration

-   **Axios:** The `axios` library is used for making HTTP requests to the backend API.
-   **Service Layer (Assumed):** While not explicitly detailed in provided files, a common practice is to have a `services/` directory containing modules that encapsulate API calls (e.g., `articleService.js` with functions like `getAllArticles()`, `createArticle(data)`). These services would handle request configuration, error handling, and data transformation.
-   **Authentication Token:** For requests to protected backend endpoints, the JWT token (stored via `AuthContext`) is retrieved and included in the `Authorization` header of API requests (e.g., `Authorization: Bearer <token>`).

4.  **Running the Frontend Development Server:**
    ```bash
    npm start
    ```
    This will start the React development server, usually on `http://localhost:3000`, and open the application in your default web browser. The page will automatically reload if you make edits.