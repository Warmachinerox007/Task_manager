# Team Task Manager

**Live Demo (Railway):** [https://task-manager-production.up.railway.app](https://task-manager-production.up.railway.app) *(Replace with actual Railway URL)*

A full-stack, single-service Team Task Manager built with Django, Django REST Framework, and React (Vite). The application uses PostgreSQL for the database and is designed to be deployed directly to Railway.

## Tech Stack
- **Frontend**: React, Vite, React Router, Vanilla CSS
- **Backend**: Python 3.11, Django 4.2, DRF, SimpleJWT
- **Database**: PostgreSQL
- **Static Files**: Whitenoise (serves the React SPA from Django)
- **Deployment**: Railway

## Demo Accounts
You can test the application using the following demo accounts (seeded automatically during deployment):

- **Admin Account:** `admin@demo.com` / `demo1234`
- **Member Account:** `member@demo.com` / `demo1234`

## Features
- JWT Authentication (SimpleJWT)
- Role-based Access Control (Admin vs Member)
- Kanban board style task management
- Dynamic Dashboard with statistics
- Premium, rich CSS aesthetic with micro-animations

## Local Development Setup

If you want to run this project locally, ensure you have PostgreSQL installed.

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Backend Setup:**
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # Or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Create a `.env` file in `backend/` with:
   ```env
   SECRET_KEY=your_local_secret_key
   DEBUG=True
   DB_NAME=taskdb
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

5. **Database Setup & Run:**
   ```bash
   python manage.py collectstatic --noinput
   python manage.py migrate
   python manage.py seed
   python manage.py runserver
   ```
   Access the app at `http://localhost:8000/`.
