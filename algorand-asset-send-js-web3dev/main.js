const algosdk = require('algosdk');

async function enviarAsset(){
    const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    const algodServer = "http://localhost";
    const algodPort = 4001;
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    let account1_mnemonic = "adapt pill nation process engine cruise client shiver salute sense resist elephant manual this monkey parade ski drama tilt believe endless wisdom reopen absorb world";
    let account2_mnemonic = "bench moment couch forest sand install school jeans sketch wasp degree help eternal situate indicate polar expand clump talent sausage artwork luxury journey ability charge";

    const account1 = algosdk.mnemonicToSecretKey(account1_mnemonic);
    const account2 = algosdk.mnemonicToSecretKey(account2_mnemonic);

    let params = await algodClient.getTransactionParams().do();
    let sender = account1.addr;
    let recipient = account2.addr;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    amount = 10;
    assetID = 112836634;
    note = undefined;

    //Construindo a transação
    let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, //Endereço remetente
        recipient, //Endereço destinatário
        closeRemainderTo, 
        revocationTarget,
        amount,  //Valor da transação
        note, //Nota da transação
        assetID, //ID do asset que vai ser transferido
        params); //Parametros sugeridos da transação

    // Assinando e enviando a transação
    rawSignedTxn = xtxn.signTxn(account1.sk)
    let xtx = (await algodClient.sendRawTransaction(rawSignedTxn).do());

    // Esperando pela confirmação
    confirmedTxn = await algosdk.waitForConfirmation(algodClient, xtx.txId, 6);
    console.log("Transação " + xtx.txId + " confirmada no round " + confirmedTxn["confirmed-round"]);
}