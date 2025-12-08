# Wallet API Endpoints Documentation

## Overview

The Wallet API provides endpoints for connecting, managing, and querying user wallets in the Gami Protocol ecosystem. These endpoints are designed to work seamlessly with the ASI:One natural language wallet integration.

## Base URL

```
http://localhost:4000/api/wallet
```

## Authentication

Currently, the API uses user_id for identification. In production, implement proper authentication with JWT tokens or session management.

## Endpoints

### 1. Connect Wallet

Connect a user's wallet to the Gami Protocol.

**Endpoint:** `POST /api/wallet/connect`

**Request Body:**
```json
{
  "user_id": "string (required)",
  "wallet_type": "string (required) - one of: metamask, walletconnect, coinbase, gami_universal",
  "chain_id": "string (required) - blockchain network ID (e.g., '1', '137')",
  "wallet_address": "string (optional) - 0x-prefixed Ethereum address"
}
```

**Response (Success - 200):**
```json
{
  "status": "success",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "chain_id": "137",
  "wallet_type": "metamask",
  "message": "Successfully connected metamask wallet on chain 137"
}
```

**Response (Already Connected - 200):**
```json
{
  "status": "already_connected",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "chain_id": "137",
  "wallet_type": "metamask",
  "message": "Wallet already connected"
}
```

**Error Responses:**
```json
// Invalid User ID (400)
{
  "error": "INVALID_USER_ID",
  "message": "user_id is required and must be a string"
}

// Invalid Wallet Type (400)
{
  "error": "INVALID_WALLET_TYPE",
  "message": "wallet_type must be one of: metamask, walletconnect, coinbase, gami_universal"
}

// Invalid Chain ID (400)
{
  "error": "INVALID_CHAIN_ID",
  "message": "chain_id is required and must be a string"
}

// Invalid Address (400)
{
  "error": "INVALID_ADDRESS",
  "message": "wallet_address must be a valid Ethereum address"
}

// Connection Failed (500)
{
  "error": "CONNECTION_FAILED",
  "message": "Error details"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/wallet/connect \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "wallet_type": "metamask",
    "chain_id": "137",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'
```

---

### 2. Disconnect Wallet

Disconnect a wallet from a user's account.

**Endpoint:** `POST /api/wallet/disconnect`

**Request Body:**
```json
{
  "user_id": "string (required)",
  "wallet_address": "string (required) - 0x-prefixed Ethereum address"
}
```

**Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Wallet 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb disconnected successfully"
}
```

**Error Responses:**
```json
// Invalid User ID (400)
{
  "error": "INVALID_USER_ID",
  "message": "user_id is required"
}

// Invalid Address (400)
{
  "error": "INVALID_ADDRESS",
  "message": "wallet_address must be a valid Ethereum address"
}

// No Wallets (404)
{
  "error": "NO_WALLETS",
  "message": "No wallets connected for this user"
}

// Wallet Not Found (404)
{
  "error": "WALLET_NOT_FOUND",
  "message": "Wallet not found in user connections"
}

// Disconnection Failed (500)
{
  "error": "DISCONNECTION_FAILED",
  "message": "Error details"
}
```

**Example:**
```bash
curl -X POST http://localhost:4000/api/wallet/disconnect \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'
```

---

### 3. List Connected Wallets

Get all connected wallets for a user.

**Endpoint:** `GET /api/wallet/list/:user_id`

**Path Parameters:**
- `user_id` (required) - User identifier

**Response (Success - 200):**
```json
{
  "user_id": "user_123",
  "wallets": [
    {
      "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "wallet_type": "metamask",
      "chain_id": "137",
      "connected_at": "2024-12-07T16:00:00.000Z"
    },
    {
      "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "wallet_type": "metamask",
      "chain_id": "1",
      "connected_at": "2024-12-07T16:05:00.000Z"
    }
  ],
  "count": 2
}
```

**Response (No Wallets - 200):**
```json
{
  "user_id": "user_123",
  "wallets": [],
  "count": 0
}
```

**Error Responses:**
```json
// Invalid User ID (400)
{
  "error": "INVALID_USER_ID",
  "message": "user_id is required"
}

// List Failed (500)
{
  "error": "LIST_FAILED",
  "message": "Error details"
}
```

**Example:**
```bash
curl http://localhost:4000/api/wallet/list/user_123
```

---

### 4. Verify Wallet Address

Verify if a wallet address is valid and get basic on-chain information.

**Endpoint:** `GET /api/wallet/verify/:wallet_address`

**Path Parameters:**
- `wallet_address` (required) - 0x-prefixed Ethereum address

**Response (On-Chain Wallet - 200):**
```json
{
  "valid": true,
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "on_chain": true,
  "level": "5",
  "total_xp": "12500"
}
```

**Response (Valid Format, Not On-Chain - 200):**
```json
{
  "valid": true,
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "on_chain": false,
  "message": "Valid address format, but no on-chain data found"
}
```

**Error Responses:**
```json
// Invalid Address (400)
{
  "error": "INVALID_ADDRESS",
  "message": "wallet_address must be a valid Ethereum address"
}
```

**Example:**
```bash
curl http://localhost:4000/api/wallet/verify/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

---

## Integration with ASI:One

These endpoints are designed to work with the ASI:One wallet agent. Example flow:

```python
# User says: "Connect my MetaMask to Polygon"
# ASI:One generates tool call:
{
  "function": "connect_wallet",
  "arguments": {
    "user_id": "user_123",
    "wallet_type": "metamask",
    "chain_id": "137"
  }
}

# Wallet service calls API:
POST /api/wallet/connect
{
  "user_id": "user_123",
  "wallet_type": "metamask",
  "chain_id": "137"
}

# Response:
{
  "status": "success",
  "wallet_address": "0x742d35...",
  "message": "Successfully connected metamask wallet on chain 137"
}

# ASI:One formats response:
"Your MetaMask wallet has been successfully connected to Polygon. 
Your address is 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb."
```

## Supported Wallet Types

- `metamask` - MetaMask browser extension
- `walletconnect` - WalletConnect protocol
- `coinbase` - Coinbase Wallet
- `gami_universal` - Gami Universal Wallet (native)

## Supported Chain IDs

- `1` - Ethereum Mainnet
- `137` - Polygon (Matic) Mainnet
- `1337` - Local development chain
- `11155111` - Sepolia Testnet
- `80001` - Mumbai Testnet (Polygon)

## Storage

**Current Implementation (Development):**
- In-memory Map storage
- Data is lost on server restart
- Not suitable for production

**Production Recommendations:**
- Redis for session management
- PostgreSQL for persistent wallet associations
- MongoDB for flexible wallet metadata storage

## Security Considerations

### Current Implementation
- Basic address validation
- User ID-based access (no authentication)
- No rate limiting

### Production Requirements
1. **Authentication**: Implement JWT or session-based authentication
2. **Authorization**: Verify user owns the wallet address (signature verification)
3. **Rate Limiting**: Prevent abuse of connection endpoints
4. **Encryption**: Encrypt sensitive data at rest
5. **Audit Logging**: Log all wallet operations
6. **Input Validation**: Enhanced validation and sanitization
7. **CORS Configuration**: Restrict allowed origins

## Testing

Run the test suite:

```bash
# Start the server
npm start

# In another terminal, run tests
node test-wallet-api.js
```

Expected output:
```
═══════════════════════════════════════════════════════════════
  Gami Wallet API - Test Suite
═══════════════════════════════════════════════════════════════

Test 1: Health Check
✅ PASS - Health check returned OK

Test 2: Connect Wallet - Success
✅ PASS - Wallet connected successfully
   Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

...

═══════════════════════════════════════════════════════════════
  Test Summary
═══════════════════════════════════════════════════════════════
  Total Tests: 10
  ✅ Passed: 10
  ❌ Failed: 0
  Success Rate: 100%
═══════════════════════════════════════════════════════════════
```

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

Common error codes:
- `INVALID_USER_ID` - User ID is missing or invalid
- `INVALID_WALLET_TYPE` - Wallet type is not supported
- `INVALID_CHAIN_ID` - Chain ID is missing or invalid
- `INVALID_ADDRESS` - Wallet address format is invalid
- `INVALID_AMOUNT` - Amount parameter is invalid
- `CONNECTION_FAILED` - Wallet connection failed
- `DISCONNECTION_FAILED` - Wallet disconnection failed
- `LIST_FAILED` - Failed to retrieve wallet list
- `NO_WALLETS` - User has no connected wallets
- `WALLET_NOT_FOUND` - Specified wallet not found
- `CHAIN_REQUEST_FAILED` - Blockchain request failed

## Monitoring

Key metrics to track:
- `wallet_connections_total` - Total wallet connections
- `wallet_connections_failed` - Failed connection attempts
- `wallet_disconnections_total` - Total disconnections
- `wallet_list_requests_total` - Wallet list queries
- `wallet_verification_requests_total` - Address verifications
- `api_response_time_seconds` - Endpoint response times

## Next Steps

1. **Implement Persistent Storage**: Replace in-memory storage with Redis/PostgreSQL
2. **Add Authentication**: Implement JWT-based authentication
3. **Add Signature Verification**: Verify wallet ownership with signatures
4. **Implement Rate Limiting**: Add rate limiting middleware
5. **Add Monitoring**: Set up Prometheus metrics
6. **Enhance Security**: Add additional security layers
7. **Deploy to Production**: Deploy with proper configuration

## Support

For issues or questions:
- Check this documentation
- Review test cases in `test-wallet-api.js`
- See integration examples in `Gami_Agents/WALLET_INTEGRATION_GUIDE.md`
