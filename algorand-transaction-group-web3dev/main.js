const algosdk = require('algosdk');
const readline = require('readline-sync');

async function criarConta() {
    try {
        const myaccount = algosdk.generateAccount();
        console.log("Endereco da conta = " + myaccount.addr);
        let chave_conta = algosdk.secretKeyToMnemonic(myaccount.sk);
        console.log("Chaves da conta = " + chave_conta);
        console.log("Conta criada. Salve sua chave e seu endereco");
        console.log("Adicione fundos na sua conta no seguinte link: ");
        console.log("https://dispenser.testnet.aws.algodev.network/ ");
        await readline.prompt();
        const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        const algodServer = "http://localhost";
        const algodPort = 4001;
        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

        let accountInfo = await algodClient.accountInformation(myaccount.addr).do();
        console.log("Saldo da conta: %d microAlgos", accountInfo.amount);
        return myaccount;
    } catch (err){
        console.log(err)
    }
}

async function transacaoEmGrupo(){
    let account1_mnemonic = "similar swim hungry alert old kangaroo dilemma denial nest arm balcony toy knife lonely weather verify twist type wrestle basket vanish bargain equal able letter"

    let account1 = algosdk.mnemonicToSecretKey(account1_mnemonic);

    console.log("Conta 1: "+account1.addr);

    const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    const algodServer = "http://localhost";
    const algodPort = 4001;
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    let accountInfo = await algodClient.accountInformation(account1.addr).do();
    console.log("Saldo da conta 1 antes da transferencia: %d microAlgos", accountInfo.amount);

    //Pegando os parametros sugeridos
    const suggestedParams = await algodClient.getTransactionParams().do();

    //Construindo as transações
    const txn1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account1.addr,
        to: "QG7CXPA6JUFEFGPTOUSCYBZQ3D6BBRTCWNQYGY2FQBN4DKMETR2FQ2OKWM",
        amount: 1000000,
        suggestedParams: suggestedParams
    });

    const txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account1.addr,
        to: "56IBEHM2MKPJL2XQ2NWRD5KRGUCNIAGQ6BK2BIOABUWJ4SXZNH3SHBC4YU",
        amount: 2000000,
        suggestedParams: suggestedParams
    })
    
    //Assinar o grupo de transações
    algosdk.assignGroupID([txn1, txn2]);

    //Assinando as transações através da secret key
    const stxn1 = txn1.signTxn(account1.sk);
    const stxn2 = txn2.signTxn(account1.sk);

    console.log("Enviando as transações...")
    const { txId } = await algodClient.sendRawTransaction([stxn1, stxn2]).do();

    //Aguardar as confirmções
    console.log("Aguardando a confirmação das transações(isso pode demorar algum tempo)")
    await algosdk.waitForConfirmation(algodClient, txId, 6);
    console.log("Transação efetuada com sucesso.")

    console.log("Transação 1 enviada no id  "+txn1.txID().toString());
    console.log("Transação 2 enviada no id  "+txn2.txID().toString());

    let accountInfo1 = await algodClient.accountInformation(account1.addr).do();
    console.log("Saldo da conta 1 DEPOIS da transferencia: %d microAlgos", accountInfo1.amount);
}

transacaoEmGrupo();