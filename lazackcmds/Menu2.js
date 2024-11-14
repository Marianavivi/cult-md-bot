import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { canLevelUp, xpRange } from '../lib/levelling.js'
import fetch from 'node-fetch'
import fs from 'fs'
const { levelling } = '../lib/levelling.js'
import moment from 'moment-timezone'
import { promises } from 'fs'
import { join } from 'path'
const time = moment.tz('Africa/Nairobi').format('HH')
let wib = moment.tz('Africa/Nairobi').format('HH:mm:ss')

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let d = new Date(new Date + 3600000)
        let locale = 'en'
        let week = d.toLocaleDateString(locale, { weekday: 'long' })
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

        if (!(who in global.db.data.users)) throw `✳️ The user is not found in my database`
        
        let pp = './jusorts/sylivanus.jpg'
        let user = global.db.data.users[who]
        let { name, exp, diamond, lastclaim, registered, regTime, age, level, role, warn } = user
        let { min, xp, max } = xpRange(user.level, global.multiplier)
        let username = conn.getName(who)
        let math = max - xp
        let prem = global.prems.includes(who.split('@')[0])
        let sn = createHash('md5').update(who).digest('hex')
        let totaluser = Object.values(global.db.data.users).length 
        let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered).length 
        let more = String.fromCharCode(8206)
        let readMore = more.repeat(850) 
        let greeting = ucapan()
        let quote = quotes[Math.floor(Math.random() * quotes.length)]
        let taguser = '@' + m.sender.split('@')[0]

        let str = `
🚀 *_Buckle up ${name}, ${greeting}! We're going on an adventure!_* 🚀

📜 *_Quote of the day: ${quote}_* 📜

╔═══════════════════════╗
║ 🌟 *User Info:* 🌟                    
║═══════════════════════╣
║ 👾  *User Tag:* ${taguser}            
║ 🎩  *Name:* ${name}                   
║ 🦸  *Master Mind:* MARIANA      
║ 💎  *Diamonds:* ${diamond}             
║ 🏆  *Rank:* ${role}                   
║ 🎮  *XP:* ${exp}                      
╚═══════════════════════╝

╔═══════════════════════╗
║ 📅 *Today's Sauce!* 📅                
╠═══════════════════════╣
║ 📆  *Today's Date:* ${date}           
║ ⏲️  *Current Time:* ${wib}            
╚═══════════════════════╝

╔═══════════════════════╗
║ 🤖 *BOT STATUS:* 🤖                   
╠═══════════════════════╣
║ 🤡  *Bot Name:* ${botname}            
║ 💻  *Platform:* HEROKU                  
║ 📣  *Prefix:* ${usedPrefix}            
║ 🕓  *Uptime:* ${uptime}               
║ 💌  *Database:* ${rtotalreg} of ${totaluser} 
║ 📚  *Total Users:* ${totaluser}       
╚═══════════════════════╝

💡 *_Remember, when in doubt, use ${usedPrefix}list or ${usedPrefix}help2. It's like my magic spell book!_* 💡
`

        await conn.sendFile(m.chat, pp, 'perfil.jpg', str, m, null, rpyt)
        m.react(done)
    } catch (err) {
        console.error(`Error processing command: ${err.message}`)
        await conn.reply(m.chat, `Something went wrong: ${err.message}`, m)
    }
}

handler.help = ['main']
handler.tags = ['group']
handler.command = ['menu3', 'help3']

export default handler

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
    const time = moment.tz('Africa/Nairobi').format('HH')
    if (time >= 4 && time < 10) return "Good Morning 🌄"
    if (time >= 10 && time < 15) return "Good Afternoon ☀️"
    if (time >= 15 && time < 18) return "Good Afternoon 🌇"
    return "Good Night 🌙"
}

const quotes = [
    "I'm not lazy, I'm just on my energy saving mode.",
    "Life is short, smile while you still have teeth.",
    // additional quotes...
    "Why do they call it beauty sleep when you wake up looking like a troll?",
]
