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
					code: child.code,
					desc: child.desc,
					children: await buildChildren(child.id), // Recursive call for the next level
				}))
			);
		};

		// Build hierarchy for each root detail
		const detailsWithChildren = await Promise.all(
			rootDetails.map(async (detail) => ({
				code: detail.code,
				desc: detail.desc,
				children: await buildChildren(detail.id), // Build children for the root-level detail
			}))
		);

		// Push the result for this master
		result.push({
			code: executive.code,
			desc: executive.desc,
			children: detailsWithChildren, // Attach all root-level details with their children
		});
	}

	return result;
};

const getExecutiveService = async () => {
	// const executive = await sequelize.query(
	// 	`SELECT
    // 			me.id,
    // 			me.code,
    // 			JSON_AGG(de.*) AS details
	// 			FROM
	// 				"MASTER_EXECUTIVE" me
	// 			LEFT JOIN
	// 				"DETAIL_EXECUTIVE" de
	// 			ON
	// 				me.id = de.master_id
	// 			GROUP BY
	// 				me.id, me.code;`,
	// 					{
	// 						type: QueryTypes.SELECT,
	// 					}
	// );
// 	const executive = await sequelize.query(
// 		`WITH RECURSIVE detail_hierarchy AS (
//     -- Anchor query: Start with all root-level details (parent IS NULL)
//     SELECT
//         de.id AS detail_id,
//         de.master_id,
//         de.parent_id,  -- Corrected to match the actual column name
//         de.code,
//         de.name,
//         de.desc,
//         ARRAY[JSON_BUILD_OBJECT('id', de.id, 'code', de.code, 'name', de.name, 'desc', de.desc)] AS children -- Include 'desc' key
//     FROM
//         "DETAIL_EXECUTIVE" de
//     WHERE
//         de.parent_id IS NULL
//
//     UNION ALL
//
//     -- Recursive query: Fetch children of the previous level
//     SELECT
//         child.id AS detail_id,
//         child.master_id,
//         child.parent_id,  -- Corrected to match the actual column name
//         child.code,
//         child.name,
//         child.desc,
//         dh.children || JSON_BUILD_OBJECT('id', child.id, 'code', child.code, 'name', child.name, 'desc', child.desc) AS children -- Include 'desc' key
//     FROM
//         "DETAIL_EXECUTIVE" child
//     INNER JOIN
//         detail_hierarchy dh
//     ON
//         child.parent_id = dh.detail_id  -- Corrected to match the actual column name
// )
//
// SELECT
//     me.id AS master_id,
//     me.code AS master_code,
//     me.name AS name,
//     JSON_AGG(
//         JSON_BUILD_OBJECT(
//             'detail_id', dh.detail_id,
//             'parent_id', dh.parent_id,  -- Changed to 'parent_id' to match column name
//             'code', dh.code,
//             'name', dh.name,
//             'desc', dh.desc,
//             'children', dh.children
//         )
//     ) AS details
// FROM
//     "MASTER_EXECUTIVE" me
// LEFT JOIN
//     detail_hierarchy dh
// ON
//     me.id = dh.master_id
// GROUP BY
//     me.id, me.code;
// `,
// 						{
// 							type: QueryTypes.SELECT,
// 						}
// 	);
	const master = await Executive.findAll();
	const hierarchy = await buildHierarchy(master);

	return hierarchy;
};

module.exports = getExecutiveService;
