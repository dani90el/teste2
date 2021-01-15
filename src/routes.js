const express = require('express');

const routes = express.Router();

const Aluno = require('./controllers/aluno.controller');

routes.get('/', Aluno.index);

// Rotas de Usuários
routes.post('/api/aluno', Aluno.create);
routes.get('/api/aluno', Aluno.index);
// routes.get('/api/aluno.details/:_id', Aluno.details);
routes.delete('/api/aluno/:_id', Aluno.delete);
routes.put('/api/aluno',Aluno.update);
routes.post('/api/aluno/login', Aluno.login);
routes.get('/api/aluno/checktoken', Aluno.checkToken);
routes.get('/api/aluno/destroytoken', Aluno.destroyToken);

module.exports = routes;
