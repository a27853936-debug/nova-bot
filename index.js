const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

// IMPORTANT: Înlocuiește PUNE_TOKEN_AICI cu token-ul real al botului tău!
const BOT_TOKEN = 'MTU1MzQyMDE0MTA0NjI2Nzk3NQ.GuvO6h.xb1e3rb0_zIJ-GPd0Z9-GNuKN4RrhowPTfspss';

client.once('ready', () => {
    console.log(`✅ Botul Nova Social este online ca: ${client.user.tag}`);
});

app.post('/api/decizie-aplicatie', async (req, res) => {
    const { discordUser, status, grade, motiv } = req.body;

    try {
        const guild = client.guilds.cache.first();
        if (!guild) return res.status(500).json({ success: false, message: 'Botul nu este pe niciun server.' });

        const members = await guild.members.fetch();
        
        const member = members.find(m => 
            m.user.username.toLowerCase() === discordUser.toLowerCase() ||
            m.user.tag.toLowerCase() === discordUser.toLowerCase() ||
            m.id === discordUser
        );

        if (!member) {
            return res.status(404).json({ success: false, message: 'Utilizatorul nu a fost găsit pe serverul de Discord.' });
        }

        if (status === 'ACCEPTAT') {
            await member.send({
                embeds: [{
                    title: '🎉 Felicitări! Aplicația ta a fost ACCEPTATĂ!',
                    description: `Salut **${member.user.username}**,\n\nAplicația ta pentru funcția de **${grade}** pe rețeaua **Nova Social** a fost aprobată!`,
                    color: 0x22c55e,
                    fields: [
                        { name: '📌 Detalii / Pasul Următor', value: motiv || 'Te rugăm să intri pe canalul de teste pentru interviu.' }
                    ],
                    footer: { text: 'Echipa Nova Social Minecraft Network' }
                }]
            });
        } else if (status === 'RESPINS') {
            await member.send({
                embeds: [{
                    title: '❌ Status Aplicație Staff - Nova Social',
                    description: `Salut **${member.user.username}**,\n\nDin păcate, aplicația ta pentru funcția de **${grade}** a fost **respinsă**.`,
                    color: 0xef4444,
                    fields: [
                        { name: '📝 Motiv', value: motiv || 'Răspunsuri incomplete sau cerințe neîndeplinite.' }
                    ],
                    footer: { text: 'Puteți reaplica în 14 zile. Echipa Nova Social.' }
                }]
            });
        }

        return res.json({ success: true, message: 'Mesajul privat a fost trimis cu succes!' });

    } catch (error) {
        console.error('Eroare la trimiterea DM-ului:', error);
        return res.status(500).json({ success: false, message: 'Nu s-a putut trimite DM (utilizatorul are DM-urile închise).' });
    }
});

app.listen(3001, () => {
    console.log('🚀 Serverul de legătură rulează pe portul 3001');
});

client.login(BOT_TOKEN);