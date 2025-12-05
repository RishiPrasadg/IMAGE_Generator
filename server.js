import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    const contentType = response.headers.get("content-type");

    if (contentType.includes("application/json")) {
      const err = await response.json();
      return res.status(500).json({ error: err.error });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    res.json({ image: base64 });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
