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

$("#form-categories").submit(function(e) {
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


$(function() {
    _loadCategoriesTable();
    
    function _loadCategoriesTable() {
        $.getJSON('/api/categories', function(res) {
            if (res.type == false) {
                return;
            }
            $('tbody', '#table-categories').find('tr').remove();
            $(res.data).each(function(index, item){
                var trElement = '<tr item-id=' + item.id + '>' +
                                '	<td>' +
                                '		' + (index + 1) +
                                '	</td>' +
                                '	<td>' +
                                '		' + item.name +
                                '	</td>' +
                                '	<td>' +
                                '		<a href="/categories/edit?ItemId=' + item.id + '">alterar</a>' +
                                '		<a href="/categories/delete?ItemId=' + item.id + '">excluir</a>' +  
                                '	</td>' +
                                '<tr>';
                $('#table-categories tbody').append($(trElement));
            });
        });
    }
});