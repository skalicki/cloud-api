# Cloud Storage Service

A simple cloud storage service built with [NestJS](https://nestjs.com/) for private use.

---

## Project Structure

```
📁 src/
├── 📄 app.module.ts                 # Main module
├── 📄 main.ts                       # Application entry point
└── 📁 file/
    ├── 📄 file.controller.spec.ts   # Unit tests for the FileController
    ├── 📄 file.controller.ts        # FileController for handling file uploads
    └── 📄 file.module.ts            # FileModule for encapsulating file-related logic
📁 test/
    └── 📁 file/ 
    ├── 📄 file.feature # Cucumber feature file describing test scenarios 
    ├── 📄 file.steps.ts # Step definitions for Cucumber tests 
    └── 📁 uploads/ # Folder containing the files used for testing file uploads 
        └── 📄 example.txt # Example file used for upload tests
...
```

## Environment Configuration

Create a `.env` file in the root directory of your project with the following example settings:

```plaintext
# .env

# Application Environment
NODE_ENV=development
PORT=3000

# Database Configuration
DB_TYPE=postgres # postgres mysql sqlite
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase

# Security & JWT (optional)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=3600s

# File Uploads
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ENABLED=true