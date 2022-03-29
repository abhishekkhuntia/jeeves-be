import express from 'express';
import controller from './topicController';
export default express.Router()
                .get('/topic', controller.getTopicsByPagination)
                .post('/topic', controller.createTopic);
                