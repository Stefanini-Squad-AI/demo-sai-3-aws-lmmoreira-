# Mock Data Quick Reference Card

## 🚀 Quick Start
```bash
# Already enabled in .env.development
VITE_USE_MOCKS=true

# Start dev server
npm run dev

# Verify mocks are working
# Look for: "🔶 MSW enabled for development" in browser console
```

## 🔐 Test Login Credentials
| User ID | Password | Role |
|---------|----------|------|
| ADMIN001 | PASSWORD | Admin |
| USER001 | PASSWORD | Back-Office |
| TESTUSER | TESTPASS | Back-Office |

## 💳 Test Account IDs (all 11 digits)
```
11111111111 - John Smith (Premium, $1,250.75)
22222222222 - Jane Doe (Standard, $0.00) - INACTIVE
33333333333 - Robert Johnson (Platinum, $8,750.25)
44444444444 - Maria Garcia (Basic, $0.00)
55555555555 - David Wilson (Gold, -$500.00) - CREDIT
66666666666 - Sarah Thompson (Corporate, $15,750.50)
77777777777 - Jennifer Martinez (Gold, $3,250.00)
88888888888 - Christopher Anderson (Silver, $625.50)
99999999999 - Elizabeth Taylor (Platinum, $12,500.75)
10101010101 - Michael Harris (Basic, $0.00) - INACTIVE
```

## 💳 Test Card Numbers (all 16 digits)
```
4111111111111111 - MARIA GARCIA (EXPIRED)
4222222222222222 - ALICE BROWN (ACTIVE)
4333333333333333 - DAVID WILSON (ACTIVE)
4444444444444444 - Account 44444444444
4555555555555555 - Account 55555555555
4666666666666666 - Account 66666666666
4777777777777777 - JENNIFER MARTINEZ (ACTIVE)
4888888888888888 - CHRISTOPHER ANDERSON (ACTIVE)
4999999999999999 - ELIZABETH TAYLOR (ACTIVE)
4101010101010101 - MICHAEL HARRIS (INACTIVE)
```

## 📊 Test Transaction IDs
```
View: 1000000000001 through 1000000000010
List: 1000000000000 through 1000000000049 (50 total)
```

## 👥 Test User IDs
```
ADMIN001  - System Administrator (Admin)
USER001   - John Smith (Back-Office)
USER0002  - Jane Doe (Back-Office)
TESTUSER  - Test User (Back-Office)
MANAGER1  - Alice Johnson (Admin)
CLERK001  - Bob Wilson (Back-Office)
CLERK002  - Carol Brown (INACTIVE)
SUPPORT1  - David Miller (Back-Office)
AUDITOR1  - Emily Davis (Back-Office)
OPERATOR  - Frank Martinez (Back-Office)
```

## 🔄 Toggle Mocks
```bash
# Use mocks (development)
echo "VITE_USE_MOCKS=true" >> .env.development

# Use real backend
echo "VITE_USE_MOCKS=false" >> .env.development

# Restart dev server after change
```

## ✅ Validate Data
```bash
bash validate-mocks.sh
# Should show: "✓ ALL ACCEPTANCE CRITERIA MET"
```

## 📚 Full Documentation
- **Complete reference**: `MOCK_DATA_SUMMARY.md`
- **Implementation details**: `DS3A-6-IMPLEMENTATION.md`
- **Validation script**: `validate-mocks.sh`

## 🎯 Common Test Scenarios

### Test Pagination
Use accounts, cards, or users list with 10+ records

### Test Search
- Users: Search by "ADMIN", "CLERK", "USER"
- Accounts: Enter any 11-digit ID above

### Test Status Filters
- Active accounts: Most accounts
- Inactive: 22222222222, 10101010101
- Expired cards: 4111111111111111

### Test Balance Scenarios
- Zero balance: 22222222222, 44444444444, 10101010101
- Negative (credit): 55555555555
- High balance: 66666666666, 99999999999

### Test Error Cases
- Invalid format: "123" (too short)
- Not found: "99999999998"
- Missing required fields: Empty submission

## 📈 Data Counts
| Entity | Count | Notes |
|--------|-------|-------|
| Accounts | 10 | With full customer data |
| Cards | 10 | Linked to accounts |
| Transactions (View) | 10 | Sample records |
| Transactions (List) | 50 | For pagination testing |
| Users | 10 | Admin + Back-Office |
| Bill Payment Accounts | 14 | All accounts + extras |

## 🔗 Data Relationships
```
Account (accountId: 77777777777)
  ↓
Customer (customerId: 1000000007)
  ↓
Card (cardNumber: 4777777777777777)
  ↓
Transactions (cardNumber: 4777777777777777)
```

## 🛠️ Troubleshooting

### Mocks Not Loading
1. Check browser console for errors
2. Verify `VITE_USE_MOCKS=true` in `.env.development`
3. Restart dev server

### Data Not Found
1. Use IDs from this quick reference
2. Check `MOCK_DATA_SUMMARY.md` for complete list
3. Verify exact format (11 digits for accounts, 16 for cards)

### Validation Errors
1. Check format requirements
2. Review error messages (match backend rules)
3. See `system-overview.md` for business rules

---

**Last Updated**: 2026-01-21 | **Issue**: DS3A-6
