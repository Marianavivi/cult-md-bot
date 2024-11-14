const isToxic = new RegExp("\\b(" +
  "gandu|maderchod|bhosdike|bhosda|laud?a|chut?iya|maa\\s+ki\\s+chut|behenchod|behen\\s+ki\\s+chut|" +
  "tatto\\s+ke\\s+saudagar|machar\\s+ki\\s+jhant|jhant?\\s+ka\\s+baal|rand?i\\s+ka\\s+aulad|" +
  "chuchi|boob(?:ie)?s|to?lo?l|idiot|nigga|fuck|dick|bitch|tits|bastard|asshole|a[su,w,yu]" +
  ")\\b", "i");

import axios from 'axios';
import fetch from 'node-fetch';

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  let chat = global.db.data.chats[m.chat];
  let bot = global.db.data.settings[this.user.jid] || {};
  const isAntiToxic = isToxic.exec(m.text);
  let removeParticipant = m.key.participant;
  let messageId = m.key.id;

  if (chat.antiToxic && isAntiToxic) {
    try {
      var analysisResult = await Analyze(m.text);
      if (isNaN(analysisResult.toxicity)) {
        // Handle API error, e.g., log, send message to admin
        console.error("Toxicity analysis failed. Skipping moderation.");
        return !0; 
      }

      var toxicityLevels = [
        '❤️  ❤️  ❤️  ❤️  ❤️',
        '☠️  ❤️  ❤️  ❤️  ❤️',
        '☠️  ☠️  ❤️  ❤️  ❤️',
        '☠️  ☠️  ☠️  ❤️  ❤️',
        '☠️  ☠️  ☠️  ☠️  ❤️',
        '☠️  ☠️  ☠️  ☠️  ☠️',
      ];
      var toxicityVerdict = [
        'You are so friendly. Very welcoming to know you!',
        'You are not too toxic, is it fun?',
        'You appear to be toxic. Calm down!',
        "Don't be so toxic. You can relax!",
        "There's nothing more I could say, you're totally the most toxic person in the world!",
        'Your toxic meter also goes above 100%.',
      ];

      const toxicityPercentage = Number(analysisResult.toxicity * 100).toFixed(2);
      let toxicityIndex;
      if (toxicityPercentage < 15) {
        toxicityIndex = 0;
      } else if (toxicityPercentage > 14 && toxicityPercentage < 35) {
        toxicityIndex = 1;
      } else if (toxicityPercentage > 34 && toxicityPercentage < 51) {
        toxicityIndex = 2;
      } else if (toxicityPercentage > 50 && toxicityPercentage < 76) {
        toxicityIndex = 3;
      } else if (toxicityPercentage > 75 && toxicityPercentage < 95) {
        toxicityIndex = 4;
      } else {
        toxicityIndex = 5;
      }

      var caption = `*[ TOXIC STRENGTH ]*\n\n${toxicityLevels[toxicityIndex]}\n${toxicityVerdict[toxicityIndex]}\n`;

      await this.reply(
        m.chat,
        `*Bad Words Detected!*\n ${caption} ${isBotAdmin ? '' : '\n\n_Bot is not admin_'}`,
        m
      );

      if (isBotAdmin) {
        // Implement tiered warning system here
        global.db.data.users[m.sender].warn += 1; 

        if (global.db.data.users[m.sender].warn >= 3) { 
          // Example: Ban user after 3 warnings
          await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
          await this.sendMessage(m.chat, { text: `@${m.sender.split('@')[0]} has been banned from the group due to repeated toxic behavior.` });
        } else {
          // Example: Delete message and give a warning
          await this.sendMessage(m.chat, {
            delete: { remoteJid: m.chat, fromMe: false, id: messageId, participant: removeParticipant },
          });
          await this.sendMessage(m.chat, { text: `@${m.sender.split('@')[0]} Warning: Avoid using toxic language. This is warning number ${global.db.data.users[m.sender].warn}.` });
        }
      }
    } catch (error) {
      console.error("Error handling toxic message:", error);
      // Additional error handling or logging
    }
  }
  return !0;
}

async function Analyze(text) {
  try {
    const result = await axios.post(
      'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyDh6d2S3S4zOuZSgyySRcnj8uZMNJ6kdFQ', // Replace with your API key
      {
        comment: {
          text: text,
          type: 'PLAIN_TEXT',
        },
        languages: ['en'], 
        requestedAttributes: { SEVERE_TOXICITY: {}, INSULT: {} },
      }
    );
    return {
      toxicity: result.data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
      insult: result.data.attributeScores.INSULT.summaryScore.value,
      combined:
        (result.data.attributeScores.SEVERE_TOXICITY.summaryScore.value +
          result.data.attributeScores.INSULT.summaryScore.value) /
        2,
    };
  } catch (error) {
    console.error("Error analyzing text:", error);
    if (error.response) {
      console.error("Perspective API response:", error.response.data);
    }
    return { toxicity: NaN, insult: NaN, combined: NaN };
  }
}
