# Card Tokenization HTTP API on AWS

### Requisitos

- Node.js v20.x
- Serverless latest
- Docker (para crear imagenes de posgres y redis)
- Postman para probar HTTP APIs

### Clone

```bash
clone git git@github.com:chaicopadillag/card-tokenization-serverless.git
```

### Run local

Crear el archivo `.env` y copiar los environments ademas llenar los valores segun el entorno desde `.env.example` manualmente o usando el siguiente comando:

```bash
cp .env.example .env
```

### Crear imagenes con Docker

Para crear images de postgres y redis, opcional imagenes de pgAdmin + redis-commander para administrar las DBs puede descomentar en `docker-compose.yml`. Este proceso es opcional si tienes los servidores de posgres y redis solo tienes que cambiar en el `.env`

Ejecutar el siguiente comando para crear los images:

```bash
docker compose up -d
```

### Start app offline

```bash
npm run dev
```

### Run test y coverage

```bash
npm run test && npm run test:cov
```

### Sincronizar las tablas

Para sincronizar las tabas usar el recurso `POST` `/migration` usando Postman o algun cliente HTTP.

```bash
# Para stage local, vericar el puerto aquí.

endpoint: curl --location --request POST 'http://localhost:4000/migration'

response: { "message": "La migracion se ejecutom correctamente" }

```

## Http Status Code

Los codigos de respuesta de `HTTP` usados estan basado en esta documentación [https://www.restapitutorial.com/httpstatuscodes.html](https://www.restapitutorial.com/httpstatuscodes.html)

_Nota_: A los endpoints colocar el header de Authorization Bearer con prefix pk

### POST Tonekizer Card

Para tokenizar la tarjeta usar el recurso `POST` `/tokens` usando Postman o algun cliente HTTP.

```bash
# Para stage local, vericar el puerto aquí.

endpoint: curl --location 'http://localhost:4000/tokens' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer pk_5Pf3TdmyK8exHXAnglgiPuxfqZLhR86WHqZdoAa8gA9Cv' \
--data-raw '{
    "card_number": "4111 1111 1111 1111",
    "cvv": "254",
    "email": "dev02@gmail.com",
    "expiration_month": "04",
    "expiration_year": "2027"
}'

response: { "token": "gxZTCiFms33bgUj2" }

```

### GET Card

Para obtener los datos de la tarjeta usar el recurso `GET` `/card?token=xxx` usando Postman o algun cliente HTTP.

```bash
# Para stage local, vericar el puerto aquí.

endpoint: curl --location 'http://localhost:4000/card?token=laqyyQlALVA80piz' \
--header 'Authorization: Bearer pk_5Pf3TdmyK8exHXAnglgiPuxfqZLhR86WHqZdoAa8gA9Cv'

response: {
  "card_number": "4111 1111 1111 1111",
    "email": "dev02@gmail.com",
    "expiration_month": "04",
    "expiration_year": "2027"
  }

```

### Deployment

```bash
npm run deploy
```
