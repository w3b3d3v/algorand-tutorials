const algosdk = require("algosdk");
const readline = require('readline-sync')

const criarConta = function() {
    try {
        const myaccount = algosdk.generateAccount();
        console.log("Endereco da conta = " + myaccount.addr);
        let chave_conta = algosdk.secretKeyToMnemonic(myaccount.sk);
        console.log("Chaves da conta = " + chave_conta);
        console.log("Conta criada. Salve sua chave e seu endereco");
        console.log("Adicione fundos na sua conta no seguinte link: ");
        console.log("https://dispenser.testnet.aws.algodev.network/ ");
        return myaccount;
    } catch (err){
        console.log(err)
    }
}

async function primeiraTransacao() {
    try {
        let myAccount = criarConta();
        console.log("Depois de adicionar fundos aperte enter!");
        await readline.prompt();
        const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        const algodServer = "http://localhost";
        const algodPort = 4001;
        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

        let accountInfo = await algodClient.accountInformation(myAccount.addr).do();
        console.log("Saldo da conta: %d microAlgos", accountInfo.amount);

        let params = await algodClient.getTransactionParams().do();
        params.fee = algosdk.ALGORAND_MIN_TX_FEE;
        params.flatFee = true;

        const receiver = "IFOVX4M36VKEWM2BCRNVEPXGX3ACYQFY6XOYAK4URAZZOQSARAZKMCM2T4";
        const enc = new TextEncoder();
        const note = enc.encode("Hello World");
        let amount = 1000000;
        let sender = myAccount.addr;

        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender,
            to: receiver,
            amount: amount,
            note: note,
            suggestedParams: params
        })

        let signedTxn = txn.signTxn(myAccount.sk);
        let txId = txn.txID().toString();
        console.log("Transação enviada no ID: %s", txId);

        await algodClient.sendRawTransaction(signedTxn).do();

        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
        console.log("Transacao " + txId + " confirmed no round " + confirmedTxn["confirmed-round"]);

        let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
        console.log("Nota: ", string);

        accountInfo = await algodClient.accountInformation(myAccount.addr).do();
        console.log("Valor da transacao: %d microAlgos", confirmedTxn.txn.txn.amt);
        console.log("Valor da taxa: %d microAlgos", confirmedTxn.txn.txn.fee);

        console.log("Balanco atual da conta: %d microAlgos", accountInfo.amount);

    } catch (error) {
        console.log(error);
    }
}

primeiraTransacao()