import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    console.log("🔍 OpenAI response:", data);  // <-- Add this for debugging

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.error("❌ Invalid response format from OpenAI:", data);
      return res.status(500).json({ reply: "Sorry, Chat with Jong is unavailable right now." });
    }

    res.json({ reply });
  } catch (err) {
    console.error("Error from OpenAI:", err);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
