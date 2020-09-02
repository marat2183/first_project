$(document).ready(function () {
    const web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/b70352c9625a4e9fb70c4a533997ade1")
    let currentLocation = window.location.href.toString().split(window.location.host)[1];
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
    $('#send_create_dialog').click(function (event) {
        event.preventDefault();
        let reciever = $('#reciever').val();
        console.log(reciever);
        $.ajax({
            type: "POST",
            url: '/dialogs/create/',
            dataType: 'json',
            data: {reciever: reciever, csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()},
            success: function (data) {
                if (data.message == 'ok') {
                    console.log(data.message)
                    document.location.href = '/dialogs/';
                }
                else
                {
                    console.log(data.message)
                    document.location.href = '/dialogs/create';
                }
            }
        });
    });
    window.setInterval(updateBalance, 5000)
});