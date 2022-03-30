import express from 'express';
import topicController from './topicController';
import postController from './postController';

export default express.Router()
                .get('/topic', topicController.getTopicsByPagination)
                .post('/topic', topicController.createTopic)
                .get('/post', postController.getPostsByPagination)
                .post('/post', postController.createPost);
                