# Ops-Assist AI – Intelligent Incident Management Platform

## Overview
Ops-Assist AI is an intelligent incident management platform designed to streamline the process of incident reporting, tracking, and analytics. The platform leverages AI to assist in classifying incidents and suggesting appropriate actions, enhancing operational efficiency.

## Project Structure
This project follows a monorepo structure with separate applications for the backend and frontend:

```
ops-assist-ai
├── apps
│   ├── backend          # FastAPI backend application
│   └── frontend         # Next.js frontend application
├── packages
│   └── shared           # Shared types and interfaces
├── package.json         # Root package configuration
└── README.md            # Project documentation
```

## Technologies Used
- **Backend**: FastAPI, SQLAlchemy
- **Frontend**: Next.js, TypeScript
- **AI Services**: Custom AI logic for incident classification

## Getting Started

### Prerequisites
- Python 3.7+
- Node.js 14+
- PostgreSQL (or any other database of your choice)

### Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd ops-assist-ai
   ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```
     cd apps/backend
     ```
   - Install the required Python packages:
     ```
     pip install -r requirements.txt
     ```
   - Set up your database and update the configuration in `src/config.py`.

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```
     cd ../frontend
     ```
   - Install the required Node.js packages:
     ```
     npm install
     ```

### Running the Applications

- **Start the Backend**
  ```
  cd apps/backend
  uvicorn src.main:app --reload
  ```

- **Start the Frontend**
  ```
  cd apps/frontend
  npm run dev
  ```

### API Documentation
The backend API is built using FastAPI, and you can access the interactive API documentation at `http://localhost:8000/docs` once the backend is running.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.# Ops-Assist-AI
