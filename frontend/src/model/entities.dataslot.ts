type PyDataSlotField = {
    required: boolean;
    name: string;
}

export abstract class PyDataSlot {
    [key: string]: {name: string, required: boolean};
}

export class PyDataSlotLine extends PyDataSlot {
    x: PyDataSlotField = { required: false, name: '' };
    y: PyDataSlotField = { required: true, name: '' };
}

export class PyDataSlotScatter extends PyDataSlot {
    x: PyDataSlotField = { required: true, name: '' };
    y: PyDataSlotField = { required: true, name: '' };
}