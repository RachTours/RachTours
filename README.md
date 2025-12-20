# RachTours - Premium Reservation System

This is the production-ready source code for the RachTours website, featuring a secure NodeJS backend and a polished frontend.

## 🚀 Getting Started

### 1. Installation

Navigate to this folder and install the dependencies:

```bash
npm install
```

### 2. Configuration

Create a `.env` file in the root directory (or use the one provided) and ensure it has your WhatsApp API credentials:

```env
# Server Config
PORT=3000
NODE_ENV=production

# WhatsApp API Credentials
ACCESS_TOKEN=your_access_token_here
PHONE_NUMBER_ID=your_phone_id_here
RECIPIENT_PHONE=your_personal_phone_here
```

### 3. Running the Server

To start the application:

```bash
npm start
```

Open your browser at `http://localhost:3000`.

## 📦 Deployment to GitHub

This folder is already initialized as a Git repository. To upload it to GitHub:

1. Create a new empty repository on GitHub.
2. Run the following commands in your terminal (inside this folder):

```bash
git add .
git commit -m "Initial commit of optimized RachTours codebase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## 🔒 Security Features

- **Strict Headers**: Helmet is configured with Content Security Policy (CSP).
- **Sanitization**: All inputs are validated and sanitized to prevent XSS.
- **HTTPS Enforcement**: Automatic redirection in production environments.
- **Clean Code**: Unused scripts and styles have been stripped for performance.
