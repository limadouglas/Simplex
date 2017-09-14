(function($) {

    var numLinhas = 4,
        numColunas = 7,
        numX = 2,
        numF = 3;

    var btnRemover = '<img src="imagens/ios-close.svg" class="float-left collapse" alt="excluir" onclick="remover(this);">';
    var btnAdicionar = '<img src="imagens/ios-plus.svg" class="float-right collapse" alt="adicionar" onclick="adicionar(this);">';


    adicionar = function(obj) {

        var cols = "";
        if ($(obj).parent().text().match(/X/) == 'X') {
            cols = '<th class="indice-topo">' + btnRemover + ('X' + (++numX)) + btnAdicionar + '</th>';
            numX++;
        } else {
            setLinha();
            cols = '<th class="indice-topo">' + btnRemover + ('F' + (++numF)) + btnAdicionar + '</th>';
            numF++;
        }

        var c = $(cols).insertAfter($(obj).parent());

        var indice = c.index() - 1;

        setColuna(indice);

        organizarTabela();
    }

    function setColuna(indice) {
        for (var i = 0; i < numLinhas; i++) {
            var cols = '<td><input type="text" value="0"></td>';
            var tr = $('#tabela-simplex tbody tr').eq(i);
            $(cols).insertAfter(tr.find('td').eq(indice));
        }
        numColunas++;
    }

    // inserindo nova linha na tabela
    function setLinha() {
        var linha = '<tr>';
        var cols = '<td class="indice">' + (numLinhas++ + 'ª') + '</td>';
        cols += '<td class="indice">' + ('F' + (numF + 1)) + '</td>';


        for (var i = 0; i < numColunas - 2; i++) {
            cols += '<td><input type="text" value="0"></td>';
        }
        cols += '<td class="indice"><input type="text" value="0"></td>';
        linha += cols + '</tr>';

        $(linha).insertAfter($('#tabela-simplex tbody tr').eq(numLinhas - 3));
    }


    // retorna um vetor com os valores da linha
    function getLinha(linha) {
        var tr = $('#tabela-simplex tbody tr').eq(linha);
        var vetor = [];

        for (var i = 0; i < numColunas - 1; i++) {
            vetor[i] = parseFloat(tr.find('input').eq(i).val());
        }

        return vetor;
    }


    // retorna um vetor  com os valores da coluna
    function getColuna(coluna) {
        var vetor = [];
        for (var i = 0; i < numLinhas; i++) {
            vetor[i] = parseFloat($('#tabela-simplex tbody tr').eq(i).find('input').eq(coluna).val());
        }

        return vetor;
    }


    function organizarTabela() {

        var tr = $('#tabela-simplex thead tr').eq(0);

        // organizando cabeçalho
        for (var i = 2; i < numColunas; i++) {
            if (tr.find('th').eq(i).text().match(/X/) == 'X') {
                tr.find('th').eq(i).html(btnRemover + ('X' + (i - 1)) + btnAdicionar);
            } else {
                for (var j = i; j < numColunas; j++) {
                    tr.find('th').eq(j).html(btnRemover + ('F' + ((j + 1) - i)) + btnAdicionar);
                }
                break;
            }
        }

        var vetor = [];

        // organizando indice numero de linhas.
        for (var i = 0; i < numF; i++) {
            vetor[i] = (i + 1) + 'ª';
        }
        atualizarColuna(vetor, 0);

        vetor = [];
        // organizando indice numero de linhas.
        for (var i = 0; i < numF; i++) {
            vetor[i] = 'F' + (i + 1);
        }
        atualizarColuna(vetor, 1);


    }

    function atualizarLinha(vetor, indice) {

    }

    function atualizarColuna(vetor, indice) {

    }

    // remover coluna
    remover = function(obj) {
        var indice = $(obj).closest('th').index();

        if (($(obj).parent().text().match(/X/) == 'X') && numX > 1) {
            removerColuna(indice);
            numX--;
        } else if (($(obj).parent().text().match(/F/) == 'F') && numF > 1) {
            removerColuna(indice);
            removerLinha(indice - (numX + 2));
            numF--;
        }

        organizarTabela();
    }

    function removerLinha(indice) {
        var tr = $('#tabela-simplex tbody tr').eq(indice); // pegando linha da tabela cabeçalho
        tr.remove();
        numLinhas--;
    }

    function removerColuna(indice) {

        var tr = $('#tabela-simplex thead tr').eq(0); // pegando linha da tabela cabeçalho
        tr.find('th').eq(indice).remove(); // excluindo celula da linha referente a tabela.

        for (var i = 0; i < numLinhas; i++) {
            var tr = $('#tabela-simplex tbody tr').eq(i); // pegando linha da tabela corpo
            tr.find('td').eq(indice).remove(); // excluindo celula da linha referente a tabela.
        }

        numColunas--;
    }


    simplex = function() {

    }


})(jQuery);