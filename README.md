# AcadTrack — Transcript Request and Tracking Portal

AcadTrack is a web-based transcript request and tracking portal developed as a student web development project. It provides a platform where students can submit transcript requests and monitor their progress, while administrators can review requests and manage their processing status.

## Live Application

**Frontend:** https://acad-track-three.vercel.app/

**Backend API:** https://acadtrack-api.onrender.com/

## Features

### Student

- Register and log in using demo accounts.
- Submit new transcript requests.
- View submitted requests and track their status.
- View request details and progress history.
- Download a sample transcript PDF when a request is completed and digital delivery is selected.

### Administrator

- View and search transcript requests.
- Filter requests by status.
- Review request details.
- Update request statuses and maintain a timeline of changes.
- Access sample transcript PDF downloads for completed requests.

## Technology Stack

- **React 19** – Frontend user interface.
- **Vite** – Development server and build tool.
- **React Router** – Application navigation.
- **Tailwind CSS 4** – Interface styling.
- **Axios** – Communication with the backend API.
- **JSON Server** – Backend API and data management.
- **html2pdf.js** – PDF generation.
- **Vercel** – Frontend hosting.
- **Render** – Backend hosting.

## Running the Project Locally

### Requirements

- Node.js and npm installed.
- Git installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/OkunyomihOghenetega/AcadTrack.git
cd AcadTrack
npm install
```

### Start the Backend

In the first terminal, run:

```bash
npm run server
```

The local JSON Server API runs at:

`http://localhost:3001`

### Start the Frontend

In a second terminal, run:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

`http://localhost:5173`

Keep both terminals running while using the application.

**Note:** The deployed frontend is configured to use the hosted Render API. For local testing against your local JSON Server, change the API base URL in `src/api.js` to `http://localhost:3001`.

## Demo Accounts

The project includes demonstration accounts for testing student and administrator functionality. The available demo credentials are provided within the application code.

Use fictional information when testing. Do not use real student records or personal passwords.

## Data Storage

AcadTrack uses JSON Server with a `db.json` file containing the account and transcript request data.

The backend API is hosted separately from the frontend on Render.

## Project Limitations

AcadTrack is a prototype developed for demonstration and learning purposes.

- It uses JSON Server and a JSON data file rather than a production database.
- Authentication is intended for demonstration and is not production-secure.
- Transcript PDFs contain sample academic data and are not official university transcripts.
- The project is not connected to an actual university academic records system.
- The free hosting configuration may have service availability and data persistence limitations.

## Future Improvements

- Integrate a persistent production database.
- Implement secure authentication and role-based authorization.
- Improve data validation and error handling.
- Add notifications for transcript request status changes.
- Integrate an authorized academic records system where appropriate.

## Source Code

GitHub Repository:

https://github.com/OkunyomihOghenetega/AcadTrack

## Author

**OKUNYOMIH OGHENETEGA**

Developed as a student web development project.