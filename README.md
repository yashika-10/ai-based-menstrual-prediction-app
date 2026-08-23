# SAKHI

SAKHI is an AI-powered menstrual health tracking and prediction prototype. It includes a static frontend, an Express backend, MongoDB/Mongoose database models, and a lightweight ML-style prediction engine.

## Run Frontend Only

Open `index.html` in a browser.

## Run Full Stack

1. Install Node.js.
2. Install MongoDB Community Server.
3. Open MongoDB Compass and connect to:

```text
mongodb://127.0.0.1:27017
```

4. Copy `.env.example` to `.env`.
5. Install backend dependencies:

```bash
npm install
```

6. Start the backend:

```bash
npm start
```

7. Open:

```text
http://localhost:5000
```

The backend database name is `sakhi`. In MongoDB Compass, you will see collections such as `users` and `periodlogs` after using signup and period logging.

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/predictions`
- `POST /api/predictions/simulate`
- `GET /api/periods`
- `POST /api/periods`
- `POST /api/chat`

## ML Engine

The ML logic lives in `server/src/ml/predictionEngine.js`. It uses:

- weighted recent cycle lengths
- symptom-based estimation when cycle history is unknown
- sleep, stress, acne, fatigue, pain, flow, and cycle variability
- PCOS/PCOD awareness scoring
- hormonal balance and cycle regularity scoring

This is a prototype awareness model, not a medical diagnosis system.
