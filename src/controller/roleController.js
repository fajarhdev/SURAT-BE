const {createRole, modifyRole, getRoleService} = require("../service/role");
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
            null,
            req,
            res
        );

        return result;
    }catch(e){
        const error = await response(
            400,
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
            null,
            req,
            res
        );

        return result;
    }catch(e){
        const error = await response(
            400,
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
            null,
            req,
            res
        );

        return result;
    }catch (e) {
        const error = await response(
            400,
            "Error delete role data",
            null,
            e,
            req,
            res
        );

        return error;
    }
}

const getRoleController = async (req, res) => {
    try{
        const role = await getRoleService();

        const result = await response(
            200,
            "Succes fetch role data",
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
            "Error fetch role data",
            null,
            e,
            req,
            res
        );

        return error;
    }
}

module.exports = {createRoleController, modifyRoleController, deleteRoleController, getRoleController};