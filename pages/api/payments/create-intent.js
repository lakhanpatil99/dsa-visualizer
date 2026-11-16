import withAuth from '../../../lib/auth.js';
import { paymentProvider, PAYMENT_STATUS } from '../../../lib/payments/PaymentProvider.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const { purpose, referenceId, tier } = req.body || {};

  if (!purpose || !['internship_certificate', 'competition_certificate'].includes(purpose)) {
    return res.status(400).json({ success: false, message: 'Valid payment purpose is required.' });
  }

  if (!referenceId) {
    return res.status(400).json({ success: false, message: 'Reference ID is required.' });
  }

  // Define nominal certificate processing fee breakdown (for future activation)
  const amount = purpose === 'internship_certificate' ? 499 : 299;

  const orderResult = await paymentProvider.createOrder({
    userId: user.uid,
    userEmail: user.email,
    purpose,
    referenceId,
    amount,
    currency: 'INR',
    tier
  });

  return res.status(200).json({
    success: true,
    paymentStatus: orderResult.status,
    amount,
    currency: 'INR',
    isConfigured: paymentProvider.isConfigured,
    message: orderResult.message
  });
}

export default withAuth(handler, { requireEmailVerified: true });
