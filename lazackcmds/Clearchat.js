async function handler(m, { conn }) {
  try {
    // Deleting the chat message
    await conn.chatModify({ delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }] }, m.chat);

    // Sending confirmation message
    await m.reply("CULT MD bot successfully deleted this chat!");
    console.log(`Chat successfully deleted in ${m.chat}`);
  } catch (err) {
    console.error(`Failed to delete chat: ${err.message}`);
    await m.reply("Failed to delete the chat. Please try again later.");
  }
}

handler.help = ['deletechat'];
handler.tags = ['owner'];
handler.command = /^(deletechat|delchat|dchat|clearchat|cleanchat)$/i;
handler.owner = true;

export default handler;
