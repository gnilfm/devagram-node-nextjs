import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'

const endpointLogin = (
    req : NextApiRequest,
    res : NextApiResponse<respostaPadraoMsg>
) => {
    if(req.method === "POST"){
        const {login, senha} = req.body

        if (login === "admin@admin.com" && 
            senha === "admin@123"){
               return res.status(200).json({msg : "Ususario autenticado com sucesso"});
    }
    return res.status(405).json({erro : "Ususario ou senha não encontrado"});
    
}
    return res.status(405).json({erro : "Metodo informado não é valido"});
}
export default conectarMongoDB(endpointLogin);