from fastapi import FastAPI
from dotenv import load_dotenv
import os 
import google.generativeai as genai

app = FastAPI()

# Load API key from environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

@app.post("/generate_roadmap")
async def generate_roadmap(text: str, hour: int, deadline: int, accuracy: float):
    deadline_1 = hour * deadline
    accuracy = int(accuracy)

    # Compose the question
    question = "Give roadmap to learn " + str(text) + " within " + str(deadline) + " weeks and can give " + str(
        deadline_1) + " hours to complete , for a student of " + str(accuracy) + "% accracy, in list format without any special characters and week or hour keyword"

    # Start the chat
    chat = model.start_chat(history=[])

    # Send the question to the model
    response = chat.send_message(question, stream=True)

    roadmap = []

    # Process the response to create a list
    string2 = ""
    for chunk in response:
        string2 += chunk.text

    # Split the response into individual elements for each week
    string2 = string2.replace("*", "")
    string2 = string2.replace("\n", "")
    string2 = string2.replace("Week", "<>Week")
    weeks = string2.split("<>")

    # Check if the first element contains the "roadmap" keyword
    if "roadmap" in weeks[0].lower() or "road map" in weeks[0].lower():
        # Remove the first two elements if the first element contains "roadmap"
        weeks = weeks[2:]
    else:
        # Otherwise, remove just the first element
        weeks = weeks[1:]

    for week in weeks:
        roadmap.append(week.strip())

    return {"roadmap": roadmap}


# uvicorn app:app --port 9000 --reload --host 0.0.0.0 --proxy-headers