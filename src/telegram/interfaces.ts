export interface CarsList {
    model_id: string
    name: string,
    photo_sha: string,
    dealer_exist: string,
    dealer_ids: string[]
    modifications: Modification[]
    colors: Color[]
}

interface Modification {
    modification_id: string,
    name: string,
    price: string,
    min_price: string,
    color_margins: string[],
    producing: string,
    fuel_consumption:string,
    horsepower:string,
    acceleration: string,
    transmission: string,
    descriptions: string
    options: string[]
}

interface Color {
    color_id: string,
    name: string
    hex_value: string,
    note: string,
    photo_sha: string,
    modification_ids: string[]
}
