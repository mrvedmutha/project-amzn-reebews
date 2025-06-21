# Reebews - Product Review Collection Platform

## Recent Updates

### Simplified Cart Structure (Major Refactor)

**Removed separate subscription model and embedded subscription data directly in cart for better performance and simplicity.**

**New Simplified Cart Structure:**

```typescript
{
  _id: ObjectId("..."),
  user: {
    name: "John Doe",
    email: "john@example.com",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      country: "United States",
      pincode: "10001"
    }
  },
  subscription: {                              // ✅ Embedded subscription data
    planId: 0,
    planName: "free",
    billingCycle: "monthly",
    amount: 0,
    currency: "USD",
    isActive: true,
    startDate: new Date("2024-01-01"),        // ✅ Set immediately for free plans
    endDate: null                             // ✅ Free plans never expire
  },
  payment: {
    id: "uuid-generated-payment-id",
    method: "paypal",
    totalAmount: 0,
    currency: "USD",
    status: "completed"                       // ✅ Auto-completed for free plans
  },
  signupToken: "uuid-generated-signup-token",
  tokenExpiry: Date("2024-01-02T12:00:00Z"),
  isSignupCompleted: false
}
```

**Key Improvements:**

- ✅ **Simplified Architecture**: One model instead of two (Cart + Subscription)
- ✅ **Better Performance**: No joins/population needed
- ✅ **Cleaner Code**: All cart data in one place
- ✅ **Easier Maintenance**: Fewer files and dependencies
- ✅ **Still Flexible**: Can update subscription data within cart
- ✅ **Proper Date Handling**: Free plans get immediate startDate and null endDate
- ✅ **Email Integration**: Free plans automatically get welcome emails

**What Was Removed:**

- ❌ `src/models/subscription/` directory and files
- ❌ `src/schemas/subscription/` directory and files
- ❌ `src/services/subscription/` directory and files
- ❌ `src/types/subscription/` directory and files
- ❌ Complex subscription service dependencies

**Migration Notes:**

- Subscription data is now embedded in cart as `cart.subscription`
- Plan helper functions moved to `src/lib/utils.ts`
- No breaking changes to API endpoints
- Existing cart functionality preserved

## Installation

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Multi-tier Pricing**: Free, Basic, Pro, and Enterprise plans
- **Global Currency Support**: USD and INR with automatic detection
- **Payment Integration**: Razorpay (India) and PayPal (International)
- **Simplified Cart Management**: Embedded subscription data for better performance
- **Email Notifications**: Welcome emails for all plan types including free
- **Proper Date Handling**: Immediate activation for free plans, billing cycles for paid plans

## Architecture

### Cart Structure

- **Embedded Subscription**: All plan data stored within cart record
- **Plan Management**: Helper functions in `src/lib/utils.ts`
- **Date Handling**: Automatic startDate for free plans, calculated endDate for paid plans
- **Email Integration**: Automatic welcome emails for all plan types

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
