const openpgp = require('openpgp');

const $ = (el, s) => el.querySelector(s);

const formEl = $(document, '.js-form');

formEl.addEventListener('submit', evt => {
    evt.preventDefault();

    let armoredPrivateKey = $(formEl, '#privateKey').value;
    let passphrase = $(formEl, '#passphrase').value;
    let armoredMessage = $(formEl, '#message').value;

    let encryptedPrivateKey = openpgp.key.readArmored(armoredPrivateKey).keys[0];
    let message = openpgp.message.readArmored(armoredMessage);

    let privateKeyPromise = encryptedPrivateKey.primaryKey.isDecrypted ?
        Promise.resolve(encryptedPrivateKey) :
        openpgp.decryptKey({'privateKey': encryptedPrivateKey, passphrase}).then(o => o.key);

    privateKeyPromise.then(privateKey => {
        return openpgp.decrypt({message, privateKey});
    }).then(decrypted => {
        $(formEl, '#decrypted').value = decrypted.data;
    }).catch(err => {
        console.error(err);
    });
});
