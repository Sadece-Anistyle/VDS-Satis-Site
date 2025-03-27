const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();

const CLIENT_ID = '1353135369356574721';
const CLIENT_SECRET = 'yDvUqV88QtoZYW7ssHtXEnltvJDf5W2g';
const REDIRECT_URI = 'http://localhost:3000/callback';

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('Hata: Yetkilendirme kodu bulunamadı.');

  try {
    // Access token al
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    // Kullanıcı bilgilerini al
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const discordName = `${userResponse.data.username}#${userResponse.data.discriminator}`;

    // Discord ismini siteye kaydet (örneğin bir veritabanına veya localStorage'a)
    console.log(`Eşleştirilen Discord İsmi: ${discordName}`);

    // Kullanıcıyı bir başarı sayfasına yönlendir
    res.send(`Eşleştirme başarılı! Discord isminiz: ${discordName}`);
  } catch (error) {
    console.error(error);
    res.send('Eşleştirme sırasında bir hata oluştu.');
  }
});

client.once('ready', () => {
  console.log('Bot hazır!');
});

client.login(process.env.DISCORD_TOKEN);

app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor.');
});