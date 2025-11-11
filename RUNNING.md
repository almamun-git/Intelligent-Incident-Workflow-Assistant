# Running Ops-Assist AI

Complete guide to run and test the Ops-Assist AI project.

## Prerequisites

Before running the project, ensure you have:

- ✅ Python 3.11+ installed
- ✅ Node.js 18+ and npm installed
- ✅ PostgreSQL 15 installed and running
- ✅ Database `ops_assist_ai` created

## Quick Start

### 1. Start Backend Server

```bash
# Navigate to backend directory
cd apps/backend

# Activate virtual environment
source venv/bin/activate

# Start the FastAPI server
uvicorn src.main:app --reload --port 8000
```

**Backend will be available at:**
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

### 2. Start Frontend Server

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd apps/frontend

# Start the Next.js development server
npm run dev
```

**Frontend will be available at:**
- Dashboard: http://localhost:3000
- Incidents: http://localhost:3000/incidents
- Analytics: http://localhost:3000/analytics

---

## Testing the System

### Method 1: Using the Test Script (Recommended)

With both backend and frontend running:

```bash
cd apps/backend
./test_api.sh
```

This script will:
1. Test the health endpoint
2. Send INFO events (should NOT create incident)
3. Send 5 ERROR events (should trigger incident detection)
4. Display created incidents with AI analysis
5. Show incident details with recommended actions

### Method 2: Using the Python Demo Script

```bash
cd apps/backend
venv/bin/python test_demo.py
```

### Method 3: Manual Testing with curl

**Test Health Endpoint:**
```bash
curl http://localhost:8000/health
```

**Send an Event:**
```bash
curl -X POST http://localhost:8000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "service": "payment-service",
    "level": "ERROR",
    "message": "Database connection timeout"
  }'
```

**List All Incidents:**
```bash
curl http://localhost:8000/api/v1/incidents
```

**Get Incident Details:**
```bash
curl http://localhost:8000/api/v1/incidents/1
```

**Update Incident Status:**
```bash
curl -X PATCH http://localhost:8000/api/v1/incidents/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "investigating"}'
```

### Method 4: Using the API Documentation

1. Open http://localhost:8000/docs in your browser
2. Try out the endpoints interactively
3. See request/response schemas
4. Test authentication if implemented

---

## Testing Incident Detection

To test automatic incident detection, you need to send **5 ERROR events within 5 minutes**:

```bash
# Send 5 ERROR events
for i in {1..5}; do
  curl -X POST http://localhost:8000/api/v1/events \
    -H "Content-Type: application/json" \
    -d "{\"service\":\"test-service\",\"level\":\"ERROR\",\"message\":\"Error #$i: Database connection failed\"}"
  echo "Sent error $i"
  sleep 1
done

# Check if incident was created
curl http://localhost:8000/api/v1/incidents
```

**Expected Result:**
- An incident should be created
- AI analysis should automatically classify it
- Incident should have category, severity (P1/P2/P3), and recommended actions

---

## Viewing in the Frontend

1. **Dashboard**: http://localhost:3000
   - View total incidents, open, investigating, resolved counts
   - See recent incidents in a table
   - Auto-refreshes every 10 seconds

2. **Incidents List**: http://localhost:3000/incidents
   - Filter by status (all, open, investigating, resolved, closed)
   - Click on any incident to view details

3. **Incident Detail**: http://localhost:3000/incidents/[id]
   - View full incident information
   - See AI-powered recommendations
   - Update incident status with buttons
   - View all related events with timestamps

---

## Development Workflow

### Running Both Servers Simultaneously

**Option 1: Using two terminal windows**
```bash
# Terminal 1: Backend
cd apps/backend && venv/bin/uvicorn src.main:app --reload --port 8000

# Terminal 2: Frontend
cd apps/frontend && npm run dev
```

**Option 2: Using background processes**
```bash
# Start backend in background
cd apps/backend && venv/bin/uvicorn src.main:app --port 8000 > backend.log 2>&1 &

# Start frontend in background
cd apps/frontend && npm run dev > frontend.log 2>&1 &

# To stop them later:
pkill -f uvicorn
pkill -f "next dev"
```

**Option 3: Using tmux or screen (Advanced)**
```bash
# Create tmux session with two panes
tmux new-session \; \
  send-keys 'cd apps/backend && venv/bin/uvicorn src.main:app --reload --port 8000' C-m \; \
  split-window -h \; \
  send-keys 'cd apps/frontend && npm run dev' C-m
```

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn src.main:app --reload --port 8001
```

**Database connection errors:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if not running
brew services start postgresql@15

# Test database connection
psql -U apu -d ops_assist_ai -c "SELECT 1"
```

**Missing Python packages:**
```bash
cd apps/backend
venv/bin/pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Cannot connect to backend:**
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` environment variable
- Default is `http://localhost:8000`

**Missing node_modules:**
```bash
# Install dependencies from root (monorepo)
npm install

# Or install frontend specific
cd apps/frontend && npm install
```

---

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://apu@localhost:5432/ops_assist_ai
OPENAI_API_KEY=your-openai-api-key-here
INCIDENT_THRESHOLD=5
INCIDENT_TIME_WINDOW=300
```

### Frontend (.env.local) - Optional
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Checking Logs

### Backend Logs
Backend logs appear in the terminal where you ran uvicorn:
- SQLAlchemy queries
- Request/response information
- Error traces

### Frontend Logs
- Server logs in terminal
- Browser console logs (F12 → Console tab)

### Database Logs
```bash
# View PostgreSQL logs
tail -f /opt/homebrew/var/log/postgresql@15.log
```

---

## Stopping the Servers

### Stop Backend
```bash
# If running in terminal: Ctrl+C

# If running in background:
pkill -f uvicorn
# or
lsof -ti:8000 | xargs kill
```

### Stop Frontend
```bash
# If running in terminal: Ctrl+C

# If running in background:
pkill -f "next dev"
# or
lsof -ti:3000 | xargs kill
```

---

## Testing Checklist

- [ ] Backend health endpoint returns 200
- [ ] Frontend loads without errors
- [ ] Can create events via API
- [ ] 5 ERROR events trigger incident creation
- [ ] AI analysis appears in incidents
- [ ] Frontend displays incidents correctly
- [ ] Can filter incidents by status
- [ ] Can view incident details
- [ ] Can update incident status
- [ ] Dashboard auto-refreshes

---

## Next Steps

Once you've verified everything works:

1. **Explore the API**: http://localhost:8000/docs
2. **Test incident workflows**: Create → Investigate → Resolve → Close
3. **Try different error patterns**: Database, memory, network issues
4. **Monitor AI classifications**: Check category and severity assignments
5. **Review recommended actions**: See what AI suggests for fixes

---

## Quick Reference

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js dashboard |
| Backend API | http://localhost:8000 | FastAPI server |
| API Docs | http://localhost:8000/docs | Interactive API documentation |
| Health Check | http://localhost:8000/health | Server status |

**Default Credentials:**
- No authentication required (add in Phase 5)

**Database:**
- Host: localhost
- Port: 5432
- Database: ops_assist_ai
- User: apu
