const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Executive = require("../model/executive");
const ExecutiveDetail = require("../model/executivedetail");

const buildHierarchy = async (master) => {
	const result = [];

	for (const executive of master) {
		// Fetch all root-level details for the current master
		const rootDetails = await ExecutiveDetail.findAll({
			where: {
				masterId: executive.id,
				parentId: null, // Fetch all root-level details
			},
		});

		if (rootDetails.length === 0) continue;

		// Recursive function to build children hierarchy
		const buildChildren = async (parentId) => {
			const children = await ExecutiveDetail.findAll({
				where: {
					parentId: parentId,
				},
			});

			// Map children and recursively build their hierarchy
			return await Promise.all(
				children.map(async (child) => ({
					id: child.id,
					code: child.code,
					name: child.desc,
					children: await buildChildren(child.id), // Recursive call for the next level
				}))
			);
		};

		// Build hierarchy for each root detail
		const detailsWithChildren = await Promise.all(
			rootDetails.map(async (detail) => ({
				id: detail.id,
				code: detail.code,
				name: detail.desc,
				children: await buildChildren(detail.id), // Build children for the root-level detail
			}))
		);

		// Push the result for this master
		result.push({
			id: executive.id,
			code: executive.code,
			name: executive.desc,
			children: detailsWithChildren, // Attach all root-level details with their children
		});
	}

	return result;
};

const getExecutiveService = async () => {
	const master = await Executive.findAll();
	const hierarchy = await buildHierarchy(master);

	return hierarchy;
};

module.exports = getExecutiveService;
