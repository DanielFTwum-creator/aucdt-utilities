import { EmailPayload } from '../types';

/**
 * Simulates the POST request to /aucdt-dev/sendMail
 * In a real environment, this would use fetch or axios.
 */
export const sendBroadsheetEmail = async (payload: EmailPayload): Promise<{ success: boolean; message: string }> => {
  console.log('Attempting to send payload to /aucdt-dev/sendMail:', JSON.stringify(payload, null, 2));

  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API success
      console.log('Email sent successfully to', payload.to);
      resolve({
        success: true,
        message: 'Broadsheet submitted and email queued successfully.',
      });
    }, 1500);
  });
};