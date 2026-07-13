import openai

openai.api_key = "REPLACE_WITH_REAL_KEY_VIA_ENV"


response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
            {"role": "system", "content": "You are a chatbot"},
            {"role": "user", "content": "How do I migrate an existing Java service into Kubernetes?"},
        ]
)

result = ''
for choice in response.choices:
    result += choice.message.content

print(result)