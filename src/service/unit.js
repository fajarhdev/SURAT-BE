const Unit = require("../model/unit");
const { Op } = require('sequelize');

const createInitUnit = async () => {
	try {
		console.log('START SEED UNIT');

		const masterData = await Unit.findAll({
			where: {
				name: {
					[Op.in]: ['REG4', 'Semarang', 'Yogyakarta', 'Solo', 'Magelang', 'Purwokerto', 'Pekalongan', 'Kudus']
				}
			}
		});
		if (masterData.length > 0) {
			return;
		}

		const listUnits = ['REG4', 'Semarang', 'Yogyakarta', 'Solo', 'Magelang', 'Purwokerto', 'Pekalongan', 'Kudus'];
		let objUnit = [];
		for (let i = 0; i < listUnits.length; i++) {
			objUnit.push({
				name: listUnits[i],
				address: ""
			});
		}
		await Unit.bulkCreate(objUnit);
	}catch(e) {
		throw e;
	}finally {
		console.log('FINISH SEED UNIT');
	}
}

const createSuperAdminUnit = async () => {
	try {
		const unit = await Unit.findOrCreate({
			where: { name: "superadmin" }, // Kriteria pencarian
			defaults: { address: "telkom" }, // Nilai default jika tidak ditemukan
		  });

		return unit;
	} catch (e) {
		throw new Error("Error database");
	}
};

const getAllUnitService = async () => {
	try {
		const getUnit = await Unit.findAll();

		return getUnit;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

const createUnit = async (unit) => {
	try {
		const unitData = await Unit.create({
			name: unit.name,
			address: unit.address
		});

		return unitData;
	} catch (e) {
		throw new Error("Error database", e);
		
	}
};

const deleteUnit = async (id) => {
	try {
		const unit = await Unit.destroy({
			where: {
				id: id
			}
		});

		return unit;
	} catch (e) {
		throw new Error("Error database", e);
		
	}
}

const modifyUnit = async (unit) => {
	try {
		const unitData = await Unit.update({
			name: unit.name,
			address: unit.address
		}, {
			where: {
				id: unit.id
			}
		});

		return unitData;
	} catch (e) {
		throw new Error("Error database", e);
		
	}
}

module.exports = { createSuperAdminUnit, getAllUnitService, createUnit, deleteUnit, modifyUnit, createInitUnit };
