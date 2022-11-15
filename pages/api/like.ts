import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { politicaCORS } from "../../middlewares/politicaCORS";
import { validarTokenJwt } from "../../middlewares/validarTokenJWT";
import { publicacaoModel } from "../../models/publicacaoModel";
import { usuarioModel } from "../../models/usuarioModel";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";

const likeEndpoint
 = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>)=> {

try{

    if(req.method === "PUT"){

        const {id} = req?.query;
        const publicacao = await publicacaoModel.findById(id);
        if(!publicacao) {
            return res.status(400).json({erro :"Publicação nao encontrada"});
        }
        const {userId} = req?.query;
        const usuario = await usuarioModel.findById(userId);
        if(!usuario) { 
            return res.status(400).json({erro :"Usuario não encontrado"});
        }
       
        const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());

        if(indexDoUsuarioNoLike != -1){
            publicacao.likes.splice(indexDoUsuarioNoLike, 1);
            await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao); 
            return res.status(200).json({msg : "Pblicacao descurtida com sucesso"});
        }else{
            publicacao.likes.push(usuario._id);  
            await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao); 
            return res.status(200).json({msg : "Pblicacao curtida com sucesso"});
        }
    }
    return res.status(405).json({erro : "Metodo informado nao e valido"});

}catch(e){
    console.log(e);
}
return res.status(500).json({erro : "Ocorreu err ao curtir/descutir publicacao"});

}

export default politicaCORS (validarTokenJwt(conectarMongoDB(likeEndpoint)));