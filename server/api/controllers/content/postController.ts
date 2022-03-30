import { Request, Response } from "express";
import * as commonUtils from '../../../utils/common';
import collections from '../../../common/collection-map';
import * as contentProcessor from '../../../utils/content-processor';

class PostController {
    async getPostsByPagination(req: Request, res: Response) {
        try{
            const {offset, limit} = req.query;
            const db = req.app.get('db');
            const _offset = offset && typeof(offset) === 'string' ? parseInt(offset): 0;
            const _limit = limit && typeof(limit) === 'string' ? parseInt(limit): 50;
            const skip = _offset * _limit;
            db.collection(collections.POST)
                .find({}, {
                    limit: _limit,
                    skip
                }).toArray((err: Error, docs: any) => {
                    if(err){
                        throw err;
                    }
                    return res.status(200).json({data: docs});
                });
        } catch(err) {
            return res.status(500).json({message: 'System error occurred!', err});
        }
    }

    async createPost(req: Request, res: Response) {
        try{
            const db = req.app.get('db'),
                  postBody = req.body,
                  postId = commonUtils.methods.generateRandomIdString(10);
            const author = await db.collection(collections.USERS).findOne({userId: (req as any).auth.user.id});
            const topic = await db.collection(collections.TOPICS).findOne({
                topicId: postBody.topicId
            });
            if(!topic) {
                throw new Error('Selected topic doesnt exists');
            }
            delete topic.relatedPostIds;
            const _updatedContent = await contentProcessor.processContent(postBody.content, postBody.postName, res);
            
            const updatedRelatedTopic = db.collection(collections.TOPICS)
                .findOneAndUpdate({
                        topicId: topic.topicId
                    }, 
                    {
                        $set: {
                            relatedPostIds: topic.relatedPostIds ? [...topic.relatedPostIds, postId]: [postId],
                            updatedOn: Date.now()
                        }
                    });
            const createPost = db.collection(collections.POST)
                .insertOne({
                    postName: postBody.postName,
                    content: _updatedContent,
                    postId,
                    topic,                    
                    createdOn: Date.now(),
                    createdBy: author
                });
            Promise.all([updatedRelatedTopic, createPost]).then(result => {
                res.status(200).json({data: 'Post created successfully!'})
            });
        } catch(err) {
            return res.status(500).json({message: 'System error occurred!', err});
        }
    } 
}

export default new PostController();