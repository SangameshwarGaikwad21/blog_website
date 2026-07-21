import Redis from "ioredis"
import app from "./app.js"
import connectionToDB from "./config/db.js"
const PORT=process.env.PORT || 1000

export const redis = new Redis(process.env.REDIS_URL)

redis.on("connect", () => {
    console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
    console.error(err);
});

app.listen(PORT,async ()=>{
    console.log(`http://LocalHost:${PORT}`)
    await connectionToDB()
})