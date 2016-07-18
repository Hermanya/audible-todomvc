import {say, listen, doCommand} from './util'
import * as TodoActions from '../redux/actions'
import {listTodos} from './list-todos'

export function doAudio (message) {
    return (message ? say(message) : Promise.resolve()).then(doCommand.bind('no context', {
        'create todo': () => {
            return say('ok, what is it?').then(listen).then(text => {
                store.dispatch(TodoActions.addTodo(text))
            }).then(() => say('todo added'))
        },
        'list todos': () => listTodos('all'),
        'list active todos': () => listTodos('active'),
        'list completed todos': () => listTodos('completed'),
        'complete all': () => {
            store.dispatch(TodoActions.completeAll())
            return say('all todos completed')
        },
        'clear completed': () => {
            store.dispatch(TodoActions.clearCompleted())
            return say('cleared completed todos')
        }
    })).then(doAudio.bind('no context'))
}
