import fetch from "node-fetch";
import "@whiskeysockets/baileys";

// Cooldown map to track requests
let cooldown = new Map();

let handler = async (m, { conn, args }) => {
  try {
    const currentTime = Date.now();
    const lastRequestTime = cooldown.get(m.sender);
  
    // 20-minute cooldown for non-owner users
    if (m.sender !== "923092668108@s.whatsapp.net" && lastRequestTime && currentTime - lastRequestTime < 1200000) {
      const remainingTime = 1200000 - (currentTime - lastRequestTime);
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      return conn.reply(m.chat, `Please wait ${minutes} minute(s) and ${seconds} second(s) before requesting again.`, m);
    }

    // Check if phone number argument is provided
    if (!args[0]) {
      return conn.reply(m.chat, "Please provide a phone number.\n*Example:* *.getpair 254732647560*", m);
    }

    const phoneNumber = encodeURIComponent(args[0]);
    const apiUrl = `https://culturesession-6987a4749d66.herokuapp.com/pair?phone=${phoneNumber}`;
    
    m.reply("*Wait while we retrieve your pairing code...*");

    // Fetch pairing code from API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch pairing code. ${response.statusText}`);
    }

    const result = await response.json();

    // Check result for pairing code or error
    if (result.code) {
      const pairingCode = result.code;
      const message = `
*Cult md Pairing Code 🫂*

💬 A verification code has been sent to your phone number. Please check your phone and enter this code to complete pairing.

*🔢 Code:* \`${pairingCode}\`
      `;
      // Send pairing code message
      await conn.reply(m.chat, message, m);
      
      // Update cooldown
      cooldown.set(m.sender, currentTime);
      console.log(`Pairing code sent to ${m.sender}`);
    } else if (result.error) {
      conn.reply(m.chat, `Error: ${result.error}`, m);
      console.error(`Error fetching pairing code: ${result.error}`);
    } else {
      conn.reply(m.chat, `Unexpected response format: ${JSON.stringify(result)}`, m);
      console.error(`Unexpected response format: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    conn.reply(m.chat, `Error: ${error.message}`, m);
    console.error(`Error during APK download: ${error.message}`);
  }
};

handler.help = ["getpair", "getcode"];
handler.tags = ["tools"];
handler.command = ["getpair", "getcode", "paircode"];
handler.owner = false;
handler.private = true;

export default handler;
