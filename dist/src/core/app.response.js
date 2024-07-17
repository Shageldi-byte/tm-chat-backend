"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = exports.defaultErrorMessage = exports.generateResponse = exports.successMessage = void 0;
exports.successMessage = {
    tm: 'Üstünlikli tamamlandy',
    en: 'Successfully completed'
};
const generateResponse = (props) => {
    let code = 200;
    let message = exports.successMessage;
    let error = false;
    if (props.code) {
        code = props.code;
    }
    if (props.message) {
        message = props.message;
    }
    if (props.error) {
        error = props.error;
    }
    return {
        code,
        message,
        error,
        body: props.body,
    };
};
exports.generateResponse = generateResponse;
exports.defaultErrorMessage = {
    tm: 'Ýalňyşlyk ýüze çykdy',
    en: 'Something went wrong'
};
function badRequest(props) {
    let code = 400;
    let message = exports.defaultErrorMessage;
    if (props.code) {
        code = props.code;
    }
    if (props.message) {
        message = props.message;
    }
    props.res.status(code).json({
        error: true,
        message: message,
        body: null
    });
}
exports.badRequest = badRequest;
