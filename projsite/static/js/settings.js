$(document).ready(function () {
    const web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/b70352c9625a4e9fb70c4a533997ade1")
        function financialMfil(numMfil) {
        return Number.parseFloat(numMfil / 1e18).toFixed(18);
    }
    const updateBal = async (client_address) => {
        let contractAddress = "0xdc549d811ae5e7f66dbfd7a6c781b33e6182ee5f";
        const contractABI = [
              {
                "constant":true,
                "inputs":[{"name":"_owner","type":"address"}],
                "name":"balanceOf",
                "outputs":[{"name":"balance","type":"uint256"}],
                "type":"function"
              },
              {
                "constant":true,
                "inputs":[],
                "name":"decimals",
                "outputs":[{"name":"","type":"uint8"}],
                "type":"function"
              }
            ];
        let contract = new web3.eth.Contract(contractABI, contractAddress, {
            from: client_address
        });
        window.user_balance = await contract.methods.balanceOf(client_address).call()
        user_balance = financialMfil(user_balance);
        user_balance = Math.round(user_balance);
        const bal = document.querySelector('#user_balance')
        bal.textContent = user_balance
    }
    function updateBalance() {
         $.ajax({
            type: "POST",
            url: '/transfer/',
            dataType: 'json',
            data: {balance_info: 'get_user_address'},
            success: function (data) {
                updateBal(data.address)
            }
        });
    }
    function validate_account(password, acc_data) {
        let valid = web3.eth.accounts.decrypt(acc_data, password);
        return valid;
    }
    $('#get_key').click(function (event) {
        event.preventDefault()
        let password = $('#file_pass').val()
        let fileData = $('#key_file').prop('files')[0].text()
        event.preventDefault()
        fileData.then((value) => {
            let temp_result = value;
            let result = JSON.parse(temp_result);
            user_address = result.address
            user_address = user_address.substr(0, 32);
            var key_valid;
            try {
                let valid = validate_account(password, result);
                let div = document.createElement('div');
                div.className = "keys";
                first_part = "<p>Ваш адрес: <strong id='text'>" + valid.address + "</strong></p>";
                second_part = "<p>Приватный ключ: <strong id='text'>" + valid.privateKey.slice(2) + "</strong></p>";
                div.innerHTML = first_part + second_part
                let info = '<p>' + valid.privateKey + '</p>'
                console.log(valid.address)
                console.log(valid.privateKey)
                info_block = document.querySelector("#dialogs-list")
                info_block.append(div);
                // $('#myKey').html(info)

            } catch {
                console.log('Ошибка')
                key_valid = false;
            }
        });
    });
    window.setInterval(updateBalance,5000)
});