from fastapi import FastAPI
from transformers import pipeline

# Create a FastAPI instance
app = FastAPI()

# Load sentiment analysis pipeline
sent_pipeline = pipeline("sentiment-analysis")

# Define the route to accept POST requests at /sentiment
@app.post("/sentiment")
async def analyze_sentiment(text: str):
    # Perform sentiment analysis
    output = sent_pipeline(text)
    # Extract sentiment label from the output
    sentiment_label = output[0]['label']
    return {"emotion": sentiment_label}

# Run the FastAPI app with uvicorn server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8086)
    # uvicorn app:app --port 8086 --reload --host 0.0.0.0 --proxy-headers

