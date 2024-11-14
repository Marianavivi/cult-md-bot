export async function before(m) {
  try {
    const chat = global.db.data.chats[m.chat];
    if (!chat.autotype) return; // Check if autotype is enabled for the chat

    const commands = Object.values(global.plugins).flatMap(plugin => [].concat(plugin.command));

    // Determine presence status based on the commands
    const presenceStatus = commands.some(cmd =>
      cmd instanceof RegExp ? cmd.test(m.text) : m.text.includes(cmd)
    ) ? 'composing' : 'available';

    // Update presence status if required
    if (presenceStatus) {
      await this.sendPresenceUpdate(presenceStatus, m.chat);
      console.log(`Presence status updated to '${presenceStatus}' for chat ${m.chat}`);
    }
  } catch (err) {
    console.error(`Error in presence update: ${err.message}`);
  }
}

export const disabled = false;
