# RSS Aggregator

### Hexlet tests and linter status:
[![Actions Status](https://github.com/dotnil/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/dotnil/frontend-project-11/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dotnil_frontend-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dotnil_frontend-project-11)
[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=dotnil_frontend-project-11)

## О проекте

RSS Aggregator — это веб-приложение для агрегации RSS-лент в едином интерфейсе.
Пользователь может добавлять источники, просматривать публикации и автоматически получать обновления.

Проект реализован в рамках учебной программы Hexlet.

🔗 Демо: https://frontend-project-11-orcin-phi.vercel.app/

## Возможности

- Добавление RSS-лент по URL
- Валидация вводимых данных и защита от дубликатов
- Отображение постов из всех добавленных источников
- Просмотр постов в модальном окне
- Отметка прочитанных публикаций
- Автоматическое обновление лент в фоновом режиме
- Поддержка мультиязычности

## Стек технологий

- Vanilla JavaScript (ES Modules)
- Vite
- Axios
- Yup
- i18next
- Valtio (vanilla)
- Bootstrap 5

## Архитектура

Приложение построено по упрощённой MVC-подобной архитектуре:

- **Model** — состояние приложения (Valtio proxy)
- **View** — рендеринг интерфейса на основе состояния
- **Controller** — обработчики пользовательских действий

Основной принцип — UI полностью зависит от состояния.

## Установка и запуск

### Установка зависимостей

```bash
npm install
````

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка проекта

```bash
npm run build
```

### Предпросмотр production-сборки

```bash
npm run preview
```

### Проверка кода

```bash
npm run lint
```

## Структура проекта

```
src/
├── api.js          # работа с RSS и прокси
├── parser.js       # парсинг RSS
├── view.js         # слой представления
├── handlers.js     # бизнес-логика
├── events.js       # DOM-события
├── state.js        # инициализация состояния
├── i18n.js         # локализация
├── updater.js      # фоновое обновление лент
└── main.js         # точка входа
```
