# REPOSITÓRIO DO VIDEO DA TESTNET DA ALGORAND COM O GOLANG -  WEB3DEV

Link dos videos</br>
Parte 1: Ainda não saiu</br>
Parte 2: Ainda não saiu

## Requisitos para rodar o código

- Sandbox da Algorand instalada no docker
- NodeJS
- Git

## Como rodar o código

- Abra o terminal e digite "git clone https://github.com/w3b3d3v/algorand-tutorials.git"
- Vá para o diretorio clonado, digitando no terminal "cd algorand-js-web3dev" e depois para a pasta desejada
- Inicie o código com "go run main.go"

## Explicando o código

- Nessa aplicação desenvolvemos duas funções, na primeira estamos criando uma função para gerar uma nova conta na testnet da Algorand, adicionando saldo nela e imprimindo esse saldo no console.
- Já na segunda função, estamos enviando uma transação de 1 Algo para um endereço, assinando essa transação com a nossa Private Key, e confirmando a mesma.
