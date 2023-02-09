var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
// import Pastpapers from "../controllers/controller.js";
import axios from 'axios';
import { load } from 'cheerio';
const router = Router();
router.get('/:grade/:subject', (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    let grade = req.params.grade.toString();
    let subject = req.params.subject.toString();
    subject = subject.toLowerCase();
    if (grade.length > 2) {
        response
            .status(404)
            .send({
            status: 404,
            error: true,
            message: 'Invalid Grade - Requested data not found.'
        });
    }
    if (grade.length < 2) {
        grade = "0" + grade;
    }
    try {
        const res = yield axios.get(`https://pastpapers.wiki/grade-${grade}-${subject}/`);
        const html = yield res.data;
        const $ = load(html);
        const arr = [];
        let id = 0;
        $("a").each(function () {
            return __awaiter(this, void 0, void 0, function* () {
                let splited = $(this).attr('href').split('-');
                let link = $(this).attr('href');
                //filter paper view links
                if (!(splited.includes('paper')))
                    return;
                const resp = yield axios.get(link);
                const fileName = $(this).text();
                const elms = yield resp.data;
                const $$ = load(elms);
                $$('.wpfd_downloadlink').each(function () {
                    let downloadlink = $$(this).attr('href');
                    arr.push({
                        fileId: id,
                        fileName: fileName,
                        fileUrl: downloadlink
                    });
                    id++;
                });
            });
        });
        setTimeout(() => {
            if (arr !== [] && !arr.length < 1) {
                let result = {
                    status: 201,
                    error: false,
                    message: 'Data fetched successfully.',
                    name: `Grade-${grade}-${subject}`,
                    items: [...arr]
                };
                response.send(result);
            }
            else {
                let result = {
                    status: 404,
                    error: true,
                    message: 'Requested data not found.',
                };
                response.send(result);
            }
        }, 5600);
    }
    catch (error) {
        console.log(error);
    }
}));
export default router;
//# sourceMappingURL=controller.js.map