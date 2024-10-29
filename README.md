# Игра "Почти сапер"

## Описание

Сервер игры "Почти сапер"

## Требования

* NodeJS 18+
* TypeScript 5+

## Установка и запуск

### Переменные окружения

| Переменная           | Описание                         | Тип       | Значение |
|----------------------|----------------------------------|-----------|----------|
| **Сервер**           |                                  |           |          |
| `HOST`               | Хост HTTP-сервера                | `String`  |          |
| `PORT`               | Порт HTTP-сервера                | `Number`  |          |
| `CLIENT_URL`         | Адрес клиента                    | `String`  |          |

Предустановленные значения файле `.env.(development|production)`

Для применения необходимых конфигураций для контура:

```bash
$ cp .env.(development|production) .env
```

### Development

```bash
$ yarn && yarn start:debug
```

### Production

```bash
$ yarn && yarn build
$ yarn start:prod
```


## Создание новой версии сборки

Добавить изменения

```bash
$ git add .
```

Создать коммит

```bash
$ git commit -m 'Commit comments'
```

Инкремент версии (патч), будет создан новый коммит и тег

```bash
$ yarn version --patch # указать точную версию сборки, например, 0.0.1
$ yarn version --minor # автоматически увеличить минорную версия, 0.1.0
$ yarn version --major # автоматически увеличить мажорную версия, 1.0.0
```

Публикация изменений

```bash
$ git push
$ git push --tags
```
