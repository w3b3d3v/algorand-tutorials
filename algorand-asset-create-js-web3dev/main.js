const algosdk = require('algosdk');

const criarAsset = async function() {
    try {
        //Criando novo client da algorand
        const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        const algodServer = "http://localhost"; ''
        const algodPort = 4001;
        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

        //Passando as secrets keys
        let account1_mnemonic = "adapt pill nation process engine cruise client shiver salute sense resist elephant manual this monkey parade ski drama tilt believe endless wisdom reopen absorb world";

        const account = algosdk.mnemonicToSecretKey(account1_mnemonic);

        //Puxando os parametros da transação, como taxa de fee, bloco atual e etc
        let params = await algodClient.getTransactionParams().do();
        console.log(params);

        let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
            account.addr, // Endereço destino
            algosdk.encodeObj("Meu primeiro asset com Javascript"), // Descrição
            1000000, // Total supply
            0, // Decimals
            false, // Frozen: se ele vai ser transferivel ou não
            account.addr || undefined, // manager account
            account.addr || undefined, // reserve account
            account.addr || undefined, // freeze account
            account.addr || undefined, // clawback account
            "W3DAsset", // unit name
            "W3D", // asset name
            "", // asset URL
            undefined, // assetMetadatahash
            params
        );

        //Assinando a transação com a secret key
        let rawSignedTxn = txn.signTxn(account.sk)

        //Enviando a transação assinada
        let tx = await algodClient.sendRawTransaction(rawSignedTxn).do()
        console.log("Asset Criado ID : " + tx.txId);

        // Esperando pela confirmação
        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

        //Puxando em qual round a transação foi executada
        console.log("Transaction confirmed in round " + confirmedTxn["confirmed-round"]);
    } catch (error) {
        console.log("err", error);
    }
}

criarAsset()