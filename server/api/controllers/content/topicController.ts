import { Request, Response } from "express";
import * as commonUtils from '../../../utils/common';
import collections from '../../../common/collection-map';

class TopicController {
    async getTopicsByPagination(req: Request, res: Response) {
        try{
            const {offset, limit} = req.query;
            const db = req.app.get('db');
            const _offset = offset && typeof(offset) === 'string' ? parseInt(offset): 0;
            const _limit = limit && typeof(limit) === 'string' ? parseInt(limit): 50;
            const skip = _offset * _limit;
            db.collection(collections.TOPICS)
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

    async createTopic(req: Request, res: Response) {
        try{
            const db = req.app.get('db'),
                  topic = req.body;
            const topicId = commonUtils.methods.generateRandomIdString(10);
            const author = await db.collection(collections.USERS).findOne({userId: (req as any).auth.user.id});
            db.collection(collections.TOPICS)
                .insertOne({
                    topicId,
                    ...topic,
                    relatedPostIds: [],
                    createdOn: Date.now(),
                    createdBy: author
                }, (err: Error, result: any) => {
                    if(err) {
                        throw err;
                    } else {
                        return res.status(200).json({data: result});
                    }
                });
        } catch(err) {
            return res.status(500).json({message: 'System error occurred!', err});
        }
    } 
}

export default new TopicController();