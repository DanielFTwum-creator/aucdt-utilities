import openai

openai.api_key = "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"

# Set up the model and prompt
model_engine = "text-davinci-003"
prompt = "History of AsanSka University College of Design and Technlogy"

# Generate a response
completion = openai.Completion.create(
    engine=model_engine,
    prompt=prompt,
    max_tokens=1024,
    n=1,
    stop=None,
    temperature=0.5,
)

response = completion.choices[0].text
print(response)