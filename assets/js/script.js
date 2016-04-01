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

    $.post("/api/authenticate", JSON.stringify(formData), function(res) {
        console.log(res);
        if (res.type == false) {
            $('#form-login .alert-warning').text(res.data).show();
        } else {
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

    $.post("/api/signup", JSON.stringify(formData), function(res) {
        if (res.type == false) {
            $('#form-signup .alert-warning').text(res.data).show();
        } else {
            window.location = '/';
        }
    });
});

$("#link-logout").click(function (e) {
    // TODO: Limpar o Cookie 'session'
	document.cookie = "AuthUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                  //(sDomain ? "; domain=" + sDomain : "") + 
                  //s(sPath ? "; path=" + sPath : "");
    window.location = '/';
});

function loadCategories() {
	$.getJSON('/api/categories', function(res) {
		$(res.data).each(function(index, item){
			var option = '<option value="' + item.id + '">' + item.name + '</option>';
			$('#select-category').append($(option));
		});
	});
}