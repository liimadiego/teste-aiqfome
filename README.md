# API AiqFome Gerenciar Produtos Favoritos

~ git clone https://github.com/liimadiego/teste-aiqfome.git<br>
~ cd teste-aiqfome<br>
~ npm install

## Para iniciar o projeto

Copie o arquivo .env.example e cole em um novo arquivo chamado .env, altere os dados (JWT_SECRET, DATABASE_URL e PORT). Os dados do banco de dados devem ser os configurados em seu postgreSQL<br><br>
Rode ~ npx prisma migrate dev<br>
(para montar as tabelas no banco de dados PostgreSQL)<br>
<br>
Para fazer o build do projeto, rode ~ npm run build
<br>
Por fim inicie a API com:<br>
~ npm run start<br><br>

Para acessar a documentação Swagger, acesse http://localhost:3000/api-docs<br>
A Api está em http://localhost:3000/api/<br><br>

Criei também um arquivo com a collection Insomnia do projeto, se encontra na base do projeto com o nome aiqfome_collection_insomnia.yaml
