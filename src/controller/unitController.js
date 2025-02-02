const {createUnit, modifyUnit, deleteUnit, getAllUnitService} = require("../service/unit");
const response = require("./util/response");

const createUnitController = async (req, res) => {
    const data = req.body;
    try {
        const unit = await createUnit(data);

        const result = await response(
            200,
            "Succes create Unit data",
            unit,
            null,
            null,
            req,
            res
        );

        return result;
    } catch (e) {
        const error = await response(
            400,
            "Error create Unit data",
            null,
            null,
            e,
            req,
            res
        );

        return error;
    }
};

const modifyUnitController = async (req, res) => {
    const data = req.body;
    try {
        const unit = await modifyUnit(data);

        const result = await response(
            200,
            "Succes update Unit data",
            unit,
            null,
            null,
            req,
            res
        );

        return result;
    } catch (e) {
        const error = await response(
            400,
            "Error update Unit data",
            null,
            null,
            e,
            req,
            res
        );

        return error;
    }
}

const deleteUnitController = async (req, res) => {
    const data = req.params.id;
    try {
        const unit = await deleteUnit(data);

        const result = await response(
            200,
            "Succes delete Unit data",
            unit,
            null,
            null,
            req,
            res
        );

        return result;
    } catch (e) {
        const error = await response(
            400,
            "Error delete Unit data",
            null,
            null,
            e,
            req,
            res
        );

        return error;
    }
}

const getUnitController = async (req, res) => {
    try{
        const role = await getAllUnitService();

        const result = await response(
            200,
            "Succes fetch unit data",
            role,
            null,
            null,
            req,
            res
        );

        return result;
    }catch (e) {
        const error = await response(
            400,
            "Error fetch unit data",
            null,
            e,
            req,
            res
        );

        return error;
    }
}

module.exports = {createUnitController, modifyUnitController, deleteUnitController, getUnitController};