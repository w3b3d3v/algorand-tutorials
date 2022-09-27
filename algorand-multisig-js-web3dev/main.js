const algosdk = require("algosdk");
const readline = require('readline-sync');

async function criarConta() {
    const myAccount = algosdk.generateAccount();
    console.log("Endereço da conta: "+ myAccount.addr);
    const keys = algosdk.secretKeyToMnemonic(myAccount.sk);
    console.log("Chaves da conta: " +keys);
    console.log("Conta criada. Salve seu endereço e sua chave");
    console.log("Adicione fundos no seuginte link: ");
    console.log("https://dispenser.testnet.aws.algodev.network?account="+myAccount.addr);
}

async function multiSign() {
    let account1_mnemonic = "adapt pill nation process engine cruise client shiver salute sense resist elephant manual this monkey parade ski drama tilt believe endless wisdom reopen absorb world";
    let account2_mnemonic = "bench moment couch forest sand install school jeans sketch wasp degree help eternal situate indicate polar expand clump talent sausage artwork luxury journey ability charge";
    let account3_mnemonic = "slush advice before very lonely crane tape food imitate garbage student uncover high link box anxiety rate horror uniform shoot fiber before proof above parent";

    let account1 = algosdk.mnemonicToSecretKey(account1_mnemonic);
    let account2 = algosdk.mnemonicToSecretKey(account2_mnemonic);
    let account3 = algosdk.mnemonicToSecretKey(account3_mnemonic);

    console.log("Conta 1: "+ account1.addr);
    console.log("Conta 2: "+ account2.addr);
    console.log("Conta 3: "+ account3.addr);

    const mparams = {
        version: 1,
        threshold: 2,
        addrs : [
            account1.addr,
            account2.addr,
            account3.addr,
        ]
    }

    let multisigaddr = algosdk.multisigAddress(mparams);
    console.log("Endereço da carteira multisig: "+multisigaddr);
    console.log("Adicione fundos para sua carteira multisig no link abaixo: ")
    console.log("https://dispenser.testnet.aws.algodev.network?account="+multisigaddr);

    await readline.prompt();

    const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    const algodServer = "http://localhost";
    const algodPort = 4001;

    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    let params = await algodClient.getTransactionParams().do();

    const receiver = account3.addr;

    let names = '{"firstName": "WEB3DEV", "lastName":"WAGBI"}'
    const enc = new TextEncoder();
    const note = enc.encode(names);

    let txn = algosdk.makePaymentTxnWithSuggestedParams(multisigaddr, receiver, 1000000, undefined, note, params);

    let txId = txn.txID().toString();

    let rawSignedTxn = algosdk.signMultisigTransaction(txn, mparams, account1.sk).blob;
    let twosigs = algosdk.appendSignMultisigTransaction(rawSignedTxn, mparams, account2.sk).blob;

    await algodClient.sendRawTransaction(twosigs).do();

    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    console.log("Transação "+txId+ " confirmada no round " + confirmedTxn["confirmed-round"]);

    let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
    console.log("Informações da transação"+mytxinfo);

    let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
    console.log("Nota da transação"+string);

    const obj = JSON.parse(string);
    console.log("Primeiro parametro da nota: "+obj.firstName);
}

multiSign();
