# WhisperNetDB

**WhisperNetDB** is the backend database for the WhisperNet system, providing both an HTTP server and a WebSocket server to facilitate all data transfers and data management.

## Features

- **HTTP Server**: Handles standard RESTful API requests for data management.
- **WebSocket Server**: Provides real-time communication for data streaming and updates.
- **Data Management**: Efficient handling of data storage, retrieval, and transfer.

## Installation

To get started with WhisperNetDB, follow the instructions below:

### 1. Clone the Repository

```bash
git clone https://github.com/skizzy-create/WhisperNetDB.git
cd WhisperNetDB
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configuration

Ensure your environment is configured correctly by setting up the necessary environment variables in a `.env` file. Refer to the `.env.example` for available configurations.

## Running the Server

### Start the HTTP and WebSocket Server

```bash
npm start
```

This will start both the HTTP server and WebSocket server for managing and transferring data.

---

## Testing

We use various testing scripts to ensure everything runs smoothly. You can run the tests in different modes:

### Run All Tests

```bash
npm test
```

This will execute all the tests once.

### Run Tests in Watch Mode

```bash
npm run test:watch
```

This will keep running the tests continuously, watching for any changes in the code.

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

This will run the tests and generate a code coverage report, helping you track how much of the code is covered by tests.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
