const Sequelize = require('sequelize');

// Inicializar a instância do Sequelize para se conectar ao banco de dados
const sequelize = new Sequelize('logindb', 'root', '', {
  host: '127.0.0.1',   // Endereço do banco de dados
  dialect: 'mysql',    // Dialeto do banco de dados
  define: {
    charset: 'utf8',   // Charset para suportar caracteres especiais
    collate: 'utf8_general_ci',   // Collate para suportar caracteres especiais
    timestamps: true   // Incluir colunas de timestamps em todas as tabelas
  },
  logging: false   // Desativar logs do Sequelize
});

module.exports = { Sequelize, sequelize };
