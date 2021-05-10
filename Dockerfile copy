FROM nikolaik/python-nodejs:python3.8-nodejs12-slim

WORKDIR /app

COPY package.json .

RUN npm install --quiet

COPY . .

CMD ["npm", "start"]