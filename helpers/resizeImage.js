const Jimp = require("jimp");

/**
 * Function to crop, resize and center uploaded image
 * 
 * @param {String} tempUpload 
 */
const resizeImage = async tempUpload => {
  const image = await Jimp.read(tempUpload);
  await image
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tempUpload);
};

module.exports = resizeImage;
