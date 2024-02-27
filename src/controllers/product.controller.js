import { productService } from "../services/services.js";



export const getAllProducts = async (req,res)=>{
    try{
        const { limit,page,query,sort } = req.query
        const productos = await productService.getAllProducts(limit, page, query, sort);
        
   
   
            res.json(productos)
        
    }
    catch(err){
        res.status(500).json({error:err})
    }
}

export const getProduct = async (req,res)=>{
    try{
        
        const{ pid } = req.params
        const producto = productService.getProductById(pid)
        res.json(producto)

    }
    catch(err){
        res.status(500).json({error:err})
    }

    

}

export const createProduct = async (req,res)=>{
    try{
        if(req.session.user.rol === 'admin'){
            
            let producto = req.body
            const newProduct = await productService.createProduct(producto)
            res.status(201).json({message: "Producto agregado correctamente"})
        }
        else{
            res.status(401).json({message:"Acceso denegado"})
        }
    }
    catch(err){
        res.status(500).json({error:err})
    }

}

export const updateProduct = async (req,res)=>{
    try{
        if(req.session.user.rol === 'admin'){
            let productoModificado = req.body
            let modified = await productService.updateProduct(req.params.pid,productoModificado)
            res.status(201).json(modified)
        }
        else{
            res.status(401).json({message:"Acceso denegado"})
        }
    }
    catch(err){
        res.status(500).json({error:err})
    }    
}

export const deleteProduct = async (req,res)=>{
    try{
        if(req.session.user.rol === 'admin'){
            let deleted =await productService.deleteProduct(req.params.pid)
            res.status(201).json(deleted.message)
        }
        else{
            res.status(401).json({message:"Acceso denegado"})
        }
    }
    catch(err){ res.status(500).json({error:err})}
    
}