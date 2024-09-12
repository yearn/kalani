import OpenAI from 'openai'

const MODELS = {
  gpt4o: 'gpt-4o-2024-05-13',
  gpt4oMini: 'gpt-4o-mini',
  gpt4: 'gpt-4',
  gpt35Turbo: 'gpt-3.5-turbo'
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `
your speciality is generating titles given the names of a list of defi investment strategies.
your input is always a list of defi investment strategy names.
your output is always a title that summarizes the list of investment strategy names.
your titles don't contain words like "strategy" or "vault".
your titles incorporate the common words in the names of the investment strategies.
your titles always use as few words as possible.
`

async function complete(messages: OpenAI.ChatCompletionMessageParam[]) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ],
    model: MODELS.gpt4o,
    temperature: 0
  })

  return completion.choices[0].message.content
}

export async function generateTitle(names: string[]) {
  if (names.length === 0) return undefined
  if (names.length === 1) return names[0]
  return await complete([
    { role: 'user', content: names.join('\n') }
  ])
}