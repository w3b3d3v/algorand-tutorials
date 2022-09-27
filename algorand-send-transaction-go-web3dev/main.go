package main

import (
	"context"
	"fmt"
	json "encoding/json"

	"github.com/algorand/go-algorand-sdk/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/crypto"
	"github.com/algorand/go-algorand-sdk/mnemonic"
	"github.com/algorand/go-algorand-sdk/transaction"
	"github.com/algorand/go-algorand-sdk/future"
)

func main() {
	//Criando conta na testnet
	account := crypto.GenerateAccount()
	passphare, err := mnemonic.FromPrivateKey(account.PrivateKey)
	myAddress := account.Address.String()
	if err != nil {
		fmt.Printf("Erro ao criar a transação: %s\n", err)
	} else {
		fmt.Printf("Meu endereço: %s\n", myAddress)
		fmt.Printf("Minhas chaves: %s\n", passphare)
		fmt.Println("Conta criada, adicione saldos em :\n--> https://dispenser.testnet.aws.algodev.network?account=" + myAddress)
		fmt.Println("Depois de adicionados, aperte enter")
		fmt.Scanln()
	}

	//Iniciando um nó na algorand
	const algodAddress = "http://localhost:4001"
	const algodToken = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

	algodClient, err := algod.MakeClient(algodAddress, algodToken)
	if err != nil {
		fmt.Printf("Erro ao criar um novo client: %s\n", err)
		return
	}

	accountInfo, err := algodClient.AccountInformation(myAddress).Do(context.Background())
	if err != nil {
		fmt.Printf("Erro ao gerar informações da conta: %sz\n", err)
		return
	}
	fmt.Printf("Saldo da conta: %d microAlgos\n", accountInfo.Amount)

	//Construindo a transação
	txParams, err := algodClient.SuggestedParams().Do(context.Background())
	if err != nil {
		fmt.Printf("Erro ao gerar os parametros da transação: %s\n", err)
		return
	}
	fromAddr := myAddress
	toAddr := "4PUGFTH6W3EBWB6BROHUOTCHVK6BMUWDVKOH3LM24FDHBWGISPETANWVFI"

	var amount uint64 = 1000000
	var minFee uint64 = transaction.MinTxnFee
	note := []byte("Hello World")
	genID := txParams.GenesisID
	genHash := txParams.GenesisHash
	firstValidRound := uint64(txParams.FirstRoundValid)
	lastValidRound := uint64(txParams.LastRoundValid)
	txn, err := transaction.MakePaymentTxnWithFlatFee(fromAddr, toAddr, minFee, amount, firstValidRound, lastValidRound, note, "", genID, genHash)
	if err != nil {
		fmt.Printf("Erro ao criar a transacao: %sz\n", err)
		return
	}

	//Assinando a transação
	txID, signedTxn, err := crypto.SignTransaction(account.PrivateKey, txn)
	if err != nil {
		fmt.Printf("Erro ao assinar a transacao: %s\n", err)
		return
	}
	fmt.Printf("Transacao assinada, txID: %s\n", txID)

	//Enviando a transação
	sendResponse, err := algodClient.SendRawTransaction(signedTxn).Do(context.Background())
	if err != nil {
		fmt.Printf("Erro ao enviar a transação: %s\n", err)
		return
	}
	fmt.Printf("Transação enviada %s\n", sendResponse)

	//Esperar a confirmação do envio
	confirmedTxn, err := future.WaitForConfirmation(algodClient, txID, 4, context.Background())
	if err != nil {
		fmt.Printf("Erro ao esperar a transacao: %s\n", txID)
	}

	txnJson, err := json.MarshalIndent(confirmedTxn.Transaction.Txn, "", "\t")
	if err != nil {
		fmt.Printf("Erro ao gerar json da transacao: %s\n", err)
	}
	fmt.Printf("Informacoes da transacao: %s\n", txnJson)
	fmt.Printf("Descricao da transacao %s\n", string(confirmedTxn.Transaction.Txn.Note))
	fmt.Printf("Valor da transação: %d microAlgos\n", confirmedTxn.Transaction.Txn.Amount)
	fmt.Printf("Valor da taxa: %d microAlgos\n", confirmedTxn.Transaction.Txn.Fee)
}
