
import toasteventbus from 'primevue/toasteventbus'

export const directToast = {
    add: (argument: any) => {
        toasteventbus.emit('add', argument)
    },
    error: (summary: string, detail: string) => {
        toasteventbus.emit('add', { severity: 'error', summary: summary, detail: detail, life: 3000 })
    }
}