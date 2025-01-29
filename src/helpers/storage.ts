import SecureLS from 'secure-ls'
const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: process.env.VUE_APP_SLS_SECRET })
export default ls
