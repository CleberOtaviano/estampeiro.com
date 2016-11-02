var pagamento = (function() {

    var stepControlador = function() {
        var passoAtual = $('[data-current-step]').data('current-step');
        var prossimoPasso = passoAtual + 1;

        $('[data-step=' + passoAtual + ']').transition('fade up');

    };

    var onClickProximo = function() {

        $('#proximo').on('click', function(e) {
            var prossimoPasso = getPassoAtual() + 1;

            $('[data-step]').transition('hide');
            $('[data-step=' + prossimoPasso + ']').transition('fade up');

            setProximoPasso();

            if (getPassoAtual() === 3) {
                $('#proximo').transition('hide');
                $('#finalizar').transition('fade up');
            }

        });
    };

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

        stepControlador();

        // startStepPagamento();
    };

    return excuteAllEvents();

})();

module.exports = function() {
    return pagamento;
}