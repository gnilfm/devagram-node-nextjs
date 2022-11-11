import type { NextApiRequest, NextApiResponse} from "next";
import {respostaPadraoMsg} from "../../types/respostaPadraoMsg"
import {validarTokenJwt} from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { usuarioModel } from "../../models/usuarioModel";
import { publicacaoModel } from "../../models/publicacaoModel";


const comentarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
    try{
        if (req.method === "PUT"){
            const {userId, id} = req.query;
            const usuarioLogado = await usuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({erro : "Usuario nao encontrado"});
            }

            const publicacao = await publicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro : "Publicação nao encontrada"});
            }
            if(!req.body || !req.body.comentario || req.body.comentario.length < 2){
                return res.status(400).json({erro : "Comentario nao e valido"});
            }    
            
            const comentario = {
                usuarioId : usuarioLogado._id,
                nome : usuarioLogado.nome,
                comentario : req.body.comentario
            }
            publicacao.comentarios.push(req.body.comentario);
            await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
            return res.status(200).json({msg : "Comentario adicionado com sucesso"});

        }

    return res.status(405).json({erro : "Metodo informado nao e valido"});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : "Erro ao adicionar comentario"});
    }
}
    
export default validarTokenJwt(conectarMongoDB(comentarioEndpoint));