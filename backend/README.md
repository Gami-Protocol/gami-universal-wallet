# Gami Universal Wallet Backend

REST API backend for wallet management in the Gami Protocol ecosystem. Provides endpoints for wallet connection, disconnection, and management, designed to work seamlessly with the ASI:One natural language wallet integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Gami Protocol Chain running (for on-chain features)

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your settings
nano .env
```

### Running the Server

```bash
# Development mode
npm start

# The server will start on http://localhost:4000
```

### Testing

```bash
# Run test suite
npm test

# Expected output: All tests passing
```

## 📁 Project Structure

```
backend/
├── server.js              # Main Express server with wallet endpoints
├── test-wallet-api.js     # Comprehensive API test suite
├── WALLET_API_DOCS.md     # Complete API documentation
├── .env.example           # Environment configuration template
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🎯 API Endpoints

### Wallet Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/wallet/connect` | Connect a wallet for a user |
| POST | `/api/wallet/disconnect` | Disconnect a wallet |
| GET | `/api/wallet/list/:user_id` | Get all connected wallets |
| GET | `/api/wallet/verify/:address` | Verify wallet address |

### Chain Queries (Existing)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chain/users/:address/stats` | Get user stats from chain |
| GET | `/api/chain/agents/:address/budget` | Check agent budget |
| GET | `/api/chain/economy/inflation-rate` | Get inflation rate |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

See [WALLET_API_DOCS.md](./WALLET_API_DOCS.md) for complete API documentation.

## 🔧 Configuration

### Environment Variables

```bash
# Server
PORT=4000                              # Server port
NODE_ENV=development                   # Environment

# Chain
GAMI_RPC_URL=http://localhost:8545     # Gami Protocol Chain RPC

# CORS
CORS_ORIGIN=http://localhost:3000      # Allowed frontend origin
```

See `.env.example` for all available configuration options.

## 📊 Features

### Current Features (v0.1.0)

✅ **Wallet Connection**
- Connect MetaMask, WalletConnect, Coinbase Wallet
- Multi-chain support (Ethereum, Polygon, custom)
- Duplicate connection detection
- Auto-generated addresses for testing

✅ **Wallet Management**
- List connected wallets per user
- Disconnect specific wallets
- Wallet verification with on-chain data
- Connection timestamp tracking

✅ **Chain Integration**
- User stats queries
- Agent budget checks
- Economy data retrieval
- Inflation rate queries

✅ **Testing**
- Comprehensive test suite (10 tests)
- Automated API testing
- Error scenario coverage
- Success rate reporting

### Storage

**Current (Development):**
- In-memory Map storage
- Fast, simple, suitable for development
- Data lost on server restart

**Recommended (Production):**
- **Redis**: Session management, temporary data
- **PostgreSQL**: Persistent wallet associations
- **MongoDB**: Flexible wallet metadata

## 🔐 Security

### Current Implementation
- Basic address validation (0x-prefixed, 40 hex chars)
- Input sanitization
- Error message sanitization
- CORS enabled

### Production Requirements

⚠️ **Important**: The current implementation is for development only. Before production deployment, implement:

1. **Authentication & Authorization**
   - JWT token-based authentication
   - Signature verification for wallet ownership
   - Role-based access control

2. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per window
   });
   
   app.use('/api/', limiter);
   ```

3. **Input Validation**
   ```javascript
   const { body, validationResult } = require('express-validator');
   
   app.post('/api/wallet/connect', [
     body('user_id').isString().notEmpty(),
     body('wallet_type').isIn(['metamask', 'walletconnect', 'coinbase']),
     body('chain_id').isString().notEmpty()
   ], (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     // ... handle request
   });
   ```

4. **Encryption**
   - Encrypt sensitive data at rest
   - Use HTTPS in production
   - Secure environment variables

5. **Audit Logging**
   ```javascript
   function logWalletOperation(userId, operation, details) {
     console.log({
       timestamp: new Date().toISOString(),
       user_id: userId,
       operation,
       details,
       ip: req.ip
     });
   }
   ```

## 🧪 Testing

### Running Tests

```bash
# Start server in one terminal
npm start

# Run tests in another terminal
npm test
```

### Test Coverage

The test suite covers:
- ✅ Health check
- ✅ Wallet connection (success)
- ✅ Duplicate connection detection
- ✅ Wallet listing
- ✅ Multi-chain connections
- ✅ Wallet verification
- ✅ Wallet disconnection
- ✅ Invalid address rejection
- ✅ Missing parameter validation
- ✅ Error handling

### Manual Testing with curl

```bash
# Connect wallet
curl -X POST http://localhost:4000/api/wallet/connect \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "wallet_type": "metamask",
    "chain_id": "137",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'

# List wallets
curl http://localhost:4000/api/wallet/list/test_user

# Verify address
curl http://localhost:4000/api/wallet/verify/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# Disconnect wallet
curl -X POST http://localhost:4000/api/wallet/disconnect \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'
```

## 🔗 Integration with ASI:One

This backend integrates with the Gami_Agents ASI:One wallet system:

```python
# In Gami_Agents/shared/wallet_service.py

async def connect(self, user_id: str, wallet_type: str, chain_id: str):
    """Connect wallet via backend API"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{self.wallet_api_url}/wallet/connect",
            json={
                "user_id": user_id,
                "wallet_type": wallet_type,
                "chain_id": chain_id
            }
        )
        return response.json()
```

User flow:
1. User says: "Connect my MetaMask to Polygon"
2. ASI:One interprets intent
3. Wallet agent calls this backend API
4. Backend connects wallet
5. Response formatted by ASI:One

## 📈 Monitoring

### Health Check

```bash
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "rpcUrl": "http://localhost:8545"
}
```

### Metrics to Track (Production)

```javascript
// Add prometheus-express middleware
const promClient = require('prom-client');

const walletConnectionsTotal = new promClient.Counter({
  name: 'wallet_connections_total',
  help: 'Total wallet connections'
});

const walletConnectionsFailed = new promClient.Counter({
  name: 'wallet_connections_failed',
  help: 'Failed wallet connections'
});

const apiResponseTime = new promClient.Histogram({
  name: 'api_response_time_seconds',
  help: 'API response time in seconds'
});
```

## 🚀 Deployment

### Development

```bash
npm start
```

### Production

```bash
# Install dependencies
npm ci --production

# Set environment
export NODE_ENV=production
export PORT=4000
export GAMI_RPC_URL=https://rpc.gami.io

# Start with PM2
pm2 start server.js --name gami-wallet-backend

# Or with Docker
docker build -t gami-wallet-backend .
docker run -p 4000:4000 -e NODE_ENV=production gami-wallet-backend
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t gami-wallet-backend .
docker run -p 4000:4000 \
  -e GAMI_RPC_URL=http://chain:8545 \
  gami-wallet-backend
```

## 🐛 Troubleshooting

### Server Won't Start

**Problem:** Port already in use
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5000 npm start
```

### Chain Connection Errors

**Problem:** Cannot connect to chain
```
Error: CHAIN_REQUEST_FAILED
```

**Solution:**
1. Verify chain is running: `curl http://localhost:8545`
2. Check `GAMI_RPC_URL` in `.env`
3. Ensure chain is synced and accessible

### Tests Failing

**Problem:** Test suite fails
```
❌ FAIL - Wallet connection error
```

**Solution:**
1. Ensure server is running: `npm start`
2. Check server logs for errors
3. Verify API URL in test script matches server port

## 📚 Documentation

- **[WALLET_API_DOCS.md](./WALLET_API_DOCS.md)** - Complete API documentation
- **[Gami_Agents/WALLET_INTEGRATION_GUIDE.md](../../Gami_Agents/WALLET_INTEGRATION_GUIDE.md)** - ASI:One integration guide
- **[test-wallet-api.js](./test-wallet-api.js)** - API test examples

## 🔄 Changelog

### v0.1.0 (2024-12-07)
- ✨ Initial wallet API implementation
- ✨ POST `/api/wallet/connect` endpoint
- ✨ POST `/api/wallet/disconnect` endpoint  
- ✨ GET `/api/wallet/list/:user_id` endpoint
- ✨ GET `/api/wallet/verify/:address` endpoint
- ✨ Comprehensive test suite
- 📝 Complete API documentation
- 🐛 Address validation and sanitization

## 🛠️ Development

### Adding New Endpoints

1. Add route to `server.js`
2. Implement handler with error handling
3. Add tests to `test-wallet-api.js`
4. Document in `WALLET_API_DOCS.md`
5. Update this README

### Code Style

- Use async/await for asynchronous operations
- Validate all inputs
- Return consistent error format
- Log important operations
- Include JSDoc comments

## 🤝 Contributing

1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit pull request

## 📄 License

Part of Gami Protocol - See main repository for license details

## 🆘 Support

- **Issues**: Create issue in main repository
- **Documentation**: Check WALLET_API_DOCS.md
- **Integration**: See Gami_Agents integration guide
- **Testing**: Run `npm test` for examples

---

**Status**: ✅ Development Complete
**Version**: 0.1.0
**Last Updated**: December 7, 2024
