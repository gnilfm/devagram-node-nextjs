import type {NextApiRequest, NextApiResponse} from "next"
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { politicaCORS } from "../../middlewares/politicaCORS";
import { validarTokenJwt } from "../../middlewares/validarTokenJWT";
import { usuarioModel } from "../../models/usuarioModel";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg"

const pesquisaEndpoint 
        = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any[]>)=> {

            try{
                if(req.method === "GET"){  
                    if(req?.query?.id){
                        const usuarioEncontrado = await usuarioModel.findById(req?.query?.id);
                        if(!usuarioEncontrado) {
                            return res.status(400).json({ erro :"Usuario nao encontrado"});                                    
                        }
                        usuarioEncontrado.senha = null;
                         return res.status(200).json(usuarioEncontrado);
        
                    }else{
                        const {filtro} = req.query;
                        if(!filtro || filtro.length < 2){
                            return res.status(400).json({erro: "Favor informar pelo menos 2 caracteres para busca"}); 
                    }
            const usuariosEncontrados = await usuarioModel.find({
                $or :[{nome : {$regex : filtro, $options: "i"}},
                    //{email : {$regex : filtro, $options: "i"}}
                ]
            });
            return res.status(200).json(usuariosEncontrados);
        }                    
     }
     return res.status(405).json({erro: "Metodo informado nao e valido"});              
           
            }catch(e){
                console.log(e);
                return res.status(500).json({erro: "Nao foi possivel buscar usuario:" + e});
            }
}

export default politicaCORS (validarTokenJwt(conectarMongoDB(pesquisaEndpoint))); 