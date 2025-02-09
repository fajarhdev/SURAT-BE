const { Op } = require("sequelize");
const Executive = require("../model/executive");
const ExecutiveDetail = require("../model/executivedetail");

const buildHierarchy = async (executives) => {
	// Fetch all executive details in one query
	const executiveDetails = await ExecutiveDetail.findAll({
		where: {
			masterId: {
				[Op.in]: executives.map((executive) => executive.id), // Fetch all at once
			},
		},
		raw: true, // Faster data retrieval
	});

	// Create a lookup map for details based on parentId
	const detailMap = new Map();
	executiveDetails.forEach((detail) => {
		if (!detailMap.has(detail.parentId)) {
			detailMap.set(detail.parentId, []);
		}
		detailMap.get(detail.parentId).push(detail);
	});

	// Recursive function to build hierarchy
	const buildChildren = (parentId) => {
		const children = detailMap.get(parentId) || [];
		return children.map((child) => ({
			id: child.id,
			code: child.code,
			name: child.desc,
			children: buildChildren(child.id), // Recursive call
		}));
	};

	// Construct the hierarchy
	return executives.map((executive) => {
		const rootDetails = detailMap.get(null) // Get root-level details (parentId = null)
			?.filter((detail) => detail.masterId === executive.id) || [];

		return {
			id: executive.id,
			code: executive.code,
			name: executive.desc,
			children: rootDetails.map((detail) => ({
				id: detail.id,
				code: detail.code,
				name: detail.desc,
				children: buildChildren(detail.id),
			})),
		};
	});
};

const getExecutiveService = async () => {
	// Fetch all executives in one query
	const executives = await Executive.findAll({ raw: true });
	if (!executives.length) return [];

	return await buildHierarchy(executives);
};

module.exports = getExecutiveService;
