import { exec } from 'child_process';
import Exception from './Exception';

/**
 * Отправка ошибок на почту
 * @class
 */
class ErrorMailer {

  /**
   * Отправить письмо с ошибкой
   * @param {Exception|Error} error
   * @returns {void}
   * @throws {Error}
   */
  static send = (error) => {
    const command = '/usr/sbin/sendmail';
    const options = '-t';

    if (!error || !(error instanceof Exception) || !(error instanceof Error)) {
      throw new Error('Необходимо передать экземпляр класса Exception или Error');
    } else if (!error.message || ((typeof error.message) !== 'string')) {
      throw new Error('Необходимо указать текст ошибки');
    }

    const sendMail = exec(`"${command}" ${options}`, (error, stdout, stderr) => {
      if (error) { console.error(`ErrorMailer: ${error}`); }
      else if (stderr) { console.error(`ErrorMailer: ${stderr}`); }
    });

    sendMail.stdin.write(this.createMsg(error.message));
    sendMail.stdin.end();
  };

  /**
   * Создать сообщение
   * @param {string} text текст сообщения
   * @returns {string} 
   */
  createMsg = (text) => {
    const to = process.env.SERVER_ADMIN;
    const subject = '[NODEJS FATAL ERROR]';

    if (!to) { console.error(`ErrorMailer: переменная SERVER_ADMIN не задана`) }

    const content = `
      To: ${to}
      Subject: ${subject}

      ${text}
    `;

    return content;
  };

}

export default ErrorMailer;
