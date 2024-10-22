import { exec } from 'child_process';

/**
 * Отправка ошибок на почту
 * @class
 */
class ErrorMailer {
  /**
   * Отправить письмо с ошибкой
   * @param {Error} error
   * @returns {void}
   */
  static send(error) {
    const command = '/usr/sbin/sendmail';
    const options = '-t -oi';

    if (!error.message || ((typeof error.message) !== 'string')) {
      console.error('ErrorMailer: Необходимо указать текст ошибки');
    }

    const sendMail = exec(`"${command}" ${options}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`ErrorMailer: ${error}`);
      } else if (stderr) {
        console.error(`ErrorMailer: ${stderr}`);
      }
    });

    sendMail.stdin.write(this.createMsg(error.message, error.stack));
    sendMail.stdin.end();
  }

  /**
   * Создать сообщение
   * @param {string} text текст сообщения
   * @param {string} stack трассировка стека
   * @returns {string}
   */
  static createMsg(text, stack = '') {
    const to = process.env.SERVER_ADMIN;
    const subject = '[NODEJS FATAL ERROR]';
    const contentType = 'text/plain;charset=UTF-8';

    if (!to) { console.error(`ErrorMailer: переменная SERVER_ADMIN не задана`); }

    const content = 'To: ' + to + '\n' +
      'Subject: ' + subject + '\n' +
      'Content-Type: ' + contentType + '\n\n' +
      text + '\n\n' +
      stack;

    return content;
  }
}

export default ErrorMailer;
