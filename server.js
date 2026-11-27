const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors()); // بيسمح لموقعك على GitHub يتصل بالسيرفر
app.use(express.json());

// هون رح نحط المفتاح السري
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'الرسالة فاضية' });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "أنت مستشار عقاري سوري خبير. تجيب بلهجة سورية واضحة ومختصرة، وتركز على القوانين العقارية السورية." 
        },
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant",
    });

    res.json({ reply: chatCompletion.choices[0]?.message?.content || 'ما وصلني جواب' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ بالسيرفر' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ السيرفر شغال على المنفذ ${PORT}`);
});
