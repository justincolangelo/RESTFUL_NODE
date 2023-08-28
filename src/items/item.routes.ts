import express, {Request, Response} from "express";
import { Item, UnitItem } from "./item.interface";
import * as database from "./item.database";
import {StatusCodes} from "http-status-codes";

export const itemRouter = express.Router();

itemRouter.get('/items', async (req : Request, res : Response) => {
    try {
       const allItems = await database.findAll();

       if (!allItems) {
        return res.status(StatusCodes.NOT_FOUND).json({error : `No items found!`});
       }

       return res.status(StatusCodes.OK).json({total : allItems.length, allItems});
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
});

itemRouter.get("/items/:id", async (req : Request, res : Response) => {
    try {
        const item = await database.findOne(req.params.id);

        if (!item) {
            return res.status(StatusCodes.NOT_FOUND).json({error : "Item does not exist"});
        }

        return res.status(StatusCodes.OK).json({item});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
});


itemRouter.post("/items", async (req : Request, res : Response) => {
    try {
        const {name, price} = req.body;

        if (!name || !price) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `Please provide all the required parameters..`});
        }
        const newItem = await database.create({...req.body});
        return res.status(StatusCodes.CREATED).json({newItem});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
});

itemRouter.put("/items/:id", async (req : Request, res : Response) => {
    try {
        const id = req.params.id;

        const newItem = req.body;

        const findItem = await database.findOne(id);

        if (!findItem) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `Item does not exist..`});
        }

        const updateItem = await database.update(id, newItem);

        return res.status(StatusCodes.OK).json({updateItem});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
});


itemRouter.delete("/items/:id", async (req : Request, res : Response) => {
    try {
        const getItem = await database.findOne(req.params.id);

        if (!getItem) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `No item with ID ${req.params.id}`});
        }

        await database.remove(req.params.id);

        return res.status(StatusCodes.OK).json({msg : `Item deleted..`});

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
});