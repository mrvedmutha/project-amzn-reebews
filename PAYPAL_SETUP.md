# PayPal Integration Setup Guide

This guide explains how to set up PayPal payments for non-Indian users in the Reebews checkout system.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# PayPal Configuration (for non-Indian users)
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_WEBHOOK_ID="your_paypal_webhook_id"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"

# Application Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## PayPal Developer Account Setup

1. **Create PayPal Developer Account**

   - Go to [PayPal Developer](https://developer.paypal.com/)
   - Sign in with your PayPal account or create a new one
   - Navigate to "My Apps & Credentials"

2. **Create a New App**

   - Click "Create App"
   - Choose "Default Application" or create a custom name
   - Select "Merchant" as the account type
   - Choose "Sandbox" for testing or "Live" for production

3. **Get Your Credentials**

   - Copy the `Client ID` and `Client Secret`
   - Add them to your environment variables

4. **Configure Webhooks**
   - In your PayPal app settings, go to "Webhooks"
   - Add webhook URL: `https://yourdomain.com/api/paypal/webhook`
   - Select the following events:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`
   - Copy the Webhook ID and add it to your environment variables

## Payment Flow

### For Non-Indian Users:

1. **Currency**: USD only
2. **Payment Method**: PayPal (card payments through PayPal)
3. **Flow**:
   - User selects PayPal payment method
   - PayPal buttons are rendered
   - User completes payment through PayPal
   - Payment is captured automatically
   - User is redirected to thank-you page

### For Indian Users:

1. **Currency**: INR
2. **Payment Methods**: Card, UPI, Net Banking, Wallet
3. **Gateway**: Razorpay

## API Endpoints

- `POST /api/paypal/create-order` - Creates PayPal order
- `POST /api/paypal/capture-payment` - Captures PayPal payment
- `POST /api/paypal/webhook` - Handles PayPal webhooks

## Testing

### Sandbox Testing

1. Use PayPal sandbox credentials
2. Test with PayPal sandbox accounts
3. Use test card numbers provided by PayPal

### Test Cards (Sandbox)

- Visa: 4032035728926093
- Mastercard: 5425233430109903
- American Express: 374245455400001

## Production Deployment

1. **Switch to Live Credentials**

   - Replace sandbox credentials with live ones
   - Update `NEXT_PUBLIC_BASE_URL` to your production domain

2. **Update Webhook URL**

   - Change webhook URL to production domain
   - Update `PAYPAL_WEBHOOK_ID` with live webhook ID

3. **SSL Certificate**
   - Ensure your domain has a valid SSL certificate
   - PayPal requires HTTPS for webhooks

## Security Notes

- Never expose `PAYPAL_CLIENT_SECRET` in client-side code
- Use `NEXT_PUBLIC_PAYPAL_CLIENT_ID` for client-side PayPal SDK
- Validate all webhook signatures
- Implement proper error handling

## Troubleshooting

### Common Issues:

1. **PayPal SDK not loading**: Check `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
2. **Order creation fails**: Verify server-side credentials
3. **Webhook verification fails**: Check `PAYPAL_WEBHOOK_ID`
4. **CORS errors**: Ensure proper domain configuration

### Debug Mode:

- Check browser console for client-side errors
- Check server logs for API errors
- Use PayPal's debug tools in developer dashboard
