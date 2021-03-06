$(document).ready(function () {
    const web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/b70352c9625a4e9fb70c4a533997ade1")
    function financialMfil(numMfil) {
        return Number.parseFloat(numMfil / 1e7).toFixed(7);
    }
    function updateDialogs () {
        let active = false;
        if ($("div.menu_test").hasClass("menu_test_active")){
            active = true;
        }
        $.ajax({
            type: "POST",
            url: '/dialogs/',
            dataType: 'html',
            data: {message: 'load_dialogs'},
            success: function (code) {
                if (code.indexOf('dialog') >= 0 ) {
                    if (code !== $('#dialogs-list').html()){
                        console.log(code)
                        console.log($('#dialogs-list').html())
                        $('#dialog').remove();
                        $('#dialogs-list').html(code);
                    }
                    else{
                        console.log('совпадают')
                    }
                    if (active){
                        $(".menu_test").addClass('menu_test_active');
                    }
                }
                else{
                    document.location.href = '/login';
                }
            }
        });
        updateBalance()
    }
    updateDialogs();
    const updateBal = async (client_address) => {
        let contractAddress = "0x7cb53602e6407c9126c3261a26a55004d0398606";
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
    $("#new-dialog-container").click(function () {
        $('.menu_test').toggleClass('menu_test_active');
    });
    $('#send_create_dialog').on( 'click', function (event) {
        event.preventDefault();
        console.log('Кнопка');
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
    window.setInterval(updateDialogs,5000);
});