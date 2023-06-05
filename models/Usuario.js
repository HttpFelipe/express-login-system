const db = require('./db');

// Definir o modelo de usuário usando o Sequelize
const Usuario = db.sequelize.define('usuario', {
  id: {
    type: db.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
});

// Sincronizar o modelo com o banco de dados (criar a tabela se não existir)
Usuario.sync();

module.exports = Usuario;
