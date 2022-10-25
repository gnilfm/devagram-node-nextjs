import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg'

export const conectarMongoDB = (handler : NextApiHandler) =>
   async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {

        //verificar se o banco esta conctado, se estiver seguir para o endpoint ou proximo middleware
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }
        //ja que nao esta conectado vamo conectar
        //obter variavel de ambiente preenchida do env
        const {DB_CONEXAO_STRING} = process.env;

        //se a env estiver vazia aborta o uso do sistema e avisa o programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro : 'ENV de configuaracao do banco, nao informado'});
        }
        mongoose.connection.on('connected', () => console.log('Banoco de dados conectado'));
        mongoose.connection.on('error', error => console.log(`Ocorreu err ao conectar no banco: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        //agora posso seguir para o endpoint pois estou conectado no banco
        return handler(req, res);

    }