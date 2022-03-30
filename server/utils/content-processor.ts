import * as cheerio from 'cheerio';
import { Response } from 'express';
export async function processContent(content: string, postName: string, res: Response) {
    return new Promise(async(resolve) => {
        const $ = cheerio.load(content);
        const images = $('img');
        for(var i=0; i < images.length; i++) {
            const uploadedImages: any = await uploadImageToBucket((images[i] as any).attr('src'), postName+ i, '');
            (images[i] as any).attr('src', uploadedImages.path);
        }
        resolve($('body').html());
    })
}

//@ts-ignore
function uploadImageToBucket(imageContent: string, name: string, alt:string) {
    // we would upload pictures to s3 with base64 content 
    
    return new Promise((resolve) => {
        resolve({
            path: '/randompath/'+ name
        });
    })
}