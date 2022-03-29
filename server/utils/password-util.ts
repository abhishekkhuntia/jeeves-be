
const bcrypt = require('bcrypt');

const passwordUtil = {
    encryptPassword: (password: string) => {
        return bcrypt.hash(password, 10);
    },
    isMatchingPassword: async (password: string, hashedPwd: string) => {
        return await bcrypt.compare(password, hashedPwd);
    }
}
export default passwordUtil;