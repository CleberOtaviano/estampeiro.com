var builder = require('./builder.js');
var pagamento = require('./pagamento.js')
var semantic = require('./libs/semantic.min.js');

pagamento();
builder();

/* Define API endpoints once globally */
    $.fn.api.settings.api = {
        'get followers' : '/followers/{id}?results={count}',
        'create user'   : '/cadastrar',
        'add user'      : '/add/{id}',
        'follow user'   : '/follow/{id}',
        'search'        : '/search/?query={value}'
    };

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};