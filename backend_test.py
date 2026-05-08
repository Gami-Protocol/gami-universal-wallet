import requests
import sys
from datetime import datetime

class GamiWalletAPITester:
    def __init__(self, base_url="https://05a2598a-5e69-4b16-8578-d623fa4cc456.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    resp_json = response.json()
                    print(f"   Response: {resp_json}")
                    return True, resp_json
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                self.failed_tests.append(f"{name}: {error_msg}")
                print(f"❌ Failed - {error_msg}")
                try:
                    error_body = response.text
                    print(f"   Response: {error_body}")
                except:
                    pass
                return False, {}

        except Exception as e:
            error_msg = f"Error: {str(e)}"
            self.failed_tests.append(f"{name}: {error_msg}")
            print(f"❌ Failed - {error_msg}")
            return False, {}

    def test_health_endpoint(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success and response.get('status') == 'ok'

    def test_get_user(self):
        """Test get user endpoint"""
        success, response = self.run_test(
            "Get User Data",
            "GET",
            "api/user",
            200
        )
        if success:
            required_fields = ['xp', 'streak_days', 'level']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing required field: {field}")
                    return False
            print(f"   User XP: {response.get('xp')}, Streak: {response.get('streak_days')}, Level: {response.get('level')}")
            return True
        return False

    def test_get_rewards(self):
        """Test get rewards endpoint"""
        success, response = self.run_test(
            "Get Rewards",
            "GET",
            "api/rewards",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} rewards")
            return True
        return False

    def test_get_missions(self):
        """Test get missions endpoint"""
        success, response = self.run_test(
            "Get Missions",
            "GET",
            "api/missions",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} missions")
            return True
        return False

    def test_get_checkins(self):
        """Test get checkins endpoint"""
        success, response = self.run_test(
            "Get Check-ins",
            "GET",
            "api/checkins",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} check-in records")
            return True
        return False

    def test_daily_checkin(self):
        """Test daily check-in endpoint"""
        success, response = self.run_test(
            "Daily Check-in",
            "PUT",
            "api/user/checkin",
            200
        )
        if success:
            if response.get('success'):
                print(f"   Checked in successfully, earned {response.get('xp_earned')} XP")
            else:
                print(f"   Check-in response: {response.get('message', 'No message')}")
            return True
        return False

    def test_spin_wheel(self):
        """Test spin wheel endpoint"""
        success, response = self.run_test(
            "Spin Wheel",
            "POST",
            "api/spin",
            200
        )
        if success:
            if response.get('success'):
                print(f"   Spin result: {response.get('result')}, XP: {response.get('xp_earned')}")
            else:
                print(f"   Spin response: {response.get('message', 'No message')}")
            return True
        return False

    def test_reward_redemption(self):
        """Test reward redemption - try with a low-cost reward"""
        # First get rewards to find a low-cost one
        success, rewards = self.run_test(
            "Get Rewards for Redemption Test",
            "GET", 
            "api/rewards",
            200
        )
        
        if not success or not rewards:
            return False
            
        # Find the cheapest reward
        cheapest = min(rewards, key=lambda r: r.get('cost', 999999))
        
        success, response = self.run_test(
            "Redeem Reward",
            "POST",
            "api/rewards/redeem",
            200,
            data={"title": cheapest.get('title')}
        )
        
        if success:
            print(f"   Redemption result: {response.get('message', 'No message')}")
            return True
        return False

    def test_mission_completion(self):
        """Test mission completion - try with an incomplete mission"""
        # First get missions to find an incomplete one
        success, missions = self.run_test(
            "Get Missions for Completion Test",
            "GET",
            "api/missions", 
            200
        )
        
        if not success or not missions:
            return False
            
        # Find an incomplete mission
        incomplete_mission = next((m for m in missions if not m.get('completed')), None)
        
        if not incomplete_mission:
            print("   All missions already completed")
            return True
            
        success, response = self.run_test(
            "Complete Mission",
            "PUT",
            "api/missions/complete",
            200,
            data={"title": incomplete_mission.get('title')}
        )
        
        if success:
            print(f"   Mission completion result: {response.get('message', 'No message')}")
            return True
        return False

    def test_get_tokens(self):
        """Test get tokens endpoint"""
        success, response = self.run_test(
            "Get Tokens",
            "GET",
            "api/tokens",
            200
        )
        if success and isinstance(response, list) and len(response) >= 5:
            print(f"   Found {len(response)} tokens")
            # Check for required fields
            if response and 'balance' in response[0] and 'usd_value' in response[0]:
                return True
        return False

    def test_get_nfts(self):
        """Test get NFTs endpoint"""
        success, response = self.run_test(
            "Get NFTs",
            "GET",
            "api/nfts",
            200
        )
        if success and isinstance(response, list) and len(response) >= 4:
            print(f"   Found {len(response)} NFTs")
            # Check for required fields
            if response and 'name' in response[0] and 'rarity' in response[0]:
                return True
        return False

    def test_get_networks(self):
        """Test get networks endpoint"""
        success, response = self.run_test(
            "Get Networks",
            "GET",
            "api/networks",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} networks")
            return True
        return False

    def test_get_pools(self):
        """Test get staking pools endpoint"""
        success, response = self.run_test(
            "Get Staking Pools",
            "GET",
            "api/pools",
            200
        )
        if success and isinstance(response, list) and len(response) >= 5:
            print(f"   Found {len(response)} staking pools")
            # Check for required fields
            if response and 'apy' in response[0] and 'tvl' in response[0]:
                return True
        return False

    def test_get_staking(self):
        """Test get staking positions endpoint"""
        success, response = self.run_test(
            "Get Staking Positions",
            "GET",
            "api/staking",
            200
        )
        if success and isinstance(response, list) and len(response) >= 2:
            print(f"   Found {len(response)} active staking positions")
            # Check for required fields
            if response and 'usd_value' in response[0] and 'earned' in response[0]:
                return True
        return False

    def test_get_transactions(self):
        """Test get transactions endpoint"""
        success, response = self.run_test(
            "Get Transactions",
            "GET",
            "api/transactions",
            200
        )
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} transactions")
            return True
        return False

    def test_get_profile(self):
        """Test get profile endpoint"""
        success, response = self.run_test(
            "Get Profile",
            "GET",
            "api/profile",
            200
        )
        if success:
            required_fields = ['username', 'wallet_address', 'level', 'connected_wallets', 'referral_code']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing required profile field: {field}")
                    return False
            print(f"   Profile: {response.get('username')}, Level: {response.get('level')}")
            return True
        return False

    def test_user_data_completeness(self):
        """Test user endpoint has all required fields from requirements"""
        success, response = self.run_test(
            "Get User Data Completeness",
            "GET",
            "api/user",
            200
        )
        if success:
            required_fields = ['total_usd_balance', 'xp', 'staking_total_usd', 'connected_wallets']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing required user field: {field}")
                    return False
            print(f"   User Balance: ${response.get('total_usd_balance')}, Staking: ${response.get('staking_total_usd')}")
            return True
        return False

def main():
    print("🚀 Starting Gami Wallet Backend API Testing...")
    tester = GamiWalletAPITester()
    
    # Run all tests
    tests = [
        tester.test_health_endpoint,
        tester.test_user_data_completeness,
        tester.test_get_user,
        tester.test_get_tokens,
        tester.test_get_nfts,
        tester.test_get_pools,
        tester.test_get_staking,
        tester.test_get_networks,
        tester.test_get_rewards,
        tester.test_get_missions,
        tester.test_get_checkins,
        tester.test_get_transactions,
        tester.test_get_profile,
        tester.test_daily_checkin,
        tester.test_spin_wheel,
        tester.test_reward_redemption,
        tester.test_mission_completion,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {str(e)}")
            tester.failed_tests.append(f"{test.__name__}: Crashed - {str(e)}")
    
    # Print final results
    print(f"\n📊 Backend API Test Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failed in tester.failed_tests:
            print(f"   - {failed}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())