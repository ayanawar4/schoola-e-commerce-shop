# Registration Flow

## Overview

3-step flow: **Register Form → OTP Verify → Logged In**

---

## Step 1 — Register

**Screen:** Collect user info
**Endpoint:** `POST /auth/register`

### Request Body
```json
{
  "first_name": "Ahmed",
  "last_name": "Mohamed",
  "phone_country_code": "EG",
  "phone": "01xxxxxxxxx",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```

### Success Response
```json
{
  "message": "OTP sent"
}
```

### On Success
- Store `phone` and `phone_country_code` locally (pending state)
- Navigate to OTP screen

### Fields
| Field | Type | Required |
|---|---|---|
| first_name | string | yes |
| last_name | string | yes |
| phone_country_code | string | yes — hardcoded `"EG"` |
| phone | string | yes — Egyptian format `01xxxxxxxxx` |
| password | string | yes |
| password_confirmation | string | yes — must match password |

---

## Step 2 — Verify OTP

**Screen:** 6-digit OTP input
**Endpoint:** `POST /auth/register/verify`

### Request Body
```json
{
  "phone_country_code": "EG",
  "phone": "01xxxxxxxxx",
  "code": "123456"
}
```

### Success Response
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "first_name": "Ahmed",
    "last_name": "Mohamed",
    "phone": "01xxxxxxxxx",
    "phone_country_code": "EG",
    "email": null,
    "has_password": true,
    "created_at": "2026-06-11T..."
  }
}
```

### On Success
- Save `token` to secure storage
- Save `user` to local state
- Mark user as authenticated
- Navigate to Home screen

### On Error
- Clear OTP inputs
- Show error message

---

## Step 3 — Resend OTP

**Trigger:** User taps "Resend OTP" after 60-second countdown
**Endpoint:** `POST /auth/register/resend-otp`

### Request Body
```json
{
  "phone_country_code": "EG",
  "phone": "01xxxxxxxxx"
}
```

### Success Response
```json
{
  "message": "OTP resent"
}
```

### On Success
- Reset countdown to 60 seconds
- Show success toast

---

## UX Rules

- Phone country code is always `"EG"` (Egypt), displayed as `+20`
- OTP is 6 digits, auto-submits when all 6 are filled
- Resend button disabled for 60 seconds after each send
- If user navigates back from OTP screen without verifying, `pendingPhone` should be cleared
- On the OTP screen, show the phone number the code was sent to: `Code sent to +20{phone}`
