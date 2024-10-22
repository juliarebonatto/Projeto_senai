<?php

include_once 'db.php';

class Agenda {

    private $conn;

    function __construct($conn)
    {
        $this->conn = $conn;
    }

    function getAll() {
        $sql = "SELECT 
            a.id, 
            a.hemocentro_id, 
            a.dia, 
            a.horario, 
            h.nome AS hemocentro_nome 
        FROM agenda a
        JOIN hemocentro h ON a.hemocentro_id = h.id";
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
            hemocentro_id, 
            dia, 
            horario 
        FROM agenda
        WHERE id = ?";
        $stm = $this->conn->prepare($sql);

        $stm->bind_param('i', $id);
        $stm->execute();

        $result = $stm->get_result();

        return $result->fetch_assoc();
    }

    function deleteById($id) {
        $sql = "DELETE FROM agenda WHERE id = ?";
        $stm = $this->conn->prepare($sql);

        $stm->bind_param('i', $id);
        $stm->execute();

        if (!$stm->error) {
            return ['status' => 'ok', 'msg' => 'Registro excluído com sucesso'];
        }

        return ['status' => 'error', 'msg' => 'Falha ao excluir registro'];
    }

    function updateById($id, $data) {
        $sql = "UPDATE agenda SET 
            hemocentro_id = ?, 
            dia = ?, 
            horario = ? 
        WHERE id = ?";

        $stm = $this->conn->prepare($sql);

        $stm->bind_param(
            'issi', 
            $data['hemocentro_id'], 
            $data['dia'], 
            $data['horario'], 
            $id
        );
        $stm->execute();

        if (!$stm->error) {
            return ['status' => 'ok', 'msg' => 'Registro atualizado com sucesso'];
        }

        return ['status' => 'error', 'msg' => 'Falha ao atualizar registro'];
    }

    function create($data) {
        $sql = "INSERT INTO agenda (hemocentro_id, dia, horario) VALUES (?, ?, ?)";

        $stm = $this->conn->prepare($sql);

        $stm->bind_param(
            'iss', 
            $data['hemocentro_id'], 
            $data['dia'], 
            $data['horario']
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

$agenda = new Agenda($conn);

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    echo json_encode($agenda->deleteById($_GET['id']));
    return;
}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode($agenda->updateById($_GET['id'], $data));
    return;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    echo json_encode($agenda->create($data));
    return;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id'])) {
        echo json_encode($agenda->getById($_GET['id']));
        return;
    }

    echo json_encode($agenda->getAll());
    return;
}
