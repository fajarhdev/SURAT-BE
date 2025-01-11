const {createRole, modifyRole} = require("../service/role");
const response = require("./util/response");
const createRoleController = async (req, res) => {
    const data = req.body;
    try{
        const role = await createRole(data);

        const result = await response(
            200,
            "Succes create role data",
            role,
            null,
            req,
            res
        );

        return result;
    }catch(e){
        const error = await response(
            500,
            "Error create role data",
            null,
            e,
            req,
            res
        );

        return error;
    }
}

const modifyRoleController = async (req, res) => {
    const data = req.body;

    try{
        const role = await modifyRole(data);

        const result = await response(
            200,
            "Succes modify role data",
            role,
            null,
            req,
            res
        );

        return result;
    }catch(e){
        const error = await response(
            500,
            "Error modify role data",
            null,
            e,
            req,
            res
        );

        return error;
    }
}

const deleteRoleController = async (req, res) => {
    const data = req.params.id;
    try{
        const role = await deleteRole(data);

        const result = await response(
            200,
            "Succes delete role data",
            role,
            null,
            req,
            res
        );

        return result;
    }catch (e) {
        const error = await response(
            500,
            "Error delete role data",
            null,
            e,
            req,
            res
        );

        return error;
    }
}

module.exports = {createRoleController, modifyRoleController, deleteRoleController};