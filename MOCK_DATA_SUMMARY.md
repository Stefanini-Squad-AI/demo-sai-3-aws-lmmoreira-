# Mock Data Summary - DS3A-6

## Overview
This document provides a comprehensive reference for all mock data available in the frontend when `VITE_USE_MOCKS=true` is enabled.

## Configuration
- **Environment Variable**: `VITE_USE_MOCKS=true` (set in `.env.development`)
- **Mock Delay**: 300-800ms (configurable via `VITE_MOCK_DELAY_MIN` and `VITE_MOCK_DELAY_MAX`)
- **MSW Logging**: Enabled via `VITE_ENABLE_MSW_LOGGING=true`

---

## Accounts (10 Total)

All accounts have complete customer and card information with proper relational integrity.

| Account ID | Customer Name | Card Number | Status | Balance | Credit Limit | Group | City |
|------------|---------------|-------------|--------|---------|--------------|-------|------|
| 11111111111 | JOHN MICHAEL SMITH | 4111-1111-1111-1111 | Active (Y) | $1,250.75 | $5,000.00 | PREMIUM | NEW YORK |
| 22222222222 | JANE DOE | 4222-2222-2222-2222 | Inactive (N) | $0.00 | $2,500.00 | STANDARD | LOS ANGELES |
| 33333333333 | ROBERT JAMES JOHNSON | 4333-3333-3333-3333 | Active (Y) | $8,750.25 | $15,000.00 | PLATINUM | CHICAGO |
| 44444444444 | MARIA ELENA GARCIA | 4444-4444-4444-4444 | Active (Y) | $0.00 | $1,000.00 | BASIC | MIAMI |
| 55555555555 | DAVID ALEXANDER WILSON | 4555-5555-5555-5555 | Active (Y) | -$500.00 | $3,000.00 | GOLD | SEATTLE |
| 66666666666 | SARAH ELIZABETH THOMPSON | 4666-6666-6666-6666 | Active (Y) | $15,750.50 | $50,000.00 | CORPORATE | BOSTON |
| 77777777777 | JENNIFER LYNN MARTINEZ | 4777-7777-7777-7777 | Active (Y) | $3,250.00 | $10,000.00 | GOLD | HOUSTON |
| 88888888888 | CHRISTOPHER PAUL ANDERSON | 4888-8888-8888-8888 | Active (Y) | $625.50 | $2,000.00 | SILVER | PHOENIX |
| 99999999999 | ELIZABETH ANN TAYLOR | 4999-9999-9999-9999 | Active (Y) | $12,500.75 | $25,000.00 | PLATINUM | SAN FRANCISCO |
| 10101010101 | MICHAEL THOMAS HARRIS | 4101-0101-0101-0101 | Inactive (N) | $0.00 | $1,500.00 | BASIC | DENVER |

### Customer Details
Each account includes:
- Customer ID (1000000001-1000000010)
- SSN (masked format: XXX-XX-XXXX)
- FICO Score (650-820)
- Date of Birth
- Full Name (First, Middle, Last)
- Complete Address (Line 1, Line 2, City, State, ZIP, Country)
- Phone Numbers (1-2 per customer)
- Government ID
- EFT Account ID
- Primary Card Holder Flag

---

## Credit Cards (10 Total)

All cards are properly linked to accounts via accountId foreign key.

| Card Number | Account ID | Embossed Name | Status | CVV | Expiry |
|-------------|------------|---------------|--------|-----|--------|
| 4532123456789012 | 12345678901 | JOHN SMITH | ACTIVE | 123 | 12/2025 |
| 4532123456789013 | 12345678901 | JANE SMITH | INACTIVE | 456 | 08/2024 |
| 5555666677778888 | 98765432109 | ROBERT JOHNSON | ACTIVE | 789 | 03/2026 |
| 4111111111111111 | 11111111111 | MARIA GARCIA | EXPIRED | 321 | 06/2023 |
| 4222222222222222 | 22222222222 | ALICE BROWN | ACTIVE | 654 | 09/2025 |
| 4333333333333333 | 33333333333 | DAVID WILSON | ACTIVE | 987 | 11/2026 |
| 4777777777777777 | 77777777777 | JENNIFER MARTINEZ | ACTIVE | 147 | 06/2027 |
| 4888888888888888 | 88888888888 | CHRISTOPHER ANDERSON | ACTIVE | 258 | 09/2028 |
| 4999999999999999 | 99999999999 | ELIZABETH TAYLOR | ACTIVE | 369 | 12/2026 |
| 4101010101010101 | 10101010101 | MICHAEL HARRIS | INACTIVE | 741 | 10/2029 |

---

## Transactions

### Transaction View Records (10 Sample Transactions)

Each transaction is linked to a card via cardNumber foreign key.

| Transaction ID | Card Number | Type | Category | Amount | Description | Date | Merchant |
|---------------|-------------|------|----------|--------|-------------|------|----------|
| 1000000000001 | 4111111111111111 | 01 | 5411 | $125.50 | GROCERY STORE PURCHASE | 2024-01-15 | SUPERMARKET XYZ |
| 1000000000002 | 4222222222222222 | 02 | 5542 | $75.25 | FUEL PURCHASE | 2024-01-14 | SHELL GAS STATION |
| 1000000000003 | 4333333333333333 | 03 | 6011 | -$200.00 | CASH WITHDRAWAL | 2024-01-13 | BANK ATM |
| 1000000000004 | 4444444444444444 | 01 | 5812 | $45.80 | RESTAURANT DINING | 2024-01-12 | ITALIAN BISTRO |
| 1000000000005 | 4555555555555555 | 02 | 5999 | $250.00 | ONLINE PURCHASE | 2024-01-11 | AMAZON.COM |
| 1000000000006 | 4666666666666666 | 01 | 5411 | $320.75 | DEPARTMENT STORE | 2024-01-10 | MACYS |
| 1000000000007 | 4777777777777777 | 02 | 5812 | $85.40 | COFFEE SHOP | 2024-01-09 | STARBUCKS COFFEE |
| 1000000000008 | 4888888888888888 | 01 | 5411 | $52.30 | PHARMACY PURCHASE | 2024-01-08 | CVS PHARMACY |
| 1000000000009 | 4999999999999999 | 02 | 7011 | $450.00 | HOTEL BOOKING | 2024-01-07 | MARRIOTT HOTELS |
| 1000000000010 | 4101010101010101 | 01 | 4511 | $275.90 | AIRLINE TICKET | 2024-01-06 | DELTA AIRLINES |

### Transaction List (50 Transactions)
The transaction list handler generates 50 transactions with randomized amounts and dates, cycling through 10 different merchant descriptions. Each transaction ID starts from 1000000000000 and increments.

---

## Users (10 Total)

| User ID | Name | Type | Role | Status | Created Date | Last Login |
|---------|------|------|------|--------|--------------|------------|
| ADMIN001 | System Administrator | A | admin | Active | 2024-01-15 | 2024-03-15 |
| USER001 | John Smith | U | back-office | Active | 2024-01-20 | 2024-03-14 |
| USER0002 | Jane Doe | U | back-office | Active | 2024-02-01 | 2024-03-13 |
| TESTUSER | Test User | U | back-office | Active | 2024-02-15 | 2024-03-12 |
| MANAGER1 | Alice Johnson | A | admin | Active | 2024-01-10 | 2024-03-15 |
| CLERK001 | Bob Wilson | U | back-office | Active | 2024-02-20 | 2024-03-11 |
| CLERK002 | Carol Brown | U | back-office | Inactive | 2024-02-25 | 2024-03-10 |
| SUPPORT1 | David Miller | U | back-office | Active | 2024-03-01 | 2024-03-09 |
| AUDITOR1 | Emily Davis | U | back-office | Active | 2024-03-05 | 2024-03-08 |
| OPERATOR | Frank Martinez | U | back-office | Active | 2024-03-10 | 2024-03-07 |

### Valid Login Credentials
- **Admin User**: `ADMIN001` / `PASSWORD`
- **Back-Office User**: `USER001` / `PASSWORD`
- **Test User**: `TESTUSER` / `TESTPASS`

---

## Bill Payments (12 Accounts Supported)

All 10 main accounts plus 2 additional test accounts are configured for bill payment operations.

| Account ID | Current Balance | Credit Limit | Status |
|------------|----------------|--------------|--------|
| 12345678901 | $1,250.75 | $5,000.00 | Active |
| 98765432109 | $0.00 | $3,000.00 | Active |
| 11111111111 | $2,500.50 | $10,000.00 | Active |
| 22222222222 | $0.00 | $2,500.00 | Active |
| 33333333333 | $8,750.25 | $15,000.00 | Active |
| 44444444444 | $0.00 | $1,000.00 | Active |
| 55555555555 | -$500.00 | $3,000.00 | Active |
| 66666666666 | $15,750.50 | $50,000.00 | Active |
| 77777777777 | $3,250.00 | $10,000.00 | Active |
| 88888888888 | $625.50 | $2,000.00 | Active |
| 99999999999 | $12,500.75 | $25,000.00 | Active |
| 10101010101 | $0.00 | $1,500.00 | Active |

---

## Data Relationships

### Account → Customer (1:1)
Each account has exactly one customer linked via `customerId`.

### Account → Card (1:N)
Each account can have multiple cards. The relationship is maintained via:
- `CardXrefRecord` table (simulated)
- `accountId` foreign key in cards
- `cardNumber` stored in account data

### Card → Transaction (1:N)
Each card can have multiple transactions:
- `cardNumber` foreign key in transactions
- Transactions reference valid card numbers
- Transaction amounts affect account balances

### User → Operations (N:M)
- Admin users (Type 'A') can perform all operations
- Back-office users (Type 'U') have restricted access
- Authentication via JWT tokens (mocked)

---

## Testing Guidelines

### Account View Testing
```
Valid Account IDs: 11111111111, 22222222222, 33333333333, 44444444444, 
                   55555555555, 66666666666, 77777777777, 88888888888,
                   99999999999, 10101010101
```

### Credit Card Testing
```
Valid Card Numbers: Use any 16-digit card from the table above
Test Cases:
- ACTIVE cards: Most cards
- INACTIVE cards: 4532123456789013, 4101010101010101
- EXPIRED card: 4111111111111111
```

### Transaction Testing
```
Valid Transaction IDs: 1000000000001 through 1000000000010 (view)
                      1000000000000 through 1000000000049 (list)
```

### User Testing
```
Search Patterns:
- By prefix: "ADMIN", "USER", "CLERK", "SUPPORT"
- Pagination: 10 users total, test with various page sizes
```

---

## Mock Behavior

### Validation Rules
All mock handlers implement the same validation rules as the backend:
- Account IDs must be 11 digits
- Card numbers must be 16 digits
- SSN format: XXX-XX-XXXX
- Phone format: XXX-XXX-XXXX
- Amounts must be valid decimals with 2 decimal places
- Dates in ISO 8601 format

### Error Scenarios
The mocks support testing various error conditions:
- Invalid format errors (400)
- Not found errors (404)
- Unauthorized errors (401)
- Business rule violations (400)
- Network errors (simulated via test endpoints)

### Success Responses
All successful operations return:
- `success: true`
- `data: {...}` with the appropriate payload
- HTTP 200 or 201 status codes

---

## Module Coverage

✅ **Accounts Module**
- Account View: 10 accounts
- Account Update: All 10 accounts updatable
- Customer data: Complete for all accounts

✅ **Cards Module**
- Card List: 10+ cards (including related cards)
- Card View: 10 detailed cards
- Card Update: All active cards updatable
- Card status management

✅ **Transactions Module**
- Transaction Add: Supports all valid cards
- Transaction List: 50 transactions with pagination
- Transaction View: 10 sample transactions
- Transaction Reports: Multi-account aggregation

✅ **Bills Module**
- Bill Payment: 12 accounts supported
- Payment processing: Full flow with confirmations
- Balance validation

✅ **Users/Admin Module**
- User List: 10 users with search
- User Add: New user creation
- User Update: Modify existing users
- User Delete: Remove users (with restrictions)

✅ **Menu/Navigation**
- Main menu: All back-office options
- Admin menu: Security functions
- Menu validation

✅ **Authentication**
- Login: 3 valid user credentials
- Logout: Full session cleanup
- Token validation: JWT simulation
- Token refresh: Auto-refresh support

---

## Quick Test Commands

### Enable Mocks
```bash
# Already enabled in .env.development
echo "VITE_USE_MOCKS=true" > frontend/.env.development
```

### Start Development Server
```bash
cd frontend
npm run dev
```

### Verify MSW is Running
Check browser console for: `🔶 MSW enabled for development`

---

## Notes

1. **Data Consistency**: All cross-references are maintained (accountId ↔ cardNumber ↔ customerId)
2. **Pagination**: All list endpoints support pagination with 10+ records
3. **Realistic Data**: Names, addresses, and amounts reflect real-world scenarios
4. **Test Coverage**: Minimum 10 records per entity as per AC2
5. **CRUD Operations**: All Create, Read, Update, Delete operations are fully mocked
6. **Validation**: Business rules from `system-overview.md` are implemented

---

## Last Updated
2026-01-21 - DS3A-6 Implementation
