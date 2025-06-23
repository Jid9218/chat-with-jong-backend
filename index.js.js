import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/send', async (req, res) => {
  const userMsg = req.body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are Chat with Jong, a warm and thoughtful personal mirror." },
        { role: "user", content: userMsg }
      ]
    })
  });

  const result = await response.json();
  res.json({ reply: result.choices[0].message.content });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
