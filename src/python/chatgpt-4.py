import openai
import os

# set up your OpenAI API key
openai.api_key = os.environ["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"]

# prompt for generating text
prompt = "Hello, ChatGPT-4!"

# generate a response from ChatGPT-4
response = openai.Completion.create(
    engine="davinci",
    prompt=prompt,
    max_tokens=50
)

# print the generated text
print(response.choices[0].text)
