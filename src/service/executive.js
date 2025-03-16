const { Op } = require("sequelize");
const Executive = require("../model/executive");
const ExecutiveDetail = require("../model/executivedetail");

const buildHierarchy = async (executives, user) => {
	// Fetch all executive details in one query
	const executiveDetails = await ExecutiveDetail.findAll({
		where: {
			masterId: {
				[Op.in]: executives.map((executive) => executive.id),
			},
		},
		raw: true,
	});

	// Create a lookup map for details based on parentId
	const detailMap = new Map();
	executiveDetails.forEach((detail) => {
		if (!detailMap.has(detail.parentId)) {
			detailMap.set(detail.parentId, []);
		}
		detailMap.get(detail.parentId).push(detail);
	});

	// Create master and child data structure
	const master =
		user.role === "superadmin"
			? executives.map((executive) => ({
					id: executive.id,
					code: executive.code,
					name: executive.desc,
			  }))
			: [];

	const child = [];
	executiveDetails.forEach((detail) => {
		child.push({
			id: detail.id,
			code: detail.code,
			name: detail.desc,
			parentId: detail.parentId,
		});
	});

	return { master, child };
};

const getExecutiveService = async (user) => {
	// Fetch all executives in one query
	const executives = await Executive.findAll({ raw: true });
	if (!executives.length) return [];

	return await buildHierarchy(executives, user);
};

module.exports = getExecutiveService;
