import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

export default props => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleDeleteClick = (user) => {
        setUserToDelete(user)
        setShowModal(true)
    }

    const handleConfirmDelete = () => {
        props.remove(userToDelete)
        setShowModal(false)
        setUserToDelete(null)
    }

    const handleCancelDelete = () => {
        setShowModal(false)
        setUserToDelete(null)
    }

    const filteredList = props.list.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <input 
                type="text" 
                className="form-control mt-3" 
                placeholder="Pesquisar usuários..." 
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Senha</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList.map(user => {
                        return (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>
                                    <button className="btn btn-warning" title='Editar' onClick={() => props.load(user)}>
                                        <i className="fa fa-pencil"></i>
                                    </button>
                                    <button className="btn btn-danger ml-2" id='btn-excluir' title='Excluir' onClick={() => handleDeleteClick(user)}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Modal show={showModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza que deseja excluir este usuário?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}