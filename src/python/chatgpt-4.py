import openai
import os

# set up your OpenAI API key
openai.api_key = os.environ["REPLACE_WITH_REAL_KEY_VIA_ENV"]

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
