// Função para obter a localização do usuário
function obterLocalizacao() {
    console.log('Obtendo localização...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Captura a data e hora atual
        const dataAtual = new Date();
        const data = formatarDataParaBanco(dataAtual);
        const hora = dataAtual.toLocaleTimeString('pt-BR');
        console.log('Localização:', lat, lon);
        console.log('Data:', data);
        console.log('Hora:', hora);
    
        // Preenche os campos ocultos com a data e hora
        document.getElementById('data').value = data;
        document.getElementById('hora').value = hora;
    
        // Chama a função para converter a lat e lon em endereço
        converterEndereco(lat, lon);
      }, function(error) {
        mostrarErro('Não foi possível obter sua localização. Verifique as permissões de geolocalização.');
      });
    } else {
      mostrarErro('A geolocalização não é suportada por este navegador.');
    }
  }
  
  // Função para formatar a data para o formato YYYY-MM-DD
  function formatarDataParaBanco(data) {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Meses começam de 0, então adicionamos +1
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`; // Formato final: YYYY-MM-DD
  }
  
  // Função para mostrar mensagens de erro
  function mostrarErro(mensagem) {
    const alertaCard = document.getElementById('alerta-card');
    alertaCard.style.display = 'block';
    alertaCard.textContent = mensagem;
  }
  
  // Função para converter a latitude e longitude em endereço usando a API Nominatim
  function converterEndereco(lat, lon) {
    console.log('Convertendo localização...');
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Resposta da API:', data);
        if (data && data.display_name) {
          const endereco = data.display_name;
          console.log('Endereço:', endereco);
          validarEndereco(endereco, lat, lon);
        } else {
          mostrarErro('Não foi possível converter a localização para um endereço válido.');
        }
      })
      .catch(err => {
        console.error('Erro ao chamar a API:', err);
        mostrarErro('Erro ao obter o endereço.');
      });
  }
  
  // Função para validar o endereço
  function validarEndereco(endereco, lat, lon) {
    console.log('Validando endereço:', endereco);
    const alertaCard = document.getElementById('alerta-card');
  
    // Exemplo de validação para garantir que o endereço contém certas palavras-chave
    if (!endereco.includes('Sesi') && !endereco.includes('Morros')) {
      alertaCard.style.display = 'block';
      alertaCard.textContent = 'Você confirmou sua disponibilidade fora do HUB - um analista entrará em contato com você para alinhar como a disponibilidade deve ser enviada.';
    }
  
    // Envia o formulário independentemente do endereço
    enviarFormulario(endereco, lat, lon);
  }
  
  function enviarFormulario(endereco, lat, lon) {
    console.log('Enviando o formulário...');
  
    // Função para verificar se o campo existe e tem valor
    function getValueById(id) {
      const element = document.getElementById(id);
      if (!element) {
        console.log(`Campo com ID ${id} não encontrado.`);
        return null;  // Se o campo não for encontrado, retornamos null
      }
      return element.value.trim();  // .trim() para eliminar espaços em branco
    }
  
    // Obtenha os dados do formulário
    const nome = getValueById('nome');
    const id_motorista = getValueById('id_motorista');
    const placa = getValueById('placa');
    const tipoVeiculo = getValueById('tipo-veiculo');
    const carregamento1 = getValueById('carregamento-1');
    const carregamento2 = getValueById('carregamento-2');
    const rota = getValueById('rota');
    const observacao = getValueById('observacao');
  
    // Armazenando os campos obrigatórios
    const camposObrigatorios = [nome, id_motorista, placa, tipoVeiculo];
  
    // Verifique se algum campo obrigatório está vazio
    let camposVazios = camposObrigatorios.filter(campo => !campo || campo === "");
  
    // Log de depuração para verificar quais campos estão vazios
    console.log('Campos obrigatórios:', camposObrigatorios);
    console.log('Campos vazios:', camposVazios);
  
    if (camposVazios.length > 0) {
      // Exibe a mensagem de erro indicando quais campos estão faltando
      let camposFaltando = camposVazios.join(', ');
      mostrarErro(`Por favor, preencha os seguintes campos obrigatórios: ${camposFaltando}.`);
      return; // Interrompe o envio do formulário
    }
  
    // Preparar o envio do formulário
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('id_motorista', id_motorista);
    formData.append('placa', placa);
    formData.append('tipoVeiculo', tipoVeiculo);
    formData.append('carregamento1', carregamento1);
    formData.append('carregamento2', carregamento2);
    formData.append('rota', rota);
    formData.append('observacao', observacao);
    formData.append('endereco', endereco);
    formData.append('latitude', lat);
    formData.append('longitude', lon);
    formData.append('data', document.getElementById('data').value);
    formData.append('hora', document.getElementById('hora').value);
  
    console.log("Enviando dados para o PHP:", formData);
  
    // Envio da requisição via Fetch
    fetch('conn.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Resposta do backend:', data);
      if (data.success) {
        document.querySelector('form').reset();
      } else {
        mostrarErro(data.message || 'Erro ao enviar o formulário. Tente novamente.');
      }
    })
    .catch(err => {
      mostrarErro('Erro ao enviar o formulário.');
    });
  }
  
  // Exibe a localização e valida a disponibilidade ao enviar o formulário
  document.querySelector('form').addEventListener('submit', function(event) {
    console.log('Formulário enviado');
    event.preventDefault(); // Evita o envio padrão do formulário
    obterLocalizacao();
  });
  