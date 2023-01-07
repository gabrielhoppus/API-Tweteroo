import cors from "cors";
import express from "express";

const app = express();
const PORT = 5000;
const users = [];
const tweets = [];
let userTweets = [];
app.use(cors());
app.use(express.json());

app.post("/sign-up", (req, res) => {
    const user = req.body;

    if (!user.username || !user.avatar || typeof user.username !== 'string' || typeof user.avatar !== 'string') {
        res.status(400).send("Todos os campos são obrigatórios!")
    }
    users.push(user);
    res.status(201).send("OK")
})

app.post("/tweets", (req, res) => {
    const tweet = req.body;
    const findUser = users.find((user) => user.username === tweet.username);

    if (!tweet.username || !tweet.tweet || typeof tweet.tweet !== 'string') {
        res.status(400).send("Todos os campos são obrigatórios!")
    }

    !findUser ?
        res.status(401).send("UNAUTHORIZED") :
        tweets.push(tweet)
    res.status(201).send("CREATED")
})


function getTweets() {
    userTweets = []
    const targetTweets = tweets.slice(0).slice(-10)
    targetTweets.map((tweet) => {
        const user = users.find((user) => user.username === tweet.username);
        userTweets.unshift({ ...tweet, avatar: user.avatar });
    })
}

app.get("/tweets", (req, res) => {
    getTweets()
    res.send(userTweets);
})





app.listen(PORT);