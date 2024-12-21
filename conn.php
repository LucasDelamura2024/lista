<?php
// Detalhes da conexão com o banco de dados
$servername = "autorack.proxy.rlwy.net"; // Host do banco de dados
$username = "root"; // Usuário do banco de dados
$password = "GlyLVqMEsBiCYDJsmjQQKXoXnnOvvulp"; // Senha
$dbname = "railway"; // Nome do banco de dados
$port = 57981; // Porta do banco de dados

// Criar a conexão com o banco de dados usando PDO (mais seguro)
try {
    $dsn = "mysql:host=$servername;dbname=$dbname;port=$port";
    $conn = new PDO($dsn, $username, $password);
    // Definir o modo de erro para exceção
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Conexão falhou: " . $e->getMessage();
    exit();
}

// Verificar se os dados foram recebidos corretamente via POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Receber os dados via POST
    $nome = $_POST['nome'];
    $id_motorista = $_POST['id_motorista'];
    $placa = $_POST['placa'];
    $tipo_veiculo = $_POST['tipoVeiculo'];
    $carregamento1 = $_POST['carregamento1'];
    $carregamento2 = $_POST['carregamento2'];
    $data = $_POST['data'];
    $endereco = $_POST['endereco'];
    $hora = $_POST['hora'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $observacao = $_POST['observacao'];
    $rota = $_POST['rota'];

    // Preparar a consulta para inserir os dados
    $sql = "INSERT INTO disponibilidade (nome, id_motorista, placa, tipo_veiculo, carregamento1, carregamento2, data, endereco, hora, latitude, longitude, observacao, rota) 
            VALUES (:nome, :id_motorista, :placa, :tipo_veiculo, :carregamento1, :carregamento2, :data, :endereco, :hora, :latitude, :longitude, :observacao, :rota)";
    $stmt = $conn->prepare($sql);

    // Vincular os parâmetros com os valores recebidos
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':id_motorista', $id_motorista);
    $stmt->bindParam(':placa', $placa);
    $stmt->bindParam(':tipo_veiculo', $tipo_veiculo);
    $stmt->bindParam(':carregamento1', $carregamento1);
    $stmt->bindParam(':carregamento2', $carregamento2);
    $stmt->bindParam(':data', $data);
    $stmt->bindParam(':endereco', $endereco);
    $stmt->bindParam(':hora', $hora);
    $stmt->bindParam(':latitude', $latitude);
    $stmt->bindParam(':longitude', $longitude);
    $stmt->bindParam(':observacao', $observacao);
    $stmt->bindParam(':rota', $rota);

    // Executar a consulta e retornar um sucesso ou erro
    try {
        $stmt->execute();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erro ao inserir dados: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método inválido.']);
}
?>
