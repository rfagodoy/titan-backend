const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ANTHROPIC_API_KEY = 'sk-ant-api03-6_K_EH76f85Ejsu2Y6A-OV4C2TCBoK1K2kvm7wR6H-ZZU74nqiJWIOn1_SYZWlX_03AXpm9aZjU-_KOxyhLOTw-T9KA0AA';

const systemPrompt = `Você é o TITAN AI, um personal trainer virtual especialista em musculação e fitness. 
Você é direto, motivador e baseado em ciência. 
Responda SEMPRE em português brasileiro.
Seja conciso — máximo 3 parágrafos por resposta.
Use emojis ocasionalmente para tornar a conversa mais dinâmica.
Quando sugerir treinos, use formato de lista clara com séries x repetições.`;

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
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