// ===== app/mocks/accountHandlers.ts =====
import { http, HttpResponse } from 'msw';
import type { AccountViewRequest, AccountViewResponse } from '~/types/account';

const mockAccountData: Record<number, AccountViewResponse> = {
  11111111111: {
    currentDate: "12/15/24",
    currentTime: "14:30:25", 
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 11111111111,
    accountStatus: "Y",
    currentBalance: 1250.75,
    creditLimit: 5000.00,
    cashCreditLimit: 1000.00,
    currentCycleCredit: 500.00,
    currentCycleDebit: 1750.75,
    openDate: "2020-01-15",
    expirationDate: "2025-12-31",
    reissueDate: "2023-06-15",
    groupId: "PREMIUM",
    customerId: 1000000001,
    customerSsn: "123-45-6789",
    ficoScore: 750,
    dateOfBirth: "1985-03-20",
    firstName: "JOHN",
    middleName: "MICHAEL",
    lastName: "SMITH",
    addressLine1: "123 MAIN STREET",
    addressLine2: "APT 4B",
    addressLine3: "",
    city: "NEW YORK",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    phoneNumber1: "555-123-4567",
    phoneNumber2: "555-987-6543",
    governmentId: "DL123456789",
    eftAccountId: "EFT001122334",
    primaryCardHolderFlag: "Y",
    cardNumber: "4111-1111-1111-1111",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  22222222222: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 22222222222,
    accountStatus: "N",
    currentBalance: 0.00,
    creditLimit: 2500.00,
    cashCreditLimit: 500.00,
    currentCycleCredit: 0.00,
    currentCycleDebit: 0.00,
    openDate: "2019-05-10",
    expirationDate: "2024-05-31",
    reissueDate: "2022-03-10",
    groupId: "STANDARD",
    customerId: 1000000002,
    customerSsn: "987-65-4321",
    ficoScore: 680,
    dateOfBirth: "1990-07-15",
    firstName: "JANE",
    middleName: "",
    lastName: "DOE",
    addressLine1: "456 OAK AVENUE",
    addressLine2: "",
    city: "LOS ANGELES",
    state: "CA",
    zipCode: "90210",
    country: "USA",
    phoneNumber1: "555-555-1234",
    phoneNumber2: "",
    governmentId: "DL987654321",
    eftAccountId: "EFT998877665",
    primaryCardHolderFlag: "Y",
    cardNumber: "4222-2222-2222-2222",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  33333333333: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 33333333333,
    accountStatus: "Y",
    currentBalance: 8750.25,
    creditLimit: 15000.00,
    cashCreditLimit: 3000.00,
    currentCycleCredit: 2500.00,
    currentCycleDebit: 11250.25,
    openDate: "2018-03-22",
    expirationDate: "2026-03-31",
    reissueDate: "2024-01-15",
    groupId: "PLATINUM",
    customerId: 1000000003,
    customerSsn: "555-44-3333",
    ficoScore: 820,
    dateOfBirth: "1975-11-08",
    firstName: "ROBERT",
    middleName: "JAMES",
    lastName: "JOHNSON",
    addressLine1: "789 PINE STREET",
    addressLine2: "SUITE 200",
    city: "CHICAGO",
    state: "IL",
    zipCode: "60601",
    country: "USA",
    phoneNumber1: "555-777-8888",
    phoneNumber2: "555-999-0000",
    governmentId: "DL555443333",
    eftAccountId: "EFT555443333",
    primaryCardHolderFlag: "Y",
    cardNumber: "4333-3333-3333-3333",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  44444444444: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 44444444444,
    accountStatus: "Y",
    currentBalance: 0.00,
    creditLimit: 1000.00,
    cashCreditLimit: 200.00,
    currentCycleCredit: 0.00,
    currentCycleDebit: 0.00,
    openDate: "2024-11-01",
    expirationDate: "2029-11-30",
    reissueDate: "2024-11-01",
    groupId: "BASIC",
    customerId: 1000000004,
    customerSsn: "111-22-3333",
    ficoScore: 650,
    dateOfBirth: "1995-06-12",
    firstName: "MARIA",
    middleName: "ELENA",
    lastName: "GARCIA",
    addressLine1: "321 MAPLE DRIVE",
    addressLine2: "",
    city: "MIAMI",
    state: "FL",
    zipCode: "33101",
    country: "USA",
    phoneNumber1: "555-444-3333",
    phoneNumber2: "555-222-1111",
    governmentId: "DL111223333",
    eftAccountId: "EFT111223333",
    primaryCardHolderFlag: "N",
    cardNumber: "4444-4444-4444-4444",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  55555555555: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 55555555555,
    accountStatus: "Y",
    currentBalance: -500.00,
    creditLimit: 3000.00,
    cashCreditLimit: 600.00,
    currentCycleCredit: 1200.00,
    currentCycleDebit: 700.00,
    openDate: "2021-08-15",
    expirationDate: "2026-08-31",
    reissueDate: "2023-08-15",
    groupId: "GOLD",
    customerId: 1000000005,
    customerSsn: "777-88-9999",
    ficoScore: 720,
    dateOfBirth: "1988-12-03",
    firstName: "DAVID",
    middleName: "ALEXANDER",
    lastName: "WILSON",
    addressLine1: "987 ELM STREET",
    addressLine2: "UNIT 15",
    city: "SEATTLE",
    state: "WA",
    zipCode: "98101",
    country: "USA",
    phoneNumber1: "555-666-7777",
    phoneNumber2: "555-888-9999",
    governmentId: "DL777889999",
    eftAccountId: "EFT777889999",
    primaryCardHolderFlag: "Y",
    cardNumber: "4555-5555-5555-5555",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  66666666666: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 66666666666,
    accountStatus: "Y",
    currentBalance: 15750.50,
    creditLimit: 50000.00,
    cashCreditLimit: 10000.00,
    currentCycleCredit: 5000.00,
    currentCycleDebit: 20750.50,
    openDate: "2017-01-10",
    expirationDate: "2027-01-31",
    reissueDate: "2022-01-10",
    groupId: "CORPORATE",
    customerId: 1000000006,
    customerSsn: "999-88-7777",
    ficoScore: 800,
    dateOfBirth: "1970-04-25",
    firstName: "SARAH",
    middleName: "ELIZABETH",
    lastName: "THOMPSON",
    addressLine1: "456 BUSINESS PLAZA",
    addressLine2: "FLOOR 12, SUITE 1200",
    city: "BOSTON",
    state: "MA",
    zipCode: "02101",
    country: "USA",
    phoneNumber1: "555-111-2222",
    phoneNumber2: "555-333-4444",
    governmentId: "DL999887777",
    eftAccountId: "EFT999887777",
    primaryCardHolderFlag: "Y",
    cardNumber: "4666-6666-6666-6666",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  77777777777: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 77777777777,
    accountStatus: "Y",
    currentBalance: 3250.00,
    creditLimit: 10000.00,
    cashCreditLimit: 2000.00,
    currentCycleCredit: 1500.00,
    currentCycleDebit: 4750.00,
    openDate: "2022-06-10",
    expirationDate: "2027-06-30",
    reissueDate: "2024-06-10",
    groupId: "GOLD",
    customerId: 1000000007,
    customerSsn: "222-33-4444",
    ficoScore: 740,
    dateOfBirth: "1992-09-18",
    firstName: "JENNIFER",
    middleName: "LYNN",
    lastName: "MARTINEZ",
    addressLine1: "654 CEDAR LANE",
    addressLine2: "APT 22C",
    city: "HOUSTON",
    state: "TX",
    zipCode: "77001",
    country: "USA",
    phoneNumber1: "555-234-5678",
    phoneNumber2: "555-345-6789",
    governmentId: "DL222334444",
    eftAccountId: "EFT222334444",
    primaryCardHolderFlag: "Y",
    cardNumber: "4777-7777-7777-7777",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  88888888888: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 88888888888,
    accountStatus: "Y",
    currentBalance: 625.50,
    creditLimit: 2000.00,
    cashCreditLimit: 400.00,
    currentCycleCredit: 250.00,
    currentCycleDebit: 875.50,
    openDate: "2023-09-05",
    expirationDate: "2028-09-30",
    reissueDate: "2023-09-05",
    groupId: "SILVER",
    customerId: 1000000008,
    customerSsn: "333-44-5555",
    ficoScore: 690,
    dateOfBirth: "1998-02-14",
    firstName: "CHRISTOPHER",
    middleName: "PAUL",
    lastName: "ANDERSON",
    addressLine1: "321 BIRCH STREET",
    addressLine2: "",
    city: "PHOENIX",
    state: "AZ",
    zipCode: "85001",
    country: "USA",
    phoneNumber1: "555-456-7890",
    phoneNumber2: "",
    governmentId: "DL333445555",
    eftAccountId: "EFT333445555",
    primaryCardHolderFlag: "Y",
    cardNumber: "4888-8888-8888-8888",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  99999999999: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 99999999999,
    accountStatus: "Y",
    currentBalance: 12500.75,
    creditLimit: 25000.00,
    cashCreditLimit: 5000.00,
    currentCycleCredit: 3000.00,
    currentCycleDebit: 15500.75,
    openDate: "2019-12-01",
    expirationDate: "2026-12-31",
    reissueDate: "2023-12-01",
    groupId: "PLATINUM",
    customerId: 1000000009,
    customerSsn: "444-55-6666",
    ficoScore: 810,
    dateOfBirth: "1980-05-30",
    firstName: "ELIZABETH",
    middleName: "ANN",
    lastName: "TAYLOR",
    addressLine1: "789 WILLOW AVENUE",
    addressLine2: "PENTHOUSE 1",
    city: "SAN FRANCISCO",
    state: "CA",
    zipCode: "94101",
    country: "USA",
    phoneNumber1: "555-567-8901",
    phoneNumber2: "555-678-9012",
    governmentId: "DL444556666",
    eftAccountId: "EFT444556666",
    primaryCardHolderFlag: "Y",
    cardNumber: "4999-9999-9999-9999",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
  10101010101: {
    currentDate: "12/15/24",
    currentTime: "14:30:25",
    transactionId: "CAVW",
    programName: "COACTVWC",
    accountId: 10101010101,
    accountStatus: "N",
    currentBalance: 0.00,
    creditLimit: 1500.00,
    cashCreditLimit: 300.00,
    currentCycleCredit: 0.00,
    currentCycleDebit: 0.00,
    openDate: "2024-10-15",
    expirationDate: "2029-10-31",
    reissueDate: "2024-10-15",
    groupId: "BASIC",
    customerId: 1000000010,
    customerSsn: "555-66-7777",
    ficoScore: 660,
    dateOfBirth: "2000-11-22",
    firstName: "MICHAEL",
    middleName: "THOMAS",
    lastName: "HARRIS",
    addressLine1: "123 SPRUCE DRIVE",
    addressLine2: "UNIT 5A",
    city: "DENVER",
    state: "CO",
    zipCode: "80201",
    country: "USA",
    phoneNumber1: "555-789-0123",
    phoneNumber2: "555-890-1234",
    governmentId: "DL555667777",
    eftAccountId: "EFT555667777",
    primaryCardHolderFlag: "N",
    cardNumber: "4101-0101-0101-0101",
    infoMessage: "Displaying details of given Account",
    inputValid: true,
    accountFilterValid: true,
    customerFilterValid: true,
    foundAccountInMaster: true,
    foundCustomerInMaster: true,
  },
};

export const accountHandlers = [
  // ✅ NUEVO: Handler para GET /api/account-view con query params
  http.get('/api/account-view', ({ request }) => {
    const url = new URL(request.url);
    const accountIdParam = url.searchParams.get('accountId');

    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit' 
    });
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Validar que se proporcione accountId
    if (!accountIdParam) {
      return HttpResponse.json({
        success: true,
        data: {
          currentDate,
          currentTime,
          transactionId: "CAVW",
          programName: "COACTVWC",
          errorMessage: "Account number not provided",
          inputValid: false,
          accountFilterValid: false,
        },
      });
    }

    // Convertir a número y validar formato
    const accountId = parseInt(accountIdParam, 10);
    const accountIdStr = accountId.toString();
    
    if (isNaN(accountId) || accountIdStr.length !== 11 || !/^\d{11}$/.test(accountIdStr)) {
      return HttpResponse.json({
        success: true,
        data: {
          currentDate,
          currentTime,
          transactionId: "CAVW",
          programName: "COACTVWC",
          errorMessage: "Account Filter must be a non-zero 11 digit number",
          inputValid: false,
          accountFilterValid: false,
        },
      });
    }

    // Buscar cuenta en datos mock
    const accountData = mockAccountData[accountId];
    
    if (!accountData) {
      return HttpResponse.json({
        success: true,
        data: {
          currentDate,
          currentTime,
          transactionId: "CAVW",
          programName: "COACTVWC",
          errorMessage: `Account:${accountId} not found in Cross ref file`,
          inputValid: false,
          accountFilterValid: false,
        },
      });
    }

    console.log('✅ MSW Account View - Found account:', accountId);

    // Simular delay de red
    return HttpResponse.json({
      success: true,
      data: {
        ...accountData,
        currentDate,
        currentTime,
      },
    });
  }),

  http.get('/api/account-view/initialize', () => {
    const now = new Date();
    return HttpResponse.json({
      success: true,
      data: {
        currentDate: now.toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: '2-digit' 
        }),
        currentTime: now.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        transactionId: "CAVW",
        programName: "COACTVWC",
        infoMessage: "Enter or update id of account to display",
        inputValid: true,
      },
    });
  }),

  http.post('/api/account-view/process', async ({ request }) => {
    const body = await request.json() as { accountId: number };
    
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit' 
    });
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (!body.accountId || body.accountId === 0) {
      return HttpResponse.json({
        success: true,
        data: {
          currentDate,
          currentTime,
          transactionId: "CAVW",
          programName: "COACTVWC",
          errorMessage: "Account number not provided",
          inputValid: false,
          accountFilterValid: false,
        },
      });
    }

    const accountIdStr = body.accountId.toString();
    if (accountIdStr.length !== 11 || !/^\d{11}$/.test(accountIdStr)) {
      return HttpResponse.json({
        success: true,
        data: {
          currentDate,
          currentTime,
          transactionId: "CAVW",
          programName: "COACTVWC",
          errorMessage: "Account Filter must be a non-zero 11 digit number",
          inputValid: false,
          accountFilterValid: false,
        },
      });
    }

    const accountData = mockAccountData[body.accountId];
    
    if (!accountData) {
      return HttpResponse.json({
        success: true,
        data: {
          currentDate,
          currentTime,
          transactionId: "CAVW",
          programName: "COACTVWC",
          errorMessage: `Account:${body.accountId} not found in Cross ref file`,
          inputValid: false,
          accountFilterValid: false,
        },
      });
    }

    return HttpResponse.json({
      success: true,
      data: {
        ...accountData,
        currentDate,
        currentTime,
      },
    });
  }),

  http.get('/api/account-view/test-accounts', () => {
    return HttpResponse.json({
      success: true,
      data: {
        message: "Available test accounts for development",
        accounts: [
          {
            accountId: "11111111111",
            description: "Active account - John Smith - Premium",
            status: "Active",
            balance: "$1,250.75",
            city: "New York"
          },
          {
            accountId: "22222222222", 
            description: "Inactive account - Jane Doe - Standard",
            status: "Inactive",
            balance: "$0.00",
            city: "Los Angeles"
          },
          {
            accountId: "33333333333",
            description: "High balance account - Robert Johnson - Platinum", 
            status: "Active",
            balance: "$8,750.25",
            city: "Chicago"
          },
          {
            accountId: "44444444444",
            description: "New account - Maria Garcia - Basic",
            status: "Active", 
            balance: "$0.00",
            city: "Miami"
          },
          {
            accountId: "55555555555",
            description: "Credit available - David Wilson - Gold",
            status: "Active",
            balance: "-$500.00",
            city: "Seattle"
          },
          {
            accountId: "66666666666",
            description: "Corporate account - Sarah Thompson - Corporate",
            status: "Active",
            balance: "$15,750.50",
            city: "Boston"
          },
          {
            accountId: "77777777777",
            description: "Mid-balance account - Jennifer Martinez - Gold",
            status: "Active",
            balance: "$3,250.00",
            city: "Houston"
          },
          {
            accountId: "88888888888",
            description: "Low-balance account - Christopher Anderson - Silver",
            status: "Active",
            balance: "$625.50",
            city: "Phoenix"
          },
          {
            accountId: "99999999999",
            description: "Premium account - Elizabeth Taylor - Platinum",
            status: "Active",
            balance: "$12,500.75",
            city: "San Francisco"
          },
          {
            accountId: "10101010101",
            description: "Brand new account - Michael Harris - Basic",
            status: "Inactive",
            balance: "$0.00",
            city: "Denver"
          }
        ]
      },
    });
  }),

  http.post('/api/account-view/test-error/:errorType', async ({ params }) => {
    const { errorType } = params;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit' 
    });
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    switch (errorType) {
      case 'network':
        return HttpResponse.error();
      
      case 'timeout':
        await new Promise(resolve => setTimeout(resolve, 15000));
        return HttpResponse.json({ success: false });
      
      case 'server-error':
        return HttpResponse.json(
          {
            success: true,
            data: {
              currentDate,
              currentTime,
              transactionId: "CAVW",
              programName: "COACTVWC",
              errorMessage: "Internal server error occurred",
              inputValid: false,
            },
          },
          { status: 500 }
        );
      
      default:
        return HttpResponse.json({
          success: true,
          data: {
            currentDate,
            currentTime,
            transactionId: "CAVW",
            programName: "COACTVWC",
            errorMessage: "Unknown error type",
            inputValid: false,
          },
        });
    }
  }),
];