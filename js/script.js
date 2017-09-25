(function($) {

    var numLinhas = 4,
        numColunas = 7,
        numX = 2,
        numF = 3;
    var estados = [];
    var estadoAtual = 0;
    var jaCalculado = false;

    var btnRemover = '<img src="imagens/ios-close.svg" class="float-left collapse" alt="excluir" onclick="remover(this);">';
    var btnAdicionar = '<img src="imagens/ios-plus.svg" class="float-right collapse" alt="adicionar" onclick="adicionar(this);">';


    adicionar = function(obj) {

        var cols = "";
        if ($(obj).parent().text().match(/X/) == 'X') {
            cols = '<th class="indice-topo">' + btnRemover + ('X' + (++numX)) + btnAdicionar + '</th>';
        } else {
            setLinha();
            cols = '<th class="indice-topo">' + btnRemover + ('F' + (++numF)) + btnAdicionar + '</th>';
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


    function setCelula(linha, coluna, valor) {

        if (linha > 0 && coluna > 1) {
            $('#tabela-simplex tbody tr').eq(linha - 1).find('input').eq(coluna - 2).val(String(valor));
        } else if (linha == 0) {
            $('#tabela-simplex thead tr').eq(0).find('th').eq(coluna).text(String(valor));
        } else {
            $('#tabela-simplex tbody tr').eq(linha - 1).find('td').eq(coluna).text(String(valor));
        }

    }


    // retorna um vetor com os valores da linha
    function getLinha(linha) {

        var vetor = [];
        var tr;

        if (linha > 0) {
            tr = $('#tabela-simplex tbody tr').eq(--linha);

            vetor[0] = tr.find('td').eq(0).text();
            vetor[1] = tr.find('td').eq(1).text();
            for (var i = 0; i < numColunas - 1; i++) {
                vetor[i + 2] = parseFloat(tr.find('input').eq(i).val());
            }
        } else {
            var tr = $('#tabela-simplex thead tr').eq(linha);

            for (var i = 0; i <= numColunas; i++) {
                vetor[i] = tr.find('th').eq(i).text();
            }
        }

        return vetor;
    }


    // retorna um vetor  com os valores da coluna
    function getColuna(coluna) {
        var vetor = [];
        vetor[0] = $('#tabela-simplex thead tr').eq(0).find('th').eq(coluna).text();

        for (var i = 1; i <= numLinhas; i++) {
            if (coluna > 1) {
                vetor[i] = parseFloat($('#tabela-simplex tbody tr').eq(i - 1).find('input').eq(coluna - 2).val());
            } else {
                vetor[i] = parseFloat($('#tabela-simplex tbody tr').eq(i - 1).find('td').eq(coluna).text());
            }
        }

        return vetor;
    }



    function getCelula(linha, coluna) {
        if (linha > 0 && coluna > 1) {
            return parseFloat($('#tabela-simplex tbody tr').eq(linha - 1).find('input').eq(coluna - 2).val());
        } else if (linha == 0) {
            return $('#tabela-simplex thead tr').eq(0).find('th').eq(coluna).text();
        } else {
            return $('#tabela-simplex tbody tr').eq(linha - 1).find('td').eq(coluna).text();
        }
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

    function atualizarLinha(vetor, linha) {
        var tr;
        var cabecalho = false;

        if (linha == 0) {
            tr = $('#tabela-simplex thead tr').eq(0).find('th');
            cabecalho = true;
        } else { //if (linha <= numLinhas) 
            tr = $('#tabela-simplex tbody tr').eq(linha - 1).find('td');
        }
        //else {
        //  tr = $('#tabela-simplex tfooter tr').eq(0).find('td');
        // }

        for (var i = 0; i < vetor.length; i++) {
            if (cabecalho) {
                tr.eq(i).text(String(vetor[i]));
            } else if (i < 2) {
                tr.eq(i).text(String(vetor[i]));
            } else {
                tr.eq(i).find('input').eq(0).val(String(vetor[i])); //.toFixed(3)
            }
        }
    }

    function atualizarColuna(vetor, coluna) {

        for (var i = 0; i < vetor.length; i++) {
            var tr = $('#tabela-simplex tbody tr').eq(i);
            tr.find('td').eq(coluna).text(String(vetor[i]));
        }

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


    //------------------------------------------------------------------------------------------------------------------------------------------------

    // função principal.
    simplex = function() {
        var pivoColuna;
        var pivoLinha;
        var valDivisao;

        jaCalculado = true;
        salvarEstado();

        while (true) {

            pivoColuna = Znegativo();

            if (pivoColuna != -1) {
                pivoLinha = menorDivisao(pivoColuna);

                // atualizando indice: atualizando valor da coluna de indice, substituindo Fn por Xn.
                setCelula(pivoLinha, 1, getCelula(0, pivoColuna));
                salvarEstado();

                valDivisao = getCelula(pivoLinha, pivoColuna);

                linhaDivPivo(pivoLinha, valDivisao);

                zerandoColuna(pivoLinha, pivoColuna);
            } else {
                break;
            }

        }

    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------

    // parte 1, verificando se a linha Z contém um valor negativo e retornando o seu indice.
    function Znegativo() {
        var vetor = getLinha(numLinhas);
        var menor = vetor[2];
        var indice = 2;

        for (var i = 3; i < numColunas + 1; i++) {
            if (menor > vetor[i]) {
                menor = vetor[i];
                indice = i;
            }
        }

        if (menor < 0) {
            return indice;
        } else {
            return -1;
        }
    }


    // parte 2, dividindo a coluna do menor valor negativo pela coluna B e retornando o indice.
    function menorDivisao(indice) {

        var col = getColuna(indice);
        var colB = getColuna(numColunas);
        var colAux = [];

        var menor;
        var indice = 0;

        for (var i = 1; i < col.length - 1; i++) {
            if (col[i] != 0) {

                colAux[i - 1] = (colB[i] / col[i]);

                if (menor == null) {
                    menor = colAux[i - 1];
                    indice = i;
                } else if (menor > colAux[i - 1]) {
                    menor = colAux[i - 1];
                    indice = i;
                }
            }
        }

        if (menor == null) {
            return -1;
        } else {
            return parseInt(indice);
        }

    }


    // parte 3, dividindo linha pelo valor definido no pivo
    function linhaDivPivo(linha, valor) {

        // a linha é dividida apenas se o valor for diferente de 0.
        if (valor != 0) {
            var vetor = getLinha(linha);

            for (var i = 2; i < vetor.length; i++) {
                vetor[i] /= valor;
            }
            atualizarLinha(vetor, linha);
            salvarEstado();
        }

    }


    // parte 4, zerando celulas superiores e inferiores e deixando apenas o valor da linha selecinada.
    function zerandoColuna(linha, coluna) {
        var vetor;
        var vetorAtual;
        var vetorAux;
        vetorAtual = getLinha(linha);
        vetorAux = vetorAtual;

        for (var i = 1; i <= numLinhas; i++) {

            vetor = getLinha(i);
            pivo = getCelula(i, coluna);
            vetorAtual = getLinha(linha);

            // verificação para não calcular a linha atual do pivo.
            if ((linha != i) && (pivo != 0)) {

                for (var j = 2; j < vetor.length; j++) {
                    vetorAtual[j] = parseFloat(vetorAtual[j] * -pivo);
                }

                atualizarLinha(vetorAtual, linha);
                salvarEstado();

                if ((vetorAtual[coluna] + pivo) != 0) {
                    for (var k = 2; k < vetor.length; k++) {
                        vetor[k] = parseFloat(vetor[k]) * vetorAtual[coluna];
                    }
                    atualizarLinha(vetor, i);
                    salvarEstado();
                }

                for (var l = 2; l < vetor.length; l++) {
                    vetor[l] = vetorAtual[l] + vetor[l];
                }

                atualizarLinha(vetor, i);
                atualizarLinha(vetorAux, linha);
                salvarEstado();
            }
        }
    }


    // salvando todos os passos, para que seja possivel ver o funcionamento por partes.
    function salvarEstado() {
        var estadoAux = [];
        for (var i = 0; i <= numLinhas; i++) {
            estadoAux[i] = getLinha(i);
        }

        estados[estados.length] = estadoAux;
        estadoAtual = estados.length;
    }




    proximo = function() {
        if (!jaCalculado) {
            simplex();
            estadoAtual = 0;
            proximo();
        } else if (estadoAtual < estados.length - 1) {
            estadoAtual++;
            for (var i = 0; i <= numLinhas; i++) {
                atualizarLinha(estados[estadoAtual][i], i);
            }
        }
    }

    anterior = function() {
        if (!jaCalculado) {
            anterior();
            estadoAtual = 0;
            anterior();
        } else if (estadoAtual > 0) {
            estadoAtual--;
            for (var i = 0; i <= numLinhas; i++) {
                atualizarLinha(estados[estadoAtual][i], i);
            }
        }
    }


    $('input').on('input', function() {
        jaCalculado = false;
    });



})(jQuery);