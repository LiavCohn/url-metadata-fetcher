const express = require("express");
const urlMetadata = require("url-metadata");
const { URL } = require("url");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // limit each IP to 5 requests per second
});

app.use(limiter);

/**
 *
 * @param {string} url
 * @returns
 */
async function fetchMetadata(url) {
  console.log("got url! ", url);
  if (!url.startsWith("http")) {
    return Promise.reject({ url, message: "Invalid URL." });
  }
  try {
    const metadata = await urlMetadata(url);
    const { title, description, "og:image": ogImage } = metadata;
    let image = metadata.image || ogImage;

    //some images have relative path, e.x Google
    if (image && !image.startsWith("http")) {
      const baseUrl = new URL(url);
      image = new URL(image, baseUrl.origin).href;
    }

    return {
      url,
      title: title || "No title available",
      description: description || "No description available",
      image: image || "No image available",
    };
  } catch (error) {
    return Promise.reject({
      url,
      message: `Failed to fetch metadata: ${error.message}`,
    });
  }
}

app.post("/fetch-metadata", async (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) {
    return res
      .status(400)
      .json({ error: "Invalid input. Expecting an array of URLs." });
  }

  // Use Promise.allSettled to handle all results
  const results = await Promise.allSettled(urls?.map(fetchMetadata));

  //format the results
  const metadataResults = results.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : { url: result.reason.url, error: result.reason.message }
  );

  return res.status(200).json(metadataResults);
});

module.exports = app;
