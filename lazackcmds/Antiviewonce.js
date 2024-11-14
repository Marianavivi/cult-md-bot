import { downloadContentFromMessage } from "@whiskeysockets/baileys";

// Main handler function for view-once message processing
let handler = message => message;

handler.before = async function (msg, { conn }) {
  let mediaStream, mediaBuffer, mediaType;

  // Check if the message is a view-once type
  if (msg.mtype === "viewOnceMessageV2" || msg.mtype === "viewOnceMessageV2Extension") {
    // Retrieve the actual message content based on message type
    const viewOnceContent = msg.mtype === "viewOnceMessageV2"
      ? msg.message.viewOnceMessageV2.message
      : msg.message.viewOnceMessageV2Extension.message;
    mediaType = Object.keys(viewOnceContent)[0]; // Determines whether it's image, video, or audio

    // Validate media type
    if (!["imageMessage", "videoMessage", "audioMessage"].includes(mediaType)) {
      console.error('Unsupported media type:', mediaType);
      return; // Exit if the message is not of a supported media type
    }

    // Download media content based on media type
    try {
      const downloadType = mediaType === "imageMessage" ? "image"
                       : mediaType === "videoMessage" ? "video"
                       : "audio";
      mediaStream = await downloadContentFromMessage(viewOnceContent[mediaType], downloadType);
    } catch (error) {
      console.error('Failed to download media content:', error);
      return;
    }

    // Collect all data chunks into a single Buffer
    mediaBuffer = Buffer.from([]);
    try {
      for await (const chunk of mediaStream) {
        mediaBuffer = Buffer.concat([mediaBuffer, chunk]);
      }
    } catch (error) {
      console.error('Failed to collect media data:', error);
      return;
    }

    // Create a formatted information message
    const fileSize = formatFileSize(viewOnceContent[mediaType].fileLength);
    const infoMessage = `
      *👀CULT MD ANTI VIEW ONCE👀*
      *Type:* ${mediaType === "imageMessage" ? "Image 📸" : mediaType === "videoMessage" ? "Video 📹" : "Voice Message"}
      *Size:* \`${fileSize}\`
      *User:* @${msg.sender.split("@")[0]}
      ${viewOnceContent[mediaType].caption ? "*Caption:* " + viewOnceContent[mediaType].caption : ''}
    `.trim();

    // Send the media and info message back to the user
    try {
      if (mediaType === "imageMessage" || mediaType === "videoMessage") {
        await conn.sendFile(
          conn.user.id,
          mediaBuffer,
          mediaType === "imageMessage" ? "error.jpg" : "error.mp4",
          infoMessage,
          msg,
          false,
          { mentions: [msg.sender] }
        );
      } else if (mediaType === "audioMessage") {
        await conn.reply(conn.user.id, infoMessage, msg, { mentions: [msg.sender] });
        await conn.sendMessage(conn.user.id, { audio: mediaBuffer, fileName: "error.mp3", mimetype: "audio/mpeg", ptt: true }, { quoted: msg });
      }
    } catch (error) {
      console.error('Failed to send media message:', error);
    }
  }
};

export default handler;

// Utility function to format file sizes in a readable format
function formatFileSize(sizeInBytes) {
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];
  const unitIndex = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const formattedSize = (sizeInBytes / Math.pow(1024, unitIndex)).toFixed(2);
  return `${formattedSize} ${units[unitIndex]}`;
}
