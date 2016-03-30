$.fn.serializeObject = function() {
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

$("#form-login").submit(function(e) {
    e.preventDefault();

    var formData = $(this).serializeObject();

    $.post("/authenticate", JSON.stringify(formData), function(res) {
        console.log(res);
        if (res.type == false) {
            $('#form-login .alert-warning').text(res.data).show();
        } else {
            //Cookie no Server - window.document.cookie = 'session=' + res.data.id;
            window.location = '/';
        }
    });
});

$("#form-signup").submit(function(e) {
    e.preventDefault();

    var formData = $(this).serializeObject();

    if (formData.password !== formData.confirmPassword) {
        $('#form-signup .alert-warning').text("As senhas não coincidem.").show();
        return;
    }

    $.post("/signup", JSON.stringify(formData), function(res) {
        if (res.type == false) {
            $('#form-signup .alert-warning').text(res.data).show();
        } else {
            //window.document.cookie = 'session=' + res.data.id;
            window.location = '/';
        }
    });
});

$(function() {
    var elements;
    // TODO: Verificar se existe o Cookie 'AuthUser'
    if (1 === 1) {
        elements = '<li><a href="/signup">Inscrever-se</a></li>' +
        '<li><a href="/login">Entrar</a></li>';
    } else {
        elements = '<li><a id="link-logout" href="#">Sair</a></li>';
    }
    $('#account-header').append($(elements));
});

$("#link-logout").click(function (e) {
    // TODO: Limpar o Cookie 'session'
    window.location = '/';
});