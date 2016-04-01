var dialog;
var categoryId;

$("#form-categories").submit(function(e) {
    e.preventDefault();

    var formData = $(this).serializeObject();

    $.post("/api/categories", JSON.stringify(formData), function(res) {
        console.log(res);
        if (res.type == false) {
            $('#form-categories .alert-warning').text(res.data).show();
        } else {
            //Cookie no Server - window.document.cookie = 'session=' + res.data.id;
            window.location = '/categories';
        }
    });
});


$(function() {
    dialog = $("#dialog-form-category").dialog({
        autoOpen: false,
        height: 400,
        width: 500,
        modal: true,
        buttons: {
            "Salvar": editCategory,
            "Fechar": function() {
                dialog.dialog("close");
            }
        },
        close: function() {
            $(':input', '#formNewItem')
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
        }
    });
    
    _loadCategories();
});

function _loadCategories() {
    $.getJSON('/api/categories', function(res) {
        if (res.type == false) {
            return;
        }
        $('tbody', '#table-categories').find('tr').remove();
        $(res.data).each(function(index, item) {
            var trElement = '<tr item-id=' + item.id + '>' +
                '	<td>' +
                '		' + (index + 1) +
                '	</td>' +
                '	<td>' +
                '		' + item.name +
                '	</td>' +
                '	<td>' +
                '		<a onClick="showDialog(' + item.id + ',\'' + item.name + '\')">alterar</a>' +
                '		<a onClick="deleteCategory(' + item.id + ')">excluir</a>' +
                '	</td>' +
                '<tr>';
            $('#table-categories tbody').append($(trElement));
        });
    });
}

function deleteCategory(id) {
    $.post('/api/categories/delete', { id: id }, function(res) {
        if (res.type) {
            _loadCategories();
        } else {
            alert("Erro ao excluir categoria!");
        }
    });
}

function showDialog(id, name) {
    categoryId = id;
    $("#txtCategory").val(name);
    dialog.dialog("option", "title", name).dialog("open");
}

function editCategory() {
    $.post('/api/categories/edit', { id: categoryId, name: $("#txtCategory").val() }, function() {
        dialog.dialog("close");
        _loadCategories();
    });
}