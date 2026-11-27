const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); 

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message, image } = req.body;
    if (!message && !image) return res.status(400).json({ error: 'الرسالة فاضية' });

    let userContent = message || "شو مكتوب بهالصورة؟ حلللي ياها.";
    
    if (image) {
      userContent = [
        { type: "text", text: message || "اقرأ هذه الصورة وحللها." },
        { type: "image_url", image_url: { url: image } } 
      ];
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "أنت مستشار عقاري سوري خبير. تجيب بلهجة سورية واضحة ومختصرة، وتركز على القوانين العقارية السورية. **مهم جداً: لا تذكر أرقام القوانين أو سنوات إصدارها نهائياً، فقط أعطِ الجواب القانوني المباشر.** إذا وصلك صورة، اقرأ النص اللي فيها وحلله." 
        },
        { role: "user", content: userContent }
      ],
      model: image ? "llama-3.2-11b-vision-preview" : "openai/gpt-oss-120b",
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
