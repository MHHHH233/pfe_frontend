# Stripe Payment Integration

This directory contains the components and services needed for processing payments with Stripe in our application. The implementation provides a secure and modern payment experience for users.

## Components

### `StripeWrapper.jsx`

A wrapper component that initializes the Stripe context and provides styling for Stripe Elements. It should be used to wrap any component that needs to use Stripe functionality.

```jsx
import StripeWrapper from './Payments/StripeWrapper';

// Usage
<StripeWrapper>
  <YourPaymentComponent />
</StripeWrapper>
```

### `StripePaymentForm.jsx`

The core component for collecting payment information. It provides:
- Card element for secure credit card input
- Billing information collection
- Form validation
- Loading, error, and success states
- Payment processing

```jsx
import StripePaymentForm from './Payments/StripePaymentForm';

// Usage
<StripePaymentForm
  amount={10000} // amount in cents (100.00)
  currency="mad"
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
  onCancel={handleCancel}
  metadata={{ type: 'reservation', id: '12345' }}
  customDescription="Custom payment description"
/>
```

### `StripePaymentModal.jsx`

A modal wrapper for the payment form, ideal for most payment flows:

```jsx
import StripePaymentModal from './Payments/StripePaymentModal';

// Usage
<StripePaymentModal
  show={showPayment}
  onClose={handleClose}
  onSuccess={handleSuccess}
  amount={10000} // amount in cents
  currency="mad"
  metadata={{ type: 'product', id: '12345' }}
  title="Complete Purchase"
  description="Your purchase description"
/>
```

### `ReservationPaymentModal.jsx`

A specialized payment modal for handling reservations, with built-in reservation data processing:

```jsx
import ReservationPaymentModal from './Payments/ReservationPaymentModal';

// Usage
<ReservationPaymentModal
  show={showPayment}
  onClose={handleClose}
  reservationData={reservationData}
  onSuccess={handleReservationSuccess}
/>
```

## Service

### `stripeService.js`

Service for handling Stripe API interactions:

- `createPaymentIntent` - Create a new payment intent
- `createReservationPaymentIntent` - Create a payment intent for reservations
- `createSubscriptionPaymentIntent` - Create a payment intent for subscriptions
- `confirmPayment` - Confirm a payment was successful

```js
import stripeService from '../../lib/services/stripeService';

// Usage
const paymentIntent = await stripeService.createPaymentIntent({
  amount: 10000,
  currency: 'mad',
  metadata: { type: 'product', id: '12345' }
});
```

## Example

Check `PaymentExample.jsx` for a complete implementation example showing how to use the Stripe payment components in different scenarios.

## Backend Requirements

These components expect the following API endpoints to be available:

- `POST /api/create-payment-intent` - Create a new payment intent
- `POST /api/payment/create-payment-intent` - Create a reservation payment intent
- `POST /api/payment/create-subscription-intent` - Create a subscription payment intent
- `POST /api/payment/confirm` - Confirm payment was successful
- `POST /api/webhook` - Handle Stripe webhooks (handled by the backend)

## Testing

For testing purposes, you can use the following test credit card:
- Card number: 4242 4242 4242 4242
- Expiry date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits 