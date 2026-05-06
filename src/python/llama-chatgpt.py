import openai

openai.api_key = "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"


response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
            {"role": "system", "content": "You are a chatbot"},
            {"role": "user", "content": "Why should Digital Media practioners learn GIMP?"},
        ]
)

result = ''
for choice in response.choices:
    result += choice.message.content

print(result)