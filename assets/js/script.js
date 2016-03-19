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

$("#form-login").submit(function(e) {
    e.preventDefault();
    $.post("/authenticate", JSON.stringify($(this).serializeObject()), function(data) {
        if (data.type) {
            // TODO: Autenticado
        } else {
            // TODO: Falha de autenticação
        }
    });
});