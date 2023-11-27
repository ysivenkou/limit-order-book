FROM python:3.12

ENV PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_HOME="/etc/poetry" \
    PATH="/etc/poetry/bin:$PATH"

WORKDIR /app

COPY poetry.lock pyproject.toml .

RUN curl -sSL https://install.python-poetry.org | python -

RUN poetry config virtualenvs.create false && poetry install
