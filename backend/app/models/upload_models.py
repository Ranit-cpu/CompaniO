from pydantic import BaseModel

class UploadResponse(BaseModel):
    avatar_url: str
