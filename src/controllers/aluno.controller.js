const Aluno = require('../models/aluno.model');
const jwt = require("jsonwebtoken");
const { checkout } = require('../routes');
const secret = "mysecret";

module.exports = {
    async index(req, res) {
        const user = await Aluno.find();
        res.json(user);
    },
    async create(req, res) {
        const { nome_aluno,
            matricula_aluno,
            senha_aluno,
            idade_aluno,
            endereco_aluno,
            telefone_aluno } = req.body;

        let data = {};
        let user = await Aluno.findOne({ matricula_aluno });

        if (!user) {
            data = { nome_aluno, matricula_aluno, senha_aluno, idade_aluno, endereco_aluno, telefone_aluno };
            //  Caso o aluno ainda não esteja cadastrado no BD ele chama a função 'create' para inserir
            user = await Aluno.create(data);
            return res.status(200).json(user);
        } else {
            return res.status(500).json(user);
        }
    },
    async details(req, res) {
        const { _id } = req.params;
        const user = await Aluno.findOne({ _id });
        res.json(user);
    },
    async delete(req, res) {
        const { _id } = req.params;
        const user = await Aluno.findByIdAndDelete({_id});
        return res.json(user);
    },
    async update(req, res) {
        const { _id, nome_aluno,
            matricula_aluno,
            senha_aluno,
            idade_aluno,
            endereco_aluno,
            telefone_aluno } = req.body;
        const data = { nome_aluno,
            matricula_aluno,
            senha_aluno,
            idade_aluno,
            endereco_aluno,
            telefone_aluno };
        const user = await Aluno.findOneAndUpdate({_id},data,{new:true});
        res.json(user);
    },
   
    async login(req, res) {
        const { matricula, senha } = req.body;
        Usuario.findOne({ matricula_aluno: matricula }, function (err, user) {
            if (err) {
                console.log(err);
                res.status(200).json({ erro: "Erro no servidor. Por favor, tente novamente!" });
            } else if (!user) {
                res.status(200).json({ status: 2, error: 'E-mail não encontrado no Banco de Dados!' });
            } else {
                user.isCorrectPassword(senha_aluno, async function (err, same) {
                    if (err) {
                        res.status(200).json({ error: "Erro no servidor. Por favor tente novamente!" });
                    } else if (!same) {
                        res.status(200).json({ status: 2, error: "A senha não confere!" });
                    } else {
                        const payload = { matricula_aluno };
                        const token = jwt.sign(payload, secret, {
                            expires: '24h'
                        })
                        //     res.cookie('token', token, {httpOnly: true});
                        //     res.status(200).json({status:1, auth: true, token:token, matricula_aluno})
                        // 
                    }
                })
            }
        })
    },
    async checkToken(req, res){
        const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-acess-token'];
        if(!token){
            res.json({status: 401, msg:"Não autorizado: Token inexistente!"});
        }else{
            jwt.verify(token,secret,function(err,decoded){
                if(err){
                    res.json({status:401, msg: "Não autorizado: Token inválido!"});
                }else{
                    res.json({status:200})
                }
            })
        }
    },
    async destroyToken(req, res){
        const token = req.headers.token;

        if(token){
            res.cookie('token', null, {httpOnly: true});
        }else{
            res.status(401).send("Logout não autorizado!");
        }
        res.send("Sessão finalizada com sucesso!");
    }
}
