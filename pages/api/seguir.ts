import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { politicaCORS } from "../../middlewares/politicaCORS";
import { validarTokenJwt } from "../../middlewares/validarTokenJWT";
import { seguidorModel } from "../../models/seguidorModel";
import { usuarioModel } from "../../models/usuarioModel";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";

const endpointSeguir = 
async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
    try{
        if(req.method === "PUT"){

            const {userId, id} = req?.query;

            //usuario login autenticado = quem esta fazendo a açao
            const usuarioLogado = await usuarioModel.findById(userId);
           if (!usuarioLogado){
                return res.status(400).json({erro : "Usuario logado nao encontrado"});

           }
           //id do usuario a ser seguido - query
           const usuarioASerSeguido = await usuarioModel.findById(id);
           if(!usuarioASerSeguido){
            return res.status(400).json({erro : "Usuario a ser seguido nao encontrado"});
           }
           //buscar se eu logado sigo ou nao sigo esse usuario
           const jaSigoEsseUsusario = await seguidorModel
           .find({usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id}); 
           if(jaSigoEsseUsusario && jaSigoEsseUsusario.length > 0){
            //sianl que eu ja sigo esse usuario
            jaSigoEsseUsusario.forEach(async (e : any) => await seguidorModel.findByIdAndDelete({_id : e._id}));
            usuarioLogado.seguindo--;
            await usuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
            usuarioASerSeguido.seguidores--;
            await usuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

            return res.status(200).json({erro : "Deixou de seguir o usuario com sucesso"});

           }else{
            //sianl que eu nao sigo esse usuario
            const seguidor = {
                usuarioId : usuarioLogado._id,
                usuarioSeguidoId : usuarioASerSeguido._id
            };
            await seguidorModel.create(seguidor);
            usuarioLogado.seguindo++
            await seguidorModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado)

            usuarioASerSeguido.seguidores++
            await usuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido)

            return res.status(200).json({erro : "Usuario seguido com sucesso"});
           }
        }
        return res.status(405).json({erro : "Metodo informado nao existe"});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : "Nao foi possivel seguir/dessegir ususario informado"});
    }
}
export default politicaCORS (validarTokenJwt(conectarMongoDB(endpointSeguir)));