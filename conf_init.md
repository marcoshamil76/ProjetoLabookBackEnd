
### Começando do zero

A seguir, são definidos o passo a passo de fluxo para inicializar as configurações do seu pacote Node e instalações de projeto Backend do ZERO.

- Passo 1: Rode o comando ```npm init -y``` para gerar o arquivo package.json, que usamos para gerenciar as dependências do nosso projeto. Ao fim do comando, seu arquivo package.json deve se parecer com isso:

```jsx
{
  "name": "nodejs-teste",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
---
- Passo 2: Instale o Typescript, usando o comando npm i typescript -D, como dependência de Desenvolvimento.

- **OBSERVAÇÃO**: Em alguns casos será necessário instalar também o typescript como depedência global, usando o comando: ```npm i -g typescript```. Esses problemas são facilmente identificados caso mais para frente o comando ```tsc``` não seja reconhecido.
**ATENÇÃO:** Caso já tenha instalado globalmente, não será necessário instalar novamente.
---
- Passo 3: Crie um arquivo chamado tsconfig.json no root do seu projeto, recomendo criar esse arquivo utilizando o seguinte comando, até adquirir mais prática e confiança: ```tsc -init```. Deixe seu tsconfig.json, conforme imagem abaixo:

```jsx
{
   "compilerOptions": {
       "target": "es2021",            /* Specify ECMAScript target version */
       "module": "commonjs",       /* Specify module code generation */
       "sourceMap": true,          /* Generates corresponding '.map' file. */
       "outDir": "./build",        /* Redirect output structure to the directory. */
       "rootDir": "./src",         /* Specify the root directory of input files. */
       "removeComments": true,    /* Do not emit comments to output. */
       "noImplicitAny": true       /* Raise error on declarations with an implied 'any' type. */
   }
}
```
---
- Passo 4: Crie a pasta src na root de seu projeto, movendo para ela os arquivos .ts, respectivamente.
---
- Passo 5: Lembre-se de criar o script start dentro do seu package.json para rodar o projeto, no seguinte formato:

```jsx
”scripts”: {
   "start": "tsc && node ./build/index.js"
}
```
---
- Passo 6: Por fim, configure e/ou crie um arquivo .gitignore que garanta que a pasta node_modules não seja enviada para o Github.