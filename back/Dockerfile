FROM python:3.13.3-alpine3.21

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY . /app

RUN python -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r /app/requirements.txt && \
    adduser --disabled-password --no-create-home duser && \
    mkdir -p /data/web/static /data/web/media && \
    chown -R duser:duser /venv /data/web/static /data/web/media && \
    chmod -R 755 /data/web/static /data/web/media && \
    chmod -R +x /app/scripts

ENV PATH="/app/scripts:/venv/bin:$PATH"
USER duser

EXPOSE 8000

CMD ["commands.sh"]
