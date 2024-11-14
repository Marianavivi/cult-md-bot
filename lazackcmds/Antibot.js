import { areJidsSameUser } from '@whiskeysockets/baileys';

export async function before(m, { participants, conn }) {
  if (m.isGroup) {
    let chat = global.db.data.chats[m.chat];

    // Check if antiBotClone is enabled
    if (!chat.antiBotClone) {
      return;
    }

    let botJid = global.conn.user.jid; // JID of the main bot

    // Ensure botJid is correctly set
    if (!botJid) {
      console.error('Bot JID is not set');
      return;
    }

    // Skip if the current bot is the main bot
    if (botJid === conn.user.jid) {
      return;
    } else {
      // Check if the main bot is present in the group
      let isBotPresent = participants.some(p => areJidsSameUser(botJid, p.id));

      if (isBotPresent) {
        setTimeout(async () => {
          try {
            await m.reply('✨ No bot is needed in this group, you will be expelled');
            await conn.groupLeave(m.chat);
          } catch (error) {
            console.error('Failed to leave group:', error);
          }
        }, 5000); // 5 seconds
      }
    }
  }
}
