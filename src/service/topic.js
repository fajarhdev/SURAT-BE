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
					id: child.id,
					code: child.code,
					name: child.name,
					desc: child.desc,
					children: await buildChildren(child.id), // Rekursif ke tingkat berikutnya
				}))
			);
		};

		const children = await buildChildren(detail.id);

		result.push({
			id: topic.id,
			code: topic.code,
			name: topic.name,
			desc: topic.desc,
			children: [
				{
					id: detail.id,
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
	const masterTopics = await Topic.findAll(); // Ambil semua master topic
	const hierarchy = await buildHierarchy(masterTopics);

	return hierarchy;
}

module.exports = getTopicService;
