# Postman Guide: Creating Trips in Travel.Genie

## Base URL
- **Development**: `https://localhost:7275` or `http://localhost:5012`

## Prerequisites

### 1. Create a User First (if you don't have one)

#### Step 1: Request OTP
```
POST {{baseUrl}}/api/auth/request-otp
Content-Type: application/json

{
  "email": "testuser@example.com"
}
```

#### Step 2: Verify OTP (Check your email for the OTP)
```
POST {{baseUrl}}/api/auth/verify-otp
Content-Type: application/json

{
  "email": "testuser@example.com",
  "otp": "123456"
}
```

#### Step 3: Register
```
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "SecurePassword123!"
}
```
**Response**: You'll receive a JWT token. Save this for trip creation.

#### Step 4: Login (if already registered)
```
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "SecurePassword123!"
}
```
**Response**: Save the token from the response.

---

## Creating Trips

### ✅ New Simple Trip Creation (Updated Feb 2026)

Trips now use a simplified structure with string-based destinations. The backend automatically creates Destination entities.

---

## Trip 1: Tokyo Adventure Trip

```http
POST {{baseUrl}}/api/trips
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Tokyo Adventure",
  "description": "Exploring Tokyo's culture, technology, and cuisine",
  "primaryDestination": "Tokyo, Japan",
  "otherDestinations": ["Kyoto, Japan", "Osaka, Japan"],
  "startDate": "2026-06-15",
  "endDate": "2026-06-25",
  "status": "Planned",
  "budget": {
    "currencyCode": "JPY",
    "totalBudget": 350000,
    "dailyTarget": 35000
  },
  "companions": [
    {
      "name": "Sarah Chen",
      "age": 28,
      "isChild": false,
      "sharesCosts": true
    }
  ]
}
```

### Field Explanations:
- **name**: Trip name (required)
- **description**: Trip description (optional)
- **primaryDestination**: Main destination as string "City, Country" (required)
- **otherDestinations**: Array of other destinations as strings (optional)
- **startDate/endDate**: ISO 8601 date format YYYY-MM-DD (required)
- **status**: "Draft", "Planned", "InProgress", "Completed", "Cancelled" (defaults to "Draft")
- **budget**: Optional budget object
  - **currencyCode**: ISO 4217 currency code (JPY, USD, EUR, etc.)
  - **totalBudget**: Total budget amount
  - **dailyTarget**: Optional daily spending target
- **companions**: Optional array of travel companions
  - **name**: Companion name
  - **age**: Optional age
  - **isChild**: Whether companion is a child
  - **sharesCosts**: Whether they share trip costs

---

## Trip 2: Paris Cultural Experience

```http
POST {{baseUrl}}/api/trips
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Paris Cultural Experience",
  "description": "Museums, art, and French cuisine",
  "primaryDestination": "Paris, France",
  "otherDestinations": ["Lyon, France", "Nice, France"],
  "startDate": "2026-09-01",
  "endDate": "2026-09-10",
  "status": "Planned",
  "budget": {
    "currencyCode": "EUR",
    "totalBudget": 2500,
    "dailyTarget": 250
  },
  "companions": []
}
```

---

## Minimal Trip Example

```http
POST {{baseUrl}}/api/trips
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Weekend Getaway",
  "primaryDestination": "Sydney, Australia",
  "startDate": "2026-03-15",
  "endDate": "2026-03-17"
}
```

**Note:** Only `name`, `primaryDestination`, and dates are required. Everything else is optional!

---

## Verify Trips Were Created

### Get All Trips (Paginated)
```http
GET {{baseUrl}}/api/trips?pageNumber=1&pageSize=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response Example:**
```json
{
  "items": [
    {
      "id": "a1b2c3d4-...",
      "name": "Tokyo Adventure",
      "description": "Exploring Tokyo...",
      "startDate": "2026-06-15",
      "endDate": "2026-06-25",
      "status": "Planned",
      "primaryDestination": {
        "id": "...",
        "name": "Tokyo, Japan",
        "countryCode": "JP"
      },
      "destinations": [...],
      "budget": {...},
      "companions": [...],
      "itineraryDays": [],
      "hasAiGeneratedPlan": false,
      "lastAiPlanUpdatedAt": null
    }
  ],
  "pageNumber": 1,
  "pageSize": 10,
  "totalCount": 2
}
```

### Get Specific Trip by ID
```http
GET {{baseUrl}}/api/trips/{tripId}
Authorization: Bearer YOUR_JWT_TOKEN
```

### Delete a Trip
```http
DELETE {{baseUrl}}/api/trips/{tripId}
Authorization: Bearer YOUR_JWT_TOKEN
```

Replace `{tripId}` with the Guid from GET response (e.g., `a1b2c3d4-e5f6-7890-abcd-1234567890ab`).

---

## How to Get Trip IDs for Deletion

1. **Login and get your JWT token**
2. **GET all trips**: `GET {{baseUrl}}/api/trips`
3. **Copy the `id` field** from each trip in the response
4. **DELETE using that ID**: `DELETE {{baseUrl}}/api/trips/{id}`

**Example:**
```http
# Step 1: Get all trips
GET http://localhost:5012/api/trips
Authorization: Bearer eyJhbGci...

# Response shows:
# { "items": [{ "id": "abc123-def456-...", "name": "Tokyo Adventure" }] }

# Step 2: Delete using that ID
DELETE http://localhost:5012/api/trips/abc123-def456-...
Authorization: Bearer eyJhbGci...
```

---

## Supported Country Codes

The backend automatically maps destination countries to ISO codes:
- **Japan** → JP
- **France** → FR  
- **USA** / **United States** → US
- **UK** / **United Kingdom** → GB
- **Australia** → AU
- **Germany** → DE
- **Italy** → IT
- **Spain** → ES
- Unknown countries → XX

**Format:** Always use "City, Country" format for destinations.

---

## Common Status Values:
- **Draft** - Trip is being planned
- **Planned** - Trip is confirmed and scheduled
- **InProgress** - Trip is currently happening
- **Completed** - Trip has finished
- **Cancelled** - Trip was cancelled

---

## Testing Notes:

1. **Authentication Required**: All trip endpoints require JWT token in Authorization header
2. **UserId Automatic**: No need to provide userId - it's extracted from your JWT token
3. **SSL Certificate**: If using HTTPS locally, you may need to disable SSL verification in Postman settings or use HTTP endpoint
4. **Dates Format**: Use simple date format `YYYY-MM-DD` (e.g., `2026-06-15`)
5. **Minimal Required Fields**: Only `name`, `primaryDestination`, `startDate`, and `endDate` are required

---

## Postman Environment Variables

Create these variables in Postman for easier testing:

| Variable | Value |
|----------|-------|
| `baseUrl` | `http://localhost:5012` or `https://localhost:7275` |
| `token` | Your JWT token from login |

Then use them in requests:
```http
POST {{baseUrl}}/api/trips
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "My Trip",
  "primaryDestination": "Tokyo, Japan",
  ...
}
```

---

## Quick Start Guide

1. **Register/Login** → Get JWT token
2. **Create a trip** using minimal fields:
   ```json
   {
     "name": "Weekend Trip",
     "primaryDestination": "Sydney, Australia",
     "startDate": "2026-03-15",
     "endDate": "2026-03-17"
   }
   ```
3. **View your trips** → `GET /api/trips`
4. **Delete old trips** → `DELETE /api/trips/{tripId}`

---

## Database Changes ✅

**UPDATED**: The Trip model now automatically creates Destination entities from strings. No manual Destination creation needed!
