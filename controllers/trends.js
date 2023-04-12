const express = require("express");
const app = express();
const {TwitterApi} = require("twitter-api-v2");
require("dotenv/config");

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_KEY_SECRET;
const accessTokenkey = process.env.ACCESS_TOKEN;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

// OAuth 1.0a (User context)
const userClient = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: accessTokenkey,
    accessSecret: accessTokenSecret,
});

const client = new TwitterApi(`${process.env.BEARER_KEY}`);

const v1Client = client.v1;
const trendsV1 = async (req, res) => {
    const id = req.body.woeid;
    try {
        const trendsOfNy = await v1Client.trendsByPlace(Number(id));
        let trendColec = [];
        for (const {trends, created_at} of trendsOfNy) {
            for (const trend of trends) {
                console.log(trend)
                if(trend.tweet_volume) {
                    trendColec.push({
                        trend: trend.name, created_at: created_at, tweet_url: trend.url, volumn: trend.tweet_volume
                    });
                }
            }
            res.status(200).json(trendColec);
        }
    } catch (error) {
        console.error(error.message);
    }
};

const nearMeT = async (req, res, next) => {
    try {
        let {lat, long} = req.body;
        (lat = Number(lat)), (long = Number(long));
        try {
            const trends = await client.v1.trendsClosest(lat, long);
            const woeid = trends[0]["woeid"];

            const trendsColec = await v1Client.trendsByPlace(Number(woeid));
            let trendColec = [];
            for (const {trends, created_at} of trendsColec) {
                for (const trend of trends) {
                    if (trend.tweet_volume) {
                        trendColec.push({
                            trend: trend.name,
                            created_at: created_at,
                            volume: trend.tweet_volume,
                            tweet_url: trend.url
                        });
                    }
                }
                res.status(200).json(trendColec);
            }
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

const trendTweets = async (req, res) => {
    let i = 0;
    let tweetColec = [];
    const {search} = req.body;
    const recentTweets = await client.v2.tweetCountRecent(search);

    const searchTweets = await client.v2.search(search, {
        "media.fields": "url",
    });

    // Consume every possible tweet of jsTweets (until rate limit is hit)
    for await (const tweet of searchTweets) {
        i++;
        if (i < 50) {
            tweetColec.push({tweetID: tweet.id, tweet: tweet.text});
        } else if (i >= 50) {
            console.log(i);
            break;
        }
    }
    console.log(i);
    tweetColec.push([`recent tweet count : ${recentTweets.data[0].tweet_count}`]);
    res.json(tweetColec);
};

const trendsCountry = async (req, res) => {
    let availableTrends = [];
    const currentTrends = await client.v1.trendsAvailable();
    let len = Object.keys(currentTrends).length;
    for (const {name, country, woeid} of currentTrends) {
        availableTrends.push({name: name, country: country, woeid: woeid});
    }
    res.json(availableTrends);
};

module.exports = {trendsV1, nearMeT, trendTweets, trendsAvailable: trendsCountry};