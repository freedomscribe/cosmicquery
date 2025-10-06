from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..services.ai_service import AIService, ai_service

router = APIRouter()

# Define the request model to expect a JSON with a "question" field
class QueryRequest(BaseModel):
    question: str

@router.post("/query", tags=["AI"])
def handle_ai_query(query: QueryRequest, service: AIService = Depends(lambda: ai_service)):
    """Endpoint to handle a user's AI query."""
    answer = service.process_query(query.question)
    return {"answer": answer}
