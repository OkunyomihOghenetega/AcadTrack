\# AcadTrack — Transcript Request and Tracking Portal

AcadTrack is a student transcript request and tracking portal developed as a web development project. It provides a simple way for students to submit transcript requests and monitor their progress, while administrators can review requests and update their status.

## Features

### Student
- Register and log in using demo accounts.
- Submit new transcript requests.
- View submitted requests and track their status.
- View request details and progress history.
- Download a sample transcript PDF when a request is completed, where digital delivery is selected.

### Administrator
- View and search transcript requests.
- Filter requests by status.
- Review request details.
- Update request statuses and maintain a timeline of changes.
- Access sample transcript PDF downloads for completed requests.

## Technology Stack

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- JSON Server
- html2pdf.js

## Running the Project Locally

### Requirements
- Node.js and npm installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/OkunyomihOghenetega/AcadTrack.git
cd AcadTrack
npm install
```

### Start the backend

In the first terminal, run:

```bash
npm run server
```

The JSON Server API runs locally at `http://localhost:3001`.

### Start the frontend

In a second terminal, run:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

Keep both terminals running while using the application.

## Demo Accounts

The project includes demo accounts for testing. The credentials are provided within the application code.

Use fictional data when testing. Do not use real student records or personal passwords.

## Project Limitations

AcadTrack is a prototype for demonstration and learning purposes.

- It uses JSON Server and a local JSON data file rather than a production database.
- Authentication is intended for demonstration and is not production-secure.
- Transcript PDFs contain sample academic data and are not official university transcripts.
- The project is not connected to a university's actual academic records system.

## Future Improvements

- Integrate a persistent hosted database.
- Implement secure authentication and role-based authorization.
- Improve data validation and error handling.
- Integrate an authorized academic records system where appropriate.

## Author

Developed as a student web development project.
