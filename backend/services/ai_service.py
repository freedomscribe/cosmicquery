import os
from openai import OpenAI
from fastapi import HTTPException

class AIService:
    def __init__(self):
        # Initialize the OpenAI client. It will automatically use the
        # OPENAI_API_KEY from the environment.
        self.client = OpenAI()

    def process_query(self, question: str):
        """Sends a question to the OpenAI API and returns the answer."""
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="OPENAI_API_KEY is not configured on the server. Please check the .env file."
            )

        try:
            system_prompt = """You are an expert astronomer and space science educator.
            Provide accurate, engaging answers about space, astronomy, and related topics.
            Use simple language but maintain scientific accuracy."""

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content

        except Exception as e:
            # Catch potential API errors, like an invalid key
            raise HTTPException(status_code=500, detail=f"An error occurred with the OpenAI API: {str(e)}")

# Create a single instance of the service
ai_service = AIService()
