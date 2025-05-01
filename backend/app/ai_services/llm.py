import httpx

class GroqAPI:
    def __init__(self, api_key: str, base_url: str = "https://api.groq.com/openai/v1/chat/completions"):
        self.api_key = api_key
        self.url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    async def get_response(self,  prompt: str, system_prompt: str = None, model: str = "llama3-70b-8192", temperature: float = 0.4):
        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        data = {
            "model": model,
            "messages": messages,
            "temperature": temperature
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.url, headers=self.headers, json=data)
            result = response.json()
            return result['choices'][0]['message']['content']