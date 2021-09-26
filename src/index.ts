import express, { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/:route', (request: Request, response: Response) => {
    const route: string = request.params.route as string;
    if (route !== `favicon.ico`) {
        const url: string = process.env.API_URL as string;
        axios.get(url, { params: { route: route } })
            .then(res => {
                if (res.data.status === `NOT FOUND`) {
                    response.json("url not found");
                } else {
                    response.redirect(res.data.url);
                }
            })
            .catch(err => {
                response.json("error!");
            })
    }
});

app.post('/', (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    const { route } = body;
    const url: string = process.env.API_URL as string;
    axios.get(url, { params: { route: route } })
        .then(res => {
            if (res.data.status === `NOT FOUND`) {
                return next(); 
            } else {
                response.json({
                    status: "FAILED",
                    msg: "Route already exist"
                });
            }
        })
        .catch(err => {
            response.json("error!")
        })
});

app.post('/', (request: Request, response: Response) => {
    const body = request.body;
    const url: string = process.env.API_URL as string;
    axios.post(url, body)
        .then(res => {
            if (res.data.status === `SUCCESS`) {
                response.json({
                    status: "SUCCESS",
                    msg: "Success adding route"
                })
            } else {
                response.json({
                    status: "FAILED",
                    msg: "Error while adding route"
                });
            }
        })
        .catch(err => {
            response.json("error!")
        })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})
