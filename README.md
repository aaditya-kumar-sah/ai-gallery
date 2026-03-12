# AI Gallery App

The Idea was as people face truble to find a specific image in their photos app among hunderades and thousends of images so we thought to make a app that can help people to find their images easily by descriptions of the uploaded image and then programe wil search through whole phots gallery and pin point the image which was described by the user. But for that we have to pass every image in the gallery of your photos app through AI to detect which can be more costly for now the solution is as soon as the photo is uploaded the program will generate a prompt of that image and store it in the database and when the user will search for a image it will search through the prompts of the images and give the desired image unless we figure out any better way. 

This is a full-stack MERN application that allows users to upload images, automatically generates AI-powered descriptions for the uploaded images, and allows managing (deleting) the photos. 

## Project Structure

This repository is organized into two main directories:

- **`frontend/`**: The client-side application built with React and Vite.
- **`backend/`**: The server-side code built with Node.js, Express, and MongoDB.

## Demo Video

You can find a demonstration of the application below:

![Demo Video](./Demo/DEMO.gif)

## Features

- **Image Upload:** Users can upload images to the gallery.
- **AI Description Generation:** Automatically generates contextual descriptions for uploaded images utilizing AI.
- **Image Deletion:** Users can safely remove images from the gallery.

## Prerequisites

- [Node.js](https://nodejs.org/en/) installed.
- Access to a MongoDB database (local or MongoDB Atlas).
- AI API Key (e.g., Google Gemini / OpenAI) based on what the backend uses.

## Setup Instructions

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the necessary variables:
```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
# Add your AI service API key and any other required keys here
```

Start the backend server:
```bash
npm start
# or npm run dev if you are using nodemon
```
The backend server typically runs on `http://localhost:5000` (or whatever `PORT` you defined).

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend application will start and can generally be accessed at `http://localhost:5173`.

## Technologies Used
- **Frontend:** React, Vite, CSS/Tailwind (depending on setup).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB, Mongoose.
- **Other:** AI APIs for descriptive features, Multer (or similar) for file uploads.
# ai-gallery
