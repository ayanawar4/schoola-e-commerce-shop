# Schoola — Mobile App Specification

This document describes every screen, user flow, API call, and business rule in the Schoola web app so a mobile developer can replicate the same functionality.

---

## 0. Complete App Cycle

This is the full user journey from first launch to a completed order.

```
┌─────────────────────────────────────────────────────────────┐
│                        APP LAUNCH                           │
│                                                             │
│   Check local storage for saved token                       │
│       ├── Token found  ──────────────────► HOME SCREEN      │
│       └── No token     ──────────────────► LANDING SCREEN   │
└─────────────────────────────────────────────────────────────┘

LANDING SCREEN
│
├── "Sign In"       ──► LOGIN FLOW
│
└── "Create Account" ──► REGISTER FLOW


═══════════════════════════════════════════════════════════════
REGISTER FLOW (New User)
═══════════════════════════════════════════════════════════════

  [1] Enter Phone Number
        │  POST /auth/otp/request
        ▼
  [2] Enter 6-digit OTP
        │  POST /auth/otp/verify
        ▼
  [3] Complete Profile
      (First Name, Last Name, Password, Email)
        │  POST /auth/register
        │  ← receives { token, user }
        │  Save token to device storage
        ▼
  HOME SCREEN ✓


═══════════════════════════════════════════════════════════════
LOGIN FLOW (Returning User)
═══════════════════════════════════════════════════════════════

  [1] Enter Phone + Password
        │  POST /auth/login
        │  ← receives { token, user }
        │  Save token to device storage
        ▼
  HOME SCREEN ✓


═══════════════════════════════════════════════════════════════
MAIN APP CYCLE (Authenticated User)
═══════════════════════════════════════════════════════════════

  HOME
    │
    ├── Search bar ────────────────────────────────► UNIFORMS (with search query)
    ├── Quick link: Schools ───────────────────────► SCHOOLS LIST
    ├── Quick link: Uniforms ──────────────────────► UNIFORMS (catalog)
    ├── Best Sellers product tap ──────────────────► PRODUCT DETAIL
    └── Top Schools school tap ────────────────────► UNIFORMS (filtered by school)

  SCHOOLS LIST
    │
    └── Tap school ────────────────────────────────► UNIFORMS (filtered by school)

  UNIFORMS / CATALOG
    │
    └── Tap product ───────────────────────────────► PRODUCT DETAIL

  PRODUCT DETAIL
    │  (select size → set quantity)
    └── "Add to Cart" ─────────────────────────────► CART  (+ badge updates)

  CART
    │  (adjust quantities, remove items)
    └── "Proceed to Checkout" ─────────────────────► CHECKOUT

  CHECKOUT
    │  [1] Select student (auto-selects first)
    │  [2] Enter delivery address
    │  [3] Enter InstaPay transaction reference
    └── "Place Order" ─────────────────────────────► ORDER SUCCESS SCREEN
                                                       │
                                               Cart is cleared
                                                       │
                                          ┌────────────┴────────────┐
                                          │                         │
                                    "View Order"             "Continue Shopping"
                                          │                         │
                                   ORDER DETAIL               HOME SCREEN

  ACCOUNT
    │
    ├── My Students ──────────────────────────────► ADD / EDIT / DELETE STUDENT
    ├── Dark Mode toggle
    ├── Language toggle (AR / EN)
    └── Logout ──────────────────────────────────► LANDING SCREEN
                                                    (token cleared)

  ORDERS (from tab bar or account)
    │
    └── Tap order ───────────────────────────────► ORDER DETAIL
```

---

## 0.1 Authentication Deep Dive

### Token Lifecycle

```
User registers / logs in
        │
        ▼
API returns { token: "eyJ...", user: { ... } }
        │
        ▼
Store token in:
  • Secure local storage  (key: "schoola_token")
  • HTTP cookie           (key: "token", expires: 30 days)
  • In-memory auth state  (isAuthenticated: true)
        │
        ▼
All API requests: Authorization: Bearer <token>
        │
        ├── 401 response received?
        │       │
        │       ▼
        │   Clear token from storage + cookie
        │   Set isAuthenticated = false
        │   Redirect to Login screen
        │
        └── User taps Logout
                │
                ▼
            POST /auth/logout   (fire and forget — always clear locally)
            Clear token from storage + cookie
            Set isAuthenticated = false
            Navigate to Landing screen
```

### Register Flow — Step by Step

```
STEP 1 ── Enter Phone
┌─────────────────────────────────────────────┐
│  Country code: +20 (Egypt, fixed)           │
│  Phone: 01XXXXXXXXX                         │
│                                             │
│  [Send OTP]                                 │
└─────────────────────────────────────────────┘
    │
    │  POST /auth/otp/request
    │  Body: { phone_country_code: "EG", phone: "01012345678" }
    │
    │  ✓ Success → save phone in memory (not storage), go to Step 2
    │  ✗ Error   → show error message under the field


STEP 2 ── Verify OTP
┌─────────────────────────────────────────────┐
│  "Code sent to +20 01012345678"             │
│                                             │
│  [ ][ ][ ][ ][ ][ ]   ← 6 boxes            │
│                                             │
│  Resend in 60s  (countdown timer)           │
└─────────────────────────────────────────────┘
    │
    │  Auto-submit when 6th digit is entered
    │  POST /auth/otp/verify
    │  Body: { phone_country_code: "EG", phone: "01012345678", code: "123456" }
    │
    │  ✓ Success → go to Step 3
    │  ✗ Error   → clear all 6 boxes, show error, focus first box


STEP 3 ── Complete Profile
┌─────────────────────────────────────────────┐
│  First Name *                               │
│  Last Name  *                               │
│  Email       (optional)                     │
│  Password   *  [strength indicator]         │
│  Confirm Password *                         │
│                                             │
│  Password rules:                            │
│   ○ At least 8 characters                  │
│   ○ At least 1 uppercase letter            │
│   ○ At least 1 number                      │
│   ○ At least 1 special character           │
│                                             │
│  [Create Account]                           │
└─────────────────────────────────────────────┘
    │
    │  POST /auth/register
    │  Body: {
    │    phone_country_code: "EG",
    │    phone: "01012345678",       ← from Step 1 (kept in memory)
    │    first_name: "Ahmed",
    │    last_name: "Mohamed",
    │    email: "...",               ← optional
    │    password: "Secret@123",
    │    password_confirmation: "Secret@123"
    │  }
    │
    │  ✓ Success → save { token, user } → navigate to Home
    │  ✗ Error   → show error message
    │
    │  NOTE: If user navigates away from Step 2/3 and comes back,
    │        the pending phone is lost. Redirect them back to Step 1.
```

### Login Flow — Step by Step

```
┌─────────────────────────────────────────────┐
│  Phone: +20 | 01XXXXXXXXX                  │
│  Password:  ••••••••   [show/hide]          │
│                                             │
│  [Log In]                                   │
│                                             │
│  No account? Create one                     │
└─────────────────────────────────────────────┘
    │
    │  POST /auth/login
    │  Body: { phone_country_code: "EG", phone: "01012345678", password: "..." }
    │
    │  ✓ Success → save { token, user } → navigate to Home
    │  ✗ 401/422 → show "Invalid phone or password"
```

### Session Persistence (App Re-open)

```
App opens
    │
    ├── Read "schoola_token" from local storage
    │
    ├── Token exists?
    │     ├── YES → set isAuthenticated = true, show Home
    │     │         (token is attached to all API calls automatically)
    │     │         Optionally: call GET /auth/profile to refresh user data
    │     │
    │     └── NO  → show Landing screen
    │
    └── Any API call returns 401?
              │
              └── Token expired → clear everything → send to Login
```

### What Gets Saved to Device Storage

| Key | What | When saved | When cleared |
|-----|------|-----------|--------------|
| `schoola_token` | Bearer token string | On login / register | On logout / 401 |
| `schoola_auth` | `{ token, user, isAuthenticated }` | On login / register | On logout / 401 |
| `schoola_cart` | Cart items array | On every cart change | On order success |
| `schoola_ui` | `{ locale, darkMode }` | On every toggle | Never (persists forever) |
| `schoola_product_cache` | Product objects by ID | On product page load | Never (app update clears) |
| `schoola_school_cache` | School objects by ID | On school page load | Never (app update clears) |

---

## 1. Overview

Schoola is an e-commerce app for school uniforms and supplies in Egypt.

- **Target users**: Parents ordering uniforms for their children
- **Language**: Arabic (default, RTL) and English (LTR) — user can toggle at any time
- **Auth**: Phone-based — either phone + password (returning users) or phone + OTP (new users)
- **Payment**: InstaPay only — user transfers money and enters the transaction reference
- **Cart**: Client-side only (not synced to server)

---

## 2. API

**Base URL**: `https://schoola.serveftp.com/api/v1`

**Authentication**: Bearer token in `Authorization` header.
- Token is obtained at login or after OTP registration
- On `401` response: clear token, redirect to login

**Headers**:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>   (when authenticated)
```

**Error format**:
```json
{
  "message": "Human-readable error",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```
Always show `errors[first_field][0]` if present, otherwise show `message`.

---

## 3. Data Models

### User
```json
{
  "id": 1,
  "first_name": "Ahmed",
  "last_name": "Mohamed",
  "phone": "01012345678",
  "phone_country_code": "EG",
  "email": "ahmed@example.com",
  "has_password": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### School
```json
{
  "id": 1,
  "name": { "ar": "مدرسة النور", "en": "Al Nour School" },
  "slug": "al-nour",
  "logo_url": "https://schoola.serveftp.com/storage/schools/logo.png",
  "curriculum": "egyptian",
  "grades": ["KG1", "KG2", "Grade 1"],
  "products_count": 24,
  "is_active": true
}
```

### Product
```json
{
  "id": 47,
  "name": { "ar": "قميص مدرسي", "en": "School Shirt" },
  "sku": "SCH-001",
  "price": 150.00,
  "description": "...",
  "category": "shirts",
  "gender": "male",
  "grade_level": "Grade 1",
  "stock": 50,
  "status": "active",
  "school": { ... },
  "images": [{ "id": 1, "url": "https://...", "is_primary": true }],
  "sizes": ["S", "M", "L", "XL"],
  "variants": [{ "id": 1, "size": "M", "color": "white", "stock": 10 }]
}
```

### Student
```json
{
  "id": 1,
  "name": "Omar Ahmed",
  "school_id": 5,
  "school": { ... },
  "grade": "Grade 3",
  "gender": "male",
  "sizes": {
    "shirt": "M",
    "pants": "28",
    "skirt": null,
    "shoes": "38",
    "jacket": "L"
  }
}
```

### Order
```json
{
  "id": 101,
  "order_number": "ORD-2024-101",
  "student_id": 1,
  "student": { ... },
  "lines": [
    {
      "id": 1,
      "product_id": 47,
      "product": { ... },
      "quantity": 2,
      "unit_price": 150.00,
      "total": 300.00,
      "size_snapshot": { "size": "M" }
    }
  ],
  "payment_method": "instapay",
  "payment_reference": "TXN123456",
  "downpayment_amount": 300.00,
  "notes": "Delivery address: Cairo, Nasr City | Leave at door",
  "status": "pending_payment",
  "subtotal": 300.00,
  "total": 300.00,
  "currency": "EGP",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## 4. Screens & Flows

### 4.1 Splash / Landing Screen (Unauthenticated)

Shown to users who are **not logged in**.

**UI elements:**
- Full-screen dark animated background (dark navy gradient)
- App logo (centered, large)
- Tagline: "كل ما يحتاجه طالبك" / "Everything your student needs"
- Subtitle: "المنصة الأولى للزي المدرسي الرسمي والأدوات الدراسية في مصر" / "Egypt's #1 platform for official school uniforms & supplies"
- 3 feature cards: "All Schools", "Top Quality", "Fast Order"
- Gold "Sign In" button → Login screen
- Ghost "Create Account" button → Register screen
- Language toggle (AR/EN) in top-right corner

**No API calls on this screen.**

---

### 4.2 Register Screen

**Flow**: Enter phone → request OTP → verify OTP → complete profile

#### Step 1 — Enter Phone
- Field: phone number (Egyptian format: 01xxxxxxxxx)
- Country code is fixed to `EG` (+20)
- Button: "Send OTP" / "إرسال رمز التحقق"

**API call**:
```
POST /auth/otp/request
Body: { "phone_country_code": "EG", "phone": "01012345678" }
Response: { "message": "OTP sent" }
```
On success → navigate to OTP screen, passing the phone number.

#### Step 2 — OTP Verification
- 6 individual digit input boxes (auto-advance on input, auto-submit on last digit)
- Countdown timer (60 seconds) before "Resend" button appears
- Show phone number in subtitle: "Code sent to +20XXXXXXXXXX"

**API call (verify)**:
```
POST /auth/otp/verify
Body: { "phone_country_code": "EG", "phone": "01012345678", "code": "123456" }
Response: { "message": "Verified" }
```
On success → navigate to Complete Profile screen.

**API call (resend)**:
```
POST /auth/otp/request
Body: { "phone_country_code": "EG", "phone": "01012345678" }
```
Reset countdown to 60 seconds on success.

#### Step 3 — Complete Profile
- Fields: First Name, Last Name, Password, Confirm Password, Email (optional)
- Button: "Create Account" / "إنشاء الحساب"

**API call**:
```
POST /auth/register
Body: {
  "phone_country_code": "EG",
  "phone": "01012345678",
  "first_name": "Ahmed",
  "last_name": "Mohamed",
  "password": "secret123",
  "password_confirmation": "secret123",
  "email": "ahmed@example.com"   // optional
}
Response: { "token": "...", "user": { ... } }
```
On success → save token + user, navigate to Home.

---

### 4.3 Login Screen

- Field: phone number (01xxxxxxxxx)
- Field: password (with show/hide toggle)
- Button: "Log In" / "تسجيل الدخول"
- Link: "No account? Register"

**API call**:
```
POST /auth/login
Body: { "phone_country_code": "EG", "phone": "01012345678", "password": "secret123" }
Response: { "token": "...", "user": { ... } }
```
On success → save token + user, navigate to Home.

**Token storage**: Store in secure local storage. Attach as `Authorization: Bearer <token>` on all subsequent requests.

---

### 4.4 Home Screen (Authenticated)

**Sections (top to bottom):**

1. **Hero / Search Bar**
   - Greeting: "Good morning, Ahmed" / "صباح الخير، أحمد"
   - Search input → navigates to Uniforms screen with search query
   - Quick-link pills: Uniforms, Schools, Supplies

2. **Stats Strip**
   - "500+ Schools", "10,000+ Products", "100% Quality"
   - API: `GET /customer/schools?per_page=1` — use the `meta.total` for school count

3. **Category Grid** (4 icons)
   - Uniforms → `/uniforms`
   - Schools → `/schools`
   - Supplies → coming soon
   - Stores → coming soon

4. **Promo Banner**
   - Static banner: "2026 School Season — Order Now"
   - CTA → `/uniforms`

5. **Best Sellers** (horizontal scroll)
   - API: `GET /customer/catalog?per_page=10&school_id=<first_school_id>`
   - Tap a product → Product Detail screen

6. **Top Schools** (horizontal scroll)
   - API: `GET /customer/schools?per_page=10`
   - Tap a school → Schools screen filtered by that school

---

### 4.5 Schools Screen

**UI**: Search bar + grid of school cards (logo/initials, name, curriculum badge, product count)

**API call**:
```
GET /customer/schools?search=<query>&per_page=50&page=1
Response: {
  "data": [ School ],
  "meta": { "current_page": 1, "last_page": 3, "total": 120 }
}
```

**Important**: Max `per_page` is **50**. Use pagination for more.

**School card shows**:
- Logo image (fallback to colored initials)
- School name (localized)
- Curriculum type
- Products count

Tap → navigate to Uniforms/Catalog screen with `school_id` pre-filtered.

---

### 4.6 Uniforms / Catalog Screen

**Purpose**: Browse products filtered by school.

**Initial load behavior**:
1. If a `school_id` is passed → use it
2. Otherwise auto-select the first school: `GET /customer/schools?per_page=1`
3. Fetch catalog using that school ID

**API call**:
```
GET /customer/catalog?school_id=5&category=shirts&gender=male&per_page=20&page=1
```

**IMPORTANT**: `school_id` OR `student_id` is **required**. Without one of these, the API returns no results.

**Filter options**:
- School selector (dropdown/sheet)
- Category: shirts, pants, skirts, shoes, jackets, etc.
- Gender: male, female, unisex
- Search by name

**Product card shows**:
- Product image
- Product name (localized)
- School name
- Price in EGP
- Tap → Product Detail screen

---

### 4.7 Product Detail Screen

**API call**:
```
GET /customer/catalog/:id
Response: { "data": Product }
```

**Cache behavior**: Cache product data locally. On reload, use cached data while re-fetching in background.

**UI elements**:
- Image gallery (swipeable)
- Product name, school name
- Price
- Size selector (chips from `product.sizes[]`)
  - Required before adding to cart
  - Show "Please select a size" if user taps Add without selecting
- Quantity selector (+/-)
- "Add to Cart" button
- Description accordion

**Add to cart**:
- Cart is client-side only (not an API)
- Cart item = `{ id: uuid, product, quantity, size }`
- If same product + same size already in cart → increment quantity

---

### 4.8 Cart Screen

**Data source**: Local cart state (persisted to device storage).

**UI**:
- List of cart items
  - Product image, name, size, quantity (+/-), price
  - Remove item (swipe or trash icon)
- Order total
- "Proceed to Checkout" button
- "Continue Shopping" button if cart is empty

**No API calls** on this screen.

---

### 4.9 Checkout Screen

**Flow**: Review → Select Student → Delivery Address → Payment Reference → Place Order

#### Student Selection
- Load user's students: `GET /customer/students`
- Display as selectable cards (name, grade, school)
- **Auto-select the first student** in the list
- If no students: show "Add a student first" with link to Add Student
- **Validation**: A student MUST be selected. If user tries to submit without one:
  - Highlight the student section with a red border
  - Show inline error: "You must select at least one student to place the order"
  - Scroll to the student section

#### Delivery Address
- Free-text field: city, district, street, building number
- This gets prepended to the `notes` field as: `"Delivery address: <value>"`

#### Payment (InstaPay)
- Show instructions: "Transfer to Schoola's InstaPay account, then enter your transaction ID"
- Required field: Transaction Reference (InstaPay transaction ID)

#### Place Order
**Validation before submit**:
1. Student selected? → if not, show error
2. Payment reference filled? → if not, show error

**API call**:
```
POST /customer/orders
Body: {
  "student_id": 1,
  "lines": [
    { "product_id": 47, "quantity": 2, "size": "M" }
  ],
  "payment_method": "instapay",
  "downpayment_amount": 300.00,
  "payment_reference": "TXN123456",
  "notes": "Delivery address: Cairo, Nasr City | Leave at door"
}
Response: { "data": Order }
```

On success:
- Clear the local cart
- Show success screen with order number, total, payment reference
- Buttons: "View Order" → Order Detail, "Continue Shopping" → Home

---

### 4.10 Orders Screen

**API call**:
```
GET /customer/orders
Response: { "data": [ Order ] }
```

**Order list item shows**:
- Order number
- Status badge (color-coded):
  - `pending` → yellow
  - `pending_payment` → orange
  - `processing` → blue
  - `shipped` → purple
  - `delivered` → green
  - `cancelled` → red
- Total amount
- Date
- Student name

Tap → Order Detail screen

---

### 4.11 Order Detail Screen

**API call**:
```
GET /customer/orders/:id
Response: { "data": Order }
```

**Shows**:
- Order number, status badge, date
- Student name
- Items list (image, name, size, quantity, price)
- Subtotal, total
- Payment method, payment reference
- Notes/delivery address
- Payment instructions (if status is `pending_payment`)

---

### 4.12 Account Screen

**Load profile**:
```
GET /auth/profile
Response: { "data": User }
```

**Sections**:
- Profile info (name, phone, email)
- My Students (list + add/edit/delete)
- Dark Mode toggle
- Language toggle (AR/EN)
- Logout button

**Logout**:
```
POST /auth/logout
```
Always clear token locally regardless of API response. Redirect to Landing screen.

---

### 4.13 Students — Add / Edit

#### Add Student
```
POST /customer/students
Body: {
  "name": "Omar Ahmed",
  "school_id": 5,
  "grade": "Grade 3",
  "gender": "male",
  "sizes": {
    "shirt": "M",
    "pants": "28",
    "shoes": "38",
    "jacket": "L"
  }
}
Response: { "data": Student }
```

#### Edit Student
```
PATCH /customer/students/:id
Body: { same fields, all optional }
Response: { "data": Student }
```

#### Delete Student
```
DELETE /customer/students/:id
```
Show confirmation dialog before deleting.

**Form fields**:
- Name (required)
- School (search + select — use `GET /customer/schools?search=<q>&per_page=50`)
- Grade (text or dropdown from `school.grades[]`)
- Gender (Male / Female)
- Sizes: Shirt, Pants, Skirt (female only), Shoes, Jacket

**Size guide** (show in info sheet):

| Size | Chest | Waist | Height |
|------|-------|-------|--------|
| XS | 76–81 cm | 61–66 cm | 140–150 cm |
| S | 84–89 cm | 69–74 cm | 152–160 cm |
| M | 92–97 cm | 76–81 cm | 162–168 cm |
| L | 100–107 cm | 84–89 cm | 170–176 cm |
| XL | 110–117 cm | 92–97 cm | 178–184 cm |

---

### 4.14 AI Chat Screen

- Floating button visible on all authenticated screens (bottom-right)
- Opens a full-screen chat interface
- (Backend integration details TBD by the team)

---

### 4.15 Coming Soon Screens

- **Stores** and **Supplies** are not yet available
- Show a "Coming Soon" overlay
- Tapping outside the card (or a "Back to Home" button) dismisses and returns to Home

---

## 5. Navigation Structure

```
├── Landing (unauthenticated)
│   ├── Login
│   └── Register → OTP → Complete Profile
│
└── App Shell (authenticated)
    ├── Bottom Tab Bar
    │   ├── Home
    │   ├── Schools
    │   ├── Uniforms (Catalog)
    │   ├── Cart  [badge with item count]
    │   └── Account
    │
    ├── Product Detail  (from any product tap)
    ├── Orders List     (from Account or header icon)
    ├── Order Detail    (from Orders List)
    ├── Students
    │   ├── Add Student
    │   └── Edit Student
    └── AI Chat         (floating button → full screen)
```

---

## 6. Local State (Persisted to Device Storage)

| Key | Content | Persist |
|-----|---------|---------|
| `schoola_auth` | `{ token, user, isAuthenticated }` | Yes |
| `schoola_cart` | `{ items: CartItem[] }` | Yes |
| `schoola_ui` | `{ locale: "ar"\|"en", darkMode: false }` | Yes |
| `schoola_product_cache` | `{ cache: { [id]: Product } }` | Yes |
| `schoola_school_cache` | `{ cache: { [id]: School } }` | Yes |

**Cache behavior for products/schools**: On product/school page load, check cache first. If found, render immediately (no loading spinner) while optionally re-fetching in background.

---

## 7. Key Business Rules

1. **Catalog requires a filter** — always pass `school_id` or `student_id`. Never call catalog without one.
2. **Schools API max per_page is 50** — for large lists, use pagination.
3. **Cart is local only** — no server cart. Items are lost only if user clears app data.
4. **InstaPay only** — `payment_method` is always `"instapay"`. `downpayment_amount` = full order total.
5. **Delivery address in notes** — prepend `"Delivery address: <value> | "` to the notes field.
6. **Image URLs** — API may return `http://` URLs. Always upgrade to `https://` before displaying. Also replace `http://137.184.57.162` with `https://schoola.serveftp.com`.
7. **Token expiry (401)** — on any 401 response, clear stored token and send user to Login screen.
8. **Localized names** — `name` fields can be either a plain string or `{ ar: string, en: string }`. Always handle both. Display based on current language.
9. **Checkout student** — auto-select first student. User can change selection. Order cannot be placed without a selected student.
10. **Logout** — call `POST /auth/logout`, then clear all auth state locally, redirect to Landing.

---

## 8. Localization

All user-facing strings must exist in Arabic and English.

**RTL**: Arabic is right-to-left. Mirror all layouts when locale = `"ar"`:
- Text alignment: right
- Icons on the left in LTR move to the right in RTL
- Navigation arrows flip direction
- Horizontal lists scroll right-to-left

**Date/number formatting**:
- Prices: `EGP 150` format
- Dates: locale-aware (e.g., `15 يناير 2024` in Arabic)
