export async function sendSMSAlert(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    console.warn("Twilio credentials missing. SMS broadcast will be simulated.");
    return { success: false, simulated: true };
  }

  // Note: In a real frontend app, you'd usually call a backend to send SMS
  // to avoid exposing Twilio keys. But for this project's scope, we'll
  // provide the structure for a direct API call if keys are present.
  
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: message
      })
    });

    if (response.ok) {
      return { success: true, simulated: false };
    } else {
      const error = await response.json();
      console.error("Twilio error:", error);
      return { success: false, simulated: false, error };
    }
  } catch (err) {
    console.error("Failed to send SMS:", err);
    return { success: false, simulated: false, error: err };
  }
}
