const express = require('express');
const userController = require('../controllers/user');

const userRouter = express.Router();

userRouter
    .post('/', (req, resp) => {
        userController.create(req.body, (err, res) => {
            let respObj;
            if (err) {
                respObj = {
                    status: "error",
                    msg: err.message
                };
                return resp.status(400).json(respObj);
            }
            respObj = {
                status: "success",
                msg: res
            };
            resp.status(201).json(respObj);
        });
    })

    .get('/:username', (req, resp) => {
        const username = req.params.username;

        userController.get(username, (err, user) => {
            if (err) {
                return resp.status(404).json({
                    status: "error",
                    msg: err.message
                });
            }
            resp.status(200).json({
                status: "success",
                user: user
            });
        });
    });

module.exports = userRouter;