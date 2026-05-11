export function logAction(action: string, details: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    details,
  };
  console.log('AUDIT LOG:', JSON.stringify(logEntry));
  // In a real app, this would be sent to a backend/database.
}
