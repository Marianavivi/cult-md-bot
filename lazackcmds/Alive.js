let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Retrieve user details
  let name = m.pushName || conn.getName(m.sender);
  
  // URLs and media
  var vn = 'https://cdn.jsdelivr.net/gh/Marianavivi/cult-md-bot@main/media/Alive.mp3';
  let url = 'https://github.com/Marianavivi/cult-md-bot';
  let murl = 'https://youtu.be/3j_EIP--2t8?si=4TFWV0On6Bl1wr-e';
  let img = 'https://files.catbox.moe/y1hq7c.jpg';

  // Create a contact message object
  let con = {
    key: {
      fromMe: false,
      participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: '254700143167@s.whatsapp.net' } : {}),
    },
    message: {
      contactMessage: {
        displayName: `${name}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
  };

  // Prepare the audio message with context info
  let doc = {
    audio: {
      url: vn,
    },
    mimetype: 'audio/mpeg',
    ptt: true,
    waveform: [100, 0, 100, 0, 100, 0, 100],
    fileName: 'shizo',

    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: 'CULT IS ALIVE',
        body: 'WANNA JOIN CULT',
        thumbnailUrl: img,
        sourceUrl: 'https://whatsapp.com/channel/0029Varf29L8PgsDJuAJtn0G',
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  };

  // Send the prepared audio message
  await conn.sendMessage(m.chat, doc, { quoted: con });
};

// Command metadata
handler.help = ['alive'];
handler.tags = ['main'];
handler.command = /^(alive)$/i;

export default handler;
