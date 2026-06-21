FROM python:3.13-slim

WORKDIR /app

RUN pip install --no-cache-dir hatchling

COPY pyproject.toml .
COPY src ./src

RUN pip install --no-cache-dir .

EXPOSE 8080

CMD ["uvicorn", "src.main:create_app", "--host", "0.0.0.0", "--port", "8080", "--factory"]
