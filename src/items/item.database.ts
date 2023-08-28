import { Item, Items, UnitItem } from "./item.interface";
import { v4 as random } from "uuid";
import fs from "fs";

let items: Items = loadItems();

function loadItems(): Items {
  try {
    const data = fs.readFileSync("./items.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error ${error}`);
    return {};
  }
}

function saveItems() {
    try {
        fs.writeFileSync("./items.json", JSON.stringify(items), "utf-8");
        console.log("Items saved successfully!");
    } catch (error) {
        console.log("Error", error);
    }
}


export const findAll = async () : Promise<UnitItem[]> => Object.values(items);

export const findOne = async (id : string) : Promise<UnitItem> => items[id];

export const create = async (itemInfo : Item) : Promise<null | UnitItem> => {

    let id = random();

    let item = await findOne(id);

    while (item) {
        id = random();
        await findOne(id);
    }

    items[id] = {
        id,
        ...itemInfo
    };

    saveItems();

    return items[id];
}

export const update = async (id : string, updateValues : Item) : Promise<UnitItem | null> => {

    const item = await findOne(id);

    if (!item) {
        return null;
    }

    items[id] = {
        id,
        ...updateValues
    };

    saveItems();

    return items[id];
}

export const remove = async (id : string) : Promise<null | void> => {

    const item = await findOne(id);

    if (!item) {
        return null;
    }

    delete items[id];

    saveItems();

}