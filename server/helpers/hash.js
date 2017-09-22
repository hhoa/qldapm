
/* hash a string */
module.exports = generateHash = (input) => {
    return require('crypto').createHash('sha256').update(input).digest('base64');
};