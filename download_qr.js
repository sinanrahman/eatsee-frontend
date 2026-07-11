const fs = require('fs');
const https = require('https');

const url = 'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://eatseefoods.com';
const file = fs.createWriteStream('eatseefoods_qrcode.png');

https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Downloaded QR code');
    });
}).on('error', (err) => {
    fs.unlink('eatseefoods_qrcode.png', () => {});
    console.error('Error downloading QR code:', err.message);
});
