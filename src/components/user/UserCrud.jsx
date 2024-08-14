import React from 'react'
import Main from '../template/Main'
import Userform from './Userform'
import UserTable from './UserTable'

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
    list: []
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
        this.remove = this.remove.bind(this)
        this.handleEnterPress = this.handleEnterPress.bind(this)
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
            NotificationManager.warning('As senhas não coincidem', 'Erro de validação')
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

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        const list = this.state.list.filter(u => u.id !== user.id)
        this.setState({ list })
    }

    render() {
        return (
            <Main {...headerProps}>
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
                <UserTable list={this.state.list}
                    load={this.load}
                    remove={this.remove}
                />
            </Main>
        )
    }
}