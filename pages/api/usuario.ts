import type { NextApiRequest, NextApiResponse } from "next";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import {validarTokenJwt} from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { usuarioModel } from "../../models/usuarioModel";

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) => {
    try{
        const {userId} = req?.query;
         const usuario = await usuarioModel.findById(userId);
         usuario.senha = null;
         return res.status(200).json(usuario);   
    }catch(e){
       console.log(e);
    }

    return res.status(400).json({erro:"Não foi possível obter dados do ususario"});

}
    export default validarTokenJwt(conectarMongoDB(usuarioEndpoint));






