const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.log('Error generating hash.');
        throw error;
    }
};

async function verifyPassword(password, hash) {
    try {
        const match = await bcrypt.compareSync(password, hash);
        return match;
    } catch (error) {
        console.log('Password verification error.');
        throw error;
    }
};

module.exports = { hashPassword, verifyPassword }