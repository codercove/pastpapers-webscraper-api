import { Router } from "express";
// import Pastpapers from "../controllers/controller.js";
import axios from 'axios'
import { load } from 'cheerio';

const router = Router()

router.get('/:grade/:subject',async(req,response)=>{
    let grade = req.params.grade.toString()
    let subject = req.params.subject.toString()
    subject = subject.toLowerCase()
 
    if(grade.length>2){
        response
         .status(404)
         .send({
            status:404,
            error:true,
            message:'Invalid Grade - Requested data not found.'
         })
    }

    if(grade.length<2){
        grade = "0"+grade
    }

    try {
        const res = await axios.get(`https://pastpapers.wiki/grade-${grade}-${subject}/`)
        const html = await res.data
        const $ = load(html)
        const arr: any = []
        let id = 0
        $("a").each(async function () {
          let splited = $(this).attr('href').split('-')
          let link = $(this).attr('href')
          //filter paper view links
          if (!(splited.includes('paper'))) return;
    
          const resp = await axios.get(link)
          const fileName = $(this).text()
          const elms = await resp.data
          const $$ = load(elms)
    
          $$('.wpfd_downloadlink').each(function(){
            let downloadlink = $$(this).attr('href')
            arr.push({
              fileId:id,
              fileName: fileName,
              fileUrl: downloadlink
            })
            id++
          })
        })
        setTimeout(() => {
          if(arr!==[] && !arr.length<1){
            let result = {
              status:201,
              error:false,
              message:'Data fetched successfully.',
              name: `Grade-${grade}-${subject}`
              items:[...arr]
            }
            response.send(result)
          }else{
            let result = {
              status:404,
              error:true,
              message:'Requested data not found.',
            }
            response.send(result)
          }
          
        
        }, 5600)
      }
      catch (error: any) {
        console.log(error)
      }
    

})
export default router