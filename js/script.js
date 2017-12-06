(function($) {

    var numLinhas = 4,
        numColunas = 8,
        numX = 2,
        numF = 3;
    var estados = [];
    var estadoAtual = 0;
    var jaCalculado = false;
    var indiceEstadosFinais = [];
    var vetorBInicial=[];

    var btnRemover = '<img src="imagens/ios-close.svg" class="float-left collapse" alt="excluir" onclick="remover(this);">';
    var btnAdicionar = '<img src="imagens/ios-plus.svg" class="float-right collapse" alt="adicionar" onclick="adicionar(this);">';

    var opMaximizar = true;


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

        console.log("Numero de X: " + numX);
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

        for (var i = 0; i < numColunas - 3; i++) {
            cols += '<td><input type="text" value="0"></td>';
        }
        cols += '<td><div class="btn-group" role="group" aria-label="Button group with nested dropdown"><div class="btn-group" role="group"><button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">=</button><div class="dropdown-menu" aria-labelledby="sinal"><a class="dropdown-item" href="#" onclick="alterarSinal(this);"> <= </a><a class="dropdown-item" href="#" onclick="alterarSinal(this);"> >= </a></div></div></div></td>';
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
            for (var i = 2; i < numColunas; i++) {
                vetor[i] = parseFloat(tr.find('input').eq(i - 2).val());
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
                for (var j = i; j < numColunas - 1; j++) {
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
        var colSinal = '<td><div class="btn-group" role="group" aria-label="Button group with nested dropdown"><div class="btn-group" role="group"><button id="sinal" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">=</button><div class="dropdown-menu" aria-labelledby="sinal"><a class="dropdown-item" href="#" onclick="alterarSinal(this);"> <= </a><a class="dropdown-item" href="#" onclick="alterarSinal(this);"> >= </a></div></div></div></td>';


        if (linha == 0) {
            tr = $('#tabela-simplex thead tr').eq(0).find('th');
            cabecalho = true;
        } else { //if (linha <= numLinhas) 
            tr = $('#tabela-simplex tbody tr').eq(linha - 1).find('td');
        }


        for (var i = 0; i < vetor.length; i++) {
            if (cabecalho) {
                tr.eq(i).text(String(vetor[i]));
            } else if (i < 2) {
                tr.eq(i).text(String(vetor[i]));
            } else {
                if (i == (vetor.length - 1))
                    tr.eq(i + 1).find('input').eq(0).val(String(vetor[i]));
                else
                    tr.eq(i).find('input').eq(0).val(String(vetor[i]));
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


    // ------------------------------------------------------------------------------------------------------------------------------------------------

    // função principal.
    calcular = function() {

        if (opMaximizar) {
            inverterSinalLinha(numLinhas);
        }

        vetorBInicial = getColuna(numColunas-1);

        simplex();

        resultado();
    }

    function resultado() {
        var tabela = $("#tbl-resultados tbody");
        var variavel;
        var resultado;
        var cols = "";
        for (var i = 0; i < indiceEstadosFinais.length; i++) {
            for (var j = 0; j < numColunas; j++) {
                variavel = (estados[indiceEstadosFinais[i]][j][1]).val();
                resultado = (estados[indiceEstadosFinais[i]][j][numColunas]).val();
                cols += "<tr><td>" + variavel + "</td><td>" + resultado + "</td></tr>";
            }
        }

        tabela.append(cols);
        $('#resultadoModal').modal("show");
    }


    function simplex() {
        var pivoColuna;
        var pivoLinha;
        var valDivisao;
        var numIteracoes = 0;

        jaCalculado = true;
        salvarEstado();

        while (true) {

            pivoColuna = Znegativo();

            if (verificarIlimitado(pivoColuna) || numIteracoes++ > 2000) {
                criarRelatorio("Soluções Ilimitadas");
                break;
            } else if (verificarMultiplosResultados()) {
                criarRelatorio("Multiplos Resultados");
                break;
            } else if (pivoColuna != -1) {
                pivoLinha = menorDivisao(pivoColuna);

                // atualizando indice: atualizando valor da coluna de indice, substituindo Fn por Xn.
                setCelula(pivoLinha, 1, getCelula(0, pivoColuna));
                salvarEstado();

                valDivisao = getCelula(pivoLinha, pivoColuna);

                linhaDivPivo(pivoLinha, valDivisao);

                zerandoColuna(pivoLinha, pivoColuna);
                indiceEstadosFinais[estadoAtual];
            } else {
                analiseSensibilidade();
                criarRelatorio("Solução Ótima");
                break;
            }

        }
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------

    // negando ultima linha método maximizar
    function inverterSinalLinha(linha) {

        var vetor = getLinha(linha);
        vetor[1] = "-Z";

        for (var i = 2; i < vetor.length; i++) {
            vetor[i] = vetor[i] * -1;
        }
        console.log(vetor);
        atualizarLinha(vetor, numLinhas);
    }

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
        var colB = getColuna(numColunas - 1);
        var colAux = [];

        var menor;
        var indice = 0;

        for (var i = 1; i < col.length - 1; i++) {
            if (col[i] != 0) {

                colAux[i - 1] = (parseInt(colB[i]) / parseInt(col[i]));
                // console.log("menor: "+ colAux[i-1]);
                if (menor == null) {
                    menor = colAux[i - 1];
                    indice = i;
                } else if (menor > colAux[i - 1]) {

                    menor = colAux[i - 1];
                    indice = i;
                    // console.log("menor: " + menor + " indice: " + indice);
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

    function analiseSensibilidade() {
        var vetorBFinal = getColuna(numColunas-1);
        var menor = null, maior = null, aux;
        var vetorF = [];
        var sombraZero = false;

        console.log("VetorBFinal" + JSON.stringify(vetorBFinal));
        console.log("VetorBInicial" + JSON.stringify(vetorBInicial));


        for(var i = 1; i <= numF; i++){

            vetorF = getColuna(numX + 1 + i);
            console.log("VetorF" + JSON.stringify(vetorF));

            sombraZero = getCelula(numLinhas, (numX + 1 + i));

            if(sombraZero === 0){
                maior = vetorBInicial[i];
            }


            for(var j = 1; j < numLinhas; j++){
                if(vetorF[j] !== 0) {
                    aux = ((-vetorBFinal[j]) / vetorF[j]) + vetorBInicial[i];
                    if(menor > aux || menor == null){
                        menor = aux;
                        console.log(i+"MENOR --" + "menor: " + menor + " | maior: " + maior);
                    }
                    if(sombraZero !== 0){
                        if(maior < aux || maior == null){
                            maior = aux;
                            console.log(i+"MAIOR -- " + "menor: " + menor + " | maior: " + maior);
                        }
                    }
                }
            }

            console.log("sombra: "+sombraZero+" | menor: " + menor + " | maior: " + maior);
            var cols = "<tr>"+"<td>"+("F"+i)+"</td>";
            cols += "<td>"+sombraZero+"</td>";
            cols += "<td>"+menor+"</td>";
            cols += "<td>"+maior+"</td>";
            cols += "<td>"+vetorBInicial[i]+"</td>";
//.
            $('#tabela-sensibilidade tbody').append(cols);

            menor = null;
            maior = null;
        }

    }

    // parte 6, criação de relatorio com variaveis basicas e não basicas.
    function criarRelatorio(resultado) {
        var vetor = [];
        var vetorNaoBasica = [];
        var vetorBasica = [];
        var naoBasica = false;

        for (var i = 2; i < numColunas - 1; i++) {

            vetor = getColuna(i);

            // verificando se variavel é não basica.
            for (var j = 1; j < numLinhas - 1; j++) {

                if (vetor[j] != 1 && vetor[j] != 0) {
                    naoBasica = true;
                    vetorNaoBasica[vetorNaoBasica.length] = vetor[0] + (" = " + 0);
                }

            }

            // verificando se a variavel é basica
            if (!naoBasica) {
                for (var j = 1; j < numLinhas - 1; j++) {
                    if (vetor[j] == 1) {
                        var aux = (getCelula(j, numColunas - 1)).toString();
                        vetorBasica[vetorBasica.length] = vetor[0] + (" = " + aux);
                        naoBasica = false;
                    }
                }
            }
        }

        z = getCelula(numLinhas, numColunas - 1);

        $("#exampleModalLabel").append(": <b>" + resultado + "</b>");

        var cols = "<tr><td>Básicas</td>";

        for (var j = 0; j < vetorBasica.length; j++) {
            cols += "<td>" + vetorBasica[j] + "</td>";
        }
        cols += "</tr>"
        $("#tbl-resultados tbody").append(cols);

        cols = "<tr><td>Não Básicas</td>";

        for (var j = 0; j < vetorNaoBasica.length; j++) {
            cols += "<td>" + vetorNaoBasica[j] + "</td>";
        }
        cols += "</tr>";

        $("#tbl-resultados tbody").append(cols);


        cols = "<tr><td>Valor de Z</td><td>" + z + "</td></tr>";


        $("#tbl-resultados tbody").append(cols);

        console.log("Variavel Não Basica : " + vetorNaoBasica);
        console.log("Variavel Basica     : " + vetorBasica);
        console.log("valor de Z: " + z);
    }

    // verificar ilimitado, se todos os valores da coluna forem negativos é porque ele é ilimitado
    function verificarIlimitado(indice) {

        var vetor = getColuna(indice);

        if (vetor[0] == "B") {
            return false;
        }

        for (var i = 1; i < vetor.length; i++) {
            if (vetor[i] >= 0) {
                return false;
            }
        }

        return true;
    }

    // comparar a ultima solução encontrada com a atual se forem diferentes é porque contém multiplas soluções. 
    function verificarMultiplosResultados() {
        if (indiceEstadosFinais.length <= 1) {
            if (JSON.stringify(estados[0]) == JSON.stringify(estados[1])) {
                return true;
            }
        }

        return false;
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


    // ir para o proximo estado
    proximo = function() {
        if (!jaCalculado) {
            calcular();
            estadoAtual = 0;
            proximo();
        } else if (estadoAtual < estados.length - 1) {
            estadoAtual++;
            for (var i = 0; i <= numLinhas; i++) {
                atualizarLinha(estados[estadoAtual][i], i);
            }
        }
    }


    // ir para o estado anterior
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


    // função chamada quando tem alteração em algum valor da tabela, jaCalculado vai pra falso e isso signifca que é necessario calcular novamente.
    $('input').on('input', function() {
        jaCalculado = false;
    });


    // alterando entre operação de maximizar e minimizar(vice e versa).
    operacao = function() {
        jaCalculado = false;
        var operacao = $('#opSecundaria').text();

        if (operacao == "Maximizar") {
            $('#opPrincipal').text("Maximizar");
            $('#opSecundaria').text("Minimizar");
            opMaximizar = true;
        } else if (operacao == "Minimizar") {
            $('#opPrincipal').text("Minimizar");
            $('#opSecundaria').text("Maximizar");
            opMaximizar = false;
        } else {
            alert("não reconhecido");
        }

    }


    // limpando tudo, preenchendo todos os campos da tabela com 0.
    limpar = function() {
        var linha = [];
        for (var i = 1; i < numLinhas + 1; i++) {
            linha = getLinha(i);
            for (var j = 2; j < numColunas + 1; j++) {
                linha[j] = 0;
            }
            atualizarLinha(linha, i);
        }
    }


    alterarSinal = function(op) {
        var auxSinal = $(op).parent().parent().find("button");
        var sinalAtual = auxSinal.text();
        auxSinal.text($(op).text());
        $(op).text(sinalAtual);


        // alterando sinal da celula.
        var indiceCelula = parseInt($(op).closest("tr").index());
        var valCelula = getCelula(indiceCelula + 1, (indiceCelula + (numX + 2)));

        if (auxSinal.text() == " <= ") {
            if (valCelula != 0) {
                valCelula = Math.abs(valCelula);
            } else {
                valCelula = 1;
            }
        } else if (auxSinal.text() == " >= ") {
            if (valCelula != 0) {
                valCelula = Math.abs(valCelula) * -1;
            } else {
                valCelula = -1;
            }
        } else if (auxSinal.text() == " = ") {
            valCelula = 0;
        }

        setCelula(indiceCelula + 1, (indiceCelula + (numX + 2)), valCelula);

        //console.log("indiceCelula: " + indiceCelula, "valCelula: " + valCelula);
    }

})(jQuery);