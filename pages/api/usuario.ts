import type { NextApiRequest, NextApiResponse } from "next";
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import {validarTokenJwt} from "../../middlewares/validarTokenJWT";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { usuarioModel } from "../../models/usuarioModel";
import nc from "next-connect";
import {upload, uploadImagemCosmic} from "../../services/uploadImagemCosmic";

const handler = nc()
    .use(upload.single("file"))
    .put(async (req : any, res : NextApiResponse<respostaPadraoMsg>) =>{
        try{
            //se eu quero alterar ousuario
            //preciso primeiro pegar o usuario no BD
            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);

            //se o usuario retornou algo e pq ele existe
            //se nao retornou e pq ele nao existe
            if(!usuario){
                return res.status(400).json({erro : "Usuario nao encontrado"}); 
            }

            const {nome} = req.body;
            if(nome && nome.length > 2){
                usuario.nome = nome;
          }
          const {file} = req;
          if(file && file.originalname){
            const image = await uploadImagemCosmic(req);
            if(image && image.media && image.media.url){
                usuario.avatar = image.media.url;
            }
            
          }
          //alterar os dados no DB
          await usuarioModel.
            findByIdAndUpdate({_id : usuario._id}, usuario);
          return res.status(200).json({erro : "Usuario alterado com sucesso"})

        }catch(e){
            console.log(e);
        }
        return res.status(400).json({erro : "Nao foi possivel atualizar usuario"});
    })
    .get(async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) => {
        try{
            const {userId} = req?.query;
             const usuario = await usuarioModel.findById(userId);
             usuario.senha = null;
             return res.status(200).json(usuario);   
        }catch(e){
           console.log(e);
        }
    
        return res.status(400).json({erro:"Não foi possível obter dados do ususario"});
    
    });
    export const config ={
        api :{
            bodyParser : false
        }
    }

    export default validarTokenJwt(conectarMongoDB(handler));






