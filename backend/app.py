from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import os
import requests
from dotenv import load_dotenv
import google.generativeai as genai

# Load API key từ .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

app = Flask(__name__)
CORS(app)

# -------------------- HÀM PHÂN TÍCH CẢM XÚC THỦ CÔNG --------------------
def simple_sentiment(title):
    title = title.lower()

    positive_keywords = ["surge", "gain", "soar", "up", "beat", "strong", "growth", "record high", "buy", "bullish"]
    negative_keywords = ["fall", "drop", "down", "weak", "loss", "plunge", "concern", "miss", "sell", "bearish"]

    positive = any(word in title for word in positive_keywords)
    negative = any(word in title for word in negative_keywords)

    if positive and not negative:
        return "Positive"
    elif negative and not positive:
        return "Negative"
    else:
        return "Neutral"

# -------------------- CHART --------------------
@app.route("/get-chart-data", methods=["POST"])
def get_chart_data():
    req = request.get_json()
    symbols = req.get("symbols", [])
    period = req.get("period","1mo" )
    price_fields = req.get("price_fields", ["Close"])

    result = {}
    for sym in symbols:
        try:
            data = yf.Ticker(sym).history(period=period)
            if not data.empty:
                result[sym] = [
                    {"date": str(index.date()), **{field.lower(): round(row[field], 2) for field in price_fields if field in row}}
                    for index, row in data.iterrows()
                ]
            else:
                result[sym] = "No data"
        except Exception as e:
            result[sym] = f"Error: {str(e)}"

    return jsonify(result)


# def model

# -------------------- CHATBOT --------------------
@app.route("/gemini-chat", methods=["POST"])
def gemini_chat():
    try:
        data = request.get_json()
        message_text = data.get("message", "").strip()

        if not message_text:
            return jsonify({"error": "Missing 'message' field"}), 400

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(message_text)

        return jsonify({"reply": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------- NEWS --------------------
@app.route("/get-news", methods=["POST"])
def get_news():
    req = request.get_json()
    symbols = req.get("symbols", [])
    all_articles = []

    for symbol in symbols:
        query = f"{symbol} stock"
        url = f"https://newsapi.org/v2/everything?q={query}&sortBy=publishedAt&pageSize=5&apiKey={NEWS_API_KEY}"

        try:
            response = requests.get(url, timeout=5)
            articles = response.json().get("articles", [])
            articles = [a for a in articles if "title" in a]

            for article in articles:
                sentiment = simple_sentiment(article["title"])

                all_articles.append({
                    "symbol": symbol,
                    "title": article["title"],
                    "url": article["url"],
                    "source": article["source"]["name"],
                    "publishedAt": article["publishedAt"],
                    "sentiment": sentiment
                })

        except Exception as e:
            print("❌ Lỗi khi lấy tin tức:", e)

    return jsonify(all_articles)

# -------------------- MAIN --------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)