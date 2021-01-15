const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DataSchema = new mongoose.Schema({
    nome_aluno: String,
    matricula_aluno: String,
    senha_aluno: String,
    idade_aluno: {type:Number, default: 0},
    endereco_aluno: String,
    telefone_aluno: String
}, {
    timestamps: true
});


DataSchema.pre('save',function(next){
    if(!this.isModified("senha_aluno")){
        return next();
    }
    this.senha_aluno = bcrypt.hashSync(this.senha_aluno,10);
    next();
});

DataSchema.pre('findOneAndUpdate', function (next){
    var password = this.getUpdate().senha_aluno+'';
    if(password.length<55){
        this.getUpdate().senha_aluno = bcrypt.hashSync(password,10);
    }
    next();
});

DataSchema.methods.isCorrectPassword = function (password, callback ){
    bcrypt.compare(password,this.senha_aluno,function(err,same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    })
}

const aluno = mongoose.model('Usuarios',DataSchema);
module.exports = aluno;