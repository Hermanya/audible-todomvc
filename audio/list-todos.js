import {say, listen, doCommand} from './util'
import * as TodoActions from '../redux/actions'

export function listTodos (filter) {
    let todos = filterTodos(window.store.getState().todos, filter)
    if (todos.length === 0) {
        return say(`nothing to be listed`)
    }

    function doTodo (index) {
        let todo = todos[index]
        let next = () => {
            if (index === todos.length - 1) {
                return say('that is all')
            } else {
                return doTodo(index + 1)
            }
        }

        let action = () => {
            return doCommand({
                repeat: () => say(todo.text).then(action),
                complete: () => {
                    store.dispatch(TodoActions.completeTodo(todo.id))
                    return say('marked as completed').then(action)
                },
                edit: () => {
                    return say('ok, what do you want to change it to?').then(listen).then(text => {
                        store.dispatch(TodoActions.editTodo(todo.id, text))
                    }).then(() => say('todo updated'))
                },
                remove: () => {
                    store.dispatch(TodoActions.deleteTodo(todo.id))
                    return say('removed this').then(next)
                },
                next: next,
                '': next,
                abort: () => say('listing aborted')
            })
        }

        return say(todo.text).then(action)
    }
    return doTodo(0)
}

function filterTodos (todos, filter) {
    //  visible todos, right? haha
    switch (`show_${filter}`.toUpperCase()) {
        case 'SHOW_ALL':
        return todos
        case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
        case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
}
