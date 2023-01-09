import cors from "cors";
import express from "express";

const app = express();
const PORT = 5000;
const users = [];
const tweets = [];
app.use(cors());
app.use(express.json());

app.post("/sign-up", (req, res) => {
    const user = req.body;

    if (!user.username || !user.avatar || typeof user.username !== 'string' || typeof user.avatar !== 'string') {
        res.status(400).send("Todos os campos são obrigatórios!");
    }
    users.push(user);
    res.status(201).send("OK");
})

app.post("/tweets", (req, res) => {
    const username = req.headers.user;
    const text = req.body.tweet;
    const findUser = users.find((user) => user.username === username);

    if (!username || !text || typeof text !== 'string') {
        res.status(400).send("Todos os campos são obrigatórios!");
    }
    const tweet = { username, tweet: text };
    if (!findUser) {
        res.status(401).send("UNAUTHORIZED")
    }
    tweets.push(tweet)
    res.status(201).send("CREATED")
})

app.get("/tweets", (req, res) => {
    let targetTweets = [];
    let userTweets =[];
    const { page } = req.query;
    const username = req.headers.user;
    const reversedTweets = [...tweets].reverse();

    if (req.query.page) {
        if (page < 1) {
            res.status(400).send("Informe uma página válida!");
            return;
        }
        const minSlice = (page - 1) * 10;
        const maxSlice = page * 10;
        targetTweets = reversedTweets.slice(minSlice, maxSlice);
    } else {
        targetTweets = reversedTweets.slice(0, 10);
    }

    targetTweets.map((tweet) => {
        const user = users.find((user) => user.username === username);
        userTweets.push({ ...tweet, avatar: user.avatar});
    })

    res.send(userTweets);
})

app.get("/tweets/:username", (req, res) => {
    const username = req.params.username;
    const reversedTweets = [...tweets].reverse();
    const usernameTweets = reversedTweets.filter((tweet) => tweet.username === username);
    res.send(usernameTweets);
})


app.listen(PORT);