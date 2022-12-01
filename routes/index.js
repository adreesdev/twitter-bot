const axios = require("axios");
const { TwitterApi } = require("twitter-api-v2");
const fs = require("fs");
var express = require("express");
var router = express.Router();

const client = new TwitterApi({
	appKey: "9gztmNRHdE98GXHNj2K5JSIRY",
	appSecret: "uvsSA2zibcHdOiczDBvYt2uXO0UVi0HMkYYJ1rxQZetTpKuFb4",
	accessToken: "808877465967923201-dMmfL08F7xZAZsqyKkEaUYsQzKi3086",
	accessSecret: "oU4hByO2ckz489cAn13OPkIVdkd6pAqxKUTIbrHtTXcID",
});

async function downloadImage(url, filepath) {
	const response = await axios({
		url,
		method: "GET",
		responseType: "stream",
	});
	return new Promise((resolve, reject) => {
		response.data
			.pipe(fs.createWriteStream(filepath))
			.on("error", reject)
			.once("close", () => resolve(filepath));
	});
}

const tweetNasaDailyImage = async () => {
	const nasaApi = await axios.get(
		"https://api.nasa.gov/planetary/apod?api_key=5FwW1dxiUkHhphUpKFM8nGNhXYdWxAOKys1ObTEN"
	);
	await downloadImage(nasaApi?.data?.url, "./public/images/image.jpg");

	const mediaIds = await Promise.all([
		client.v1.uploadMedia("./public/images/image.jpg"),
	]);

	await client.v1.tweet(nasaApi.data.title, { media_ids: mediaIds });
};

setInterval(tweetNasaDailyImage, 86400000);
// tweetNasaDailyImage();

module.exports = router;
