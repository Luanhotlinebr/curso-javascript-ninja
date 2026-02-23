(function (win, doc) {
  /*
  No HTML:
  - Crie um formulário com um input de texto que receberá um CEP e um botão
  de submit;
  - Crie uma estrutura HTML para receber informações de endereço:
  "Logradouro, Bairro, Estado, Cidade e CEP." Essas informações serão
  preenchidas com os dados da requisição feita no JS.
  - Crie uma área que receberá mensagens com o status da requisição:
  "Carregando, sucesso ou erro."

  No JS:
  - O CEP pode ser entrado pelo usuário com qualquer tipo de caractere, mas
  deve ser limpo e enviado somente os números para a requisição abaixo;
  - Ao submeter esse formulário, deve ser feito um request Ajax para a URL:
  "https://viacep.com.br/ws/[cep]/json/", onde [CEP] será o CEP passado
  no input criado no HTML;
  - Essa requisição trará dados de um CEP em JSON. Preencha campos na tela
  com os dados recebidos.
  - Enquanto os dados são buscados, na área de mensagens de status, deve mostrar
  a mensagem: "Buscando informações para o CEP [CEP]..."
  - Se não houver dados para o CEP entrado, mostrar a mensagem:
  "Não encontramos o endereço para o CEP [CEP]."
  - Se houver endereço para o CEP digitado, mostre a mensagem:
  "Endereço referente ao CEP [CEP]:"
  - Utilize a lib DOM criada anteriormente para facilitar a manipulação e
  adicionar as informações em tela.
  */

  /*
   * 0 - Antes de abrir conexão
   * 1 - Conexão aberta
   * 2 - Headers
   * 3 - Request body
   * 4 - Concluído
   */

  ("use strict");
  function app() {
    var ajax = new XMLHttpRequest();
    var $formCep = new DOM('[data-js="form-cep"]');
    var $inputCep = new DOM('[data-js="input-cep"]');
    var $cep = new DOM('[data-js="cep"]');
    var $bairro = new DOM('[data-js="bairro"]');
    var $estado = new DOM('[data-js="estado"]');
    var $cidade = new DOM('[data-js="cidade"]');
    var $logradouro = new DOM('[data-js="logradouro"]');
    var $status = new DOM('[data-js=" status"]');
    $formCep.on("submit", handleSubmitFormCep, false);

    function handleSubmitFormCep(event) {
      event.preventDefault();
      console.log($inputCep.get()[0].value);
      var url = getUrl();
      ajax.open("GET", url);
      ajax.send();
      getMessage("loading");
      ajax.addEventListener("readystatechange", handleReadyStateChange);
    }

    function handleReadyStateChange() {
      if (isRequestOk) {
        getMessage("ok");
        fillCepFields();
      }
      console.log("Carregando...");
    }

    function fillCepFields() {
      var data = parseData();
      console.log(data);
      if (!data) {
        getMessage("error");
        data = clearData();
      }

      $cep.get()[0].textContent = data.cep;
      $bairro.get()[0].textContent = data.bairro;
      $estado.get()[0].textContent = data.estado;
      $cidade.get()[0].textContent = data.localidade;
      $logradouro.get()[0].textContent = data.logradouro;
    }

    function parseData() {
      var result;
      try {
        result = JSON.parse(ajax.responseText);
      } catch (e) {
        result = null;
      }
      return result;
    }

    function isRequestOk() {
      return ajax.readyState === 4 && ajax.status === 200;
    }

    function getUrl() {
      return "https://viacep.com.br/ws/[CEP]/json/".replace(
        "[CEP]",
        clearCEP(),
      );
    }

    function clearCEP() {
      return $inputCep.get()[0].value.replace(/\D/g, "");
    }

    function replaceCEP(message) {
      var cep = clearCEP();
      return message.replace("[CEP]", cep);
    }

    function getMessage(type) {
      var messages = {
        loading: replaceCEP("Buscando informações para o CEP [CEP]..."),
        ok: replaceCEP("Endereço referente ao CEP :[CEP]"),
        error: replaceCEP("Não encontramos o endereço para o CEP [CEP]."),
      };

      $status.get()[0].textContent = messages[type];
    }

    function clearData() {
      return {
        cep: "-",
        bairro: "-",
        estado: "-",
        localidade: "-",
        logradouro: "-",
      };
    }
  }
  app();
  // handle = manipular
})(window.DOM, document);
