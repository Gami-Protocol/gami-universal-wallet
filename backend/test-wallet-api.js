/**
 * Test Suite for Wallet API Endpoints
 * Tests the wallet connection, disconnection, and management endpoints
 */

const BASE_URL = process.env.API_URL || 'http://localhost:4000';

// Helper function to make requests
async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();
  
  return {
    status: response.status,
    data
  };
}

// Test data
const testUserId = 'test_user_' + Date.now();
const testWalletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  Gami Wallet API - Test Suite');
console.log('═══════════════════════════════════════════════════════════════\n');

async function runTests() {
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Health Check
  try {
    console.log('Test 1: Health Check');
    const { status, data } = await request('GET', '/health');
    
    if (status === 200 && data.status === 'ok') {
      console.log('✅ PASS - Health check returned OK');
      testsPassed++;
    } else {
      console.log('❌ FAIL - Health check failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Health check error:', error.message);
    testsFailed++;
  }

  // Test 2: Connect Wallet - Success
  try {
    console.log('\nTest 2: Connect Wallet - Success');
    const { status, data } = await request('POST', '/api/wallet/connect', {
      user_id: testUserId,
      wallet_type: 'metamask',
      chain_id: '137',
      wallet_address: testWalletAddress
    });
    
    if (status === 200 && data.status === 'success' && data.wallet_address) {
      console.log('✅ PASS - Wallet connected successfully');
      console.log(`   Address: ${data.wallet_address}`);
      testsPassed++;
    } else {
      console.log('❌ FAIL - Wallet connection failed');
      console.log('   Response:', JSON.stringify(data, null, 2));
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Wallet connection error:', error.message);
    testsFailed++;
  }

  // Test 3: Connect Wallet - Duplicate
  try {
    console.log('\nTest 3: Connect Wallet - Duplicate Detection');
    const { status, data } = await request('POST', '/api/wallet/connect', {
      user_id: testUserId,
      wallet_type: 'metamask',
      chain_id: '137',
      wallet_address: testWalletAddress
    });
    
    if (status === 200 && data.status === 'already_connected') {
      console.log('✅ PASS - Duplicate connection detected correctly');
      testsPassed++;
    } else {
      console.log('❌ FAIL - Duplicate detection failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Duplicate detection error:', error.message);
    testsFailed++;
  }

  // Test 4: List Wallets
  try {
    console.log('\nTest 4: List Connected Wallets');
    const { status, data } = await request('GET', `/api/wallet/list/${testUserId}`);
    
    if (status === 200 && data.wallets && data.wallets.length > 0) {
      console.log('✅ PASS - Wallet list retrieved successfully');
      console.log(`   Found ${data.count} wallet(s)`);
      data.wallets.forEach((w, i) => {
        console.log(`   ${i + 1}. ${w.address} (${w.wallet_type}, chain ${w.chain_id})`);
      });
      testsPassed++;
    } else {
      console.log('❌ FAIL - Wallet list retrieval failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Wallet list error:', error.message);
    testsFailed++;
  }

  // Test 5: Connect Another Wallet (Different Chain)
  try {
    console.log('\nTest 5: Connect Wallet on Different Chain');
    const { status, data } = await request('POST', '/api/wallet/connect', {
      user_id: testUserId,
      wallet_type: 'metamask',
      chain_id: '1', // Ethereum mainnet
      wallet_address: testWalletAddress
    });
    
    if (status === 200 && data.status === 'success') {
      console.log('✅ PASS - Second wallet connected (different chain)');
      testsPassed++;
    } else {
      console.log('❌ FAIL - Second wallet connection failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Second wallet connection error:', error.message);
    testsFailed++;
  }

  // Test 6: Verify Wallet Address
  try {
    console.log('\nTest 6: Verify Wallet Address');
    const { status, data } = await request('GET', `/api/wallet/verify/${testWalletAddress}`);
    
    if (status === 200 && data.valid === true && data.address) {
      console.log('✅ PASS - Wallet address verified');
      console.log(`   Valid: ${data.valid}`);
      console.log(`   On-chain: ${data.on_chain}`);
      testsPassed++;
    } else {
      console.log('❌ FAIL - Wallet verification failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Wallet verification error:', error.message);
    testsFailed++;
  }

  // Test 7: Disconnect Wallet
  try {
    console.log('\nTest 7: Disconnect Wallet');
    const { status, data } = await request('POST', '/api/wallet/disconnect', {
      user_id: testUserId,
      wallet_address: testWalletAddress
    });
    
    if (status === 200 && data.status === 'success') {
      console.log('✅ PASS - Wallet disconnected successfully');
      testsPassed++;
    } else {
      console.log('❌ FAIL - Wallet disconnection failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Wallet disconnection error:', error.message);
    testsFailed++;
  }

  // Test 8: List Wallets After Disconnect
  try {
    console.log('\nTest 8: List Wallets After Disconnect');
    const { status, data } = await request('GET', `/api/wallet/list/${testUserId}`);
    
    if (status === 200) {
      console.log('✅ PASS - Wallet list retrieved after disconnect');
      console.log(`   Remaining wallets: ${data.count}`);
      testsPassed++;
    } else {
      console.log('❌ FAIL - Wallet list retrieval failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Wallet list error:', error.message);
    testsFailed++;
  }

  // Test 9: Invalid Wallet Address
  try {
    console.log('\nTest 9: Invalid Wallet Address');
    const { status, data } = await request('POST', '/api/wallet/connect', {
      user_id: testUserId,
      wallet_type: 'metamask',
      chain_id: '137',
      wallet_address: 'invalid_address'
    });
    
    if (status === 400 && data.error === 'INVALID_ADDRESS') {
      console.log('✅ PASS - Invalid address rejected correctly');
      testsPassed++;
    } else {
      console.log('❌ FAIL - Invalid address not rejected');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Invalid address test error:', error.message);
    testsFailed++;
  }

  // Test 10: Missing Parameters
  try {
    console.log('\nTest 10: Missing Parameters');
    const { status, data } = await request('POST', '/api/wallet/connect', {
      user_id: testUserId
      // Missing wallet_type and chain_id
    });
    
    if (status === 400 && data.error) {
      console.log('✅ PASS - Missing parameters rejected correctly');
      testsPassed++;
    } else {
      console.log('❌ FAIL - Missing parameters not rejected');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ FAIL - Missing parameters test error:', error.message);
    testsFailed++;
  }

  // Test Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Test Summary');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Total Tests: ${testsPassed + testsFailed}`);
  console.log(`  ✅ Passed: ${testsPassed}`);
  console.log(`  ❌ Failed: ${testsFailed}`);
  console.log(`  Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
