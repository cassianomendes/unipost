$("#form-login").submit(function(e) {
    e.preventDefault();
    $.post("/authenticate", $(this).serialize(), function(data) {
        console.log(data);
        // if (data == '1') {
        //     loadData();
        // } else {
        //     alert('Erro ao salvar item.')
        // }
        // dialog.dialog('close');
    });
});