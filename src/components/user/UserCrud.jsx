import React from 'react'
import Main from '../template/Main'
import Userform from './Userform'
import UserTable from './UserTable'
import Modal from 'react-modal'
import { NotificationContainer, NotificationManager } from 'react-notifications'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de Usuários: Incluir, Listar, Alterar e Excluir'
}

const initialState = {
    user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    },
    list: [],
    search: '',
    modalIsOpen: false,
    userToDelete: null
}

export default class UserCrud extends React.Component {

    constructor() {
        super()

        this.state = { ...initialState }

        this.clear = this.clear.bind(this)
        this.save = this.save.bind(this)
        this.getUpdatedList = this.getUpdatedList.bind(this)
        this.updateField = this.updateField.bind(this)
        this.load = this.load.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.confirmDelete = this.confirmDelete.bind(this)
        this.handleEnterPress = this.handleEnterPress.bind(this)
        this.updateSearch = this.updateSearch.bind(this)
    }

    handleEnterPress(event) {
        if (event.key === 'Enter') {
            this.save()
        }
    }
   
    clear() {
        this.setState({ user: initialState.user })
    }
    
    save() {
        const user = this.state.user
    
        if (user.name === '' || user.email === '' || user.password === '' || user.confirmPassword === '') {
            NotificationManager.warning('Todos os campos são obrigatórios', 'Preencha os campos')
            return
        }
    
        if (user.password !== user.confirmPassword) {
            NotificationManager.warning('Senhas não conferem', 'Verifique as senhas')
            return
        }
    
        const existingUser = this.state.list.find(u => u.id === user.id)
    
        if (!existingUser) {
            user.id = Date.now()
        }
    
        const list = this.getUpdatedList(user)
        this.setState({ list, user: initialState.user })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add)
            list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    updateSearch(event) {
        this.setState({ search: event.target.value })
    }

    load(user) {
        this.setState({ user: { ...user } })
    }

    openModal(user) {
        this.setState({ modalIsOpen: true, userToDelete: user })
    }

    closeModal() {
        this.setState({ modalIsOpen: false, userToDelete: null })
    }

    confirmDelete() {
        const user = this.state.userToDelete
        const list = this.state.list.filter(u => u.id !== user.id)
        this.setState({ list, modalIsOpen: false, userToDelete: null })
    }

    render() {
        const filteredList = this.state.list.filter(user => 
            user.name.toLowerCase().includes(this.state.search.toLowerCase())
        )

        return (
            <Main {...headerProps}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Buscar por nome..." 
                        value={this.state.search} 
                        onChange={this.updateSearch} 
                    />
                </div>
                <Userform 
                    id={this.state.user.id}
                    name={this.state.user.name}
                    email={this.state.user.email}
                    password={this.state.user.password}
                    confirmPassword={this.state.user.confirmPassword}
                    clear={this.clear}
                    save={this.save}
                    updateField={this.updateField}
                    handleEnterPress={this.handleEnterPress}
                />
                <UserTable list={filteredList}
                    load={this.load}
                    remove={this.openModal}
                />
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Confirmar Exclusão"
                >
                    <h2>Confirmar Exclusão</h2>
                    <p>Tem certeza que deseja excluir este usuário?</p>
                    <button onClick={this.confirmDelete}>Sim</button>
                    <button onClick={this.closeModal}>Não</button>
                </Modal>
                <NotificationContainer />
            </Main>
        )
    }
}