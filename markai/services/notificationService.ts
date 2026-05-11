// services/notificationService.ts

const NOTIFICATION_ENDPOINT = '/api/sendNotification';

interface SendNotificationParams {
  to: string;
  subject: string;
  body: string; // HTML is likely supported
}

/**
 * Sends an email notification using the centralized service.
 * For tracking purposes, all notifications are redirected to a central helpdesk email.
 * This is a fire-and-forget function. It will log errors to the console
 * but will not throw them, to prevent it from blocking primary user flows.
 * @param {SendNotificationParams} params - The notification parameters.
 */
export const sendNotification = async ({ to, subject, body }: SendNotificationParams): Promise<void> => {
  const trackingEmail = 'helpdesk@aucdt.edu.gh';
  const trackedSubject = `[MarkAI Notification for ${to}] ${subject}`;

  try {
    const response = await fetch(NOTIFICATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Assuming the endpoint expects a payload with `to`, `subject`, and `message` keys.
      // This is a common pattern for generic mailer endpoints.
      body: JSON.stringify({
        to: trackingEmail, // All emails are sent to the helpdesk for tracking
        subject: trackedSubject,
        message: body,
        from: 'noreply@markai.com', // Specifying a sender is good practice
      }),
    });

    if (!response.ok) {
      // Try to get more details from the response body if possible
      let errorDetails = `HTTP status ${response.status}`;
      try {
        const errorJson = await response.json();
        errorDetails = JSON.stringify(errorJson);
      } catch {
        // Body is not JSON or empty
        errorDetails = await response.text();
      }
      throw new Error(`Failed to send notification. Server responded with: ${errorDetails}`);
    }

    console.log(`Notification for ${to} successfully registered locally (target: ${trackingEmail}, subject: "${trackedSubject}")`);

  } catch (error) {
    console.error('Error in sendNotification service:', error);
    // We don't re-throw the error to avoid blocking UI flows.
  }
};
