import withAuth from '../../../lib/auth.js';
import { paymentProvider } from '../../../lib/payments/PaymentProvider.js';
import { INTERNSHIP_FEE_INR, INTERNSHIP_FEE_PAISE } from '../../../lib/payments/razorpayConfig.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const { purpose, referenceId, tier } = req.body || {};

  if (!purpose || !['internship_certificate', 'competition_certificate', 'internship_registration'].includes(purpose)) {
    return res.status(400).json({ success: false, message: 'Valid payment purpose is required.' });
  }

  if (!referenceId) {
    return res.status(400).json({ success: false, message: 'Reference ID is required.' });
  }

  // Canonical standard fee: ₹99 (9900 paise)
  const amount = INTERNSHIP_FEE_INR;

  const orderResult = await paymentProvider.createOrder({
    applicationId: referenceId,
    userId: user.uid,
    userEmail: user.email,
  });

  return res.status(200).json({
    success: true,
    paymentStatus: 'CREATED',
    amount,
    amountPaise: INTERNSHIP_FEE_PAISE,
    currency: 'INR',
    orderId: orderResult.id,
    message: 'Payment order created successfully for ₹99 standard registration.'
  });
}

export default withAuth(handler, { requireEmailVerified: true });
