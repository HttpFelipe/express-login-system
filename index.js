const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { generateAuthToken, verifyAuthToken } = require('./models/auth');
const PORT = process.env.PORT || 3000;

//Configuração do Handlebars
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Importar model usuario
const Usuario = require("./models/Usuario");

//Configuração das sessions
app.use(
  session({
    secret: "secretExample",
    resave: false,
    saveUninitialized: true,
  })
);

//Criptografia de Senha
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

//Rota para exibir o formulário de cadastro
app.get("/cad", (req, res) => {
  if (req.session.errors) {
    var arrayErros = req.session.errors;
    req.session.errors = "";
    return res.render("cad", {error: arrayErros });
  }

  if (req.session.success) {
    req.session.success = false;
    return res.render("cad", {MsgSuccess: true });
  }

  return res.render("cad");
});

//Rota para exibir a página inicial
app.get("/", (req, res) => {
  if (req.session.errors) {
    var arrayErros = req.session.errors;
    req.session.errors = "";
    return res.render("index", {error: arrayErros });
  }

  if (req.session.success) {
    req.session.success = false;
    return res.render("index", {MsgSuccess: true });
  }

  return res.render("index");
});

// Rota restrita que requer autenticação
app.get("/restrita", verifyAuthToken, (req, res) => {
  return res.render("restrita");
});

// Rota para limpar o cookie de autenticação
app.post("/clear", (req, res)=>{
  res.clearCookie('token');
  return res.redirect('/');
})

// Rota para autenticação do usuário
app.post("/search", (req, res) => {
  let searchEmail = req.body.searchEmail;
  let searchPassword = req.body.searchPassword;
  const erros = [];

  Usuario.findAll({
    where: {
      email: searchEmail,
    },
  })
    .then((result) => {
      if (result.length !== 0) {
        const storedPassword = result[0].senha;

        bcrypt.compare(searchPassword, storedPassword, (err, isMatch) => {
          if (err) {
            console.log(err);
            // Lidar com o erro
            return res.status(500).send("Erro ao comparar as senhas.");
          }

          if (isMatch) {
            // Senhas são iguais, redirecionar para a página restrita
            const userId = Usuario.id // ID do usuário autenticado
  
            // Gerar o token de autenticação
            const token = jwt.sign({ userId }, 'example');
            
            // Definir o token como um cookie
            res.cookie('token', token);
            return res.redirect("/restrita");
          } else {
            // Senhas não são iguais, redirecionar para a index
            erros.push({ mensagem: "Email ou senha incorretos" });

            console.log(erros);
            req.session.errors = erros;
            req.session.success = false;
            return res.redirect("/");
          }
        });
      } else {
        erros.push({ mensagem: "Email ou senha incorretos" });
        console.log(erros);
        req.session.errors = erros;
        req.session.success = false;
        return res.redirect("/");
      }
    })
    .catch((error) => {
      console.log(error);
      // Lidar com o erro.
      return res.status(500).send("Erro ao buscar o usuário.");
    });
});

// Rota para cadastrar um novo usuário
app.post("/cad", async (req, res) => {
  //Valores vindos do formulário
  var nome = req.body.nome;
  var email = req.body.email;
  var password = req.body.password;
  var passwordrepeat = req.body.passwordrepeat;
  var agreecheck = req.body.agree;

  //Array que vai conter os erros
  const erros = [];

  //Remover espaços em branco
  nome = nome.trim();
  email = email.trim();

  //Verificar se o campo nome está vazio
  if (nome == "" || typeof nome == undefined || nome == null) {
    erros.push({ mensagem: "Campo nome não pode ser vazio!" });
  }

  //Verificar se o campo nome é válido
  if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)) {
    erros.push({ mensagem: "Nome inválido! Digite apenas letras no campo Nome!" });
  }

  //Verificar se o campo email está vazio
  if (email == "" || typeof email == undefined || email == null) {
    erros.push({ mensagem: "Campo email não pode ser vazio!" });
  }

  //Verificar se o campo email é valido
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    erros.push({ mensagem: "Campo email inválido!" });
  }

  //Verificar se a senha é válida
  if (!/^[a-zA-Z0-9!@#$%^&*?]+$/.test(password)){
    erros.push({ mensagem: "Campo senha inválido!" })
  }

   //Verificar se a senha tem mais de 6 dígitos
  if (password.length < 6) {
    erros.push({ mensagem: "A senha precisa ter mais de 6 dígitos!" });
  }

  //Verificar se a senha foi repetida corretamente
  if (password !== passwordrepeat) {
    erros.push({ mensagem: "As senhas não podem ser diferentes!" });
  }

  //Verificar se o checkbox foi marcado
  if (agreecheck !== "on") {
    erros.push({
      mensagem:
        "Você precisa concordar com a Política de Privacidade e os Termos de uso para realizar o cadastro!",
    });
  }

  //Caso existam erros, mostra os erros para o usuário na página de cadastro
  if (erros.length > 0) {
    console.log(erros);
    req.session.errors = erros;
    req.session.success = false;
    return res.redirect("/cad");
  }

  //Se não tiver nenhum erro até o momento, seguir para salvar no banco de dados
  try {
    const hashedPassword = await hashPassword(password);

    Usuario.findAll({
      where: {
        email: email,
      },
    })
      .then((result) => {
        if (result.length !== 0) {
          // Se for encontrado o mesmo email no banco de dados, retornar erro
          erros.push({ mensagem: "Email já cadastrado" });
          req.session.errors = erros;
          req.session.success = false;
          return res.redirect("/cad");
        } else {
          //Se não for encontrado o mesmo email no banco de dados, registrar o usuário
          Usuario.create({
            nome: nome,
            email: email.toLowerCase(),
            senha: hashedPassword,
          })
            .then(function () {
              console.log("Cadastrado com sucesso!");
              req.session.success = true;
              return res.redirect("/cad");
            })
            .catch(function (erro) {
              console.log(`Ops, houve um erro: ${erro}`);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    //Lidar com o erro
    console.log(error);
    return res.status(500).send("Erro ao criar o hash da senha.");
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});
