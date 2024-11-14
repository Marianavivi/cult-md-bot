import fetch from 'node-fetch';

let bpink = [];

// Fetch the list of images and split into an array
fetch('https://raw.githubusercontent.com/arivpn/dbase/master/kpop/blekping.txt')
  .then(res => res.text())
  .then(txt => (bpink = txt.split('\n')))
  .catch(err => console.error('Error fetching image list:', err));

let handler = async (m, { conn }) => {
  if (bpink.length === 0) {
    console.error('Image list is empty');
    throw new Error('Image list is empty');
  }

  let img = bpink[Math.floor(Math.random() * bpink.length)];

  if (!img) {
    console.error('No image found');
    throw new Error('No image found');
  }

  try {
    const thumbnailBuffer = await (await fetch(img)).buffer();
    await conn.sendFile(m.chat, img, '', 'made by silva tech inc', m, 0, {
      thumbnail: thumbnailBuffer,
    });
  } catch (err) {
    console.error('Error sending file:', err);
    throw new Error('Error sending file');
  }
};

handler.help = ['blackpink'];
handler.tags = ['image'];
handler.limit = false;
handler.command = /^(bpink|bp|blackpink)$/i;

export default handler;
