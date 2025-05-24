# 1. Используем официальный образ с bun
FROM oven/bun:1.1.13-alpine

# 2. Рабочая директория
WORKDIR /app

# 3. Копируем package.json/bun.lockb
COPY bun.lockb package*.json ./

# 4. Установка зависимостей
RUN bun install

# 5. Копируем проект
COPY . .

# 6. Сборка
RUN bun run build

# 7. Порт
EXPOSE 3000

# 8. Запуск
CMD ["bun", "start"]