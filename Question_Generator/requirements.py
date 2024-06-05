from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv
import os 
import google.generativeai as genai
import json

app = FastAPI()

# Load API key from environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-pro")



@app.post("/generate_questions")
async def generate_questions(subject: str, topic: str, accuracy: float):
    subject = str(subject)
    topic = str(topic)
    accuracy = accuracy
    if accuracy < 50:
        difficulty = "easy"
    else:
        difficulty = "moderate"

    question = f"give 5 MCQ questions and their options with correct option on {topic} of {subject} of {difficulty} difficulty level. in json format. with correct_option in every question."

    chat = model.start_chat(history=[])
    response = chat.send_message(question, stream=True)

    string2 = ""
    for chunk in response:
        string2 += chunk.text

    # Remove unnecessary text
    string2 = string2.replace("json", "", 1)
    string2 = string2.replace("*", "")
    string2 = string2.replace("```", "")

    # Now we can parse the JSON
    try:
        questions_obj = json.loads(string2)
        return questions_obj
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail="Error decoding JSON")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)

# uvicorn app:app --port 8040 --reload --host 0.0.0.0 --proxy-headers