import type { NextApiRequest, NextApiResponse} from "next";
import  type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import  type {cadastroRequisicao} from "../../types/cadastroRequisicao";
import {usuarioModel} from "../../models/usuarioModel";
import {conectarMongoDB} from "../../middlewares/conectarMongoDB";
import md5 from "md5";
import {upload, uploadImagemCosmic} from "../../services/uploadImagemCosmic";
import nc from "next-connect";
import {politicaCORS} from "../../middlewares/politicaCORS";

const handler = nc()
    .use(upload.single("file"))
    .post(async (req : NextApiRequest, 
        res : NextApiResponse<respostaPadraoMsg>) => {         
        const usuario = req.body as cadastroRequisicao;

        if (!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({ erro: "Nome invalido" });
        }

        if (!usuario.email || usuario.email.length < 5
            || !usuario.email.includes("@")
            || !usuario.email.includes(".")) {
                return res.status(400).json({ erro: "Email invalido" });   
            }

            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ erro: 'Senha invalida'});
            }
                //validacao se ja existe usuario com o mesmo email
            const usuarioComMesmoEmail = await usuarioModel.find({email : usuario.email});
                if(usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0){
                    return res.status(400).json({ erro: 'ja existe uma conta com o email informado'});
                }
                //enviar a imagem do multer para o cosmic
                const image = await uploadImagemCosmic(req);
                //salvarno banco de dados
            const usuarioASerSalvo = {
                nome : usuario.nome,
                email : usuario.email,
                senha : md5(usuario.senha),
                avatar : image?.media?.url
            };


 
            await usuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({msg : 'Usuario criado com sucesso'});   
    });
    
    export const config = {
        api:{
            bodyParser: false
        }
    }

export default politicaCORS(conectarMongoDB(handler)); 