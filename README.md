# Automation Server Backup

This Node.js application performs automatic backups for both FTP files and MySQL database with Cron Job. 

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20 or higher)
- MySQL (or compatible database system)
- FTP server (optional, for FTP backups)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Environment configuration

Copy the `.env.example` file and rename it as `.env`. Make sure to configure the `.env` file with the necessary settings.

### 3. Install Dependencies

Install all the required dependencies for the project:

```bash
npm install
```

### 4. Start the project

```bash
npm run start
```

