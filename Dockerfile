FROM python:3.9-slim
WORKDIR /app
COPY pyproject.toml poetry.lock* ./
RUN pip install poetry && poetry install --no-dev
COPY . .
CMD ["uvicorn", "app:app:app", "--host", "0.0.0.0", "--port", "8001"]