const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = '7217537023:AAFvjMkI4eC7cP4_KxGc69u9EYFE9JHnT28';
const bot = new TelegramBot(token, { polling: true });

const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));
let userSessions = {};

// Главное меню
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userSessions[chatId] = { currentIndex: 0, score: 0, difficulty: 'normal', mode: 'standard' };

    bot.sendMessage(chatId, `👋 Добро пожаловать в "Матемагию"!\n\n🎯 Ваша задача — решать математические загадки.\n\nВыберите, с чего начать:`, {
        reply_markup: {
            keyboard: [
                ['📚 Играть', '⚙️ Настройки'],
                ['📊 Статистика']
            ],
            resize_keyboard: true,  // Автоматически подстраивает размер кнопок
            one_time_keyboard: true // Кнопки скрываются после выбора
        }
    });
});

// Обработчик нажатий
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const session = userSessions[chatId] || {};
    const text = msg.text;

    if (text === '📚 Играть') {
        session.currentIndex = 0; // Сброс текущего вопроса при начале игры
        sendQuestion(chatId);
    } else if (text === '⚙️ Настройки') {
        showSettings(chatId);
    } else if (text === '📊 Статистика') {
        showStats(chatId);
    } else if (text === '🔙 В меню') {
        showMainMenu(chatId);
    } else if (text.startsWith('difficulty_')) {
        const difficulty = text.split('_')[1];
        session.difficulty = difficulty;
        bot.sendMessage(chatId, `🎯 Сложность изменена на: ${difficulty.toUpperCase()}`);
    } else if (text.startsWith('mode_')) {
        const mode = text.split('_')[1];
        session.mode = mode;
        bot.sendMessage(chatId, `🎮 Режим изменён на: ${mode === 'standard' ? 'Обычный' : 'С таймером'}`);
    } else {
        handleAnswer(chatId, text);
    }
});

function sendQuestion(chatId) {
    const session = userSessions[chatId];
    const filteredQuestions = questions.filter(q => q.difficulty === session.difficulty);

    if (!filteredQuestions.length) {
        bot.sendMessage(chatId, `⚠️ Нет задач для выбранной сложности. Попробуйте другую.`);
        return;
    }

    const question = filteredQuestions[session.currentIndex % filteredQuestions.length];
    const correctAnswer = question.answer;

    const options = generateOptions(correctAnswer);
    bot.sendPhoto(chatId, question.image, {
        caption: `❓ ${question.text}\n\nСложность: ${session.difficulty.toUpperCase()}\n\n📊 Счёт: ${session.score}`,
        reply_markup: {
            keyboard: options.map((opt) => ([
                { text: opt }
            ])),
        },
    });
}

function handleAnswer(chatId, userAnswer) {
    const session = userSessions[chatId];
    const filteredQuestions = questions.filter(q => q.difficulty === session.difficulty);
    const question = filteredQuestions[session.currentIndex % filteredQuestions.length];

    if (userAnswer === question.answer) {
        session.score += 1;
        bot.sendMessage(chatId, `✅ Верно! Ваш счёт: ${session.score}`);
    } else {
        bot.sendMessage(chatId, `❌ Неправильно! Правильный ответ: ${question.answer}`);
    }

    session.currentIndex += 1;
    sendQuestion(chatId);
}

function generateOptions(correctAnswer) {
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
        const randomOption = (Math.random() * 200).toFixed(2);
        if (randomOption !== correctAnswer) options.add(randomOption);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
}

function showSettings(chatId) {
    bot.sendMessage(chatId, `⚙️ Настройки:\nВыберите параметр для изменения:`, {
        reply_markup: {
            keyboard: [
                ['🟢 Простые', '🔵 Средние', '🔴 Сложные'],
                ['🎮 Обычный режим', '⏱️ Режим с таймером'],
                ['🔙 В меню']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}

function showStats(chatId) {
    const session = userSessions[chatId];
    const statsMessage = `
📊 Статистика:
- Решено задач: ${session.currentIndex}
- Счёт: ${session.score}
- Сложность: ${session.difficulty.toUpperCase()}
- Режим: ${session.mode === 'standard' ? 'Обычный' : 'С таймером'}
    `;
    bot.sendMessage(chatId, statsMessage, {
        reply_markup: {
            keyboard: [
                ['🔙 В меню']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
}

// Возврат в главное меню
function showMainMenu(chatId) {
    bot.sendMessage(chatId, `Вы вернулись в главное меню. Выберите действие:`, {
        reply_markup: {
            keyboard: [
                ['📚 Играть', '⚙️ Настройки'],
                ['📊 Статистика']
            ],
            resize_keyboard: true,  // Автоматически подстраивает размер кнопок
            one_time_keyboard: true // Кнопки скрываются после выбора
        }
    });
}
