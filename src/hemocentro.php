<?php

include_once 'db.php';

class Hemocentro {

    private $conn;

    function __construct($conn)
    {
        $this->conn = $conn;
    }

    function getAll() {
        $sql = "SELECT 
            id, 
            nome, 
            endereco 
        FROM Hemocentro";
        $result = $this->conn->query($sql);

        $data = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }

        return $data;
    }

    function getById($id) {
        $sql = "SELECT 
            id, 
            nome, 
            endereco 
        FROM Hemocentro
        WHERE id = ?";
        $stm = $this->conn->prepare($sql);

        $stm->bind_param('i', $id);
        $stm->execute();

        $result = $stm->get_result();

        $data = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }

        return $data;
    }

    function deleteById($id) {
        $sql = "DELETE FROM Hemocentro WHERE id = ?";
        $stm = $this->conn->prepare($sql);

        $stm->bind_param('i', $id);
        $stm->execute();

        if (!$stm->error) {
            return ['status' => 'ok', 'msg' => 'Registro excluído com sucesso'];
        }

        return ['status' => 'error', 'msg' => 'Falha ao excluir registro'];
    }

    function updateById($id, $data) {
        $sql = "UPDATE hemocentro SET 
            nome = ?,
            endereco = ?
        WHERE id = ?";

        $stm = $this->conn->prepare($sql);

        $stm->bind_param(
            'ssi', 
            $data['nome'], 
            $data['endereco'], 
            $id
        );
        $stm->execute();

        if (!$stm->error) {
            return ['status' => 'ok', 'msg' => 'Registro atualizado com sucesso'];
        }

        return ['status' => 'error', 'msg' => 'Falha ao atualizar registro'];
    }

    function create($data) {
        $sql = "INSERT INTO Hemocentro (nome, endereco) VALUES (?, ?)";

        $stm = $this->conn->prepare($sql);

        $stm->bind_param(
            'ss', 
            $data['nome'], 
            $data['endereco']
        );
        $stm->execute();

        if (!$stm->error) {
            return ['status' => 'ok', 'msg' => 'Registro criado com sucesso'];
        }

        return ['status' => 'error', 'msg' => 'Falha ao criar registro'];
    }
}

$allowed_methods = [
    'GET',
    'POST',
    'PUT',
    'DELETE'
];

if (!in_array($_SERVER['REQUEST_METHOD'], $allowed_methods)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode( [
        'status' => 'error',
        'msg' => 'Invalid Request'
    ] );
}

$hemocentro = new Hemocentro($conn);

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    echo json_encode($hemocentro->deleteById($_GET['id']));
    return;
}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode($hemocentro->updateById($_GET['id'], $data));
    return;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode($hemocentro->create($data));
    return;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'], 'hemocentro/cadastro')) {
        echo json_encode($hemocentro->getById($_GET['id']));
        return;
    }

    echo json_encode($hemocentro->getAll());
    return;
}
