<?php
include_once 'db.php'; // Inclua seu arquivo de conexão com o banco de dados

class Usuario {
    private $conn;

    function __construct($conn) {
        $this->conn = $conn;
    }

    function getAll() {
        $sql = "SELECT * FROM usuario";
        $result = $this->conn->query($sql);
        
        $data = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        return $data;
    }

    function create($data) {
        $sql = "INSERT INTO usuario (nome, telefone, email, cpf, tipo_sanguineo) VALUES (?, ?, ?, ?, ?)";
        $stm = $this->conn->prepare($sql);
        
        $stm->bind_param('sssss', $data['nome'], $data['telefone'], $data['email'], $data['cpf'], $data['tipo_sanguineo']);
        $stm->execute();

        if (!$stm->error) {
            return ['status' => 'ok', 'msg' => 'Usuário criado com sucesso'];
        }
        return ['status' => 'error', 'msg' => 'Falha ao criar usuário'];
    }

    function updateById($id, $data) {
        $sql = "UPDATE usuario SET nome = ?, telefone = ?, email = ?, cpf = ?, tipo_sanguineo = ? WHERE id = ?";
        $stm = $this->conn->prepare($sql);
        
        $stm->bind_param('sssssi', $data['nome'], $data['telefone'], $data['email'], $data['cpf'], $data['tipo_sanguineo'], $id);
        $stm->execute();

        if (!$stm->error) {
            return ['status' => 'ok', 'msg' => 'Usuário atualizado com sucesso'];
        }
        return ['status' => 'error', 'msg' => 'Falha ao atualizar usuário'];
    }

    function deleteById($id) {
        $sql = "DELETE FROM usuario WHERE id = ?";
        $stm = $this->conn->prepare($sql);
        
        $stm->bind_param('i', $id);
        $stm->execute();

        if (!$stm->error) {
            return ['status' => 'ok', 'msg' => 'Usuário excluído com sucesso'];
        }
        return ['status' => 'error', 'msg' => 'Falha ao excluir usuário'];
    }
}

$allowed_methods = ['GET', 'POST', 'PUT', 'DELETE'];

if (!in_array($_SERVER['REQUEST_METHOD'], $allowed_methods)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'msg' => 'Método inválido']);
    exit();
}

$usuario = new Usuario($conn);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    echo json_encode($usuario->getAll());
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode($usuario->create($data));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $_GET['id'];
    echo json_encode($usuario->updateById($id, $data));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $id = $_GET['id'];
    echo json_encode($usuario->deleteById($id));
    exit();
}
?>
