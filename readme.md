# infiniNoob
Ah e tal, o Quirino quer fazer um jogo text-based com o ppl das programações. Começa text-based mas o objectivo é que eventualmente seja pôsto online.

## Eieiei instruções (para windows)
1. Faz uma conta no GitHub e clica no botão "Fork" que vês no canto superior direito desta página.
2. Instala o [cmder](http://cmder.net/), vem com grande parte do que é preciso (incluindo o Git).
3. Instala o [NodeJs@4.2.2](https://nodejs.org/dist/v4.2.2/).
4. Instala o [Atom](https://atom.io/).
(se tiveres problemas a abrir o Atom, tenta adicionar os caminhos do NodeJs e do Atom à tua Variàvel de Ambiente PATH) [wtf](http://www.computerhope.com/issues/ch000549.htm).

5. Abre o [cmder](http://cmder.net/) e insere os seguintes comandos:
```
apm install linter
apm install linter-eslint
mkdir code
cd code
git clone https://github.com/(o teu username do github)/infiniteNoob
cd infiniteNoob
npm install
npm install -g babel-cli
babel-node index.js
```
Se tudo corre bem, o jogo abre e tens tudo o que é preciso para editar código e testar. Quando quiseres, volta a abrir o atom, muda o código, e correr:
```
babel-node index.js
```
Para testar as tuas alterações.

Eventualmente, se quiseres submeter as mudanças para este repositório, faz:
```
git add --all
git commit -m "descrição das alterações"
git push origin master
```
Depois do processo terminar, podes vir à página do teu Fork no GitHub e clicar no botão verde no canto superior esquerdo para me enviares as tuas alterações.
