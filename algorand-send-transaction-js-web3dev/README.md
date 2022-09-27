# REPOSITÓRIO DO VIDEO DA TESTNET DA ALGORAND COM O JAVASCRIPT -  WEB3DEV

Link dos videos
Parte 1: https://www.youtube.com/watch?v=BzuQjtP6xak
Parte 2: https://www.youtube.com/watch?v=hkfZMxaYk6c

## Requisitos para rodar o código

- Sandbox da Algorand instalada no docker
- NodeJS
- Git

## Como rodar o código

- Abra o terminal e digite "git clone https://github.com/guilhermeboaventurarodrigues/algorand-js-web3dev.git"
- Vá para o diretorio clonado, digitando no terminal "cd algorand-js-web3dev"
- Instale as dependências, digitando no terminal "npm install"

## Explicando o código

- Nessa aplicação desenvolvemos duas funções, na primeira estamos criando uma função para gerar uma nova conta na testnet da Algorand, adicionando saldo nela e imprimindo esse saldo no console.
- Já na segunda função, estamos enviando uma transação de 1 Algo para um endereço, assinando essa transação com a nossa Private Key, e confirmando a mesma.
