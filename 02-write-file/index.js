// https://nodejs.org/api/readline.html
// https://nodejsdev.ru/api/readline/
const fs = require('fs');
const readline = require('readline');

const outToFile = fs.createWriteStream('./02-write-file/output.txt', { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Введите текст который вы хотите записать в файл: '
});

console.log('Эта программа записывает ваш текст в файл output.txt');
rl.prompt();

rl.on('line', (line) => {
  if (line.trim().toLowerCase() === 'exit') {
    console.log('Спасибо! До свидания!');
    rl.close();
    return;
  }

  outToFile.write(`${line}\n`, (err) => {
    if (err) {
      console.error('Ошибка при записи в файл:', err.message);
    } else {
      console.log('Отлично! Текст записан в файл.');
    }
  });

  rl.prompt();
});

rl.on('close', () => {
  console.log('Текст успешно записан в output.txt');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nВы остановили запись текста в файл');
  rl.close();
});