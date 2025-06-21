/**
 * Signup Client Example for admin.reebews.com
 * This shows how to integrate with the protected signup API
 */

class SignupAPIClient {
  constructor(apiKey, baseUrl = 'https://your-main-app.com/api') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Check if signup is completed and get cart details
   */
  async checkSignupStatus(signupToken) {
    try {
      const response = await fetch(`${this.baseUrl}/signup?token=${signupToken}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check signup status');
      }

      return data;
    } catch (error) {
      console.error('Error checking signup status:', error);
      throw error;
    }
  }

  /**
   * Complete the signup process
   */
  async completeSignup(signupToken) {
    try {
      const response = await fetch(`${this.baseUrl}/signup/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signupToken })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete signup');
      }

      return data;
    } catch (error) {
      console.error('Error completing signup:', error);
      throw error;
    }
  }
}

// Usage Example for admin.reebews.com
async function handleSignupFlow() {
  // Initialize client with your API key
  const signupClient = new SignupAPIClient(process.env.REEBEWS_API_KEY);
  
  // Get signup token from URL (e.g., ?token=abc123)
  const urlParams = new URLSearchParams(window.location.search);
  const signupToken = urlParams.get('token');

  if (!signupToken) {
    console.error('No signup token found in URL');
    return;
  }

  try {
    // Step 1: Check signup status and get cart details
    console.log('Checking signup status...');
    const signupData = await signupClient.checkSignupStatus(signupToken);

    if (!signupData.success) {
      console.error('Signup check failed:', signupData.message);
      return;
    }

    // Step 2: Display signup form with cart details
    const cart = signupData.cart;
    console.log('Cart details:', cart);
    
    // Show form with:
    // - User name: cart.user.name
    // - User email: cart.user.email
    // - Plan: cart.subscription.planName
    // - Amount: cart.subscription.amount
    // - Currency: cart.subscription.currency

    // Step 3: After user completes signup form
    // (This would be triggered by form submission)
    console.log('Completing signup...');
    const completionResult = await signupClient.completeSignup(signupToken);

    if (completionResult.success) {
      console.log('✅ Signup completed successfully!');
      console.log('Updated cart:', completionResult.cart);
      
      // Redirect to success page or show success message
      // window.location.href = '/signup-success';
    } else {
      console.error('❌ Signup completion failed:', completionResult.message);
    }

  } catch (error) {
    console.error('❌ Signup flow error:', error.message);
    // Handle error (show error message to user)
  }
}

// React/Next.js Hook Example
function useSignupFlow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartData, setCartData] = useState(null);

  const signupClient = new SignupAPIClient(process.env.NEXT_PUBLIC_REEBEWS_API_KEY);

  const checkSignup = async (signupToken) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await signupClient.checkSignupStatus(signupToken);
      setCartData(data.cart);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeSignup = async (signupToken) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await signupClient.completeSignup(signupToken);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { checkSignup, completeSignup, loading, error, cartData };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SignupAPIClient, handleSignupFlow, useSignupFlow };
}
