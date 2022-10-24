import type { NextApiRequest, NextApiResponse } from "next";

export default(
    req : NextApiRequest,
    res : NextApiResponse
) => {
    if(req.method === "POST"){
        const {login, senha} = req.body

        if (login === "admin@admin.com" && 
            senha === "admin@123"){
                res.status(200).json({msg : "Ususario autenticado com sucesso"});
    }
    return res.status(405).json({erro : "Ususario ou senha não encontrado"});
    
}
    return res.status(405).json({erro : "Metodo informado não é valido"});
}