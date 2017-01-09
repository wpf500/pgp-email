const openpgp = require('openpgp');

const $ = (el, s) => el.querySelector(s);

const formEl = $(document, '.js-form');

formEl.addEventListener('submit', evt => {
    evt.preventDefault();

    let armoredPrivateKey = $(formEl, '#privateKey').value;
    let passphrase = $(formEl, '#passphrase').value;
    let armoredPublicKey = $(formEl, '#publicKey').value;
    let data = $(formEl, '#message').value;

    let encryptedPrivateKeys = openpgp.key.readArmored(armoredPrivateKey).keys;
    let publicKeys = openpgp.key.readArmored(armoredPublicKey).keys;

    let privateKeysPromise = encryptedPrivateKeys.map(privateKey => {
        return privateKey.primaryKey.isDecrypted ?
            Promise.resolve(privateKey) :
            openpgp.decryptKey({privateKey, passphrase}).then(o => o.key);
    });

    Promise.all(privateKeysPromise).then(privateKeys => {
        return openpgp.encrypt({data, publicKeys, privateKeys});
    }).then(encrypted => {
        console.log(encrypted);
        $(formEl, '#encrypted').value = encrypted.data;
    }).catch(err => {
        console.error(err);
    });
});
