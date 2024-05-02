# Healthcare-API

The Healthcare-API is a Node.js backend designed to support the Healthcare application. It handles and manages the questionnaire data efficiently, leveraging PostgreSQL for database management and Express.js for routing.

## Features

- **Questionnaire Management**: Supports operations to create and retrieve questionnaire entries.
- **Chronic Condition Details**: Handles special logic for chronic conditions by storing additional details in a separate table, optimizing data structure and retrieval.
- **Robust Validation**: Integrates Zod for request validation to ensure data integrity and consistency.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm (Node Package Manager)
- PostgreSQL database

### Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/SalehinSyed/healthcare-api
   ```

2. Install DependenciesNavigate to the project directory and install the required dependencies:
   ```bash
   cd healthcare-api
   ```
   ```bash
   npm install
   ```

3. Initialize the DatabaseMake sure PostgreSQL is running and execute the SQL scripts found in the /scripts directory to set up your database schema and tables.
    ```bash 
    npm run dev
    ```

### Running Tests

To run the predefined test suite, use:
  ```bash
  npm run test
  ```

This will execute tests defined in the tests directory, ensuring that all functionalities work as expected.

### Deployment

To prepare the application for deployment:

## Build the Project

```bash
npm run build
```

### Authors
Syed Salehin - Initial work






