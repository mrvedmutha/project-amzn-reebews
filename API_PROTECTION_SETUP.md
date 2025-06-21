# API Protection Setup Guide

## 🔒 Protected Routes

The following API routes are now protected with API key authentication:

- `GET /api/signup?token={signuptoken}` - Check signup status and get cart details
- `PATCH /api/signup/complete` - Complete signup and update isSignupCompleted to true

## 🛠️ Setup Instructions

### 1. Add Environment Variable

Add the following to your `.env.local` file (or production environment):

```bash
# API Key for protecting external access to signup routes
REEBEWS_API_KEY=reebews_2024_secure_api_key_$(openssl rand -hex 16)
```

**Generate a secure key:**
```bash
# Run this command to generate a random secure API key
echo "REEBEWS_API_KEY=reebews_2024_$(openssl rand -hex 16)" >> .env.local
```

### 2. Example API Key
```bash
REEBEWS_API_KEY=reebews_2024_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## 🚀 Usage from External Projects

### 1. Check Signup Status
```javascript
const response = await fetch('https://your-main-app.com/api/signup?token=signup_token_here', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
if (data.success) {
  console.log('Cart details:', data.cart);
} else {
  console.error('Error:', data.message);
}
```

### 2. Complete Signup
```javascript
const response = await fetch('https://your-main-app.com/api/signup/complete', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    signupToken: 'signup_token_from_previous_call'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Signup completed!', data.cart);
} else {
  console.error('Signup completion failed:', data.message);
}
```

### Complete Flow Example
```javascript
class SignupManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://your-main-app.com/api';
  }

  async checkSignupStatus(signupToken) {
    const response = await fetch(`${this.baseUrl}/signup?token=${signupToken}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async completeSignup(signupToken) {
    const response = await fetch(`${this.baseUrl}/signup/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ signupToken })
    });
    return response.json();
  }
}

// Usage in admin.reebews.com
const signupManager = new SignupManager(process.env.REEBEWS_API_KEY);

// 1. User clicks signup link
const signupData = await signupManager.checkSignupStatus(tokenFromUrl);

// 2. Show signup form with cart details
if (signupData.success) {
  // Show form with signupData.cart details
  
  // 3. After user completes signup
  const completionResult = await signupManager.completeSignup(signupData.cart.signupToken);
  
  if (completionResult.success) {
    // Redirect to success page
    console.log('Signup completed successfully!');
  }
}
```

## 📋 Response Examples

### ✅ Success Response (Check Signup - Not Completed)
```json
{
  "success": true,
  "message": "Cart details retrieved successfully",
  "cart": {
    "_id": "cart_id_here",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": { ... }
    },
    "subscription": {
      "planName": "FREE",
      "amount": 0,
      "currency": "INR"
    },
    "signupToken": "signup_token_here",
    "isSignupCompleted": false
  }
}
```

### ✅ Success Response (Complete Signup)
```json
{
  "success": true,
  "message": "Signup completed successfully",
  "cart": {
    "_id": "cart_id_here",
    "signupToken": "signup_token_here",
    "isSignupCompleted": true,
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "subscription": {
      "planName": "FREE",
      "amount": 0,
      "currency": "INR"
    },
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### ❌ Error Responses

**Missing API Key:**
```json
{
  "success": false,
  "message": "Missing or invalid authorization header",
  "error": "Authorization Bearer token is required"
}
```

**Invalid API Key:**
```json
{
  "success": false,
  "message": "Invalid API key",
  "error": "Unauthorized access"
}
```

**Signup Already Completed:**
```json
{
  "success": false,
  "message": "Signup already completed",
  "error": "This signup has already been completed"
}
```

**Missing Signup Token (Complete Endpoint):**
```json
{
  "success": false,
  "message": "Missing signup token",
  "error": "signupToken is required in request body"
}
```

## 🎯 The Complete Flow

1. **User clicks signup link** → Goes to admin.reebews.com
2. **Admin app calls GET /api/signup** → Gets cart details if not completed
3. **User fills signup form** → Using cart details from step 2
4. **Admin app calls PATCH /api/signup/complete** → Updates isSignupCompleted = true
5. **Success!** → User is fully signed up

## 🔧 Security Features

✅ **API Key Authentication** - Requires valid REEBEWS_API_KEY  
✅ **Bearer Token Format** - Standard Authorization header  
✅ **Server Configuration Check** - Validates API key is set  
✅ **Detailed Error Messages** - Clear feedback for debugging  
✅ **24/7 Availability** - No token expiration  
✅ **Simple Management** - Single key, no manual rotation needed  
✅ **Idempotent Operations** - Safe to call multiple times  

## 🎯 Testing

### Test Check Signup:
```bash
curl -X GET "http://localhost:3000/api/signup?token=your_signup_token" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json"
```

### Test Complete Signup:
```bash
curl -X PATCH "http://localhost:3000/api/signup/complete" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"signupToken": "your_signup_token"}'
```

## 🚨 Important Notes

1. **Keep API Key Secret** - Never commit to version control
2. **Use Environment Variables** - Store in .env.local or production env
3. **HTTPS Only** - Always use HTTPS in production
4. **Monitor Usage** - Check logs for unauthorized access attempts
5. **Backup Key** - Store securely in case you need to restore access

## 🔄 Key Rotation (Optional)

If you need to change the API key:

1. Generate new key: `openssl rand -hex 16`
2. Update environment variable
3. Update all client applications
4. Restart your application
5. Verify all clients are working

---

**Setup Complete!** Your signup routes are now protected and ready for external access. 🚀
