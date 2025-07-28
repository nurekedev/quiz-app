FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:0.6.11 /uv /uvx /bin/


RUN apt-get update && \
apt-get install -y curl gettext pkg-config build-essential && \
apt-get clean && \
apt-get install -y --no-install-recommends curl ca-certificates && \
rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./pyproject.toml ./uv.lock /app/
COPY . /app

RUN groupadd -g 1000 quizadmin && useradd -u 1000 -g 1000 -r -m -d /home/quizadmin quizadmin
RUN chown -R quizadmin:quizadmin /app /home/quizadmin
RUN chmod 2775 /app /home/quizadmin

USER quizadmin

RUN uv sync --no-dev --no-install-project

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH=/app

