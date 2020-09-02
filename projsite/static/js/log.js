$(document).ready(function () {
   const web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/b70352c9625a4e9fb70c4a533997ade1")
    function validate_account(password, acc_data) {
        let valid = web3.eth.accounts.decrypt(acc_data, password);
        return valid;
    }
    function cipher(word, key){
        const nonce = nacl.randomBytes(24)
        const secretKey = new ethereumjs.Buffer.Buffer.from(key, 'utf8')
        const secretData = new ethereumjs.Buffer.Buffer.from(word, 'utf8')
        const encrypted = nacl.secretbox(secretData, nonce, secretKey)
        const result = `${ethereumjs.Buffer.Buffer.from(nonce).toString('base64')}:${ethereumjs.Buffer.Buffer.from(encrypted).toString('base64')}`
        return result
    }
    $('#send_data').click(function (event) {
        event.preventDefault();
        let login = $('#login').val();
        let password = $('#password').val();
        let fileData = $('#key').prop('files')[0].text();
        console.log(login);
        console.log(password);
        console.log(fileData)
        fileData.then((value) => {
            let temp_result = value;
            let result = JSON.parse(temp_result);
            console.log(result);
            user_address = result.address
            user_address = user_address.substr(0, 32);
            console.log(user_address)
            var key_valid;
            try {
                let valid = validate_account(password, result);
                console.log('Приватный ключ', valid.privateKey)
                if (valid) {
                    console.log('Авторизация прошла успешно')
                    key_valid = true;
                }
            } catch {
                console.log('Ошибка')
                key_valid = false;
            }
            if (key_valid) {
                $.ajax({
                    type: "POST",
                    url: "/login/",
                    dataType: 'json',
                    data: {
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        login: login
                    },
                    success: function (data) {
                        if (data.message == 'ok') {
                            word = data.word
                            message = cipher(word, user_address)
                            console.log('Слово', word)
                            console.log('Ключ', user_address)
                            console.log("Шифр", message)
                            $.ajax({
                                type: "POST",
                                url: "/login/",
                                dataType: "json",
                                data: {login: login, password:password, key_valid: message, csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
                                success: function (data) {
                                    if (data.message == 'ok'){
                                        console.log('OK')

                                        document.location.href = '/dialogs';
                                    }
                                    else{
                                        console.log('Ошибка авторизации')
                                        document.location.href = '/login';
                                    }
                                }

                            })

                        }
                    }
                });
            }
            else{
                document.location.href = '/login';
            }
        });
    });
});
