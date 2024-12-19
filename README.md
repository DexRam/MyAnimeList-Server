# My Anime List Server

This is a server built with Hyper Express for managing anime list. It provides an API for users to track, rate, and review anime.

## Features

- User registration & authorization
- Token-based authentication
- Watchlist management

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DexRam/MyAnimeList-Server
   cd MyAnimeList-Server
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the settings:

   a. Go to src - dbConnector
   b. Configure settings if needed
   c. Go to src - middleware
   d. Configure security settings if needed
   e. Go to the root folder
   f. Set up your secred key in .env

4. Run the development server:

   ```bash
   npx ts-node src/server.ts
   ```

5. You can navigate to /docs to see the Swagger UI or to /docs-json to see the JSON specification

## Endpoints

### Registration & Authorization

#### Register

- **URL:** `/register/`
- **Method:** `POST`

#### Login

- **URL:** `/login/`
- **Method:** `POST`

### Watchlist Management

<!-- There will be details -->

## Contributing

1. Fork the repository
2. Create a new branch (git checkout -b feature-branch)
3. Commit your changes (git commit -am 'Add new feature')
4. Push to the branch (git push origin feature-branch)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
Feel free to customize it according to your project's specific details and requirements.
