import express from 'express';
import controller from './controller';
export default express.Router()
                .post('/signup', controller.signUp)
                .post('/login', controller.login);