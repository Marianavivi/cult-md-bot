import { download } from 'aptoide-scraper';

let handler = async (m, { conn, usedPrefix: prefix, command, text }) => {
  try {
    if (command === 'modapk') {
      if (!text) throw `*[❗] Please provide the APK name you want to download.*`;

      await conn.reply(m.chat, global.wait, m);

      let data = await download(text);
      if (!data || !data.size || !data.dllink) {
        return await conn.sendMessage(m.chat, { text: '*[❗] Unable to find the APK.*' }, { quoted: m });
      }

      let sizeInMB = parseFloat(data.size.replace(' MB', '').replace(',', ''));
      if (data.size.includes('GB') || sizeInMB > 200) {
        return await conn.sendMessage(m.chat, { text: '*[⛔] The file is too large.*' }, { quoted: m });
      }

      await conn.sendMessage(
        m.chat,
        { document: { url: data.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: `${data.name}.apk`, caption: null },
        { quoted: m }
      );

      console.log(`APK Downloaded: ${data.name}, Size: ${data.size}`);
    }
  } catch (err) {
    console.error(`Error during APK download: ${err.message}`);
    await conn.sendMessage(m.chat, { text: `*[❗] An error occurred: ${err.message}*` }, { quoted: m });
  }
};

handler.help = ['modapk'];
handler.tags = ['downloader'];
handler.command = /^modapk$/i;
export default handler
