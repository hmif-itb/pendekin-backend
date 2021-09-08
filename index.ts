import express, { Request, Response } from 'express';
import axios from 'axios';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/:route', (request: Request, response: Response) => {
    const route: string = request.params.route as string;
    console.log(route)
    if (route !== `favicon.ico`) {
        const url: string = process.env.API_URL as string;
        console.log(url)
        axios.get(url, { params: { route: route } })
            .then(res => {
                if (res.data.status === `NOT FOUND`) {
                    response.json("url not found hehe");
                } else {
                    response.redirect(res.data.url);
                }
            })
            .catch(err => {
                console.log(err);
                response.json("error!");
            })
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})