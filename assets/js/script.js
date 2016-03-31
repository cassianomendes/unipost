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

$(function() {
    loadPosts();
});

$("#link-logout").click(function (e) {
    // TODO: Limpar o Cookie 'session'
    window.location = '/';
});

$('#search-post').keypress(function(e) {
    if(e.which == 13) { // ENTER
        loadPosts($(this).val());
    }
});

function loadCategories() {
	$.getJSON('/api/categories', function(res) {
		// $('#select-category').find('option').remove();
		$(res.data).each(function(index, item){
			var option = '<option value="' + item.id + '">' + item.name + '</option>';
			$('#select-category').append($(option));
		});
	});
}

function loadPosts(like) {
    var url = '/api/posts' + (like ? '?title=' + like : '');
    $.getJSON(url, function(res){
        if (res.type == false) {
            return;
        }
		$('tbody', '#table-posts').find('tr').remove();
		$(res.data).each(function(index, item){
			var trElement = '<tr item-id=' + item.id + '>' +
                            '	<td>' +
                            '		' + (index + 1) +
                            '	</td>' +
                            '	<td>' +
                            '		' + item.title +
                            '	</td>' +
                            '	<td>' +
                            '		' + item.category +
                            '	</td>' +
                            '	<td>' +
                            '		<a href="/posts?ItemId=' + item.id + '">visualizar</a>' + 
                            '	</td>' +
                            '<tr>';
			$('#table-posts tbody').append($(trElement));
		});
	});
}