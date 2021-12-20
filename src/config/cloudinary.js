// import cloudinary from 'cloudinary';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dah8nslpd',
    api_key: '168873961773654',
    api_secret: 'lig8cRrBNm2dC9neNGIbVlaQmlM'
});

module.exports = { cloudinary };