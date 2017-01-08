var pagamento = (function() {

    var stepControlador = function() {
        var passoAtual = $('[data-current-step]').data('current-step');
        var prossimoPasso = passoAtual + 1;

        $('[data-step=' + passoAtual + ']').transition('fade up');

    };

    var onClickProximo = function() {

        $('#proximo').on('click', function(e) {
            var prossimoPasso = getPassoAtual() + 1;


            if ( getPassoAtual() === 1 ) {
                // alert($('#user_name').val());
                var formSerialized = $('#cadastro_form').serializeObject();
                formSerialized.isAjax = true;

                $(this)
                    .api({
                        action: 'create user',
                        method : 'POST',
                        on: 'now',
                        data: formSerialized,
                        // beforeSend: function(settings) {
                        //     // cancel request
                        //     if(!formSerialized.user.name || !formSerialized.user.email || !formSerialized.user.password) {
                        //         $(this).state('flash text', 'FALTA INFORMAÇÃO AI RAPÁ!');
                        //         return false;
                        //     }
                        // },
                        onSuccess: function(response) {
                            if (response.success) {
                                $('[data-step]').transition('hide');
                                $('[data-step=' + prossimoPasso + ']').transition('fade up');

                                setProximoPasso();
                            }
                        },
                        onComplete: function(response) {
                            if(!response.success) {

                                console.log(response);
                            }
                        }
                    });
            }

            if ( getPassoAtual() === 2 ) {

            }

            // $('[data-step]').transition('hide');
            // $('[data-step=' + prossimoPasso + ']').transition('fade up');

            // setProximoPasso();

            // if (getPassoAtual() === 3) {
            //     $('#proximo').transition('hide');
            //     $('#finalizar').transition('fade up');
            // }

        });
    };

    var onBlurBuscaCEP = function() {
        // $('#endereco_cep')
        //     .search({
        //         minCharacters : 3,
        //         apiSettings   : {
        //             url        : 'viacep.com.br/ws/{cep}/json',
        //             onResponse : function(theresponse) {
        //                 // here you modify theresponse object,
        //                 // then you return the modified version.
        //                 return theresponse
        //             }
        //         }
        //     });

            $('.ui.search')
                .search({
                    debug: true,
                    apiSettings: {
                        url: 'https://viacep.com.br/ws/{query}/json',
                        onResponse: function(cepResponse) {
                            var response = {
                                results: []
                            };
                            var temp = [];
                            temp[0] = cepResponse;

                            $.each(temp, function(index, item) {

                                response.results.push({
                                    title       : item.logradouro || item.localidade,
                                    description : item.uf
                                });

                            });

                            console.log(response);

                            return response;
                        }
                    },
                    // fields: {
                    //     results : 'items',
                    //     title   : 'localidade'
                    // },
                    minCharacters : 8
                });
    }

    var getPassoAtual = function() {
        var passoAtual = $('[data-current-step]').data('current-step');
        return passoAtual;
    };

    var setProximoPasso = function() {
        var prossimoPasso = getPassoAtual() + 1;

        if (getPassoAtual() === 1) {
            $('.jaPossuiCadastro').transition('hide');
        }
        $('[data-current-step]').data('current-step', prossimoPasso);
    };

    var onClickBotaoVoltar = function() {
        $('.voltar-login').on('click', function(e) {
            $('.login_form').transition('hide');
            $('.envio_form').transition('hide');
            $('.cadastro_form').transition('fade up');
            $('.jaPossuiCadastro').transition('fade right');
            $(this).transition('hide');
        });
    };

    var onClickBotaoJaPossuiCadastro = function() {
        $('.jaPossuiCadastro').on('click', function(e) {
            hideElementsFromSteps();
            $('.login_form').transition('fade up');
            $('.voltar-login').transition('fade right');
            $(this).transition('hide');
        });
    };

    var hideElementsFromSteps = function() {
        // Default itens invisble
        $('.cadastro_form').transition('hide');
        $('.login_form').transition('hide');
        $('.voltar-login').transition('hide');
        $('.envio_form').transition('hide');
        $('.pagamento_form').transition('hide');
        $('#finalizar').transition('hide');

    };

    var onClickVerSenha = function() {
        $('.ver-senha').on('click', function(e) {
            var campoSenha = $('#user_password');

            if (campoSenha.prop('type') == 'password') {
                campoSenha.prop('type', 'text');
                $(this).addClass('hide');
            } else {
                campoSenha.prop('type', 'password');
                $(this).removeClass('hide');
            }
        });
    };

    var excuteAllEvents = function() {
        hideElementsFromSteps();
        onClickBotaoJaPossuiCadastro();
        onClickBotaoVoltar();
        onClickProximo();
        onClickVerSenha();
        onBlurBuscaCEP();

        stepControlador();

        // startStepPagamento();
    };

    return excuteAllEvents();

})();

module.exports = function() {
    return pagamento;
}