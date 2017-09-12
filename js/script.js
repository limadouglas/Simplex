(function($) {
    var numLinhas = 4;
    var numColunas = 7;
    var numX = 2,
        numF = 3
    var numX = 2;

    adicionar = function(obj) {

        var cols = "";
        if ($(obj).parent().text().match(/X/) == 'X') {
            cols = '<th class="indice-topo"><img src="imagens/ios-close.svg" class="float-left collapse" alt="excluir" onclick="remover(this);">' + 'X' + (++numX) + '<img src="imagens/ios-plus.svg" class="float-right collapse" alt="adicionar" onclick="adicionar(this);"></th>';
        } else {
            cols = '<th class="indice-topo"><img src="imagens/ios-close.svg" class="float-left collapse" alt="excluir" onclick="remover(this);">' + 'F' + (++numF) + '<img src="imagens/ios-plus.svg" class="float-right collapse" alt="adicionar" onclick="adicionar(this);"></th>';
        }

        var c = $(cols).insertAfter($(obj).parent());

        var indice = c.index() - 1;

        for (var i = 0; i < numLinhas; i++) {
            cols = '<td><input type="text" value="0"></td>';
            var tr = $('#tabela-simplex tbody tr').eq(i);
            $(cols).insertAfter(tr.find('td').eq(indice));
        }

        organizarTabela();
    }

    function organizarTabela() {

        var tr = $('#tabela-simplex thead tr').eq(0);

        for (var i = 1; i < numColunas - 1; i++) {
            if (tr.find('th').eq(i).text().match(/X/) == 'X') {
                tr.find('th').eq(i).text('X' + i);
            } else {
                for (var j = i; j < numColunas; j++) {
                    tr.find('th').eq(j).text('F' + (j - (i - 1)));
                }
                return;
            }
        }
    }



    remover = function() {
        alert('remover');
    }

})(jQuery);