import cors from "cors";
import express from "express";

const app = express();
const PORT = 5000;
const users = [];
const tweets = [];
let userTweets = [];
app.use(cors());
app.use(express.json());

app.post("/tweets", (req, res) => {
    const tweet = req.body;
    if (!users.includes(tweet.username)) {
        res.send("UNAUTHORIZED")
    } else {
        tweets.push(tweet);
        res.send(tweet)
    }

})

app.post("/sign-up", (req, res) => {
    const user = req.body;
    users.push(user);
    res.send(user)
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