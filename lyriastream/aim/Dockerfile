FROM python:3.12-alpine

# System deps for librosa + soundfile + scipy
RUN apk add --no-cache \
    libsndfile ffmpeg curl build-base

WORKDIR /app

# Install Python deps first (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

# Copy application code
COPY app/ ./app/

# Model cache volume (pre-populated at deploy time)
VOLUME ["/var/lyriastream/models", "/var/lyriastream/audio"]

ENV HF_HOME=/var/lyriastream/models
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

EXPOSE 8090

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:8090/aim/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8090"]
