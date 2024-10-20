import ErrorMailer from "./ErrorMailer";

/**
 * Кастомный класс ошибки
 * @class
 * @extends Error
 */
class Exception extends Error {

  /**
   * @param {string} message описание ошибки
   * @param {number} statusCode статус-код ошибки
   */
  constructor(message, statusCode = 550) {
    super(message);

    this.statusCode = statusCode;

    // поддерживаем соответствующую трассировку стека с указанием места возникновения ошибки (доступно только в V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // ошибки со статус-кодом от 450 до 499 не интересуют
    if (450 > statusCode > 499) {
      ErrorMailer.send(this);
    }
  }

}

export default Exception;
