const algosdk = require('algosdk');

async function receberAsset(){
    const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    const algodServer = "http://localhost";
    const algodPort = 4001;
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    let account2_mnemonic = "bench moment couch forest sand install school jeans sketch wasp degree help eternal situate indicate polar expand clump talent sausage artwork luxury journey ability charge";

    const account2 = algosdk.mnemonicToSecretKey(account2_mnemonic);

    let params = await algodClient.getTransactionParams().do();
    console.log(params);

    let sender = account2.addr;
    let recipient = account2.addr;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    amount = 0;
    note = undefined;
    assetID = 112836634;

    let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, //Endereço remetente
        recipient, //Endereço destinatário
        closeRemainderTo, 
        revocationTarget,
        amount, //Valor da transação 
        note, //Descrição da transação
        assetID, //ID do asset que vai ser transferido
        params); //Parametros sugeridos da transação

    // Assinando a transação com a secret key  
    rawSignedTxn = opttxn.signTxn(account2.sk);
    let opttx = (await algodClient.sendRawTransaction(rawSignedTxn).do());

    // Esperando pela confirmaçlão
    confirmedTxn = await algosdk.waitForConfirmation(algodClient, opttx.txId, 6);

    //Puxando o round em que a transação foi confirmada
    console.log("Transação " + opttx.txId + " confirmada no round " + confirmedTxn["confirmed-round"]);
}

receberAsset()