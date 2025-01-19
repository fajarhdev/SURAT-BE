const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Topic = require('../model/topic');
const TopicDetail = require('../model/topicdetail');

const buildHierarchy = async (master) => {
	const result = [];

	for (const topic of master) {
		const detail = await TopicDetail.findOne({
			where: {
				masterId: topic.id,
				parentId: null, // Ambil root-level detail (tidak memiliki parent)
			},
		});

		if (!detail) continue;

		// Rekursif untuk mengambil anak-anak
		const buildChildren = async (parentId) => {
			const children = await TopicDetail.findAll({
				where: {
					parentId: parentId,
				},
			});

			// Untuk setiap anak, tambahkan children di dalamnya (jika ada)
			return await Promise.all(
				children.map(async (child) => ({
					code: child.code,
					name: child.name,
					desc: child.desc,
					children: await buildChildren(child.id), // Rekursif ke tingkat berikutnya
				}))
			);
		};

		const children = await buildChildren(detail.id);

		result.push({
			code: topic.code,
			name: topic.name,
			desc: topic.desc,
			children: [
				{
					code: detail.code,
					name: detail.name,
					desc: detail.desc,
					children: children,
				},
			],
		});
	}

	return result;
};

const getTopicService = async () => {
	const result = [];
	const master = await Topic.findAll();

	// for (const topic of master) {
	// 	const detail = await TopicDetail.findOne({
	// 		where: {
	// 			masterId: topic.id
	// 		}
	// 	});
	// 	const childDetail = await TopicDetail.findAll({
	// 		where: {
	// 			parentId: detail.id
	// 		}
	// 	});
	//
	// 	result.push({
	// 		id: topic.id,
	// 		code: topic.code,
	// 		name: topic.name,
	// 		desc: topic.desc,
	// 		children: {
	// 			detail: detail,
	// 			children: childDetail,
	// 		},
	// 	})
	// }

	const masterTopics = await Topic.findAll(); // Ambil semua master topic
	const hierarchy = await buildHierarchy(masterTopics);

	return hierarchy;
}
	// const topic = await sequelize.query(
	// 	`SELECT
   	// 			mt.id,
   	// 			mt.code,
   	// 			mt."desc",
   	// 			JSON_AGG(dt.*) AS details
	// 		FROM
	// 		    "MASTER_TOPIC" mt
	// 		LEFT JOIN
	// 		    "DETAIL_TOPIC" dt
	// 		ON
	// 		    mt.id = dt.master_id
	// 		GROUP BY
	// 		    mt.id, dt.code;`,
	// 	{
	// 			type: QueryTypes.SELECT,
	// 			}
	// );
	//
// 	const topic = await sequelize.query(
// 		`WITH RECURSIVE detail_hierarchy AS (
//     -- Anchor query: Start with all root-level details (parent IS NULL)
//     SELECT
//         de.id,
//         de.code,
//         de.name,
//         de.desc,
//         de.master_id,  -- Include master_id
//         de.parent_id,  -- Include parent_id
//         ARRAY[JSON_BUILD_OBJECT('id', de.id, 'code', de.code, 'name', de.name, 'desc', de.desc)] AS children -- Path as an array of objects
//     FROM
//         "DETAIL_TOPIC" de
//     WHERE
//         de.parent_id IS NULL
//
//     UNION ALL
//
//     -- Recursive query: Fetch children of the previous level
//     SELECT
//         child.id,
//         child.code,
//         child.name,
//         child.desc,
//         child.master_id,  -- Include master_id
//         child.parent_id,  -- Include parent_id
//         dh.children || JSON_BUILD_OBJECT('id', child.id, 'code', child.code, 'name', child.name, 'desc', child.desc) AS children -- Append child to the path
//     FROM
//         "DETAIL_TOPIC" child
//     INNER JOIN
//         detail_hierarchy dh
//     ON
//         child.parent_id = dh.id  -- Joining on parent_id correctly
// )
// SELECT
//     me.id AS master_id,
//     me.code AS master_code,
//     me.name AS master_name,
//     me.desc AS master_desc,
//     JSON_AGG(
//         JSON_BUILD_OBJECT(
//             'detail_id', dh.id,
//             'parent_id', dh.parent_id,  -- Correctly referencing parent_id
//             'code', dh.code,
//             'name', dh.name,
//             'children', dh.children  -- Returning the path with child details
//         )
//     ) AS details
// FROM
//     "MASTER_TOPIC" me
// LEFT JOIN
//     detail_hierarchy dh
// ON
//     me.id = dh.master_id  -- Join MASTER_TOPIC to the details using master_id
// GROUP BY
//     me.id, me.code;
// `,
// 		{
// 				type: QueryTypes.SELECT,
// 				}
// 	);
//
// 	return topic;
// };

module.exports = getTopicService;
