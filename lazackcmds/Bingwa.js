export async function all(m) {
  const messageTriggers = [
    'bingwasokoni', 
    'Bingwa', 
    'safaricom', 
    'sokoni', 
    'Sokoni', 
    'bingwa', 
    'Data'
  ];

  if (
    (messageTriggers.includes(m.mtype) || messageTriggers.some(trigger => m.text.startsWith(trigger))) &&
    !m.isBaileys &&
    !m.isGroup
  ) {
    const welcomeMessage = `*WELCOME TO BINGWA SOKONI*      
HELLO @${m.sender.split('@')[0]} 
THIS IS BINGWA SOKONI 😇\n\n *select your offer*\n\n> POWERED BY SAFARICOM✅\n> SELECT YOUR CHOICE FOR TODAY📞\n> THANK YOU FOR BEING PART OF US📚\n\n\n> click the buttons to see more`.trim();

    const buttons = [
      ['Data 💀', '.data'],
      ['Sms 😍', '.sms'],
      ['Minutes 📚', '.minutes'],
      ['Data & Minutes 📞', '.datamin'],
      ['Data & Sms📞', '.datasms'],
      ['All in one ✅', '.all'],
      ['Home 🏠', 'Bingwa']
    ];

    // Add a delay before sending the message to simulate typing
    setTimeout(() => {
      this.sendButton(m.chat, welcomeMessage, igfg, null, buttons, m, { mentions: [m.sender] });
    }, 1000);

    // React with multiple emojis
    ['🤫', '🎉', '👍'].forEach(emoji => m.react(emoji));

    // Log message details for analytics
    console.log(`Message from: @${m.sender.split('@')[0]}`);
    console.log(`Message content: ${m.text}`);
  }

  return true;
}
