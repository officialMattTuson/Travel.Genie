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

### ⚠️ UserId Required (Hardcoded for now)

For now, you need to **manually provide the userId** in the request body. 

**To get your userId:**
1. After registering, **check the server console** - it will print your UserId like:
   ```
   [USER REGISTERED]
   Email: testuser@example.com
   UserId: a1b2c3d4-e5f6-7890-abcd-1234567890ab
   ```
2. Copy that exact Guid and use it in your requests

**Important:** The userId must be a valid Guid format without quotes around the individual parts.

---

## Trip 1: Tokyo Adventure Trip

```
POST {{baseUrl}}/api/trips
Content-Type: application/json

{
  "id": 0,
  "destination": "Tokyo, Japan",
  "startDate": "2026-06-15T00:00:00Z",
  "endDate": "2026-06-25T00:00:00Z",
  "createdAt": "2026-02-09T00:00:00Z",
  "updatedAt": "2026-02-09T00:00:00Z",
  "userId": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "status": "Planned",
  "currencyCode": "JPY",
  "budgetedPrice": 350000,
  "keepToBudget": true,
  "actualPrice": 0,
  "itinerary": 1,
  "tripType": 0,
  "transportTypes": []
}
```

**Note:** Replace `a1b2c3d4-e5f6-7890-abcd-1234567890ab` with the actual UserId from your console output!

### Field Explanations:
- **id**: Set to 0 (will be auto-generated)
- **destination**: Trip destination
- **startDate/endDate**: ISO 8601 format dates
- **userId**: Your Guid from user account
- **status**: "Planned", "InProgress", "Completed", "Cancelled"
- **currencyCode**: ISO 4217 currency code (JPY for Japanese Yen)
- **budgetedPrice**: Budget in the currency specified
- **keepToBudget**: true/false - whether to strictly keep to budget
- **actualPrice**: Actual spent amount (0 for new trips)
- **itinerary**: 0=Chill, 1=Balanced, 2=Packed
- **tripType**: 0=Adventure, 1=Relaxation, 2=Cultural, 3=Luxury, 4=Balanced

---

## Trip 2: Paris Cultural Experience

```
POST {{baseUrl}}/api/trips
Content-Type: application/json

{
  "id": 0,
  "destination": "Paris, France",
  "startDate": "2026-09-01T00:00:00Z",
  "endDate": "2026-09-10T00:00:00Z",
  "createdAt": "2026-02-09T00:00:00Z",
  "updatedAt": "2026-02-09T00:00:00Z",
  "userId": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "status": "Planned",
  "currencyCode": "EUR",
  "budgetedPrice": 2500,
  "keepToBudget": false,
  "actualPrice": 0,
  "itinerary": 2,
  "tripType": 2,
  "transportTypes": []
}
```

### Field Explanations for Paris Trip:
- **destination**: "Paris, France"
- **currencyCode**: "EUR" (Euro)
- **budgetedPrice**: 2500 EUR
- **keepToBudget**: false (flexible budget)
- **itinerary**: 2 (Packed - lots of activities)
- **tripType**: 2 (Cultural trip)

---

## Verify Trips Were Created

### Get All Trips
```
GET {{baseUrl}}/api/trips
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Get Specific Trip by ID
```
GET {{baseUrl}}/api/trips/{tripId}
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Replace `{tripId}` with the ID returned from the POST request.

---

## Enum Reference

### TripType Enum (int values):
- `0` = Adventure
- `1` = Relaxation
- `2` = Cultural
- `3` = Luxury
- `4` = Balanced

### ItineraryType Enum (int values):
- `0` = Chill
- `1` = Balanced
- `2` = Packed

---

## Common Status Values:
- "Planned"
- "InProgress"
- "Completed"
- "Cancelled"

---

## Testing Notes:

1. **SSL Certificate**: If using HTTPS locally, you may need to disable SSL verification in Postman settings or use HTTP endpoint
2. **Authorization**: Most endpoints require the JWT token in the Authorization header
3. **UserId**: Make sure to replace the sample UserId with an actual Guid from your database
4. **Dates**: Use future dates for realistic trip planning

---

## Postman Environment Variables

Create these variables in Postman:
```
baseUrl: https://localhost:7275
```

Then use them in requests like:
```
POST {{baseUrl}}/api/trips
Authorization: Bearer {{token}}

{
  "destination": "...",
  ...
}
```

**Note:** No need for a `userId` variable anymore - it's handled automatically!
```

---

## Database Issue Alert ⚠️

**IMPORTANT**: Your SQL file `Database/TripDetails.sql` has a data type mismatch:
- Line 9: `UserId FLOAT` should be `UserId UNIQUEIDENTIFIER` (Guid in SQL Server)

Update your SQL file or ensure your migrations are correct!
