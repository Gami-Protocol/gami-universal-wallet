const express = require('express');
const cors = require('cors');
const { GamiWallet } = require('@gami/wallet-sdk');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const RPC_URL = process.env.GAMI_RPC_URL || 'http://localhost:8545';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for connected wallets (replace with Redis/DB in production)
const connectedWallets = new Map(); // user_id -> { wallets: [{ address, type, chain_id, connected_at }] }

function sanitizeAddress(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  return ADDRESS_REGEX.test(trimmed) ? trimmed : null;
}

async function initWallet(address) {
  const wallet = new GamiWallet(RPC_URL);
  await wallet.connectReadOnly(address);
  return wallet;
}

function handleError(res, error) {
  console.error('[gami-wallet-backend] chain error:', error);
  res.status(500).json({ error: 'CHAIN_REQUEST_FAILED', message: error.message });
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', rpcUrl: RPC_URL });
});

// ============================================================================
// WALLET MANAGEMENT ENDPOINTS (ASI:One Integration)
// ============================================================================

/**
 * POST /api/wallet/connect
 * Connect a wallet for a user
 * Body: { user_id, wallet_type, chain_id, wallet_address? }
 */
app.post('/api/wallet/connect', async (req, res) => {
  const { user_id, wallet_type, chain_id, wallet_address } = req.body;

  // Validation
  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ 
      error: 'INVALID_USER_ID', 
      message: 'user_id is required and must be a string' 
    });
  }

  if (!wallet_type || !['metamask', 'walletconnect', 'coinbase', 'gami_universal'].includes(wallet_type)) {
    return res.status(400).json({ 
      error: 'INVALID_WALLET_TYPE', 
      message: 'wallet_type must be one of: metamask, walletconnect, coinbase, gami_universal' 
    });
  }

  if (!chain_id || typeof chain_id !== 'string') {
    return res.status(400).json({ 
      error: 'INVALID_CHAIN_ID', 
      message: 'chain_id is required and must be a string' 
    });
  }

  try {
    // Generate or use provided wallet address
    let address = wallet_address;
    if (!address) {
      // In production, this would trigger wallet connection flow
      // For now, generate a mock address for testing
      address = `0x${Math.random().toString(16).substr(2, 40).padEnd(40, '0')}`;
    } else {
      address = sanitizeAddress(address);
      if (!address) {
        return res.status(400).json({ 
          error: 'INVALID_ADDRESS', 
          message: 'wallet_address must be a valid Ethereum address' 
        });
      }
    }

    // Get or create user wallet list
    if (!connectedWallets.has(user_id)) {
      connectedWallets.set(user_id, { wallets: [] });
    }

    const userWallets = connectedWallets.get(user_id);

    // Check if wallet already connected
    const existing = userWallets.wallets.find(
      w => w.address.toLowerCase() === address.toLowerCase() && w.chain_id === chain_id
    );

    if (existing) {
      return res.json({
        status: 'already_connected',
        wallet_address: address,
        chain_id,
        wallet_type,
        message: 'Wallet already connected'
      });
    }

    // Add wallet to user's list
    userWallets.wallets.push({
      address,
      wallet_type,
      chain_id,
      connected_at: new Date().toISOString()
    });

    console.log(`[wallet-connect] User ${user_id} connected ${wallet_type} wallet ${address} on chain ${chain_id}`);

    res.json({
      status: 'success',
      wallet_address: address,
      chain_id,
      wallet_type,
      message: `Successfully connected ${wallet_type} wallet on chain ${chain_id}`
    });

  } catch (error) {
    console.error('[wallet-connect] Error:', error);
    res.status(500).json({ 
      error: 'CONNECTION_FAILED', 
      message: error.message 
    });
  }
});

/**
 * POST /api/wallet/disconnect
 * Disconnect a wallet for a user
 * Body: { user_id, wallet_address }
 */
app.post('/api/wallet/disconnect', async (req, res) => {
  const { user_id, wallet_address } = req.body;

  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ 
      error: 'INVALID_USER_ID', 
      message: 'user_id is required' 
    });
  }

  const address = sanitizeAddress(wallet_address);
  if (!address) {
    return res.status(400).json({ 
      error: 'INVALID_ADDRESS', 
      message: 'wallet_address must be a valid Ethereum address' 
    });
  }

  try {
    const userWallets = connectedWallets.get(user_id);
    
    if (!userWallets || userWallets.wallets.length === 0) {
      return res.status(404).json({ 
        error: 'NO_WALLETS', 
        message: 'No wallets connected for this user' 
      });
    }

    const initialLength = userWallets.wallets.length;
    userWallets.wallets = userWallets.wallets.filter(
      w => w.address.toLowerCase() !== address.toLowerCase()
    );

    if (userWallets.wallets.length === initialLength) {
      return res.status(404).json({ 
        error: 'WALLET_NOT_FOUND', 
        message: 'Wallet not found in user connections' 
      });
    }

    console.log(`[wallet-disconnect] User ${user_id} disconnected wallet ${address}`);

    res.json({
      status: 'success',
      message: `Wallet ${address} disconnected successfully`
    });

  } catch (error) {
    console.error('[wallet-disconnect] Error:', error);
    res.status(500).json({ 
      error: 'DISCONNECTION_FAILED', 
      message: error.message 
    });
  }
});

/**
 * GET /api/wallet/list/:user_id
 * Get all connected wallets for a user
 */
app.get('/api/wallet/list/:user_id', (req, res) => {
  const { user_id } = req.params;

  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ 
      error: 'INVALID_USER_ID', 
      message: 'user_id is required' 
    });
  }

  try {
    const userWallets = connectedWallets.get(user_id);

    if (!userWallets || userWallets.wallets.length === 0) {
      return res.json({
        user_id,
        wallets: [],
        count: 0
      });
    }

    res.json({
      user_id,
      wallets: userWallets.wallets.map(w => ({
        address: w.address,
        wallet_type: w.wallet_type,
        chain_id: w.chain_id,
        connected_at: w.connected_at
      })),
      count: userWallets.wallets.length
    });

  } catch (error) {
    console.error('[wallet-list] Error:', error);
    res.status(500).json({ 
      error: 'LIST_FAILED', 
      message: error.message 
    });
  }
});

/**
 * GET /api/wallet/verify/:wallet_address
 * Verify if a wallet address is valid and get basic info
 */
app.get('/api/wallet/verify/:wallet_address', async (req, res) => {
  const address = sanitizeAddress(req.params.wallet_address);
  
  if (!address) {
    return res.status(400).json({ 
      error: 'INVALID_ADDRESS', 
      message: 'wallet_address must be a valid Ethereum address' 
    });
  }

  try {
    // Check if wallet exists on-chain
    const wallet = await initWallet(address);
    const stats = await wallet.checkMyLevel();

    res.json({
      valid: true,
      address,
      on_chain: true,
      level: stats.level.toString(),
      total_xp: stats.totalXP.toString()
    });

  } catch (error) {
    // Address is valid format but may not exist on-chain
    res.json({
      valid: true,
      address,
      on_chain: false,
      message: 'Valid address format, but no on-chain data found'
    });
  }
});

// ============================================================================
// EXISTING ENDPOINTS
// ============================================================================

app.get('/api/chain/users/:address/stats', async (req, res) => {
  const address = sanitizeAddress(req.params.address);
  if (!address) {
    return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Address must be a 0x-prefixed 40 byte hex string.' });
  }

  try {
    const wallet = await initWallet(address);
    const stats = await wallet.checkMyLevel();

    res.json({
      address,
      level: stats.level.toString(),
      totalXP: stats.totalXP.toString(),
      xpToNextLevel: stats.xpToNextLevel.toString(),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/chain/agents/:agentAddress/budget', async (req, res) => {
  const agentAddress = sanitizeAddress(req.params.agentAddress);
  if (!agentAddress) {
    return res.status(400).json({ error: 'INVALID_ADDRESS', message: 'Agent address is invalid.' });
  }

  const { amount } = req.query;
  if (typeof amount !== 'string' || !amount.trim()) {
    return res.status(400).json({ error: 'INVALID_AMOUNT', message: 'Query parameter "amount" is required as a bigint string.' });
  }

  let requestedAmount;
  try {
    requestedAmount = BigInt(amount);
  } catch (error) {
    return res.status(400).json({ error: 'INVALID_AMOUNT', message: 'Amount must be a valid bigint string.' });
  }

  try {
    const wallet = await initWallet(agentAddress);
    const budget = await wallet.checkAgentBudget(agentAddress, requestedAmount);

    res.json({
      agent: agentAddress,
      requestedAmount: requestedAmount.toString(),
      allowed: budget.allowed,
      remaining: budget.remaining.toString(),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/chain/economy/inflation-rate', async (_req, res) => {
  try {
    const wallet = await initWallet(ZERO_ADDRESS);
    const basisPoints = await wallet.getInflationRate();
    res.json({
      basisPoints: basisPoints.toString(),
      percentage: Number(basisPoints) / 100,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.listen(PORT, () => {
  console.log(`Gami wallet backend listening on http://localhost:${PORT}`);
});
