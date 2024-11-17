FROM node:22

# Встановлення робочого каталогу
WORKDIR /app

# Копіюйте тільки файли package.json і package-lock.json
COPY package*.json ./

# Встановіть залежності
RUN npm install

# Копіюйте весь проєкт
COPY . .

# Command to start the Node.js app
CMD ["npm", "run", "start2"]