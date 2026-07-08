export async function sendDiscord(message) {
  const url = process.env.DISCORD_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
  } catch {
    // fail silently — don't crash the main script over a notification
  }
}
