class Funcionario{
    constructor(nome, telefone, email, cargo, salario){
        this.nome = nome,
        this.telefone = telefone,
        this.email = email,
        this.cargo = cargo,
        this.salario = salario
    }
    // verifica se os campos estão preenchidos
    validaDados(){
        for(let i in this){
            if (this[i] == undefined || this[i] == '' || this[i] == null || this[i] == NaN) {
                return false;
            }else{

            }
        }
        return true
    }
}

class BancoDados{
    constructor(){
        let id = localStorage.getItem('id');
        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId(){
        let id = localStorage.getItem('id');
        let proximo_id = parseInt(id) + 1;
        return parseInt(proximo_id);
    }
    gravar(d){
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id)

    }

    recuperaFuncionarios(){
        let lista_funcionarios = [];
        let id = localStorage.getItem('id');

        // recupera todos os funcionarios cadastrados em localStorage
        for(let i = 1; i <= id; i++){
            let funcionario = JSON.parse(localStorage.getItem(i));

            // verifica se há itens removidos, se sim, não adiciona na lista_funcionarios
            if(funcionario === null){
                continue;
            }

            // cria o atributo 'id' e atribui a ele o valor de i
            funcionario.id = i;
            lista_funcionarios.push(funcionario);
        }
        return lista_funcionarios;
    }

    filtrar(funcionario){
        // essa variavel recebe os funcionarios pelo metodo já criado "recuperaFuncionarios()"
        let funcionarios_filtrados = this.recuperaFuncionarios()

        // filtro de nome
        if(funcionario.nome != ''){
            funcionarios_filtrados = funcionarios_filtrados.filter(indice => indice.nome == funcionario.nome)
        }
        if(funcionario.telefone != ''){
            funcionarios_filtrados = funcionarios_filtrados.filter(indice => indice.telefone == funcionario.telefone)
        }
        if(funcionario.email != ''){
            funcionarios_filtrados = funcionarios_filtrados.filter(indice => indice.email == funcionario.email)
        }
        if(funcionario.cargo != ''){
            funcionarios_filtrados = funcionarios_filtrados.filter(indice => indice.cargo == funcionario.cargo)
        }
        if(funcionario.salario != ''){
            funcionarios_filtrados = funcionarios_filtrados.filter(indice => indice.salario == funcionario.salario)
        }

        return funcionarios_filtrados
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let banco_dados = new BancoDados();


function cadastrarFuncionario(){
    let nome = document.getElementById('nome').value;
    let telefone = document.getElementById('telefone').value;
    let email = document.getElementById('email').value;
    let cargo = document.getElementById('cargo').value;
    let salario = document.getElementById('salario').value;

    let funcionario = new Funcionario(nome, telefone, email, cargo, salario);


    if (funcionario.validaDados() === true) {
        banco_dados.gravar(funcionario)
        console.log(funcionario);
        mostraModal('Registro Salvo!', '2px solid #3c83ec', "s_color_btn_modal", true)
    }else{
        mostraModal('Existem campos obrigatorios vazios!', '2px solid #d45252', "e_color_btn_modal", false)
    }

}

let modal = document.getElementById("gravacao");
let modal_content = document.getElementById('modal_content');
let msg = document.getElementById('msg');
let span = document.getElementsByClassName("close")[0];


function mostraModal(msg_modal, borda_modal, cor_btn_modal, recarregar){
    modal.style.display = "block";
    msg.innerText = msg_modal;
    modal_content.style.border = borda_modal;
    span.classList.add(cor_btn_modal);
    fechaModal(recarregar)
}

function fechaModal(recarregar){
    span.onclick = function() {
        modal.style.display = "none";
        if (recarregar === true) {
            document.location.reload()
        }
    }

    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        if (recarregar === true) {
            document.location.reload()
        }
        }
    }
}

function exibeListaFuncionarios(){
    lista_funcionarios = banco_dados.recuperaFuncionarios();

    // seleciona o item tbody da tabela
    let lista_funcionarios_tb = document.getElementById('lista_funcionarios_tb');

    // limpa os campos do tbody
    lista_funcionarios_tb.innerHTML = ''

    // percorre lista_funcionarios, listando todos os itens
    lista_funcionarios.forEach(function(d){

        let linha = lista_funcionarios_tb.insertRow()

        linha.insertCell(0).innerHTML = d.nome
        switch(d.cargo){
            case '1':
                d.cargo = 'Programador'
                break
            case '2':
                d.cargo = 'Analista de Sistemas'
                break
            case '3':
                d.cargo = 'UX/UI Designer'
                break
            case '4':
                d.cargo = 'Gerente de Projetos'
                break
        }
        linha.insertCell(1).innerHTML = d.cargo
        linha.insertCell(2).innerHTML = `R$: ${d.salario}`

        let botao = document.createElement('button')
        linha.insertCell(3).append(botao)
        botao.className = 'btn_excluir'
        botao.innerText = 'X'
        botao.id = d.id
        botao.onclick = function(){
            let id = this.id
            banco_dados.remover(id)
            pesquisarFuncionarios()
        }
    })

}

// funcção acionada ao clica no botão "filtrar"
function pesquisarFuncionarios(){
    let nome = document.getElementById('nome_filtro').value;
    let cargo = document.getElementById('cargo_filtro').value;
    let salario = document.getElementById('salario_filtro').value;

    // essa variavel não é usada, mas é preciso cria-la para não dá erro
    let telefone = document.getElementById('telefone').value;
    let email = document.getElementById('email').value;

    // essa função não usa todos esses parametros, mas é preciso passar, pois o construtor exige.
    let funcionario = new Funcionario(nome, telefone, email, cargo, salario)

    lista_funcionarios = banco_dados.filtrar(funcionario);

    // seleciona o item tbody da tabela
    let lista_funcionarios_tb = document.getElementById('lista_funcionarios_tb');

    // limpa os campos do tbody
    lista_funcionarios_tb.innerHTML = ''

    // percorre lista_funcionarios, listando todos os itens
    lista_funcionarios.forEach(function(d){

        let linha = lista_funcionarios_tb.insertRow()

        linha.insertCell(0).innerHTML = d.nome
        switch(d.cargo){
            case '1':
                d.cargo = 'Programador'
                break
            case '2':
                d.cargo = 'Analista de Sistemas'
                break
            case '3':
                d.cargo = 'UX/UI Designer'
                break
            case '4':
                d.cargo = 'Gerente de Projetos'
                break
        }
        linha.insertCell(1).innerHTML = d.cargo
        linha.insertCell(2).innerHTML = `R$: ${d.salario}`

        let botao = document.createElement('button')
        linha.insertCell(3).append(botao)
        botao.className = 'btn_excluir'
        botao.innerText = 'X'
        botao.id = d.id
        botao.onclick = function(){
            let id = this.id
            banco_dados.remover(id)
            pesquisarFuncionarios()
        }
    })

}
function exibeFiltro(){
    let filtro = document.getElementById('container_filtro')
    let msg_btn_filtro = document.getElementById('btn_exibir_filtro')
    let filtroCs = window.getComputedStyle(container_filtro)
    if (filtroCs.display == 'none'){
        filtro.style.display = 'block'
        msg_btn_filtro.innerText = 'Esconder Filtros'
    }
    else{
        filtro.style.display = 'none'
        msg_btn_filtro.innerText = 'Exibir Filtros'
    }
}