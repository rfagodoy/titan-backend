const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: `Você é o TITAN AI, um personal trainer virtual especialista em musculação e fitness. 
Você é direto, motivador e baseado em ciência. 
Responda SEMPRE em português brasileiro.
Seja conciso — máximo 3 parágrafos por resposta.
Use emojis ocasionalmente para tornar a conversa mais dinâmica.
Quando sugerir treinos, use formato de lista clara com séries x repetições.`,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({ text: data.content[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'TITAN Backend' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TITAN Backend rodando na porta ${PORT}`));