const handleError = (error) => {
    let messages = [];

    if (error.response && error.response.data) {
        const responseJson = error.response.data;

        if (responseJson.detail) {
            messages.push(responseJson.detail);
        } else if (responseJson.non_field_errors) {
            responseJson.non_field_errors.forEach((el) => messages.push(el));
        } else {
            Object.keys(responseJson).forEach((key) => {
                if (Array.isArray(responseJson[key])) {
                    responseJson[key].forEach((message) => messages.push(message));
                } else {
                    messages.push(responseJson[key]);
                }
            });
        }
    } else if (error.message) {
        messages.push(error.message);
    } else if (error.response && error.response.status === 404) {
        messages.push('O recurso requisitado não existe.');
    } else if (error.response && error.response.statusText) {
        messages.push(error.response.statusText);
    } else {
        messages.push('Ocorreu um erro ao processar a requisição.');
    }

    messages.forEach((el) => {
        console.error(el); 
    });

    return messages;
};

export default handleError;