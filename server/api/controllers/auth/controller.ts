import { Request, Response } from "express";
import * as commonUtils from '../../../utils/common';
import passwordUtil from '../../../utils/password-util';
import auth from '../../../common/auth-helper';
import * as emailUtil from '../../../utils/emails';
import collections from '../../../common/collection-map';

class AuthController {
    async login(req: Request, res: Response) {
        const db = req.app.get('db');
        try {
            if(db) {
                const payload = req.body;
                const user = await db.collection(collections.USERS).findOne({
                    emailId: payload.emailId
                });
                if(user) {
                    const authUser = await db.collection(collections.USERS_AUTH).findOne({
                        uid: user.userId
                    });
                    
                    if(!authUser) {
                        throw new Error('User authentication missing');
                    }

                    if(await passwordUtil.isMatchingPassword(payload.password, authUser.password)) {
                        const expiration = new Date();
                        expiration.setDate(expiration.getDate() + 30); // 30 days expiration
                        return res.status(200)
                                .json({
                                    user: {
                                        ...user,
                                        userId: authUser.uid
                                    },
                                    token: auth.issueToken(user.userName, user.role, user.userId, expiration.toUTCString())
                                });
                    } else {
                        return res.status(403).json({message: 'Invalid combination of emailId and password'});
                    }
                } else {
                    throw new Error('User not found');
                }
            } else{
                throw new Error('Error creating the user');
            }
        } catch(err) {
            return res.status(500).json({message: 'System error occurred!', err});
        }
    }

    async signUp(req: Request, res: Response) {
        const db = req.app.get('db');
        try {
            if(db) {
                const payload = req.body;
                const user = await db.collection(collections.USERS).findOne({$or: [{
                    phoneNo: payload.phoneNo
                }, {
                    emailId: payload.emailId
                }]});
    
                if(user){
                    return res.status(500).json({message: 'User already exists'});
                }
                const encryptedPassword = await passwordUtil.encryptPassword(payload.password)
                let uid = commonUtils.methods.generateRandomIdString(15);
                await db.collection(collections.USERS_AUTH).insertOne({
                    uid,
                    password: encryptedPassword 
                 });
                 const inserted = await db.collection(collections.USERS).insertOne({
                    refId: commonUtils.methods.generateRandomIdString(15),
                    userId: uid,
                    phoneNo: payload.phoneNo,
                    countryCode: payload.countryCode,
                    emailId: payload.emailId,
                    userName: payload.userName, 
                    role: 'ADMIN'
                });

                if(inserted) {
                    const expiration = new Date();
                    expiration.setDate(expiration.getDate() + 30); // 30 days expiration
                    emailUtil.sendInvitationMail(payload.userName, payload.emailId)
                    delete payload.password;
                    return res.status(200)
                            .json({
                                user: {
                                    ...payload,
                                    userId: uid
                                },
                                token: auth.issueToken(payload.userName, 'ADMIN', uid, expiration.toUTCString())
                            })
                } else{
                    throw new Error('Error creating the user');
                }
            } 
            throw new Error('Error accessing DB');
        } catch(err) {
            return res.status(500).json({message: 'System error occurred!', err});
        }
        
    }
}

export default new AuthController();