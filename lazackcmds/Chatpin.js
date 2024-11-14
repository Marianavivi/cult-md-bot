let handler = async (m, { conn, args }) => {
  try {
    await conn.reply(m.chat, 'Chat pinned 📌', m);
    await conn.chatModify({ pin: true }, m.chat);
    console.log(`Chat successfully pinned for ${m.chat}`);
  } catch (err) {
    console.error(`Failed to pin chat: ${err.message}`);
    await conn.reply(m.chat, 'Failed to pin the chat. Please try again later.', m);
  }
}

handler.help = ['pin'];
handler.tags = ['owner'];
handler.command = ['pin'];
handler.owner = true;

export default handler;
